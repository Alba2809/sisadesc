import { createContext, useContext, useEffect, useState } from "react";
import {
  loginRequest,
  verifyTokenRequest,
  getUserRequest,
} from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1); /* exp: 1day */

      Cookies.set("token", res.data.token, {
        expires: expirationDate,
        secure: true,
        sameSite: "None",
        httpOnly: true
      });

      setIsAuthenticated(true);
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  const getUser = async () => {
    try {
      const res = await getUserRequest();
      setUser(res.data)
      return res.data;
    } catch (error) {}
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        Cookies.remove("token");
        return setUser(null);
      }

      try {
        const res = await verifyTokenRequest(cookies.token);
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signin,
        logout,
        getUser,
        loading,
        user,
        isAuthenticated,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
