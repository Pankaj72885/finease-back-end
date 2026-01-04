import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

let serviceAccount;

// Try loading from Environment Variables first
if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
) {
  serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };
} else {
  // Fallback to local file
  try {
    // Adjust path based on your directory structure.
    // If this file is in src/config, root is two levels up.
    serviceAccount = require("../../finease-48cd9-firebase-adminsdk.json");
  } catch (error) {
    console.warn(
      "Warning: Firebase credentials not found in Env Vars or local file."
    );
  }
}

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    console.error(
      "ERROR: Firebase Admin could not be initialized. Missing credentials."
    );
  }
}

export default admin;
