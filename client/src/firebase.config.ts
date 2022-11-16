import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = 
{
  apiKey: "AIzaSyD9B7EYrRf2pFWNz_rbgq-k6jouqkX7vwQ",
  authDomain: "real-estate-site-32040.firebaseapp.com",
  projectId: "real-estate-site-32040",
  storageBucket: "real-estate-site-32040.appspot.com",
  messagingSenderId: "268247514989",
  appId: "1:268247514989:web:01c3e0ad92f128a93a2464",
  measurementId: "G-9JC5TY30VR"
};

initializeApp(firebaseConfig);
export const dataBase = getFirestore();
