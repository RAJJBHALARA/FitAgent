from fastapi import APIRouter
from models.schemas import AnalyzeMealRequest
from services.gemini_service import analyze_meal

router = APIRouter()


@router.post("/meals/analyze")
async def analyze_food(req: AnalyzeMealRequest):
    """Use Gemini to estimate macros from a food description.
    Accepts Indian vegetarian foods and returns JSON with calories, protein, carbs, fat.
    """
    result = await analyze_meal(req.description)
    return result
