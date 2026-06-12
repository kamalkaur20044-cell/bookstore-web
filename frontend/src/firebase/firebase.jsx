import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Basic runtime sanity check to help debug configuration issues
{
  const required = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];

  const missing = required.filter((k) => !firebaseConfig[k]);
  // Log non-secret fields and warn if any are missing
  console.debug("Firebase config loaded:", {
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    appId: firebaseConfig.appId,
  });

  if (missing.length > 0) {
    console.error(
      "Firebase configuration missing keys:",
      missing,
      "— check frontend/.env and restart Vite"
    );
  }
}

let app;
let firebaseAuth;
let firebaseProvider;
let firebaseConfigError = null;

try {
  app = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(app);
  firebaseProvider = new GoogleAuthProvider();
} catch (configError) {
  firebaseConfigError = configError?.message || "Firebase configuration failed";
  console.error("Firebase initialization error:", firebaseConfigError);
}

export const auth = firebaseAuth;
export const provider = firebaseProvider;
export const firebaseInitialized = !!firebaseAuth && !!firebaseProvider;
export const firebaseConfigurationError = firebaseConfigError;