import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { setUser, redirectPath, setRedirectPath } =
    useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    const inputs = document.querySelectorAll(
      'input[type="text"], input[type="email"], input[type="password"]'
    );

    inputs.forEach((input) => {
      input.value = "";
    });
  }, []);

  const handleSignup = async (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword =
        "Confirm password is required";
    }

    if (
      password &&
      confirmPassword &&
      password !== confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const response = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      setUser(response.data);

      toast.success("Account created successfully.");

      if (response.data?.role === "admin") {
        navigate("/seller");
      } else {
        navigate(redirectPath || "/");
      }

      setRedirectPath("/");
    } catch (error) {
      console.error("Signup error:", error);

      toast.error(
        error?.response?.data?.message ||
        "Unable to create account. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-6">
      <div className="max-w-md w-full shadow-2xl rounded-4xl overflow-hidden bg-slate-100 border border-slate-200 p-8">
        <h1 className="text-3xl text-center font-bold text-amber-600">
          Create an account
        </h1>

        <form
          onSubmit={handleSignup}
          className="mt-6 space-y-4"
        >
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({
                  ...errors,
                  name: "",
                });
              }}
              autoComplete="name"
              className={`w-full rounded-lg px-4 py-3 border ${errors.name
                  ? "border-red-500"
                  : "border-gray-200"
                }`}
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({
                  ...errors,
                  email: "",
                });
              }}
              autoComplete="username"
              className={`w-full rounded-lg px-4 py-3 border ${errors.email
                  ? "border-red-500"
                  : "border-gray-200"
                }`}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({
                  ...errors,
                  password: "",
                });
              }}
              autoComplete="new-password"
              className={`w-full rounded-lg px-4 py-3 border ${errors.password
                  ? "border-red-500"
                  : "border-gray-200"
                }`}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors({
                  ...errors,
                  confirmPassword: "",
                });
              }}
              autoComplete="new-password"
              className={`w-full rounded-lg px-4 py-3 border ${errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-200"
                }`}
            />

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 text-slate-900 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600 text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="text-amber-600 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}