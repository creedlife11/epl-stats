import TeamHeader from '../../components/TeamHeader';
import PlayerStatsList from '../../components/PlayerStatsList';

export async function getStaticPaths() {
  const res = await fetch('https://api.football-data.org/v4/competitions/PL/teams', {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
  });
  const { teams } = await res.json();
  return {
    paths: teams.map(t => ({ params: { teamId: t.id.toString() } })),
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const id = params.teamId;
  
  // Fetch team basic info
  let team = {};
  try {
    const teamRes = await fetch(`https://api.football-data.org/v4/teams/${id}`, {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
    });
    
    if (!teamRes.ok) {
      // Only return 404 for actual 404 responses (team doesn't exist)
      if (teamRes.status === 404) {
        return { notFound: true };
      }
      throw new Error(`HTTP error! status: ${teamRes.status}`);
    }
    
    team = await teamRes.json();
  } catch (error) {
    console.log('Team data fetch error:', error.message);
    
    // Try to get team info from standings as fallback
    try {
      const standingsRes = await fetch('https://api.football-data.org/v4/competitions/PL/standings', {
        headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
      });
      
      if (standingsRes.ok) {
        const standingsData = await standingsRes.json();
        const teamFromStandings = standingsData?.standings?.[0]?.table?.find(t => t.team.id == id);
        
        if (teamFromStandings) {
          team = {
            id: teamFromStandings.team.id,
            name: teamFromStandings.team.name,
            crest: teamFromStandings.team.crest,
            venue: teamFromStandings.team.venue || 'Unknown',
            squad: [] // We'll populate this with basic data if possible
          };
        } else {
          throw new Error('Team not found in standings');
        }
      } else {
        throw new Error('Standings API also failed');
      }
    } catch (fallbackError) {
      console.log('Fallback team fetch also failed:', fallbackError.message);
      // Last resort: create a basic team object
      team = {
        id: parseInt(id),
        name: `Team ${id}`,
        crest: '',
        venue: 'Unknown',
        squad: []
      };
    }
  }

  // Fetch top scorers for this team
  let teamScorers = [];
  try {
    const scorersRes = await fetch('https://api.football-data.org/v4/competitions/PL/scorers', {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
    });
    const scorersData = await scorersRes.json();
    teamScorers = (scorersData?.scorers || []).filter(p => p.team.id == id);
  } catch (error) {
    console.log('Scorers data not available:', error.message);
    teamScorers = [];
  }

  // Fetch assists data (if available)
  let teamAssists = [];
  try {
    const assistsRes = await fetch('https://api.football-data.org/v4/competitions/PL/scorers?type=assists', {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
    });
    const assistsData = await assistsRes.json();
    teamAssists = (assistsData?.scorers || []).filter(p => p.team.id == id);
  } catch (error) {
    console.log('Assists data not available:', error.message);
    teamAssists = [];
  }

  // Combine squad with performance data
  const playersWithStats = (team?.squad || []).map(player => {
    const scorerData = teamScorers.find(s => s?.player?.id === player?.id);
    const assistData = teamAssists.find(a => a?.player?.id === player?.id);
    
    return {
      ...player,
      goals: scorerData?.goals || 0,
      assists: assistData?.assists || 0,
      penalties: scorerData?.penalties || 0
    };
  });

  return {
    props: { 
      team: {
        ...team,
        squad: playersWithStats
      },
      teamScorers,
      teamAssists
    },
    revalidate: 60 * 30
  };
}

export default function TeamPage({ team, teamScorers, teamAssists }) {
  const topScorers = teamScorers?.slice(0, 5) || [];
  const topAssists = teamAssists?.slice(0, 5) || [];

  return (
    <div className="container mx-auto p-4">
      <TeamHeader team={team} />
      
      {/* Top Performers Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top Performers</h2>
        {(topScorers.length > 0 || topAssists.length > 0) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topScorers.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium mb-2">Top Scorers</h3>
                <div className="space-y-2">
                  {topScorers.map((scorer, index) => (
                    <div key={scorer.player.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{index + 1}. {scorer.player.name}</span>
                      <span className="font-medium">{scorer.goals} goals</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-2">Top Scorers</h3>
                <div className="p-4 bg-gray-50 rounded text-center text-gray-500">
                  No scoring data available for this season
                </div>
              </div>
            )}
            
            {topAssists.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium mb-2">Top Assists</h3>
                <div className="space-y-2">
                  {topAssists.map((assist, index) => (
                    <div key={assist.player.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{index + 1}. {assist.player.name}</span>
                      <span className="font-medium">{assist.assists} assists</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-2">Top Assists</h3>
                <div className="p-4 bg-gray-50 rounded text-center text-gray-500">
                  No assist data available for this season
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 bg-gray-50 rounded text-center text-gray-500">
            Performance data not available for this team in the current season
          </div>
        )}
      </div>

      {/* Full Squad Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">Full Squad</h2>
      {team?.squad && team.squad.length > 0 ? (
        <PlayerStatsList data={team.squad} />
      ) : (
        <div className="p-6 bg-gray-50 rounded text-center text-gray-500">
          <p className="mb-2">Squad information not available for {team?.name || 'this team'}</p>
          <p className="text-sm">This may be due to API limitations or the team not being in the current Premier League season.</p>
        </div>
      )}
    </div>
  );
}
