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
  const teamRes = await fetch(`https://api.football-data.org/v4/teams/${id}`, {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN }
  });
  const team = await teamRes.json();

  // Optionally: get all scorers to filter top scorers for this team
  // const scorersRes = await fetch('https://api.football-data.org/v4/competitions/PL/scorers', {...});
  // const scorersData = await scorersRes.json();
  // const teamScorers = scorersData.scorers.filter(p => p.team.id == id);

  return {
    props: { team }, // optionally add teamScorers
    revalidate: 60 * 30
  };
}

export default function TeamPage({ team }) {
  return (
    <div className="container mx-auto p-4">
      <TeamHeader team={team} />
      <h2 className="text-2xl font-semibold mt-6 mb-2">Players</h2>
      <PlayerStatsList data={team.squad} />
    </div>
  );
}
