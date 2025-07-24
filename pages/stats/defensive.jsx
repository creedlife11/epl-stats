export async function getStaticProps() {
  const res = await fetch('https://api.football-data.org/v4/competitions/PL/standings', {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
  });
  let teams = [];
  try {
    const data = await res.json();
    // data.standings[0].table is an array of teams in the league table
    teams = Array.isArray(data.standings?.[0]?.table) ? data.standings[0].table : [];
  } catch {
    teams = [];
  }
  return {
    props: { teams },
    revalidate: 60 * 15
  };
}

export default function Defensive({ teams }) {
  if (!Array.isArray(teams) || teams.length === 0) {
    return <div>No defensive data available.</div>;
  }
  // Sort teams by fewest goals conceded
  const sorted = [...teams].sort((a, b) => a.against - b.against);

  return (
    <div>
      <h1>Top Defensive Teams (Fewest Goals Conceded)</h1>
      <ul>
        {sorted.slice(0, 10).map(team => (
          <li key={team.team.id}>
            {team.team.name}: {team.against} goals conceded
          </li>
        ))}
      </ul>
    </div>
  );
}
