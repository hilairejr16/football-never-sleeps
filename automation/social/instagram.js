require('dotenv').config({ path: '../../.env' });
const axios = require('axios');

const PAGE_ID = process.env.INSTAGRAM_ACCOUNT_ID;
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const GRAPH_URL = 'https://graph.facebook.com/v20.0';

async function createMediaContainer(imageUrl, caption) {
  if (!ACCESS_TOKEN) {
    console.warn('[Instagram] Access token not configured');
    return null;
  }

  const { data } = await axios.post(`${GRAPH_URL}/${PAGE_ID}/media`, {
    image_url: imageUrl,
    caption,
    access_token: ACCESS_TOKEN,
  });
  return data.id;
}

async function publishContainer(containerId) {
  const { data } = await axios.post(`${GRAPH_URL}/${PAGE_ID}/media_publish`, {
    creation_id: containerId,
    access_token: ACCESS_TOKEN,
  });
  return data.id;
}

async function postImage(imageUrl, caption, hashtags = []) {
  try {
    const fullCaption = `${caption}\n\n${hashtags.join(' ')}`;
    const containerId = await createMediaContainer(imageUrl, fullCaption);
    if (!containerId) return null;

    // Instagram requires a small delay between container creation and publish
    await new Promise(r => setTimeout(r, 2000));

    const postId = await publishContainer(containerId);
    console.log('[Instagram] Posted:', postId);
    return postId;
  } catch (err) {
    console.error('[Instagram] Post failed:', err.response?.data || err.message);
    return null;
  }
}

async function postReel(videoUrl, caption, hashtags = []) {
  try {
    const fullCaption = `${caption}\n\n${hashtags.join(' ')}`;

    // Step 1: Create reel container
    const { data: container } = await axios.post(`${GRAPH_URL}/${PAGE_ID}/media`, {
      media_type: 'REELS',
      video_url: videoUrl,
      caption: fullCaption,
      share_to_feed: true,
      access_token: ACCESS_TOKEN,
    });

    // Step 2: Wait for processing (poll)
    let status = 'IN_PROGRESS';
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 5000));
      const { data: statusData } = await axios.get(
        `${GRAPH_URL}/${container.id}?fields=status_code&access_token=${ACCESS_TOKEN}`
      );
      status = statusData.status_code;
      if (status === 'FINISHED') break;
      if (status === 'ERROR') throw new Error('Reel processing failed');
    }

    // Step 3: Publish
    const postId = await publishContainer(container.id);
    console.log('[Instagram] Reel posted:', postId);
    return postId;
  } catch (err) {
    console.error('[Instagram] Reel failed:', err.response?.data || err.message);
    return null;
  }
}

async function postGoalAlert(imageUrl, match, scorer, minute) {
  const score = `${match.homeScore}-${match.awayScore}`;
  const caption = `⚽ GOAL!\n\n${match.homeTeam.name} ${score} ${match.awayTeam.name}\n\n🎯 ${scorer} scores in the ${minute}th minute!\n\n📺 Follow @goalrushglobal for live updates`;

  const hashtags = [
    `#${match.homeTeam.name.replace(/\s/g, '')}`,
    `#${match.awayTeam.name.replace(/\s/g, '')}`,
    `#${match.league.name.replace(/\s/g, '')}`,
    '#Goal', '#Football', '#LiveFootball', '#GoalRushGlobal', '#FootballNeverSleeps',
    '#Soccer', '#UCL', '#PremierLeague',
  ];

  return postImage(imageUrl, caption, hashtags);
}

module.exports = { postImage, postReel, postGoalAlert };
