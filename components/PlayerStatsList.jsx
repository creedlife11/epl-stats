// components/PlayerStatsList.jsx
export default function PlayerStatsList({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map(item => (
        <div
          key={item.player?.id || item.team?.id || item.name}
          className="border rounded-lg p-4 flex items-center space-x-4"
        >
          {item.team?.crest && (
            <img
              src={item.team.crest}
              alt={`${item.team.name} crest`}
              className="w-10 h-10"
            />
          )}
          <div>
            <p className="font-medium">
              {item.player?.name || item.name}
            </p>
            <p className="text-sm text-gray-600">
              {item.goals !== undefined
                ? `Goals: ${item.goals}`
                : item.cleanSheets !== undefined
                ? `Clean Sheets: ${item.cleanSheets}`
                : `${item.statName}: ${item.statValue}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
