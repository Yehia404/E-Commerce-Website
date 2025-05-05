import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Input, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useUser } from "../context/usercontext";
import axios from "axios";

const Profile = () => {
  const { user, token, setUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    number: "",
    email: "",
    image: null,
    preview: null,
  });

  const [editing, setEditing] = useState({
    firstname: false,
    lastname: false,
    number: false,
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Initialize profile data and cleanup previews
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        number: user.phone || "",
        email: user.email || "",
        image: user.image || null,
        preview: null, // Clear preview when user data updates
      }));
    }
  }, [user]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (profile.preview) {
        URL.revokeObjectURL(profile.preview);
      }
    };
  }, [profile.preview]);

  const handleEditToggle = (field) => {
    setEditing(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      message.error("File size must be less than 5MB!");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setProfile(prev => ({
      ...prev,
      image: file,
      preview: previewUrl
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      
      // Only append image if it's a File object
      if (profile.image instanceof File) {
        formData.append('image', profile.image);
      }
      
      formData.append('firstname', profile.firstname);
      formData.append('lastname', profile.lastname);
      formData.append('phone', profile.number);

      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Profile updated successfully");
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setHasChanges(false);
      setEditing({ firstname: false, lastname: false, number: false });
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1 bg-gray-100 p-10">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-4 w-1/3">
            <img
              src={
                profile.preview || 
                profile.image ||
                "https://via.placeholder.com/200x200.png?text=Profile"
              }
              alt="Profile preview"
              className="w-48 h-48 rounded-full object-cover"
            />
            <label className="w-full flex justify-center">
              <div className="bg-black text-white px-4 py-2 rounded-full cursor-pointer hover:bg-gray-800 transition duration-200 text-center">
                {isSaving ? "Uploading..." : "Change Image"}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isSaving}
              />
            </label>
          </div>

          {/* Profile Information Section */}
          <div className="flex flex-col gap-6 w-2/3 pl-10">
            {/* First Name Field */}
            <div className="flex items-center gap-4">
              <label className="w-32 font-medium text-gray-700">First Name:</label>
              {editing.firstname ? (
                <Input
                  value={profile.firstname}
                  onChange={(e) => handleChange("firstname", e.target.value)}
                  className="flex-1 rounded-lg border-gray-300"
                  disabled={isSaving}
                />
              ) : (
                <span className="text-lg text-gray-800">{profile.firstname}</span>
              )}
              <EditOutlined
                onClick={() => !isSaving && handleEditToggle("firstname")}
                className={`text-gray-500 cursor-pointer ${!isSaving && "hover:text-black"}`}
              />
            </div>

            {/* Last Name Field */}
            <div className="flex items-center gap-4">
              <label className="w-32 font-medium text-gray-700">Last Name:</label>
              {editing.lastname ? (
                <Input
                  value={profile.lastname}
                  onChange={(e) => handleChange("lastname", e.target.value)}
                  className="flex-1 rounded-lg border-gray-300"
                  disabled={isSaving}
                />
              ) : (
                <span className="text-lg text-gray-800">{profile.lastname}</span>
              )}
              <EditOutlined
                onClick={() => !isSaving && handleEditToggle("lastname")}
                className={`text-gray-500 cursor-pointer ${!isSaving && "hover:text-black"}`}
              />
            </div>

            {/* Phone Number Field */}
            <div className="flex items-center gap-4">
              <label className="w-32 font-medium text-gray-700">Phone:</label>
              {editing.number ? (
                <Input
                  value={profile.number}
                  onChange={(e) => handleChange("number", e.target.value)}
                  className="flex-1 rounded-lg border-gray-300"
                  disabled={isSaving}
                />
              ) : (
                <span className="text-md text-gray-800">{profile.number}</span>
              )}
              <EditOutlined
                onClick={() => !isSaving && handleEditToggle("number")}
                className={`text-gray-500 cursor-pointer ${!isSaving && "hover:text-black"}`}
              />
            </div>

            {/* Email Field (non-editable) */}
            <div className="flex items-center gap-4">
              <label className="w-32 font-medium text-gray-700">Email:</label>
              <span className="text-md text-gray-800">{profile.email}</span>
            </div>

            {/* Save Button */}
            {hasChanges && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Profile;