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
    revalidate: 60 * 60  // re‑build every hour to reduce API calls
  };
}

export default function Home({ table }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Premier League
          </h1>
          <p className="text-xl md:text-2xl font-light mb-2">2024-25 Season</p>
          <p className="text-lg opacity-90">Live Standings & Statistics</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Standings Section */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="mr-3">🏆</span>
              Current Standings
            </h2>
          </div>
          <div className="p-6">
            <Table rows={table.map(row => ({
              rank: row.position,
              team: row.team.name,
              crest: row.team.crest,
              played: row.playedGames,
              points: row.points,
              link: `/teams/${row.team.id}`
            }))} />
          </div>
        </div>

        {/* Stats Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/stats/attacking">
            <a className="group bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">⚽ Top Attackers</h3>
                  <p className="text-red-100">Goals, assists & attacking stats</p>
                </div>
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  🎯
                </div>
              </div>
            </a>
          </Link>
          
          <Link href="/stats/defensive">
            <a className="group bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">🛡️ Top Defenders</h3>
                  <p className="text-blue-100">Clean sheets & defensive records</p>
                </div>
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  🥅
                </div>
              </div>
            </a>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white opacity-75">
          <p className="text-sm">Data provided by football-data.org • Updated hourly</p>
        </div>
      </div>
    </div>
  );
}
