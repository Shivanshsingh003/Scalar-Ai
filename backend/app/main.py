import csv
import io
import json
import re
import uuid
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.analytics_schemas import FormAnalytics
from app.database import get_db, init_db
from app.models import Answer, Form, Question, Response
from app.schemas import (
    FormCreate,
    FormRead,
    FormSummary,
    FormUpdate,
    QuestionCreate,
    QuestionRead,
    QuestionUpdate,
    ResponseRead,
    ResponseSubmit,
)
from app.seed import build_csv_export, build_form_analytics, seed_demo_data

DbSession = Annotated[Session, Depends(get_db)]


def slugify(text: str) -> str:
    slug = re.sub(r"[^\w\s-]", "", text.lower())
    slug = re.sub(r"[\s_-]+", "-", slug).strip("-")
    return slug or str(uuid.uuid4())[:8]


def serialize_question(question: Question) -> QuestionRead:
    options = json.loads(question.options) if question.options else None
    return QuestionRead(
        id=question.id,
        type=question.type,
        title=question.title,
        description=question.description,
        required=question.required,
        order=question.order,
        options=options,
    )


def serialize_form(form: Form) -> FormRead:
    return FormRead(
        id=form.id,
        title=form.title,
        description=form.description,
        slug=form.slug,
        is_published=form.is_published,
        created_at=form.created_at,
        updated_at=form.updated_at,
        questions=[serialize_question(q) for q in form.questions],
    )


def get_form_or_404(db: Session, form_id: str) -> Form:
    form = db.scalar(
        select(Form).options(selectinload(Form.questions)).where(Form.id == form_id)
    )
    if not form:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")
    return form


def get_published_form_by_slug(db: Session, slug: str) -> Form:
    form = db.scalar(
        select(Form)
        .options(selectinload(Form.questions))
        .where(Form.slug == slug, Form.is_published.is_(True))
    )
    if not form:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")
    return form


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed_demo_data()
    yield


