// pages/stats/attacking.jsx
import PlayerStatsList from '../../components/PlayerStatsList';

export async function getStaticProps() {
  const res = await fetch('https://api.football-data.org/v4/competitions/PL/scorers', {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
  });
  const { scorers } = await res.json();
  return { props: { players: scorers }, revalidate: 60 * 15 };
}

export default function Attacking({ players }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Top Goals & Assists</h1>
      <PlayerStatsList data={players} />
    </div>
  );
}

// pages/stats/defensive.jsx
import PlayerStatsList from '../../components/PlayerStatsList';

export async function getStaticProps() {
  const res = await fetch('https://api.example.com/epl/defensive-stats');
  const players = await res.json(); // e.g. tackles, interceptions
  return { props: { players }, revalidate: 60 * 15 };
}

export default function Defensive({ players }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Top Defensive Players</h1>
      <PlayerStatsList data={players} />
    </div>
  );
}
