import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load user and token from localStorage on first load
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.isAdmin);
    }
  }, []);

  const loginUser = async (formData) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      setUser(res.data.user);
      setToken(res.data.token);
      setIsLoggedIn(true);
      setIsAdmin(res.data.user.isAdmin);

      // Save to localStorage
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong.";
      return { success: false, message };
    }
  };

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
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        isAdmin,
        loginUser,
        registerUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
