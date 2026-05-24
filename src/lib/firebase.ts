import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAr_hpzrSIWQ8P6dU9nSwEAmIuZ_UeaTMQ",
  authDomain: "astra-ai-3ece4.firebaseapp.com",
  projectId: "astra-ai-3ece4",
  storageBucket: "astra-ai-3ece4.firebasestorage.app",
  messagingSenderId: "181874478930",
  appId: "1:181874478930:web:7eb43d74c197766892348b",
  measurementId: "G-28H74XZPSG"
};

let app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
