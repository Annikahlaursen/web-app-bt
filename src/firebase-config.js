// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // for authentication

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Mock user profiles for testing (replace with real Firebase data later)
export const mockUsers = [
  {
    id: 1,
    email: "heidi@btp.dk",
    password: "password123",
    profile: {
      firstName: "Heidi",
      lastName: "Astrup",
      gender: "Kvinde",
      birthday: "1985-05-15",
      email: "heidi@btp.dk",
      phone: "+45 12 34 56 78",
      rating: 1450,
    },
  },
  {
    id: 2,
    email: "lars@btp.dk",
    password: "password456",
    profile: {
      firstName: "Lars",
      lastName: "Nielsen",
      gender: "Mand",
      birthday: "1990-08-22",
      email: "lars@btp.dk",
      phone: "+45 87 65 43 21",
      rating: 1650,
    },
  },
  {
    id: 3,
    email: "anna@btp.dk",
    password: "password789",
    profile: {
      firstName: "Anna",
      lastName: "Hansen",
      gender: "Kvinde",
      birthday: "1988-12-03",
      email: "anna@btp.dk",
      phone: "+45 23 45 67 89",
      rating: 1520,
    },
  },
];

// Helper function to create test accounts in Firebase (call this once to set up test users)
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export const createTestAccounts = async () => {
  console.log("Creating test accounts in Firebase...");

  for (const mockUser of mockUsers) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        mockUser.email,
        mockUser.password
      );

      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: `${mockUser.profile.firstName} ${mockUser.profile.lastName}`,
      });

      console.log(`✅ Created account for ${mockUser.email}`);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        console.log(`ℹ️  Account ${mockUser.email} already exists`);
      } else {
        console.error(`❌ Failed to create ${mockUser.email}:`, error.message);
      }
    }
  }

  console.log("Finished creating test accounts");
};
