// components/AboutUs/TeamTab.jsx
import { AlertCircle, Loader, Users } from "lucide-react";
import TeamMemberCard from "./TeamMemberCard";

const TeamTab = ({ teamMembers, teamLoading, teamError }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our dedicated team of professionals brings together decades of
          experience in the automotive industry, committed to delivering
          excellence in every aspect of our service.
        </p>
      </div>

      {/* Loading State */}
      {teamLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center space-x-2">
            <Loader className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading team members...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {teamError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <span className="text-red-800">
              Error loading team members: {teamError.message}
            </span>
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      {!teamLoading && !teamError && (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {teamMembers.length > 0 ? (
            teamMembers.map((member, index) => (
              <TeamMemberCard
                key={member.id || index}
                member={member}
                index={index}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No team members found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamTab;
