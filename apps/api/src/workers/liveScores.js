const { getLiveFixtures } = require('../services/footballApi');

let lastScores = new Map();

function startLiveScoreWorker(io) {
  const tick = async () => {
    try {
      const matches = await getLiveFixtures();

      matches.forEach(match => {
        const prev = lastScores.get(match.id);
        const scoreKey = `${match.homeScore}-${match.awayScore}`;

        if (prev) {
          const prevKey = `${prev.homeScore}-${prev.awayScore}`;

          // Score changed — broadcast goal event
          if (scoreKey !== prevKey) {
            io.to('live-scores').emit('goal', {
              matchId: match.id,
              homeTeam: match.homeTeam.name,
              awayTeam: match.awayTeam.name,
              homeScore: match.homeScore,
              awayScore: match.awayScore,
              minute: match.minute,
            });

            io.to(`match:${match.id}`).emit('score-update', {
              homeScore: match.homeScore,
              awayScore: match.awayScore,
              minute: match.minute,
              status: match.status,
            });
          }

          // Status changed (e.g. FT, HT)
          if (match.status !== prev.status) {
            io.to('live-scores').emit('status-change', {
              matchId: match.id,
              status: match.status,
              homeTeam: match.homeTeam.name,
              awayTeam: match.awayTeam.name,
              finalScore: `${match.homeScore}-${match.awayScore}`,
            });
          }
        }

        lastScores.set(match.id, {
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          status: match.status,
          minute: match.minute,
        });
      });

      // Broadcast full live score update to all clients
      io.to('live-scores').emit('scores-update', matches);

    } catch (err) {
      console.error('[LiveScoreWorker] Error:', err.message);
    }
  };

  // Run every 30 seconds
  const interval = setInterval(tick, 30_000);
  tick(); // Run immediately on start

  return () => clearInterval(interval);
}

module.exports = { startLiveScoreWorker };
