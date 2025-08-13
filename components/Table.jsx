// components/Table.jsx
import Link from 'next/link';

export default function Table({ rows }) {
  return (
    <table className="min-w-full table-auto border-collapse">
      <thead>
        <tr>
          <th className="px-4 py-2">#</th>
          <th className="px-4 py-2">Team</th>
          <th className="px-4 py-2">P</th>
          <th className="px-4 py-2">Pts</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.rank} className="text-center border-t">
            <td className="px-4 py-2">{row.rank}</td>
            <td className="px-4 py-2">
              <div className="flex items-center space-x-2">
                {row.crest && (
                  <img 
                    src={row.crest} 
                    alt={`${row.team} crest`}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <Link href={row.link}><a className="hover:underline">{row.team}</a></Link>
              </div>
            </td>
            <td className="px-4 py-2">{row.played}</td>
            <td className="px-4 py-2">{row.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
