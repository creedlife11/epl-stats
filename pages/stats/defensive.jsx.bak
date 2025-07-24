import PlayerStatsList from '../../components/PlayerStatsList';

export async function getStaticProps() {
  let players = [];
  try {
    const res = await fetch('YOUR_REAL_DEFENSIVE_STATS_API_URL', {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
    });
    if (res.ok) {
      const data = await res.json();
      // adjust this if your API returns data in a property (e.g., data.players)
      players = Array.isArray(data) ? data : [];
    }
  } catch (e) {
    players = [];
  }
  return {
    props: { players },
    revalidate: 60 * 15
  };
}

export default function Defensive({ players }) {
  if (!Array.isArray(players) || players.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Top Defensive Players</h1>
        <div className="text-lg">No defensive data available.</div>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Top Defensive Players</h1>
      <PlayerStatsList data={players} />
    </div>
  );
}
