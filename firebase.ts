import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMB_7gGikA3bL_Q1Nzh1fmbjC3FDQmj5w",
  authDomain: "farmagestao.firebaseapp.com",
  projectId: "farmagestao",
  storageBucket: "farmagestao.firebasestorage.app",
  messagingSenderId: "51610447356",
  appId: "1:51610447356:web:113a95274193434d73d679",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
