import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { auth, provider, firebaseInitialized, firebaseConfigurationError } from "../../firebase/firebase";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function LoginModal() {
  const {
    showLogin,
    setShowLogin,
    setUser,
    redirectPath,
    setRedirectPath,
  } = useContext(AuthContext);

  const [loginError, setLoginError] = useState(null);
  const [configInvalid, setConfigInvalid] = useState(false);

  const navigate = useNavigate();

  if (!showLogin) return null;

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Sync with backend — get MongoDB _id, role and JWT
      const { data } = await api.post("/auth/google-login", {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
      });

      const { token, user: dbUser } = data;

      localStorage.setItem("token", token);

      setUser({
        _id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        photo: firebaseUser.photoURL,
        role: dbUser.role,
      });
      toast.success("Login successful 🎉");
      setShowLogin(false);
      navigate(redirectPath || "/");
      setRedirectPath("/");

    } catch (error) {
      const didPopupFail = !!error && (
        [
          "auth/popup-blocked",
          "auth/popup-closed-by-user",
          "auth/cancelled-popup-request",
        ].includes(error.code) ||
        /window\.closed|popup|cross-origin-opener-policy/i.test(error.message || "")
      );

      if (didPopupFail && firebaseInitialized) {
        toast.error("Popup login blocked — switching to redirect flow...");
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectError) {
          console.error("Redirect fallback failed:", redirectError);
          const msg = (redirectError && (redirectError.message || redirectError.code)) || "Redirect login failed ❌";
          toast.error(msg);
          setLoginError(msg);
          return;
        }
      }

      console.error(error);
      const msg = (error && (error.message || error.code)) || "Login failed ❌";
      toast.error(msg);
      setLoginError(msg);

      // Dev fallback if Firebase is misconfigured
      const isConfigError = error && (
        error.code === "auth/configuration-not-found" ||
        (error.message && error.message.includes("configuration-not-found"))
      );

      if (isConfigError) {
        setConfigInvalid(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 text-center shadow-lg">

        <h2 className="text-xl font-bold text-gray-800">Login Required</h2>
        <p className="text-gray-500 text-sm mt-2">Please sign in to continue</p>

        <button
          onClick={handleGoogleLogin}
          disabled={!firebaseInitialized || configInvalid}
          className={`mt-5 w-full py-2 rounded-lg ${
            firebaseInitialized && !configInvalid
              ? "bg-amber-500 text-slate-900 hover:bg-amber-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue with Google
        </button>

        {(!firebaseInitialized || configInvalid) && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 text-sm text-red-700 rounded">
            Firebase login is currently unavailable.
            <div className="mt-2">
              Check <code>frontend/.env</code> and your Firebase project settings.
            </div>
            {firebaseConfigurationError && (
              <div className="mt-2 text-xs text-red-600">{firebaseConfigurationError}</div>
            )}
          </div>
        )}

        {loginError && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 rounded">
            <strong>Login Error:</strong>
            <div>{loginError}</div>
            <div className="mt-2">
              Quick checks:
              <ul className="list-disc ml-5 text-left">
                <li>Ensure Firebase API keys in <code>frontend/.env</code> match your project.</li>
                <li>Enable Google sign-in in Firebase Console → Authentication → Sign-in method.</li>
                <li>Add your Vite origin (e.g. <code>localhost:5176</code>) to Authorized domains.</li>
              </ul>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowLogin(false)}
          className="mt-3 text-gray-500 text-sm"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}
