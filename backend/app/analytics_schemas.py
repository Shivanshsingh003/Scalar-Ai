from pydantic import BaseModel


class AnswerCount(BaseModel):
    value: str
    count: int


class TimelinePoint(BaseModel):
    date: str
    count: int


class QuestionAnalytics(BaseModel):
    question_id: str
    title: str
    type: str
    total_answers: int
    answer_counts: list[AnswerCount] | None = None


class FormAnalytics(BaseModel):
    form_id: str
    title: str
    total_responses: int
    total_questions: int
    completed_responses: int
    completion_rate: float
    response_timeline: list[TimelinePoint]
    questions: list[QuestionAnalytics]
