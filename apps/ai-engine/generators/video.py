"""Video script generator for TikTok, Instagram Reels, and YouTube Shorts."""

import json
import os
import anthropic
from typing import Optional


PLATFORM_SPECS = {
    "TikTok": {
        "aspect_ratio": "9:16",
        "style": "fast cuts, trending audio, Gen Z hooks, ultra-engaging",
        "hook_rule": "First 1.5 seconds must be INSANE — stop the scroll",
    },
    "Instagram": {
        "aspect_ratio": "9:16",
        "style": "aesthetic, emotional, high production value",
        "hook_rule": "Hook in first 2 seconds with emotion or controversy",
    },
    "YouTube": {
        "aspect_ratio": "9:16 (Shorts) or 16:9",
        "style": "educational, detailed, storytelling",
        "hook_rule": "Promise value in first 5 seconds",
    },
    "Facebook": {
        "aspect_ratio": "9:16 or 1:1",
        "style": "shareable, relatable, community discussion trigger",
        "hook_rule": "Emotional opening that triggers a reaction",
    },
}


class VideoScriptGenerator:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.model = "claude-opus-4-7"

    async def generate(
        self,
        topic: str,
        platform: str = "TikTok",
        duration: int = 60,
        style: str = "energetic",
    ) -> dict:
        spec = PLATFORM_SPECS.get(platform, PLATFORM_SPECS["TikTok"])
        word_count = max(50, duration * 2)  # ~2 words/sec for voiceover

        message = self.client.messages.create(
            model=self.model,
            max_tokens=1500,
            messages=[{
                "role": "user",
                "content": f"""Create a {duration}-second {platform} football video script for GoalRush Global.

Topic: {topic}
Style: {style}
Platform spec: {spec['style']}
Hook rule: {spec['hook_rule']}
Aspect ratio: {spec['aspect_ratio']}
Voiceover words needed: ~{word_count}

GoalRush brand: "Football Never Sleeps" — global, exciting, viral.

Return ONLY valid JSON:
{{
  "hook": "first 2-3 words that stop the scroll",
  "script": "complete word-for-word voiceover script (~{word_count} words)",
  "visual_cues": [
    "0-5s: visual description",
    "5-15s: visual description",
    "15-30s: visual description"
  ],
  "on_screen_text": ["text overlay 1", "text overlay 2"],
  "music_mood": "description of background music vibe",
  "captions": ["caption line 1", "caption line 2"],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "cta": "call to action text",
  "viral_potential": "low/medium/high/explosive",
  "estimated_views": "realistic range e.g. 10K-100K"
}}"""
            }]
        )

        text = message.content[0].text
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            import re
            m = re.search(r'\{[\s\S]*\}', text)
            return json.loads(m.group(0)) if m else {"script": text, "hook": topic}

    async def generate_goal_reaction(self, scorer: str, team: str, minute: int, match: str) -> dict:
        topic = f"GOAL REACTION: {scorer} scores for {team} in the {minute}th minute — {match}"
        return await self.generate(topic, "TikTok", 30, "explosive")

    async def generate_transfer_video(self, player: str, from_team: str, to_team: str, fee: str) -> dict:
        topic = f"{player} TRANSFER BREAKDOWN: From {from_team} to {to_team} for {fee}"
        return await self.generate(topic, "TikTok", 60, "dramatic")

    async def generate_top_goals(self, week: str, goals: list) -> dict:
        topic = f"Top 5 Goals of {week} — You won't believe #3"
        return await self.generate(topic, "YouTube", 90, "energetic")

    async def generate_tactical_breakdown(self, match: str) -> dict:
        topic = f"Tactical breakdown: How {match} was won"
        return await self.generate(topic, "YouTube", 120, "analytical")
