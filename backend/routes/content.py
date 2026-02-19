from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai
from config import GEMINI_API_KEY

router = APIRouter(prefix="/content", tags=["Content"])

client = genai.Client(api_key=GEMINI_API_KEY)

# 👇 CHANGE THE MODEL HERE — Options: "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-2.5-flash", "gemini-2.5-pro"
MODEL_NAME = "gemini-2.5-flash"


class ContentRequest(BaseModel):
    topic: str
    tone: str = "professional"
    length: str = "medium"


@router.post("/generate")
def generate_content(req: ContentRequest):
    prompt = f"""
You are an expert LinkedIn content writer. Generate a compelling LinkedIn post about the following topic.

Topic: {req.topic}
Tone: {req.tone}
Length: {req.length} (short = 50-100 words, medium = 100-200 words, long = 200-350 words)

Guidelines:
- Start with a strong hook that grabs attention
- Use short paragraphs and line breaks for readability
- Include relevant emojis sparingly
- Add 3-5 relevant hashtags at the end
- Make it engaging and encourage comments
- Do NOT include any markdown formatting, just plain text
- Write it as ready-to-post content
"""

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )
        if response and response.text:
            return {"generated_text": response.text}
        else:
            raise HTTPException(status_code=500, detail="Empty response from Gemini API")
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Gemini API error: {e}")
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")
