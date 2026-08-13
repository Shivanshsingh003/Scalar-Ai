from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class QuestionType(str, Enum):
    SHORT_TEXT = "short_text"
    LONG_TEXT = "long_text"
    MULTIPLE_CHOICE = "multiple_choice"
    DROPDOWN = "dropdown"
    YES_NO = "yes_no"
    CHECKBOX = "checkbox"
    EMAIL = "email"
    NUMBER = "number"
    RATING = "rating"


class QuestionCreate(BaseModel):
    type: QuestionType
    title: str
    description: str | None = None
    required: bool = False
    order: int = 0
    options: list[str] | None = None


class QuestionUpdate(BaseModel):
    type: QuestionType | None = None
    title: str | None = None
    description: str | None = None
    required: bool | None = None
    order: int | None = None
    options: list[str] | None = None


class QuestionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    type: str
    title: str
    description: str | None
    required: bool
    order: int
    options: list[str] | None = None


class FormCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None


class FormUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    is_published: bool | None = None


class FormRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: str | None
    slug: str
    is_published: bool
    created_at: datetime
    updated_at: datetime
    questions: list[QuestionRead] = []


class FormSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: str | None
    slug: str
    is_published: bool
    response_count: int = 0
    created_at: datetime
    updated_at: datetime


class AnswerSubmit(BaseModel):
    question_id: str
    value: str


class ResponseSubmit(BaseModel):
    answers: list[AnswerSubmit]


class AnswerRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    question_id: str
    value: str


class ResponseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    form_id: str
    submitted_at: datetime
    answers: list[AnswerRead] = []
