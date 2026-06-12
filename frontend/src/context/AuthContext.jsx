import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { getRedirectResult } from "firebase/auth";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Discard stale sessions with no _id
      return parsed?._id ? parsed : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");

  const isGuest = !user;

  // On app load: validate stored user + token against backend
  useEffect(() => {
    const validateStoredUser = async () => {
      const token = localStorage.getItem("token");

      if (!user?._id || !token) {
        // No valid session — clear both
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      try {
        await api.get(`/users/me/${user._id}`);
        // valid session, keep it
      } catch (err) {
        // stale or invalid — clear everything
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    validateStoredUser();
  }, []);

  // Handle Firebase redirect result (fallback flow)
  useEffect(() => {
    const checkRedirect = async () => {
      if (!auth) return;

      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const { data } = await api.post("/auth/google-login", {
            name: result.user.displayName,
            email: result.user.email,
          });

          const { token, user: dbUser } = data;
          localStorage.setItem("token", token);

          setUser({
            _id: dbUser._id,
            name: dbUser.name,
            email: dbUser.email,
            photo: result.user.photoURL,
            role: dbUser.role,
          });
        }
      } catch (err) {
        console.error("Firebase redirect sign-in error:", err);
      }
    };

    checkRedirect();
  }, []);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    try {
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (e) {
      /* ignore */
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        showLogin,
        setShowLogin,
        redirectPath,
        setRedirectPath,
        isGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
