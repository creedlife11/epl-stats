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

  const getRowBorderClass = (position) => {
    // Add thicker borders after qualification zones
    if (position === 4) return 'border-b-4 border-green-400'; // After Champions League
    if (position === 5) return 'border-b-4 border-orange-400'; // After Europa League
    if (position === 6) return 'border-b-4 border-yellow-400'; // After Conference League
    if (position === 17) return 'border-b-4 border-red-400'; // Before relegation zone
    return 'border-b-2 border-gray-300'; // Standard row separator
  };

  const getPositionBadge = (position) => {
    if (position <= 4) return '🏆';
    if (position === 5) return '🥈';
    if (position === 6) return '🥉';
    if (position >= 18) return '⬇️';
    return '';
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg">
      <table className="min-w-full border-collapse">
        <thead className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
          <tr>
            <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider border-r-2 border-gray-500">Pos</th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider border-r-2 border-gray-500">Team</th>
            <th className="px-2 py-4 text-center text-xs font-semibold uppercase tracking-wider border-r border-gray-600">P</th>
            <th className="px-2 py-4 text-center text-xs font-semibold uppercase tracking-wider border-r border-gray-600">W</th>
            <th className="px-2 py-4 text-center text-xs font-semibold uppercase tracking-wider border-r border-gray-600">D</th>
            <th className="px-2 py-4 text-center text-xs font-semibold uppercase tracking-wider border-r border-gray-600">L</th>
            <th className="px-2 py-4 text-center text-xs font-semibold uppercase tracking-wider border-r-2 border-gray-500">GF</th>
            <th className="px-2 py-4 text-center text-xs font-semibold uppercase tracking-wider border-r-2 border-gray-500">GA</th>
            <th className="px-2 py-4 text-center text-xs font-semibold uppercase tracking-wider border-r-2 border-gray-500">GD</th>
            <th className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider">Pts</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.map((row, index) => (
            <tr 
              key={row.rank} 
              className={`${getPositionColor(row.rank)} ${getRowBorderClass(row.rank)} transition-all duration-200 hover:shadow-md`}
            >
              <td className="px-3 py-4 border-r-2 border-gray-300">
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-bold text-gray-700">{row.rank}</span>
                  <span className="text-sm">{getPositionBadge(row.rank)}</span>
                </div>
              </td>
              <td className="px-4 py-4 border-r-2 border-gray-300">
                <div className="flex items-center space-x-3">
                  {row.crest ? (
                    <Link href={row.link}>
                      <a className="hover:scale-110 transition-transform duration-200 flex-shrink-0">
                        <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full border border-gray-200 shadow-sm">
                          <img 
                            src={row.crest} 
                            alt={`${row.team} crest`}
                            className="w-6 h-6 object-contain cursor-pointer"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      </a>
                    </Link>
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full border border-gray-200 flex-shrink-0">
                      <span className="text-xs font-bold text-gray-400">
                        {row.team?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <Link href={row.link}>
                    <a className="font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 text-sm truncate">
                      {row.team}
                    </a>
                  </Link>
                </div>
              </td>
              <td className="px-2 py-4 text-center border-r border-gray-200">
                <span className="text-sm font-medium text-gray-700">{row.played}</span>
              </td>
              <td className="px-2 py-4 text-center border-r border-gray-200">
                <span className="text-sm font-medium text-green-600">{row.won || 0}</span>
              </td>
              <td className="px-2 py-4 text-center border-r border-gray-200">
                <span className="text-sm font-medium text-yellow-600">{row.drawn || 0}</span>
              </td>
              <td className="px-2 py-4 text-center border-r border-gray-200">
                <span className="text-sm font-medium text-red-600">{row.lost || 0}</span>
              </td>
              <td className="px-2 py-4 text-center border-r-2 border-gray-300">
                <span className="text-sm font-medium text-blue-600">{row.goalsFor || 0}</span>
              </td>
              <td className="px-2 py-4 text-center border-r-2 border-gray-300">
                <span className="text-sm font-medium text-red-500">{row.goalsAgainst || 0}</span>
              </td>
              <td className="px-2 py-4 text-center border-r-2 border-gray-300">
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
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Position Legend */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">QUALIFICATION</h4>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded border border-green-600"></div>
                <span>Champions League</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-500 rounded border border-orange-600"></div>
                <span>Europa League</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded border border-yellow-600"></div>
                <span>Conference League</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded border border-red-600"></div>
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
