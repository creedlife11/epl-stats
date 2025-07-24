// pages/teams/[teamId].jsx
import { useRouter } from 'next/router';
import TeamHeader from '../../components/TeamHeader';
import PlayerStatsList from '../../components/PlayerStatsList';

export async function getStaticPaths() {
  // Pre‑render only the 20 EPL clubs
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
  const [teamRes, statsRes] = await Promise.all([
    fetch(`https://api.football-data.org/v4/teams/${id}`, { headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }}),
    fetch(`https://api.football-data.org/v4/teams/${id}/stats`, { headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }})
  ]);
  const team = await teamRes.json();
  const stats = await statsRes.json();  // e.g. goals, assists, clean sheets, tackles
  return {
    props: { team, stats },
    revalidate: 60 * 30
  };
}

export default function TeamPage({ team, stats }) {
  return (
    <div className="container mx-auto p-4">
      <TeamHeader team={team} />
      <h2 className="text-2xl font-semibold mt-6">Top Metrics</h2>
      <PlayerStatsList data={stats} />
    </div>
  );
}
