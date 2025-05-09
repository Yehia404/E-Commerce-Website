import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Input, message, Dropdown, Button, Space, Modal } from "antd";
import {
  EditOutlined,
  UserOutlined,
  UploadOutlined,
  DeleteOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useUser } from "../context/usercontext";
import axios from "axios";

const Profile = () => {
  const { user, token, setUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
      setProfile((prev) => ({
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
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
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
    setProfile((prev) => ({
      ...prev,
      image: file,
      preview: previewUrl,
    }));
    setHasChanges(true);
  };

  const handleRemoveImage = () => {
    setProfile((prev) => ({
      ...prev,
      image: null,
      preview: null,
    }));
    setHasChanges(true);

    // If there was a preview URL, revoke it
    if (profile.preview) {
      URL.revokeObjectURL(profile.preview);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();

      // Add profile fields
      formData.append("firstname", profile.firstname);
      formData.append("lastname", profile.lastname);
      formData.append("phone", profile.number);

      // Handle image
      if (profile.image instanceof File) {
        // If we have a new image file, upload it
        formData.append("image", profile.image);
      } else if (profile.image === null) {
        // If image is null, explicitly set removeImage flag
        formData.append("removeImage", "true");
      }

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
      message.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const imageDropdownItems = {
    items: [
      {
        key: "1",
        label: "Change Image",
        icon: <UploadOutlined />,
        onClick: () => setModalVisible(true),
      },
      {
        key: "2",
        label: "Remove Image",
        icon: <DeleteOutlined />,
        onClick: handleRemoveImage,
        danger: true,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gray-100 p-4 md:p-10">
        <div className="flex flex-col md:flex-row">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-4 w-full md:w-1/3 mb-6 md:mb-0">
            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {profile.preview || profile.image ? (
                <img
                  src={profile.preview || profile.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserOutlined className="text-4xl md:text-6xl text-gray-400" />
              )}
            </div>

            <Dropdown menu={imageDropdownItems} disabled={isSaving}>
              <Button className="rounded-full">
                <Space>
                  Profile Image
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            {/* Image Upload Modal */}
            <Modal
              title="Upload Profile Image"
              open={modalVisible}
              onCancel={() => setModalVisible(false)}
              footer={null}
            >
              <div className="p-4 flex flex-col items-center">
                <label className="w-full flex justify-center mb-4">
                  <div className="bg-black text-white px-4 py-2 rounded-full cursor-pointer hover:bg-gray-800 transition duration-200 text-center">
                    Select Image File
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleImageChange(e);
                      setModalVisible(false);
                    }}
                    className="hidden"
                    disabled={isSaving}
                  />
                </label>
                <p className="text-gray-500 text-sm text-center">
                  Maximum file size: 5MB.
                  <br />
                  Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </Modal>
          </div>

          {/* Profile Information Section */}
          <div className="flex flex-col gap-6 w-full md:w-2/3 md:pl-10">
            {/* First Name Field */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <label className="w-32 font-medium text-gray-700">
                First Name:
              </label>
              <div className="flex-1 flex items-center gap-2">
                {editing.firstname ? (
                  <Input
                    value={profile.firstname}
                    onChange={(e) => handleChange("firstname", e.target.value)}
                    className="flex-1 rounded-lg border-gray-300"
                    disabled={isSaving}
                  />
                ) : (
                  <span className="text-lg text-gray-800">
                    {profile.firstname}
                  </span>
                )}
                <EditOutlined
                  onClick={() => !isSaving && handleEditToggle("firstname")}
                  className={`text-gray-500 cursor-pointer ${
                    !isSaving && "hover:text-black"
                  }`}
                />
              </div>
            </div>

            {/* Last Name Field */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <label className="w-32 font-medium text-gray-700">
                Last Name:
              </label>
              <div className="flex-1 flex items-center gap-2">
                {editing.lastname ? (
                  <Input
                    value={profile.lastname}
                    onChange={(e) => handleChange("lastname", e.target.value)}
                    className="flex-1 rounded-lg border-gray-300"
                    disabled={isSaving}
                  />
                ) : (
                  <span className="text-lg text-gray-800">
                    {profile.lastname}
                  </span>
                )}
                <EditOutlined
                  onClick={() => !isSaving && handleEditToggle("lastname")}
                  className={`text-gray-500 cursor-pointer ${
                    !isSaving && "hover:text-black"
                  }`}
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <label className="w-32 font-medium text-gray-700">Phone:</label>
              <div className="flex-1 flex items-center gap-2">
                {editing.number ? (
                  <Input
                    value={profile.number}
                    onChange={(e) => handleChange("number", e.target.value)}
                    className="flex-1 rounded-lg border-gray-300"
                    disabled={isSaving}
                  />
                ) : (
                  <span className="text-md text-gray-800">
                    {profile.number}
                  </span>
                )}
                <EditOutlined
                  onClick={() => !isSaving && handleEditToggle("number")}
                  className={`text-gray-500 cursor-pointer ${
                    !isSaving && "hover:text-black"
                  }`}
                />
              </div>
            </div>

            {/* Email Field (non-editable) */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <label className="w-32 font-medium text-gray-700">Email:</label>
              <span className="text-md text-gray-800">{profile.email}</span>
            </div>

            {/* Save Button */}
            {hasChanges && (
              <div className="flex justify-center md:justify-end mt-4">
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
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
