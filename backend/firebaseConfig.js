import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from '@firebase/auth';
import { getStorage, ref } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkDJwc6IC8KNV9BzPqzg2xm1Y9pCXAM9A",
  authDomain: "spiceup-42f5d.firebaseapp.com",
  projectId: "spiceup-42f5d",
  storageBucket: "spiceup-42f5d.appspot.com",
  messagingSenderId: "248773968744",
  appId: "1:248773968744:web:74941feada08cf49010cdd",
  measurementId: "G-R77VJZVYS4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const auth = getAuth(app); 

export { db, app, auth, storage };
