export async function getStaticProps() {
  let teams = [];
  let goalkeepers = [];
  
  // Fetch team standings for defensive stats
  try {
    const standingsRes = await fetch('https://api.football-data.org/v4/competitions/PL/standings', {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
    });
    
    if (standingsRes.ok) {
      const standingsData = await standingsRes.json();
      teams = Array.isArray(standingsData?.standings?.[0]?.table) ? standingsData.standings[0].table : [];
    } else {
      console.log('Standings API returned:', standingsRes.status);
    }
  } catch (error) {
    console.log('Error fetching standings:', error.message);
    teams = [];
  }

  // Try to fetch goalkeeper/clean sheet data (this might not be available in all API tiers)
  try {
    const scorersRes = await fetch('https://api.football-data.org/v4/competitions/PL/scorers', {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
    });
    
    if (scorersRes.ok) {
      const scorersData = await scorersRes.json();
      // Filter for goalkeepers and defenders with good defensive records
      goalkeepers = (scorersData?.scorers || []).filter(player => 
        player?.player?.position === 'Goalkeeper' || player?.player?.position === 'Defender'
      );
    }
  } catch (error) {
    console.log('Error fetching defensive players:', error.message);
    goalkeepers = [];
  }

  return {
    props: { teams, goalkeepers },
    revalidate: 60 * 15
  };
}

import Link from 'next/link';

export default function Defensive({ teams, goalkeepers }) {
  if (!Array.isArray(teams) || teams.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Top Defensive Stats</h1>
        <div className="text-center py-8 text-gray-500">No defensive data available.</div>
        <Link href="/">
          <a className="text-blue-600 hover:underline">← Back to Home</a>
        </Link>
      </div>
    );
  }

  // Sort teams by defensive metrics
  const bestDefense = [...teams].sort((a, b) => a.goalsAgainst - b.goalsAgainst);
  const cleanSheets = [...teams].sort((a, b) => (b.won - b.draw) - (a.won - a.draw)); // Approximate clean sheets
  const bestGoalDifference = [...teams].sort((a, b) => b.goalDifference - a.goalDifference);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Top Defensive Stats</h1>
        <Link href="/">
          <a className="text-blue-600 hover:underline">← Back to Home</a>
        </Link>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600">Premier League defensive statistics and best performing defensive teams.</p>
      </div>

      {/* Top 3 Defensive Teams */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Best Defensive Records</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bestDefense.slice(0, 3).map((team, index) => (
            <div key={team.team.id} className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-gray-400' : 'bg-green-400'
                }`}>
                  {index + 1}
                </div>
                <img src={team.team.crest} alt={`${team.team.name} crest`} className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg">{team.team.name}</h3>
              <p className="text-2xl font-bold text-blue-600">{team.goalsAgainst} goals conceded</p>
              <p className="text-sm text-gray-600">in {team.playedGames} games</p>
              <p className="text-sm text-green-600">Avg: {(team.goalsAgainst / team.playedGames).toFixed(1)} per game</p>
            </div>
          ))}
        </div>
      </div>

      {/* Defensive Statistics Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Goals Conceded */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Fewest Goals Conceded</h2>
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Team</th>
                  <th className="px-4 py-2 text-center">Goals Against</th>
                  <th className="px-4 py-2 text-center">Games</th>
                </tr>
              </thead>
              <tbody>
                {bestDefense.slice(0, 10).map((team, index) => (
                  <tr key={team.team.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <img src={team.team.crest} alt={`${team.team.name} crest`} className="w-5 h-5" />
                        <Link href={`/teams/${team.team.id}`}>
                          <a className="hover:underline">{team.team.name}</a>
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center font-medium">{team.goalsAgainst}</td>
                    <td className="px-4 py-2 text-center">{team.playedGames}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Goal Difference */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Best Goal Difference</h2>
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Team</th>
                  <th className="px-4 py-2 text-center">Goal Diff</th>
                  <th className="px-4 py-2 text-center">For/Against</th>
                </tr>
              </thead>
              <tbody>
                {bestGoalDifference.slice(0, 10).map((team, index) => (
                  <tr key={team.team.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <img src={team.team.crest} alt={`${team.team.name} crest`} className="w-5 h-5" />
                        <Link href={`/teams/${team.team.id}`}>
                          <a className="hover:underline">{team.team.name}</a>
                        </Link>
                      </div>
                    </td>
                    <td className={`px-4 py-2 text-center font-medium ${
                      team.goalDifference > 0 ? 'text-green-600' : team.goalDifference < 0 ? 'text-red-600' : ''
                    }`}>
                      {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                    </td>
                    <td className="px-4 py-2 text-center text-sm">
                      {team.goalsFor}/{team.goalsAgainst}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Defensive Players Section */}
      {goalkeepers.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Top Defensive Players</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goalkeepers.slice(0, 6).map(player => (
              <div key={player.player.id} className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <img src={player.team.crest} alt={`${player.team.name} crest`} className="w-6 h-6" />
                  <span className="text-sm text-gray-600">{player.team.name}</span>
                </div>
                <h3 className="font-medium">{player.player.name}</h3>
                <p className="text-sm text-gray-600">{player.player.position}</p>
                {player.goals > 0 && (
                  <p className="text-sm text-blue-600">Goals: {player.goals}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
