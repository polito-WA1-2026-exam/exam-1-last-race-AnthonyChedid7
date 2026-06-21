import { useEffect, useState } from 'react';
import API from '../API';

function RankingPage() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getRanking()
      .then(setRanking)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="card">
        <h2>Loading ranking...</h2>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>🏆 Leaderboard</h2>

      <table className="ranking-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>
          {ranking.map((player, index) => (
            <tr key={index}>
              <td>
                {index === 0
                  ? '🥇'
                  : index === 1
                  ? '🥈'
                  : index === 2
                  ? '🥉'
                  : index + 1}
              </td>

              <td>{player.username}</td>

              <td>{player.best_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default RankingPage;
