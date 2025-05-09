import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "./cartcontext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { setCart, setSubtotal, setDiscount, setTotal } = useCart();

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setCart([]);
    setSubtotal(0);
    setDiscount(0);
    setTotal(0);
    localStorage.removeItem("cart");
    localStorage.removeItem("subtotal");
    localStorage.removeItem("discount");
    localStorage.removeItem("total");

    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout(true); // Force immediate logout on 401 errors
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);

  useEffect(() => {
    const storedTokenData = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedTokenData) {
      try {
        const { token, timestamp, expirationTime } =
          JSON.parse(storedTokenData);
        const currentTime = new Date().getTime();

        if (currentTime - timestamp < expirationTime) {
          setToken(token);
          setIsLoggedIn(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Failed to parse authToken:", error);
        localStorage.removeItem("authToken");
      }
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAdmin(parsedUser.isAdmin);
      } catch (error) {
        console.error("Failed to parse user:", error);
        localStorage.removeItem("user");
      }
    }
  }, [logout]);

  const loginUser = async (formData, rememberMe) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      const currentTime = new Date().getTime();
      const expirationTime = rememberMe ? 3 * 60 * 60 * 1000 : 60 * 60 * 1000; // 3 hours or 1 hour

      const tokenData = {
        token: res.data.token,
        timestamp: currentTime,
        expirationTime,
      };

      setUser(res.data.user);
      setToken(res.data.token);
      setIsLoggedIn(true);
      setIsAdmin(res.data.user.isAdmin);

      localStorage.setItem("authToken", JSON.stringify(tokenData));
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

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
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
