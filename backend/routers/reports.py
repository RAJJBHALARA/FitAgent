from fastapi import APIRouter
from models.schemas import WeeklyReportRequest, AnalyzeMealRequest
from services.gemini_service import generate_weekly_report, analyze_meal

router = APIRouter()


@router.post("/weekly-report")
async def weekly_report(req: WeeklyReportRequest):
    """F8 — Generate weekly correlation report using Gemini Flash"""
    report = await generate_weekly_report(req.weekly_data)
    return report


@router.post("/analyze-meal")
async def meal_analysis(req: AnalyzeMealRequest):
    """Use Gemini to identify food and estimate macros from text description"""
    result = await analyze_meal(req.description)
    return result


@router.post("/correlations")
async def find_correlations(req: WeeklyReportRequest):
    """Find patterns in weekly log data"""
    report = await generate_weekly_report(req.weekly_data, mode="correlations")
    return report
