"""ElevenLabs text-to-speech service for AI voiceovers."""

import os
import aiofiles
import httpx
from pathlib import Path

VOICE_IDS = {
    "rachel":   "21m00Tcm4TlvDq8ikWAM",   # Professional female
    "adam":     "pNInz6obpgDQGcFmaJgB",   # Professional male
    "domi":     "AZnzlk1XvdvUeBnXmlld",   # Energetic female
    "bella":    "EXAVITQu4vr4xnSDxMaL",   # Soft female
    "elli":     "MF3mGyEYCl7XYWbV9V6O",   # Young female
    "josh":     "TxGEqnHWrfWFTfGW9XjX",   # Deep male (great for sports)
    "arnold":   "VR6AewLTigWG4xSOukaG",   # Powerful male
    "sam":      "yoZ06aMxZJJ28mfd3POQ",   # Raspy male
}

OUTPUT_DIR = Path("generated/audio")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


class ElevenLabsService:
    def __init__(self):
        self.api_key = os.getenv("ELEVENLABS_API_KEY")
        self.base_url = "https://api.elevenlabs.io/v1"

    async def generate(
        self,
        script: str,
        voice: str = "josh",
        output_format: str = "mp3_44100_128",
    ) -> str:
        if not self.api_key:
            return ""

        voice_id = VOICE_IDS.get(voice, VOICE_IDS["josh"])
        filename = f"voiceover_{hash(script[:50])}.mp3"
        output_path = OUTPUT_DIR / filename

        if output_path.exists():
            return f"/generated/audio/{filename}"

        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                f"{self.base_url}/text-to-speech/{voice_id}",
                headers={
                    "Accept": "audio/mpeg",
                    "xi-api-key": self.api_key,
                    "Content-Type": "application/json",
                },
                json={
                    "text": script,
                    "model_id": "eleven_turbo_v2",
                    "voice_settings": {
                        "stability": 0.5,
                        "similarity_boost": 0.75,
                        "style": 0.5,
                        "use_speaker_boost": True,
                    },
                    "output_format": output_format,
                },
            )
            response.raise_for_status()

        async with aiofiles.open(output_path, "wb") as f:
            await f.write(response.content)

        return f"/generated/audio/{filename}"

    async def list_voices(self) -> list:
        if not self.api_key:
            return list(VOICE_IDS.keys())

        async with httpx.AsyncClient() as client:
            r = await client.get(
                f"{self.base_url}/voices",
                headers={"xi-api-key": self.api_key},
            )
            r.raise_for_status()
            return [v["name"] for v in r.json().get("voices", [])]
