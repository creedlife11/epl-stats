// components/TeamHeader.jsx
export default function TeamHeader({ team }) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <img
        src={team.crest}
        alt={`${team.name} crest`}
        className="w-16 h-16"
      />
      <div>
        <h1 className="text-3xl font-bold">{team.name}</h1>
        <p className="text-sm text-gray-600">{team.venue}</p>
      </div>
    </div>
  );
}
