// components/Table.jsx
import Link from 'next/link';

export default function Table({ rows }) {
  const getPositionColor = (position) => {
    if (position <= 4) return 'bg-green-50 border-l-4 border-green-500'; // Champions League
    if (position === 5) return 'bg-orange-50 border-l-4 border-orange-500'; // Europa League
    if (position === 6) return 'bg-yellow-50 border-l-4 border-yellow-500'; // Conference League
    if (position >= 18) return 'bg-red-50 border-l-4 border-red-500'; // Relegation
    return 'bg-white hover:bg-gray-50';
  };

  const getPositionBadge = (position) => {
    if (position <= 4) return '🏆';
    if (position === 5) return '🥈';
    if (position === 6) return '🥉';
    if (position >= 18) return '⬇️';
    return '';
  };

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
          <tr>
            <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">Pos</th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Team</th>
            <th className="px-2 py-4 text-center text-xs font-semibold uppercase tracking-wider">P</th>
            <th className="px-2 py-4 text-center text-xs font-semibold uppercase tracking-wider">W</th>
            <th className="px-2 py-4 text-center text-xs font-semibold uppercase tracking-wider">D</th>
            <th className="px-2 py-4 text-center text-xs font-semibold uppercase tracking-wider">L</th>
            <th className="px-2 py-4 text-center text-xs font-semibold uppercase tracking-wider">GF</th>
            <th className="px-2 py-4 text-center text-xs font-semibold uppercase tracking-wider">GA</th>
            <th className="px-2 py-4 text-center text-xs font-semibold uppercase tracking-wider">GD</th>
            <th className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider">Pts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, index) => (
            <tr 
              key={row.rank} 
              className={`${getPositionColor(row.rank)} transition-all duration-200 hover:shadow-md`}
            >
              <td className="px-3 py-4">
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-bold text-gray-700">{row.rank}</span>
                  <span className="text-sm">{getPositionBadge(row.rank)}</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center space-x-2">
                  {row.crest && (
                    <Link href={row.link}>
                      <a className="hover:scale-110 transition-transform duration-200">
                        <img 
                          src={row.crest} 
                          alt={`${row.team} crest`}
                          className="w-6 h-6 object-contain cursor-pointer rounded-full shadow-sm"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </a>
                    </Link>
                  )}
                  <Link href={row.link}>
                    <a className="font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 text-sm">
                      {row.team}
                    </a>
                  </Link>
                </div>
              </td>
              <td className="px-2 py-4 text-center">
                <span className="text-sm font-medium text-gray-700">{row.played}</span>
              </td>
              <td className="px-2 py-4 text-center">
                <span className="text-sm font-medium text-green-600">{row.won || 0}</span>
              </td>
              <td className="px-2 py-4 text-center">
                <span className="text-sm font-medium text-yellow-600">{row.drawn || 0}</span>
              </td>
              <td className="px-2 py-4 text-center">
                <span className="text-sm font-medium text-red-600">{row.lost || 0}</span>
              </td>
              <td className="px-2 py-4 text-center">
                <span className="text-sm font-medium text-blue-600">{row.goalsFor || 0}</span>
              </td>
              <td className="px-2 py-4 text-center">
                <span className="text-sm font-medium text-red-500">{row.goalsAgainst || 0}</span>
              </td>
              <td className="px-2 py-4 text-center">
                <span className={`text-sm font-bold ${
                  (row.goalDifference || 0) > 0 ? 'text-green-600' : 
                  (row.goalDifference || 0) < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {(row.goalDifference || 0) > 0 ? '+' : ''}{row.goalDifference || 0}
                </span>
              </td>
              <td className="px-3 py-4 text-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                  {row.points}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Legend */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Position Legend */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">QUALIFICATION</h4>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Champions League</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>Europa League</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Conference League</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Relegation</span>
              </div>
            </div>
          </div>
          
          {/* Column Legend */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">COLUMNS</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>P = Played • W = Won • D = Drawn • L = Lost</div>
              <div>GF = Goals For • GA = Goals Against • GD = Goal Difference</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
