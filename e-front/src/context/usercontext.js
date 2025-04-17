// src/context/UserContext.js
import { createContext, useState, useContext } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Handles login API call
  const loginUser = async (formData) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem("authToken", res.data.token);
      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong.";
      return { success: false, message };
    }
  };

  // Handles register API call
  const registerUser = async (formData) => {
    try {
      await axios.post("http://localhost:5000/api/users/register", {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        password: formData.password,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong.";
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <UserContext.Provider
      value={{ user, token, logout, loginUser, registerUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
