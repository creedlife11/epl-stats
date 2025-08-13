export default function PlayerStatsList({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No player data available.</div>;
  }

  // Sort players by goals + assists for better display
  const sortedData = [...data].sort((a, b) => {
    const aTotal = (a.goals || 0) + (a.assists || 0);
    const bTotal = (b.goals || 0) + (b.assists || 0);
    return bTotal - aTotal;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedData.map(player => (
        <div
          key={player.id || player.name}
          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-medium text-lg">{player.name}</p>
              <p className="text-sm text-gray-600">{player.position}</p>
            </div>
            {player.nationality && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {player.nationality}
              </span>
            )}
          </div>
          
          <div className="space-y-1">
            {(player.goals > 0 || player.assists > 0) && (
              <div className="flex justify-between text-sm">
                <span>Goals:</span>
                <span className="font-medium">{player.goals || 0}</span>
              </div>
            )}
            {player.assists > 0 && (
              <div className="flex justify-between text-sm">
                <span>Assists:</span>
                <span className="font-medium">{player.assists}</span>
              </div>
            )}
            {player.penalties > 0 && (
              <div className="flex justify-between text-sm">
                <span>Penalties:</span>
                <span className="font-medium">{player.penalties}</span>
              </div>
            )}
            {player.dateOfBirth && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>Age:</span>
                <span>{new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear()}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
