"""Social media post generator — optimized per platform."""

import json
import os
import anthropic
from typing import Optional, List


PLATFORM_SPECS = {
    "twitter": {
        "max_chars": 280,
        "hashtags": 3,
        "style": "punchy, breaking news energy, 1-2 emojis max",
    },
    "instagram": {
        "max_chars": 2200,
        "hashtags": 25,
        "style": "engaging, storytelling, emotional, heavy emojis",
    },
    "tiktok": {
        "max_chars": 150,
        "hashtags": 5,
        "style": "ultra-short hook, slang, Gen Z energy, viral",
    },
    "facebook": {
        "max_chars": 500,
        "hashtags": 5,
        "style": "conversational, community-focused, share-worthy",
    },
    "telegram": {
        "max_chars": 4096,
        "hashtags": 8,
        "style": "detailed, informative, newsletter-like",
    },
}


class SocialGenerator:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.model = "claude-opus-4-7"

    async def generate_post(
        self,
        content: str,
        platform: str,
        post_type: str = "news",
        match_data: Optional[dict] = None,
    ) -> dict:
        spec = PLATFORM_SPECS.get(platform, PLATFORM_SPECS["twitter"])
        match_ctx = f"\nMatch context: {json.dumps(match_data)}" if match_data else ""

        message = self.client.messages.create(
            model=self.model,
            max_tokens=400,
            messages=[{
                "role": "user",
                "content": f"""Create a viral {platform} football post for GoalRush Global.

Content: {content}
Type: {post_type}
Platform style: {spec['style']}
Max characters: {spec['max_chars']}
Hashtag count: {spec['hashtags']}{match_ctx}

Brand voice: "Football Never Sleeps" — exciting, global, emotional.

Return ONLY valid JSON:
{{
  "text": "the post content with emojis",
  "hashtags": ["#hash1", "#hash2"],
  "caption_only": "just the main text without hashtags",
  "hook": "first line that stops the scroll"
}}"""
            }]
        )

        text = message.content[0].text
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            import re
            m = re.search(r'\{[\s\S]*\}', text)
            return json.loads(m.group(0)) if m else {"text": content, "hashtags": ["#Football"]}

    async def generate_pack(
        self,
        content: str,
        platforms: List[str],
        post_type: str = "news",
        match_data: Optional[dict] = None,
    ) -> dict:
        results = {}
        for platform in platforms:
            results[platform] = await self.generate_post(content, platform, post_type, match_data)
        return results

    async def generate_goal_alert(self, match: dict, scorer: str, minute: int) -> dict:
        home = match.get("homeTeam", {}).get("name")
        away = match.get("awayTeam", {}).get("name")
        score = f"{match.get('homeScore', 0)}-{match.get('awayScore', 0)}"

        content = f"GOAL! {scorer} scores in the {minute}th minute — {home} {score} {away}"
        return await self.generate_pack(content, ["twitter", "instagram", "telegram"], "goal", match)

    async def generate_match_preview_pack(self, home: str, away: str, league: str, kickoff: str) -> dict:
        content = f"{home} vs {away} — {league} preview | Kickoff: {kickoff}"
        return await self.generate_pack(content, ["twitter", "instagram", "tiktok", "facebook"], "preview")

    async def generate_transfer_post(self, player: str, from_team: str, to_team: str, fee: str) -> dict:
        content = f"TRANSFER: {player} moves from {from_team} to {to_team} for {fee}"
        return await self.generate_pack(content, ["twitter", "instagram", "tiktok", "telegram"], "transfer")