app = FastAPI(title="Typeform Clone API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://scalar-ai-hkiq.vercel.app",
        "https://scalar-ai-teal.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


# --- Forms ---

@app.get("/api/v1/forms", response_model=list[FormSummary])
def list_forms(db: DbSession):
    rows = db.execute(
        select(Form, func.count(Response.id).label("response_count"))
        .outerjoin(Response, Response.form_id == Form.id)
        .group_by(Form.id)
        .order_by(Form.updated_at.desc())
    ).all()
    return [
        FormSummary(
            id=form.id,
            title=form.title,
            description=form.description,
            slug=form.slug,
            is_published=form.is_published,
            response_count=response_count,
            created_at=form.created_at,
            updated_at=form.updated_at,
        )
        for form, response_count in rows
    ]


@app.post("/api/v1/forms", response_model=FormRead, status_code=status.HTTP_201_CREATED)
def create_form(data: FormCreate, db: DbSession):
    form = Form(
        title=data.title,
        description=data.description,
        slug=f"{slugify(data.title)}-{str(uuid.uuid4())[:8]}",
    )
    db.add(form)
    db.flush()
    db.refresh(form)
    return serialize_form(form)


@app.get("/api/v1/forms/{form_id}", response_model=FormRead)
def get_form(form_id: str, db: DbSession):
    return serialize_form(get_form_or_404(db, form_id))


@app.patch("/api/v1/forms/{form_id}", response_model=FormRead)
def update_form(form_id: str, data: FormUpdate, db: DbSession):
    form = get_form_or_404(db, form_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(form, field, value)
    db.flush()
    db.refresh(form)
    return serialize_form(form)


@app.delete("/api/v1/forms/{form_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_form(form_id: str, db: DbSession):
    form = get_form_or_404(db, form_id)
    db.delete(form)


@app.post("/api/v1/forms/{form_id}/duplicate", response_model=FormRead, status_code=status.HTTP_201_CREATED)
def duplicate_form(form_id: str, db: DbSession):
    source = get_form_or_404(db, form_id)
    duplicate = Form(
        title=f"{source.title} (Copy)",
        description=source.description,
        slug=f"{slugify(source.title)}-copy-{str(uuid.uuid4())[:8]}",
        is_published=False,
    )
    db.add(duplicate)
    db.flush()

    for question in source.questions:
        db.add(
            Question(
                form_id=duplicate.id,
                type=question.type,
                title=question.title,
                description=question.description,
                required=question.required,
                order=question.order,
                options=question.options,
            )
        )

    db.flush()
    return serialize_form(get_form_or_404(db, duplicate.id))


# --- Questions ---

@app.post(
    "/api/v1/forms/{form_id}/questions",
    response_model=QuestionRead,
    status_code=status.HTTP_201_CREATED,
)
def create_question(form_id: str, data: QuestionCreate, db: DbSession):
    get_form_or_404(db, form_id)
    question = Question(
        form_id=form_id,
        type=data.type.value,
        title=data.title,
        description=data.description,
        required=data.required,
        order=data.order,
        options=json.dumps(data.options) if data.options else None,
    )
    db.add(question)
    db.flush()
    return serialize_question(question)


@app.patch("/api/v1/forms/{form_id}/questions/{question_id}", response_model=QuestionRead)
def update_question(form_id: str, question_id: str, data: QuestionUpdate, db: DbSession):
    question = db.scalar(
        select(Question).where(Question.id == question_id, Question.form_id == form_id)
    )
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

    update_data = data.model_dump(exclude_unset=True)
    if "type" in update_data and update_data["type"] is not None:
        update_data["type"] = update_data["type"].value
    if "options" in update_data:
        update_data["options"] = (
            json.dumps(update_data["options"]) if update_data["options"] else None
        )
    for field, value in update_data.items():
        setattr(question, field, value)

    db.flush()
    return serialize_question(question)


@app.delete(
    "/api/v1/forms/{form_id}/questions/{question_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_question(form_id: str, question_id: str, db: DbSession):
    question = db.scalar(
        select(Question).where(Question.id == question_id, Question.form_id == form_id)
    )
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    db.delete(question)


# --- Responses (creator view) ---

@app.get("/api/v1/forms/{form_id}/responses", response_model=list[ResponseRead])
def list_responses(form_id: str, db: DbSession):
    get_form_or_404(db, form_id)
    responses = db.scalars(
        select(Response)
        .options(selectinload(Response.answers))
        .where(Response.form_id == form_id)
        .order_by(Response.submitted_at.desc())
    ).all()
    return responses


@app.get("/api/v1/forms/{form_id}/responses/{response_id}", response_model=ResponseRead)
def get_response(form_id: str, response_id: str, db: DbSession):
    get_form_or_404(db, form_id)
    response = db.scalar(
        select(Response)
        .options(selectinload(Response.answers))
        .where(Response.id == response_id, Response.form_id == form_id)
    )
    if not response:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Response not found")
    return response


@app.get("/api/v1/forms/{form_id}/analytics", response_model=FormAnalytics)
def get_form_analytics(form_id: str, db: DbSession):
    analytics = build_form_analytics(db, form_id)
    if not analytics:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")
    return analytics


@app.get("/api/v1/forms/{form_id}/responses/export")
def export_responses_csv(form_id: str, db: DbSession):
    form = get_form_or_404(db, form_id)
    csv_content = build_csv_export(db, form_id)
    filename = f"{slugify(form.title)}-responses.csv"
    return PlainTextResponse(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# --- Public (respondents) ---

@app.get("/api/v1/public/forms/{slug}", response_model=FormRead)
def get_public_form(slug: str, db: DbSession):
    return serialize_form(get_published_form_by_slug(db, slug))


@app.post(
    "/api/v1/public/forms/{slug}/responses",
    response_model=ResponseRead,
    status_code=status.HTTP_201_CREATED,
)
def submit_response(slug: str, data: ResponseSubmit, db: DbSession):
    form = get_published_form_by_slug(db, slug)
    response = Response(form_id=form.id)
    db.add(response)
    db.flush()

    for answer_data in data.answers:
        db.add(
            Answer(
                response_id=response.id,
                question_id=answer_data.question_id,
                value=answer_data.value,
            )
        )

    db.flush()
    db.refresh(response, ["answers"])
    return response
