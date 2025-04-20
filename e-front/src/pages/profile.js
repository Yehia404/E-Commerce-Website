import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Input, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useUser } from "../context/usercontext";
import axios from "axios";

const Profile = () => {
  const { user, token, setUser } = useUser();

  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    number: "",
    email: "",
    image: null,
  });

  const [editing, setEditing] = useState({
    firstname: false,
    lastname: false,
    number: false,
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        number: user.phone || "",
        email: user.email || "",
        image: user.image || null,
      }));
    }
  }, [user]);

  const handleEditToggle = (field) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const previewUrl = URL.createObjectURL(file);
    if (file) {
      setProfile((prev) => ({
        ...prev,
        image: file,
        preview: previewUrl
      }));
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    try {
      console.log("Saving profile:", profile);
      const formData = new FormData();
      formData.append('image', profile.image); 
      formData.append('firstname', profile.firstname);
      formData.append('lastname',  profile.lastname);
      formData.append('phone',     profile.number);
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
      message.error("Failed to update profile");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1 bg-gray-100 p-10">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4 w-1/3">
            <img
              src={
                profile.preview ||
                profile.image ||
                "https://via.placeholder.com/200x200.png?text=Profile"
              }
              alt="Profile"
              className="w-48 h-48 rounded-full object-cover"
            />
            <label className="w-full flex justify-center">
              <div className="bg-black text-white px-4 py-2 rounded-full cursor-pointer hover:bg-gray-800 transition duration-200 text-center">
                Change Image
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Info Fields */}
          <div className="flex flex-col gap-6 w-2/3 pl-10">
            {/* First Name */}
            <div className="flex items-center gap-4">
              <label className="w-32 font-medium text-gray-700">
                First Name:
              </label>
              {editing.firstname ? (
                <Input
                  value={profile.firstname}
                  onChange={(e) => handleChange("firstname", e.target.value)}
                  className="flex-1 rounded-lg border-gray-300"
                />
              ) : (
                <span className="text-lg text-gray-800">
                  {profile.firstname}
                </span>
              )}
              <EditOutlined
                onClick={() => handleEditToggle("firstname")}
                className="text-gray-500 cursor-pointer hover:text-black"
              />
            </div>

            {/* Last Name */}
            <div className="flex items-center gap-4">
              <label className="w-32 font-medium text-gray-700">
                Last Name:
              </label>
              {editing.lastname ? (
                <Input
                  value={profile.lastname}
                  onChange={(e) => handleChange("lastname", e.target.value)}
                  className="flex-1 rounded-lg border-gray-300"
                />
              ) : (
                <span className="text-lg text-gray-800">
                  {profile.lastname}
                </span>
              )}
              <EditOutlined
                onClick={() => handleEditToggle("lastname")}
                className="text-gray-500 cursor-pointer hover:text-black"
              />
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <label className="w-32 font-medium text-gray-700">Phone:</label>
              {editing.number ? (
                <Input
                  value={profile.number}
                  onChange={(e) => handleChange("number", e.target.value)}
                  className="flex-1 rounded-lg border-gray-300"
                />
              ) : (
                <span className="text-md text-gray-800">{profile.number}</span>
              )}
              <EditOutlined
                onClick={() => handleEditToggle("number")}
                className="text-gray-500 cursor-pointer hover:text-black"
              />
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <label className="w-32 font-medium text-gray-700">Email:</label>
              <span className="text-md text-gray-800">{profile.email}</span>
            </div>

            {/* Save Button */}
            {hasChanges && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSave}
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition duration-200"
                >
                  Save Changes
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
