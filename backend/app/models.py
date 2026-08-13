import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Form(Base):
    __tablename__ = "forms"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    is_published: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    questions: Mapped[list["Question"]] = relationship(
        back_populates="form", cascade="all, delete-orphan", order_by="Question.order"
    )
    responses: Mapped[list["Response"]] = relationship(
        back_populates="form", cascade="all, delete-orphan"
    )


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    form_id: Mapped[str] = mapped_column(ForeignKey("forms.id", ondelete="CASCADE"))
    type: Mapped[str] = mapped_column(String(50))
    title: Mapped[str] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    required: Mapped[bool] = mapped_column(default=False)
    order: Mapped[int] = mapped_column(default=0)
    options: Mapped[str | None] = mapped_column(Text, nullable=True)

    form: Mapped["Form"] = relationship(back_populates="questions")
    answers: Mapped[list["Answer"]] = relationship(
        back_populates="question", cascade="all, delete-orphan"
    )


class Response(Base):
    __tablename__ = "responses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    form_id: Mapped[str] = mapped_column(ForeignKey("forms.id", ondelete="CASCADE"))
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    form: Mapped["Form"] = relationship(back_populates="responses")
    answers: Mapped[list["Answer"]] = relationship(
        back_populates="response", cascade="all, delete-orphan"
    )


class Answer(Base):
    __tablename__ = "answers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    response_id: Mapped[str] = mapped_column(ForeignKey("responses.id", ondelete="CASCADE"))
    question_id: Mapped[str] = mapped_column(ForeignKey("questions.id", ondelete="CASCADE"))
    value: Mapped[str] = mapped_column(Text)

    response: Mapped["Response"] = relationship(back_populates="answers")
    question: Mapped["Question"] = relationship(back_populates="answers")
