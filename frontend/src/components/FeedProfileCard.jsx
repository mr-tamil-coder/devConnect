import React, { useRef } from "react";
import {
  Heart,
  X,
  Code,
  Github,
  Coffee,
  Briefcase,
  MapPin,
  Star,
} from "lucide-react";

const FeedProfileCard = ({
  profile,
  onSwipe,
  swipeDirection,
  isDragging,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
}) => {
  const cardRef = useRef(null);

  if (!profile) return null;

  return (
    <div
      ref={cardRef}
      className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Profile Image */}
      <div className="relative h-96">
        <img
          src={profile.image}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-32" />
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-3xl font-bold text-white mb-2">
            {profile.name}
          </h2>
          <div className="flex items-center text-gray-200 space-x-2">
            <Code className="h-5 w-5 text-green-400" />
            <span>{profile.role}</span>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-gray-300">
            <Briefcase className="h-5 w-5 mr-2 text-blue-400" />
            <span>{profile.experience}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <MapPin className="h-5 w-5 mr-2 text-red-400" />
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Github className="h-5 w-5 mr-2 text-purple-400" />
            <span>{profile.github}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Coffee className="h-5 w-5 mr-2 text-yellow-400" />
            <span>{profile.coffeePreference}</span>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-2 font-mono flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-400" />
            Achievement
          </div>
          <p className="text-gray-300">{profile.achievement}</p>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-2 font-mono">
            Tech Stack
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-gray-700 text-green-400 rounded-full text-sm font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-2 font-mono">
            Interests
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 bg-gray-700 text-blue-400 rounded-full text-sm font-mono"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-4 bg-gray-900 flex justify-center space-x-6">
        <button
          onClick={() => onSwipe("left")}
          className="p-4 bg-gray-800 hover:bg-red-500 rounded-full transition-colors duration-300 group"
        >
          <X className="h-8 w-8 text-red-500 group-hover:text-white" />
        </button>
        <button
          onClick={() => onSwipe("right")}
          className="p-4 bg-gray-800 hover:bg-green-500 rounded-full transition-colors duration-300 group"
        >
          <Heart className="h-8 w-8 text-green-500 group-hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default FeedProfileCard;