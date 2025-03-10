import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { X, Check, Edit, User } from 'lucide-react';

// Mock components to demonstrate functionality
const ProfileHeader = ({ profile, editedProfile, isEditing, setIsEditing, handleSave, handleCancel, user }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
          {profile.photoUrl ? (
            <img src={profile.photoUrl} alt={profile.firstName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-white mb-2 font-mono">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-green-400 font-mono mb-4">{profile.role}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-gray-900 rounded-md font-mono flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Save Changes
                </button>
                <button 
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-mono flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-mono flex items-center gap-2"
              >
                <Edit className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileDetails = ({ profile, editedProfile, isEditing, setEditedProfile }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !editedProfile.skills.includes(newSkill.trim())) {
      setEditedProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditedProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-6 font-mono">Profile Details</h2>
      
      {/* Personal Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-green-400 mb-4 font-mono">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <label className="block text-gray-400 mb-2 font-mono">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="emailId"
                value={editedProfile.emailId}
                onChange={handleInputChange}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-green-500"
              />
            ) : (
              <p className="text-white font-mono">{profile.emailId}</p>
            )}
          </div>
          
          {/* Age */}
          <div>
            <label className="block text-gray-400 mb-2 font-mono">Age</label>
            {isEditing ? (
              <input
                type="number"
                name="age"
                value={editedProfile.age}
                onChange={handleInputChange}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-green-500"
              />
            ) : (
              <p className="text-white font-mono">{profile.age}</p>
            )}
          </div>
          
          {/* Gender */}
          <div>
            <label className="block text-gray-400 mb-2 font-mono">Gender</label>
            {isEditing ? (
              <select
                name="gender"
                value={editedProfile.gender}
                onChange={handleInputChange}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-green-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            ) : (
              <p className="text-white font-mono capitalize">{profile.gender}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* About */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-green-400 mb-4 font-mono">About</h3>
        {isEditing ? (
          <textarea
            name="about"
            value={editedProfile.about}
            onChange={handleInputChange}
            rows="4"
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-green-500"
          />
        ) : (
          <p className="text-white font-mono whitespace-pre-line">{profile.about}</p>
        )}
      </div>
      
      {/* Skills */}
      <div>
        <h3 className="text-lg font-semibold text-green-400 mb-4 font-mono">Skills</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {(isEditing ? editedProfile.skills : profile.skills).map((skill, index) => (
            <div 
              key={index} 
              className={`
                px-3 py-1 rounded-full font-mono text-sm
                ${isEditing 
                  ? 'bg-gray-700 text-white flex items-center' 
                  : 'bg-green-900/30 text-green-400 border border-green-800'}
              `}
            >
              {skill}
              {isEditing && (
                <button 
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-red-400 hover:text-red-300"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        {isEditing && (
          <div className="flex items-center">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a skill"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-l px-3 py-2 text-white font-mono focus:outline-none focus:border-green-500"
            />
            <button
              onClick={handleAddSkill}
              className="bg-green-500 text-gray-900 px-3 py-2 rounded-r hover:bg-green-400 transition-colors"
            >
              <span className="font-bold">+</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;