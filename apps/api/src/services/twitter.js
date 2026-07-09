const { TwitterApi } = require('twitter-api-v2');

function getClient() {
  const { TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET } = process.env;
  if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_SECRET) {
    throw new Error('Twitter API credentials not configured in environment variables');
  }
  return new TwitterApi({
    appKey:            TWITTER_API_KEY,
    appSecret:         TWITTER_API_SECRET,
    accessToken:       TWITTER_ACCESS_TOKEN,
    accessSecret:      TWITTER_ACCESS_SECRET,
  });
}

/**
 * Post a tweet (text only, up to 280 chars)
 * Returns the created tweet object.
 */
async function postTweet(text) {
  const client = getClient();
  const { data } = await client.v2.tweet(text);
  return data;
}

/**
 * Post a tweet with a quoted link (article URL appended automatically)
 * Twitter counts URLs as 23 chars — text can be up to 257 chars before the link.
 */
async function postArticleTweet(text, articleUrl) {
  const MAX_TEXT = 257; // 280 - 23 (URL)
  const body = text.length > MAX_TEXT ? text.slice(0, MAX_TEXT - 1) + '…' : text;
  return postTweet(`${body}\n\n${articleUrl}`);
}

/**
 * Build a punchy tweet from a GoalRush article object
 * { title, excerpt, slug } → tweet text + URL
 */
function buildArticleTweet(article) {
  const url = `https://www.goalrushglobal.com/news/${article.slug}`;
  // Use the title if short, else excerpt
  const headline = article.title.length <= 200
    ? article.title
    : article.excerpt?.slice(0, 197) + '…';
  const body = `⚽ ${headline}\n\n#WorldCup2026 #GoalRush`;
  return { text: body, url };
}

module.exports = { postTweet, postArticleTweet, buildArticleTweet };
