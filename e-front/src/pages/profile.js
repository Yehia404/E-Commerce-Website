import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Input } from "antd";
import { EditOutlined } from "@ant-design/icons";

const Profile = () => {
  const initialProfile = {
    name: "John Doe",
    number: "1234567890",
    email: "john@example.com",
    address: "123 Main Street, City",
    image: null,
  };

  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState({
    name: false,
    number: false,
    address: false,
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleEditToggle = (field) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    console.log("Saving profile...", profile);
    setHasChanges(false);
    setEditing({ name: false, number: false, address: false });
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
            {/* Name */}
            <div className="flex items-center gap-2">
              {editing.name ? (
                <Input
                  value={profile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full"
                />
              ) : (
                <span className="text-2xl font-semibold">{profile.name}</span>
              )}
              <EditOutlined
                onClick={() => handleEditToggle("name")}
                className="text-gray-500 cursor-pointer"
              />
            </div>

            {/* Number */}
            <div className="flex items-center gap-2">
              {editing.number ? (
                <Input
                  value={profile.number}
                  onChange={(e) => handleChange("number", e.target.value)}
                  className="w-full"
                />
              ) : (
                <span className="text-md">{profile.number}</span>
              )}
              <EditOutlined
                onClick={() => handleEditToggle("number")}
                className="text-gray-500 cursor-pointer"
              />
            </div>

            {/* Email */}
            <div className="flex items-center gap-2">
              <span className="text-md">{profile.email}</span>
            </div>

            {/* Address */}
            <div className="flex items-center gap-2">
              {editing.address ? (
                <Input
                  value={profile.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full"
                />
              ) : (
                <span className="text-md">{profile.address}</span>
              )}
              <EditOutlined
                onClick={() => handleEditToggle("address")}
                className="text-gray-500 cursor-pointer"
              />
            </div>

            {/* Save Button (aligned right) */}
            {hasChanges && (
              <div className="flex justify-end">
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
