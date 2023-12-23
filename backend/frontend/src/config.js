// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCfW49RKOqFIwyDxgglMRUqTELoQeydbAA",
  authDomain: "hiragfashion-d1d40.firebaseapp.com",
  projectId: "hiragfashion-d1d40",
  storageBucket: "hiragfashion-d1d40.appspot.com",
  messagingSenderId: "1097743302238",
  appId: "1:1097743302238:web:a78649d7025b868d8afecf",
  measurementId: "G-PWX104WJW8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const imageDb = getStorage(app);
export default imageDb;