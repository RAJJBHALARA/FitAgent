from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    message: str
    context: dict = {}
    history: list = []
    preferences: Optional[dict] = None


class WeeklyReportRequest(BaseModel):
    weekly_data: dict


class AnalyzeMealRequest(BaseModel):
    description: str
