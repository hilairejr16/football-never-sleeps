"""Hashtag generator optimized for each social platform."""

import json
import os
import anthropic
from typing import List

PLATFORM_HASHTAG_STRATEGIES = {
    "instagram": {
        "count": 25,
        "mix": "5 mega (1M+), 8 large (100K-1M), 7 medium (10K-100K), 5 niche (<10K)",
    },
    "tiktok": {
        "count": 5,
        "mix": "2 trending, 2 football-specific, 1 brand",
    },
    "twitter": {
        "count": 3,
        "mix": "1 trending, 1 specific, 1 GoalRush brand tag",
    },
    "youtube": {
        "count": 10,
        "mix": "3 broad, 5 niche football, 2 brand",
    },
    "facebook": {
        "count": 5,
        "mix": "broad football hashtags, community-focused",
    },
}

ALWAYS_INCLUDE = {
    "twitter": ["#GoalRushGlobal"],
    "instagram": ["#GoalRushGlobal", "#FootballNeverSleeps"],
    "tiktok": ["#GoalRush", "#Football"],
    "youtube": ["#GoalRushGlobal"],
    "facebook": [],
}


class HashtagGenerator:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.model = "claude-opus-4-7"

    async def generate(self, topic: str, platform: str, count: int = 20) -> List[str]:
        spec = PLATFORM_HASHTAG_STRATEGIES.get(platform, PLATFORM_HASHTAG_STRATEGIES["instagram"])

        message = self.client.messages.create(
            model=self.model,
            max_tokens=300,
            messages=[{
                "role": "user",
                "content": f"""Generate {count} viral football hashtags for {platform}.

Topic: {topic}
Strategy: {spec['mix']}

Include a mix of:
- Global football hashtags (Premier League, Champions League, etc.)
- Player/team specific tags
- Trending football culture tags
- Language: primarily English but include 2-3 Spanish/French tags if relevant

Return ONLY a JSON array: ["#Tag1", "#Tag2", ...]
No explanation, just the array."""
            }]
        )

        text = message.content[0].text
        try:
            tags = json.loads(text)
        except json.JSONDecodeError:
            import re
            m = re.search(r'\[[\s\S]*\]', text)
            tags = json.loads(m.group(0)) if m else ["#Football", "#GoalRush"]

        # Always prepend brand tags
        brand_tags = ALWAYS_INCLUDE.get(platform, [])
        all_tags = brand_tags + [t for t in tags if t not in brand_tags]

        return all_tags[:count]

    async def get_trending_football_hashtags(self) -> List[str]:
        """Get currently trending football hashtags across platforms."""
        message = self.client.messages.create(
            model=self.model,
            max_tokens=200,
            messages=[{
                "role": "user",
                "content": "List 15 currently trending football/soccer hashtags on social media (mix of English, Spanish, Portuguese). Return only a JSON array of hashtag strings."
            }]
        )

        text = message.content[0].text
        try:
            return json.loads(text)
        except Exception:
            return ["#Football", "#Soccer", "#UCL", "#PremierLeague", "#LaLiga"]
