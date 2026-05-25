"""News and match content generator using Claude claude-opus-4-7."""

import json
import os
import anthropic
from typing import Optional


class NewsGenerator:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.model = "claude-opus-4-7"

    async def generate(
        self,
        topic: str,
        match_data: Optional[dict] = None,
        tone: str = "exciting",
        length: str = "medium",
        league: Optional[str] = None,
    ) -> dict:
        word_count = {"short": 200, "medium": 500, "long": 900}.get(length, 500)

        context = f"\nMatch context: {json.dumps(match_data)}" if match_data else ""
        league_ctx = f"\nLeague: {league}" if league else ""

        message = self.client.messages.create(
            model=self.model,
            max_tokens=2500,
            messages=[{
                "role": "user",
                "content": f"""You are a world-class football journalist for GoalRush Global — the premier AI-powered football media brand. "Football Never Sleeps." is our slogan.

Write a {tone} football news article about: {topic}{context}{league_ctx}

Requirements:
- Approximately {word_count} words
- Punchy, viral headline that drives clicks
- SEO-optimized with natural keyword placement
- Include tactical insights where relevant
- Tone: {tone} (exciting/dramatic/analytical)
- Style: modern sports journalism like ESPN / Bleacher Report / 433
- End with a clear key takeaway or prediction
- Target audience: global football fans aged 15-45

Return ONLY valid JSON (no markdown):
{{
  "title": "headline here",
  "slug": "url-friendly-slug",
  "excerpt": "2-sentence compelling summary",
  "content": "full article in markdown format",
  "tags": ["tag1", "tag2", "tag3"],
  "seo_title": "SEO-optimized title",
  "seo_description": "155-char meta description",
  "read_time": estimated_minutes_as_integer,
  "is_breaking": true_or_false
}}"""
            }]
        )

        text = message.content[0].text
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            import re
            match = re.search(r'\{[\s\S]*\}', text)
            if match:
                return json.loads(match.group(0))
            return {"title": topic, "content": text, "excerpt": text[:200], "tags": [], "read_time": 3}

    async def generate_match_summary(self, match: dict) -> str:
        home = match.get("homeTeam", {}).get("name", "Home")
        away = match.get("awayTeam", {}).get("name", "Away")
        home_score = match.get("homeScore", 0)
        away_score = match.get("awayScore", 0)
        events = match.get("events", [])

        message = self.client.messages.create(
            model=self.model,
            max_tokens=800,
            messages=[{
                "role": "user",
                "content": f"""Write an exciting 3-paragraph match summary for GoalRush Global:

{home} {home_score} - {away_score} {away}
Key events: {json.dumps(events[:8])}

Write like a Sky Sports commentator. Vivid, dramatic, fast-paced. Use plain text."""
            }]
        )
        return message.content[0].text

    async def generate_prediction(
        self,
        home_team: str,
        away_team: str,
        league: str,
        home_form: Optional[str] = None,
        away_form: Optional[str] = None,
    ) -> dict:
        form_ctx = ""
        if home_form or away_form:
            form_ctx = f"\nRecent form — {home_team}: {home_form or 'N/A'} | {away_team}: {away_form or 'N/A'}"

        message = self.client.messages.create(
            model=self.model,
            max_tokens=600,
            messages=[{
                "role": "user",
                "content": f"""Generate an AI football prediction for GoalRush Global.

{home_team} (HOME) vs {away_team} (AWAY)
League: {league}{form_ctx}

Analyze likely outcome. Return ONLY valid JSON:
{{
  "home_win_pct": number_0_to_100,
  "draw_pct": number_0_to_100,
  "away_win_pct": number_0_to_100,
  "predicted_home": integer,
  "predicted_away": integer,
  "btts": true_or_false,
  "over_25_goals": true_or_false,
  "key_factor": "one decisive sentence",
  "confidence": number_0_to_100,
  "analysis": "2-3 sentence tactical breakdown"
}}
Note: home_win_pct + draw_pct + away_win_pct must equal 100."""
            }]
        )

        text = message.content[0].text
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            import re
            match = re.search(r'\{[\s\S]*\}', text)
            return json.loads(match.group(0)) if match else {}
