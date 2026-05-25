import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDdN51b74CSIUJ3YilpiTqcZMZ1jOnPyn4",
  authDomain: "claritasverify.firebaseapp.com",
  projectId: "claritasverify",
  storageBucket: "claritasverify.firebasestorage.app",
  messagingSenderId: "1009630074759",
  appId: "1:1009630074759:web:7988824ac976231b15a522",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);