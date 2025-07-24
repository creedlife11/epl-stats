// pages/index.jsx
import Link from 'next/link';
import Table from '../components/Table';

export async function getStaticProps() {
  const res = await fetch('https://api.football-data.org/v4/competitions/PL/standings', {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
  });
  const data = await res.json();
  const table = data.standings.find(s => s.type === 'TOTAL').table;
  
  return {
    props: { table },
    revalidate: 60 * 15  // re‑build every 15 minutes
  };
}

export default function Home({ table }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Premier League Standings</h1>
      <Table rows={table.map(row => ({
        rank: row.position,
        team: row.team.name,
        crest: row.team.crest,
        played: row.playedGames,
        points: row.points,
        link: `/teams/${row.team.id}`
      }))} />

      <div className="mt-8 flex space-x-4">
        <Link href="/stats/attacking">
          <a className="btn">Top Attacking Players</a>
        </Link>
        <Link href="/stats/defensive">
          <a className="btn">Top Defensive Players</a>
        </Link>
      </div>
    </div>
  );
}
