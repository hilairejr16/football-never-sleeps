"""
GoalRush Global — AI Engine
FastAPI microservice powering content generation, video scripts,
social media automation, and predictive analytics.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv

from generators.news import NewsGenerator
from generators.social import SocialGenerator
from generators.video import VideoScriptGenerator
from generators.hashtags import HashtagGenerator
from services.elevenlabs_service import ElevenLabsService

load_dotenv()

app = FastAPI(
    title="GoalRush Global AI Engine",
    description="AI-powered content generation for the world's most automated football media brand",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("APP_URL", "http://localhost:3000"), os.getenv("API_URL", "http://localhost:4000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

news_gen = NewsGenerator()
social_gen = SocialGenerator()
video_gen = VideoScriptGenerator()
hashtag_gen = HashtagGenerator()
tts_service = ElevenLabsService()


# ─── Request Models ────────────────────────────────────────

class ArticleRequest(BaseModel):
    topic: str
    match_data: Optional[dict] = None
    tone: str = "exciting"
    length: str = "medium"   # short | medium | long
    league: Optional[str] = None
    seo_optimized: bool = True

class VideoScriptRequest(BaseModel):
    topic: str
    platform: str = "TikTok"    # TikTok | Instagram | YouTube
    duration: int = 60
    style: str = "energetic"
    include_voiceover: bool = False

class SocialPackRequest(BaseModel):
    content: str
    platforms: List[str] = ["twitter", "instagram", "tiktok", "facebook"]
    post_type: str = "news"    # news | goal | transfer | prediction | meme
    match_data: Optional[dict] = None

class VoiceoverRequest(BaseModel):
    script: str
    voice: str = "rachel"
    output_format: str = "mp3"

class PredictionRequest(BaseModel):
    home_team: str
    away_team: str
    league: str
    home_form: Optional[str] = None
    away_form: Optional[str] = None

class HashtagRequest(BaseModel):
    topic: str
    platform: str = "instagram"
    count: int = 20


# ─── Health ────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "service": "GoalRush AI Engine", "version": "1.0.0"}


# ─── Article Generation ────────────────────────────────────

@app.post("/generate/article")
async def generate_article(req: ArticleRequest):
    try:
        result = await news_gen.generate(
            topic=req.topic,
            match_data=req.match_data,
            tone=req.tone,
            length=req.length,
            league=req.league,
        )
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Match Summary ─────────────────────────────────────────

@app.post("/generate/match-summary")
async def generate_match_summary(data: dict):
    try:
        result = await news_gen.generate_match_summary(data)
        return {"status": "success", "data": {"summary": result}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Video Script ──────────────────────────────────────────

@app.post("/generate/video-script")
async def generate_video_script(req: VideoScriptRequest):
    try:
        script = await video_gen.generate(
            topic=req.topic,
            platform=req.platform,
            duration=req.duration,
            style=req.style,
        )

        result = {"status": "success", "data": {"script": script}}

        if req.include_voiceover and script.get("script"):
            audio_url = await tts_service.generate(script["script"])
            result["data"]["audio_url"] = audio_url

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Social Media Pack ─────────────────────────────────────

@app.post("/generate/social-pack")
async def generate_social_pack(req: SocialPackRequest):
    try:
        posts = await social_gen.generate_pack(
            content=req.content,
            platforms=req.platforms,
            post_type=req.post_type,
            match_data=req.match_data,
        )
        return {"status": "success", "data": posts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Hashtags ──────────────────────────────────────────────

@app.post("/generate/hashtags")
async def generate_hashtags(req: HashtagRequest):
    try:
        tags = await hashtag_gen.generate(req.topic, req.platform, req.count)
        return {"status": "success", "data": {"hashtags": tags}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Voiceover ─────────────────────────────────────────────

@app.post("/generate/voiceover")
async def generate_voiceover(req: VoiceoverRequest):
    try:
        url = await tts_service.generate(req.script, req.voice)
        return {"status": "success", "data": {"audio_url": url}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Match Prediction ──────────────────────────────────────

@app.post("/generate/prediction")
async def generate_prediction(req: PredictionRequest):
    try:
        result = await news_gen.generate_prediction(
            home_team=req.home_team,
            away_team=req.away_team,
            league=req.league,
            home_form=req.home_form,
            away_form=req.away_form,
        )
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Batch Generation ──────────────────────────────────────

@app.post("/generate/daily-batch")
async def generate_daily_batch(background_tasks: BackgroundTasks):
    """Trigger daily automated content generation in the background."""
    background_tasks.add_task(run_daily_batch)
    return {"status": "success", "message": "Daily batch generation started"}


async def run_daily_batch():
    leagues = ["Premier League", "La Liga", "Serie A", "Bundesliga", "Champions League"]
    topics = [
        "Today's top football stories and match previews",
        "Transfer window latest rumours and confirmed deals",
        "Premier League title race update",
        "Champions League quarter-final preview",
        "Weekend's best goals and highlights",
    ]

    for topic in topics:
        try:
            await news_gen.generate(topic=topic, tone="exciting", length="medium")
        except Exception as e:
            print(f"[DailyBatch] Failed to generate: {topic} — {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
