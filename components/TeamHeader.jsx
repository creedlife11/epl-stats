// components/TeamHeader.jsx
export default function TeamHeader({ team }) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      {team?.crest ? (
        <img
          src={team.crest}
          alt={`${team.name} crest`}
          className="w-16 h-16 object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-500 text-xs font-bold">
            {team?.name?.charAt(0) || '?'}
          </span>
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold">{team?.name || 'Unknown Team'}</h1>
        <p className="text-sm text-gray-600">{team?.venue || 'Venue not available'}</p>
      </div>
    </div>
  );
}
