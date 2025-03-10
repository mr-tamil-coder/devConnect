import React, { useState, useRef, useEffect } from "react";
import {
  Heart,
  X,
  Code,
  Github,
  Coffee,
  Briefcase,
  MapPin,
  Award,
  Star,
  Satellite,
} from "lucide-react";
import axios from "axios";
import { API } from "../data/main";
import { useSelector, useDispatch } from "react-redux";
import { addFeed } from "../utils/feedSlice";
// Sample developer profiles data with images
const sampleProfiles = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Full Stack Developer",
    location: "San Francisco",
    github: "sarahcodes",
    experience: "5 years",
    techStack: ["React", "Node.js", "MongoDB", "TypeScript"],
    interests: ["Open Source", "AI/ML", "Cloud"],
    achievement: "Created a popular dev tool with 2k+ stars",
    coffeePreference: "Cold Brew ☕",
    image: "/api/placeholder/400/500", // Using placeholder for demo
  },
  {
    id: 2,
    name: "Alex Kumar",
    role: "Frontend Specialist",
    location: "Berlin",
    github: "alexdev",
    experience: "3 years",
    techStack: ["Vue.js", "Nuxt", "TailwindCSS"],
    interests: ["UI/UX", "Animation", "JAMstack"],
    achievement: "Speaker at Vue.js Conference",
    coffeePreference: "Espresso ☕",
    image: "/api/placeholder/400/500",
  },
];

const DevTinderFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [swipeHistory, setSwipeHistory] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [currentUser,setCurrentUser]= useState("");
  const currentProfile = sampleProfiles[currentIndex];
  const getFeed = async () => {
    if (feed) return;
    try {
      const response = await axios.get(API + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(response.data));
      setCurrentUser(response.data[2]);
      console.log(response.data[2]);
      
      // currentUser = response.data[2];
      // console.log("currentUser: ", currentUser);
    } catch (err) {
      //TODO : handle feed logic error
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;

    setDragOffset({ x: deltaX, y: deltaY });

    // Calculate rotation based on drag distance
    const rotation = deltaX * 0.1;
    if (cardRef.current) {
      cardRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
    }

    // Show swipe indicators based on drag direction
    if (deltaX > 100) {
      setSwipeDirection("right");
    } else if (deltaX < -100) {
      setSwipeDirection("left");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const threshold = 100; // Minimum distance to trigger swipe

    if (dragOffset.x > threshold) {
      handleSwipe("right");
    } else if (dragOffset.x < -threshold) {
      handleSwipe("left");
    } else {
      // Reset card position if swipe threshold not met
      if (cardRef.current) {
        cardRef.current.style.transform = "none";
      }
    }

    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleSwipe = (direction) => {
    setSwipeHistory((prev) => [
      ...prev,
      {
        id: currentProfile.id,
        name: currentProfile.name,
        direction,
        timestamp: new Date().toISOString(),
      },
    ]);

    // Animate card away
    const rotation = direction === "right" ? 30 : -30;
    const translateX = direction === "right" ? "120%" : "-120%";

    if (cardRef.current) {
      cardRef.current.style.transform = `translate(${translateX}, 0) rotate(${rotation}deg)`;
      cardRef.current.style.transition = "transform 0.5s ease-out";
    }

    // Move to next profile
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % sampleProfiles.length);
      setSwipeDirection(null);
      if (cardRef.current) {
        cardRef.current.style.transform = "none";
        cardRef.current.style.transition = "none";
      }
    }, 500);
  };

  if (!currentProfile) return null;

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center">
      {/* Swipe indicators */}
      <div className="fixed top-1/2 left-8 transform -translate-y-1/2">
        <div
          className={`transition-opacity duration-200 ${
            swipeDirection === "left" ? "opacity-100" : "opacity-0"
          }`}
        >
          <X className="h-16 w-16 text-red-500" />
        </div>
      </div>
      <div className="fixed top-1/2 right-8 transform -translate-y-1/2">
        <div
          className={`transition-opacity duration-200 ${
            swipeDirection === "right" ? "opacity-100" : "opacity-0"
          }`}
        >
          <Heart className="h-16 w-16 text-green-500" />
        </div>
      </div>

      {/* Profile Card */}
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
            src={currentUser.photoUrl}
            alt={currentUser.firstName}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-32" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-3xl font-bold text-white mb-2">
              {currentUser.firstName + " " + currentUser.lastName}
            </h2>
            <div className="flex items-center text-gray-200 space-x-2">
              <Code className="h-5 w-5 text-green-400" />
              <span>{currentUser.role}</span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-gray-300">
              <Briefcase className="h-5 w-5 mr-2 text-blue-400" />
              <span>{currentProfile.experience}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <MapPin className="h-5 w-5 mr-2 text-red-400" />
              <span>{currentProfile.location}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Github className="h-5 w-5 mr-2 text-purple-400" />
              <span>{currentProfile.github}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Coffee className="h-5 w-5 mr-2 text-yellow-400" />
              <span>{currentProfile.coffeePreference}</span>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-2 font-mono flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-400" />
              Achievement
            </div>
            <p className="text-gray-300">{currentProfile.achievement}</p>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-2 font-mono">
              Tech Stack
            </div>
            <div className="flex flex-wrap gap-2">
              {currentUser && currentUser.skills.map((tech) => (
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
              {currentProfile.interests.map((interest) => (
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
            onClick={() => handleSwipe("left")}
            className="p-4 bg-gray-800 hover:bg-red-500 rounded-full transition-colors duration-300 group"
          >
            <X className="h-8 w-8 text-red-500 group-hover:text-white" />
          </button>
          <button
            onClick={() => handleSwipe("right")}
            className="p-4 bg-gray-800 hover:bg-green-500 rounded-full transition-colors duration-300 group"
          >
            <Heart className="h-8 w-8 text-green-500 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Swipe History */}
      <div className="mt-6 w-full max-w-md">
        <div className="text-gray-400 font-mono mb-2">Recent Activity</div>
        <div className="space-y-2">
          {swipeHistory
            .slice(-3)
            .reverse()
            .map((swipe) => (
              <div
                key={swipe.timestamp}
                className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center justify-between"
              >
                <span className="text-gray-300 font-mono">{swipe.name}</span>
                <span
                  className={`font-mono ${
                    swipe.direction === "right"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {swipe.direction === "right" ? "→ Matched" : "← Passed"}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DevTinderFeed;
