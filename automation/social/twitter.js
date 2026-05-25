require('dotenv').config({ path: '../../.env' });
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey:            process.env.TWITTER_API_KEY,
  appSecret:         process.env.TWITTER_API_SECRET,
  accessToken:       process.env.TWITTER_ACCESS_TOKEN,
  accessSecret:      process.env.TWITTER_ACCESS_SECRET,
});

const rwClient = client.readWrite;

// ─── Post a tweet ──────────────────────────────────────────

async function postTweet(text) {
  if (!process.env.TWITTER_API_KEY) {
    console.warn('[Twitter] API keys not configured — skipping post');
    return null;
  }

  try {
    const { data } = await rwClient.v2.tweet(text.slice(0, 280));
    console.log('[Twitter] Posted:', data.id);
    return data;
  } catch (err) {
    console.error('[Twitter] Post failed:', err.message);
    return null;
  }
}

// ─── Post a thread ─────────────────────────────────────────

async function postThread(tweets) {
  if (!process.env.TWITTER_API_KEY) return null;

  try {
    const results = [];
    let replyToId = null;

    for (const text of tweets) {
      const params = { text: text.slice(0, 280) };
      if (replyToId) {
        params.reply = { in_reply_to_tweet_id: replyToId };
      }

      const { data } = await rwClient.v2.tweet(params);
      results.push(data);
      replyToId = data.id;

      // Small delay between tweets
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`[Twitter] Thread posted — ${results.length} tweets`);
    return results;
  } catch (err) {
    console.error('[Twitter] Thread failed:', err.message);
    return null;
  }
}

// ─── Post with media ───────────────────────────────────────

async function postTweetWithMedia(text, imagePath) {
  if (!process.env.TWITTER_API_KEY) return null;

  try {
    const mediaId = await rwClient.v1.uploadMedia(imagePath);
    const { data } = await rwClient.v2.tweet({
      text: text.slice(0, 280),
      media: { media_ids: [mediaId] },
    });
    return data;
  } catch (err) {
    console.error('[Twitter] Media post failed:', err.message);
    return null;
  }
}

// ─── Live match thread ─────────────────────────────────────

async function createLiveMatchThread(match) {
  const home = match.homeTeam.name;
  const away = match.awayTeam.name;
  const league = match.league.name;

  const tweets = [
    `🚨 LIVE THREAD: ${home} vs ${away}\n\n📍 ${match.venue || 'TBD'}\n🏆 ${league}\n\n🔔 Follow this thread for live updates ⚽\n\n#${home.replace(/\s/g, '')} #${away.replace(/\s/g, '')} #${league.replace(/\s/g, '')} #GoalRushGlobal`,
    `📊 LINEUPS OUT!\n\n${home} formation: TBD\n${away} formation: TBD\n\nStay tuned for kick-off updates ⚡\n\n#LiveFootball #GoalRushGlobal #FootballNeverSleeps`,
  ];

  return postThread(tweets);
}

// ─── Goal alert ────────────────────────────────────────────

async function tweetGoalAlert(match, scorer, minute) {
  const home = match.homeTeam.name;
  const away = match.awayTeam.name;
  const score = `${match.homeScore}-${match.awayScore}`;

  const text = `⚽ GOAL!\n\n${home} ${score} ${away}\n\n🎯 ${scorer} (${minute}')\n\n#${home.replace(/\s/g, '')} #${away.replace(/\s/g, '')} #GoalRushGlobal #FootballNeverSleeps`;
  return postTweet(text);
}

// ─── Transfer alert ────────────────────────────────────────

async function tweetTransferAlert(player, fromTeam, toTeam, fee) {
  const text = `🚨 TRANSFER ALERT\n\n${player} | ${fromTeam} ➡️ ${toTeam}\n\n💰 Fee: ${fee}\n\n✅ Confirmed!\n\n#TransferNews #FootballTransfers #GoalRushGlobal`;
  return postTweet(text);
}

module.exports = {
  postTweet,
  postThread,
  postTweetWithMedia,
  createLiveMatchThread,
  tweetGoalAlert,
  tweetTransferAlert,
};
