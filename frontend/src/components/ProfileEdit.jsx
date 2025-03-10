// ProfileEdit.js
import React, { useState, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileDetails from "./ProfileDetails";
import { useSelector } from "react-redux";
import { API } from "../data/main";
import axios from "axios";

const ProfileEdit = () => {
  const user = useSelector((store) => store.user);
  console.log("Redux User:", user);

  // Create initial profile from user data in store
  const initialProfile = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    role: user?.role || "",
    photoUrl: user?.photoUrl || "",
    emailId: user?.emailId || "",
    age: user?.age || "",
    gender: user?.gender || "",
    about: user?.about || "",
    skills: user?.skills || [],
  };

  // Profile state management
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("devProfile");
    return savedProfile ? JSON.parse(savedProfile) : initialProfile;
  });

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [isDirty, setIsDirty] = useState(false);

  // Save draft to localStorage
  useEffect(() => {
    localStorage.setItem("devProfileDraft", JSON.stringify(editedProfile));

    // Check if there are changes
    if (JSON.stringify(profile) !== JSON.stringify(editedProfile)) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [editedProfile, profile]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("devProfileDraft");
    if (savedDraft) {
      setEditedProfile(JSON.parse(savedDraft));
      setIsDirty(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const updatedProfile = {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || "",
        photoUrl: user.photoUrl || "",
        emailId: user.emailId || "",
        age: Number(user.age) || "",
        gender: user.gender || "",
        about: user.about || "",
        skills: user.skills || [],
      };

      setProfile(updatedProfile);
      setEditedProfile(updatedProfile); // Ensure editedProfile updates
    }
  }, [user]);

  // Save final changes
  const handleSave = async () => {
    try {
      const response = await axios.patch(
        API + "/profile/edit",

        { editedProfile },

        {
          withCredentials: true,
        }
      );
    } catch (err) {
      // TODO:Handle error
      console.log(err);
    }
    setProfile(editedProfile);

    localStorage.setItem("devProfile", JSON.stringify(editedProfile));
    localStorage.removeItem("devProfileDraft");
    setIsEditing(false);
    setIsDirty(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditedProfile(profile);
    localStorage.removeItem("devProfileDraft");
    setIsEditing(false);
    setIsDirty(false);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-mono">
          Developer Profile
        </h1>
        <p className="text-gray-400 font-mono">
          Manage your professional information
        </p>
        {isDirty && !isEditing && (
          <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-md">
            <p className="text-yellow-400 font-mono text-sm">
              You have unsaved changes. Click "Edit Profile" to continue
              editing.
            </p>
          </div>
        )}
      </div>

      {user && (
        <>
          <ProfileHeader
            profile={profile}
            editedProfile={editedProfile}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setEditedProfile={setEditedProfile}
            handleSave={handleSave}
            handleCancel={handleCancel}
            user={user}
          />

          <ProfileDetails
            profile={profile}
            editedProfile={editedProfile}
            isEditing={isEditing}
            setEditedProfile={setEditedProfile}
          />
        </>
      )}
    </div>
  );
};

export default ProfileEdit;
