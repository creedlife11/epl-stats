export async function getStaticProps() {
  const res = await fetch('https://api.football-data.org/v4/competitions/PL/scorers', {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
  });
  let players = [];
  try {
    const data = await res.json();
    players = Array.isArray(data.scorers) ? data.scorers : [];
  } catch {
    players = [];
  }
  return {
    props: { players },
    revalidate: 60 * 15
  };
}

import Link from 'next/link';
import PlayerStatsList from '../../components/PlayerStatsList';

export default function Attacking({ players }) {
  if (!Array.isArray(players) || players.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Top Attacking Players</h1>
        <div className="text-center py-8 text-gray-500">No attacking data available.</div>
        <Link href="/">
          <a className="text-blue-600 hover:underline">← Back to Home</a>
        </Link>
      </div>
    );
  }

  // Transform the data to match PlayerStatsList expectations
  const attackingStats = players.map(scorer => ({
    id: scorer.player.id,
    name: scorer.player.name,
    team: scorer.team,
    goals: scorer.goals,
    assists: scorer.assists || 0,
    penalties: scorer.penalties || 0,
    position: scorer.player.position,
    nationality: scorer.player.nationality,
    dateOfBirth: scorer.player.dateOfBirth
  }));

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Top Attacking Players</h1>
        <Link href="/">
          <a className="text-blue-600 hover:underline">← Back to Home</a>
        </Link>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600">Premier League top scorers and attacking players for the current season.</p>
      </div>

      {/* Top 3 Scorers Highlight */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top 3 Scorers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {attackingStats.slice(0, 3).map((player, index) => (
            <div key={player.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                }`}>
                  {index + 1}
                </div>
                <img src={player.team.crest} alt={`${player.team.name} crest`} className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg">{player.name}</h3>
              <p className="text-sm text-gray-600">{player.team.name}</p>
              <p className="text-2xl font-bold text-green-600">{player.goals} goals</p>
              {player.penalties > 0 && (
                <p className="text-sm text-gray-500">{player.penalties} penalties</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* All Players */}
      <h2 className="text-2xl font-semibold mb-4">All Top Scorers</h2>
      <PlayerStatsList data={attackingStats} />
    </div>
  );
}
