// components/AboutUs/TeamMemberCard.jsx

const TeamMemberCard = ({ member, index }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={member.image || "/api/placeholder/80/80"}
          alt={member.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
          onError={(e) => {
            e.target.src = "/api/placeholder/80/80";
          }}
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
          <p className="text-blue-600 font-semibold mb-2">{member.position}</p>
          <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
          {member.expertise && member.expertise.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {member.expertise.map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
