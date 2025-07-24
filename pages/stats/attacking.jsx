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

export default function Attacking({ players }) {
  if (!Array.isArray(players) || players.length === 0) {
    return <div>No attacking data available.</div>;
  }
  // ...your render code
}
