import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { auth, provider, firebaseInitialized } from "../firebase/firebase";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import toast from "react-hot-toast";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { setUser, redirectPath, setRedirectPath } =
    useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setPassword("");

    const inputs = document.querySelectorAll(
      'input[type="email"], input[type="password"]'
    );

    inputs.forEach((input) => {
      input.value = "";
    });
  }, []);

  const handleRedirect = (user) => {
    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate(redirectPath || "/");
    }
    setRedirectPath("/");
  };

  const handleSignin = async (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const response = await api.post("/auth/signin", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setUser(user);

      toast.success("Signed in successfully.");
      handleRedirect(user);
    } catch (error) {
      console.error("Signin error:", error);

      toast.error(
        error?.response?.data?.message ||
        "Unable to sign in. Please check your credentials."
      );
    }
  };

  const handleGoogleLogin = async () => {
    if (!firebaseInitialized) {
      toast.error(
        "Google login is unavailable. Please check Firebase settings."
      );
      return;
    }

    try {
      const result = await signInWithPopup(auth, provider);

      const firebaseUser = result.user;

      const userData = {
        name:
          firebaseUser.displayName ||
          firebaseUser.email.split("@")[0],
        email: firebaseUser.email,
      };

      const response = await api.post("/auth/google-login", userData);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setUser(user);

      toast.success("Login successful");
      handleRedirect(user);
    } catch (error) {
      console.error("Google login error:", error);

      const msg =
        error?.message ||
        error?.code ||
        "Google sign-in failed";

      toast.error(msg);

      const popupBlocked =
        /popup|blocked|window\.closed|cross-origin-opener-policy/i.test(
          error?.message || ""
        );

      if (popupBlocked) {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError) {
          console.error("Redirect login fallback failed:", redirectError);

          toast.error("Redirect login failed. Please try again.");
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full shadow-2xl rounded-4xl overflow-hidden bg-slate-100 border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-amber-600 text-center">
          Login
        </h1>

        <p className="text-slate-600 text-center">
          Welcome back! Continue your reading journey.
        </p>

        <form onSubmit={handleSignin} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: "" });
            }}
            autoComplete="username"
            className="w-full border border-gray-200 rounded-lg px-4 py-3"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {  
              setPassword(e.target.value);
 setErrors({ ...errors, password: "" });
            }}
            autoComplete="current-password"
            className="w-full border border-gray-200 rounded-lg px-4 py-3"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-amber-500 text-slate-900 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            Login
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-300" />
          </div>

          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-100 px-3 text-slate-500">
              or
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-slate-300 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-slate-100"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5"
          />

          Continue with Google
        </button>

        {!firebaseInitialized && (
          <p className="mt-4 text-sm text-red-600">
            Google login is unavailable until Firebase is configured.
          </p>
        )}

        <p className="mt-6 text-sm text-slate-600 text-center">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-amber-600 font-semibold hover:underline"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}