// config/firebaseConfig.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAnnDCzBzJNVklEYUVNK7nhg8r7PZcktfo",
  authDomain: "gi-smarts-ghana.firebaseapp.com",
  projectId: "gi-smarts-ghana",
  storageBucket: "gi-smarts-ghana.firebasestorage.app",
  messagingSenderId: "255897033821",
  appId: "1:255897033821:web:fbd21646482b40e5e941b4"
};

const app = initializeApp(firebaseConfig);
export default firebaseConfig;