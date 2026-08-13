import json
import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.database import SessionLocal
from app.models import Answer, Form, Question, Response

CHOICE_TYPES = {"multiple_choice", "dropdown", "yes_no", "rating"}


def seed_demo_data() -> None:
    db = SessionLocal()
    try:
        existing = db.scalar(select(func.count()).select_from(Form))
        if existing and existing > 0:
            return

        form = Form(
            id=str(uuid.uuid4()),
            title="Customer Feedback Survey",
            description="Help us improve by sharing your experience.",
            slug="customer-feedback-demo",
            is_published=True,
            created_at=datetime.now(UTC) - timedelta(days=7),
            updated_at=datetime.now(UTC) - timedelta(days=1),
        )
        db.add(form)
        db.flush()

        questions_data = [
            ("short_text", "What's your name?", "We'd love to know who you are.", True, 0, None),
            ("email", "What's your email address?", None, False, 1, None),
            ("multiple_choice", "How did you hear about us?", None, True, 2, ["Social media", "Friend referral", "Search engine", "Advertisement"]),
            ("rating", "How would you rate your overall experience?", "1 = Poor, 5 = Excellent", True, 3, None),
            ("yes_no", "Would you recommend us to a friend?", None, True, 4, ["Yes", "No"]),
            ("long_text", "Any additional feedback?", "Optional — tell us more.", False, 5, None),
        ]

        questions: list[Question] = []
        for qtype, title, desc, required, order, opts in questions_data:
            question = Question(
                form_id=form.id,
                type=qtype,
                title=title,
                description=desc,
                required=required,
                order=order,
                options=json.dumps(opts) if opts else None,
            )
            db.add(question)
            questions.append(question)
        db.flush()

        sample_responses = [
            {
                "name": "Alice Johnson",
                "email": "alice@example.com",
                "source": "Social media",
                "rating": "5",
                "recommend": "Yes",
                "feedback": "Great product, very intuitive!",
            },
            {
                "name": "Bob Smith",
                "email": "bob@example.com",
                "source": "Search engine",
                "rating": "4",
                "recommend": "Yes",
                "feedback": "Good overall, could use better docs.",
            },
            {
                "name": "Carol Williams",
                "email": "carol@example.com",
                "source": "Friend referral",
                "rating": "3",
                "recommend": "No",
                "feedback": "It was okay but missing features I need.",
            },
            {
                "name": "David Lee",
                "email": "",
                "source": "Advertisement",
                "rating": "5",
                "recommend": "Yes",
                "feedback": "",
            },
            {
                "name": "Eva Martinez",
                "email": "eva@example.com",
                "source": "Social media",
                "rating": "2",
                "recommend": "No",
                "feedback": "Had trouble getting started.",
            },
        ]

        q_map = {
            "name": questions[0],
            "email": questions[1],
            "source": questions[2],
            "rating": questions[3],
            "recommend": questions[4],
            "feedback": questions[5],
        }

        for i, sample in enumerate(sample_responses):
            response = Response(
                form_id=form.id,
                submitted_at=datetime.now(UTC) - timedelta(days=5 - i, hours=i * 3),
            )
            db.add(response)
            db.flush()

            answer_values = {
                "name": sample["name"],
                "email": sample["email"],
                "source": sample["source"],
                "rating": sample["rating"],
                "recommend": sample["recommend"],
                "feedback": sample["feedback"],
            }

            for key, question in q_map.items():
                value = answer_values[key]
                if value:
                    db.add(
                        Answer(
                            response_id=response.id,
                            question_id=question.id,
                            value=value,
                        )
                    )

        draft_form = Form(
            id=str(uuid.uuid4()),
            title="Event Registration",
            description="Sign up for our upcoming webinar.",
            slug="event-registration-demo",
            is_published=False,
        )
        db.add(draft_form)
        db.flush()

        db.add(
            Question(
                form_id=draft_form.id,
                type="short_text",
                title="Full name",
                required=True,
                order=0,
            )
        )
        db.add(
            Question(
                form_id=draft_form.id,
                type="dropdown",
                title="Which session will you attend?",
                required=True,
                order=1,
                options=json.dumps(["Morning (9 AM)", "Afternoon (2 PM)", "Evening (6 PM)"]),
            )
        )

        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def build_form_analytics(db: Session, form_id: str) -> dict:
    form = db.scalar(select(Form).options(selectinload(Form.questions)).where(Form.id == form_id))
    if not form:
        return None

    questions = sorted(form.questions, key=lambda q: q.order)
    required_question_ids = {q.id for q in questions if q.required}
    total_questions = len(questions)

    responses = db.scalars(
        select(Response)
        .options(selectinload(Response.answers))
        .where(Response.form_id == form_id)
    ).all()

    total_responses = len(responses)
    completed_responses = 0
    timeline_counts: dict[str, int] = {}

    for response in responses:
        answered_ids = {
            answer.question_id
            for answer in response.answers
            if answer.value and answer.value.strip()
        }
        if required_question_ids.issubset(answered_ids):
            completed_responses += 1

        if response.submitted_at:
            date_key = response.submitted_at.date().isoformat()
            timeline_counts[date_key] = timeline_counts.get(date_key, 0) + 1

    completion_rate = (
        round(completed_responses / total_responses * 100, 1) if total_responses else 0.0
    )
    response_timeline = [
        {"date": date, "count": count}
        for date, count in sorted(timeline_counts.items())
    ]

    question_analytics = []
    for question in sorted(form.questions, key=lambda q: q.order):
        answers = db.scalars(
            select(Answer.value)
            .join(Response, Answer.response_id == Response.id)
            .where(Answer.question_id == question.id, Response.form_id == form_id)
        ).all()

        entry = {
            "question_id": question.id,
            "title": question.title,
            "type": question.type,
            "total_answers": len(answers),
            "answer_counts": None,
        }

        if question.type in CHOICE_TYPES and answers:
            counts: dict[str, int] = {}
            for value in answers:
                counts[value] = counts.get(value, 0) + 1
            entry["answer_counts"] = [
                {"value": value, "count": count}
                for value, count in sorted(counts.items(), key=lambda x: -x[1])
            ]

        question_analytics.append(entry)

    return {
        "form_id": form.id,
        "title": form.title,
        "total_responses": total_responses,
        "total_questions": total_questions,
        "completed_responses": completed_responses,
        "completion_rate": completion_rate,
        "response_timeline": response_timeline,
        "questions": question_analytics,
    }


def build_csv_export(db: Session, form_id: str) -> str:
    form = db.scalar(
        select(Form).options(selectinload(Form.questions)).where(Form.id == form_id)
    )
    if not form:
        return ""

    questions = sorted(form.questions, key=lambda q: q.order)
    responses = db.scalars(
        select(Response)
        .options(selectinload(Response.answers))
        .where(Response.form_id == form_id)
        .order_by(Response.submitted_at.asc())
    ).all()

    import csv
    import io

    output = io.StringIO()
    writer = csv.writer(output)

    headers = ["Response ID", "Submitted At"] + [q.title for q in questions]
    writer.writerow(headers)

    for response in responses:
        answer_map = {a.question_id: a.value for a in response.answers}
        row = [
            response.id,
            response.submitted_at.isoformat() if response.submitted_at else "",
        ]
        for q in questions:
            row.append(answer_map.get(q.id, ""))
        writer.writerow(row)

    return output.getvalue()
