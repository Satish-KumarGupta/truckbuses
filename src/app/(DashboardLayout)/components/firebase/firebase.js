import * as firebase from 'firebase/app';
import { getStorage } from 'firebase/storage';
import 'firebase/storage';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCfpw2KE7-86AD3UJE6Uz_uk5_dD9sDmbw",
    authDomain: "curious-mender-320213.firebaseapp.com",
    projectId: "curious-mender-320213",
    storageBucket: "curious-mender-320213.appspot.com",
    messagingSenderId: "256067225397",
    appId: "1:256067225397:web:80b9c1f620ef4fc0a0ee7c"
  };

// Initialize Firebase

//  firebase.initializeApp(firebaseConfig);
 const app=initializeApp(firebaseConfig)
// Export Firebase storage instance

// for auth store create
const auth = getAuth(app)

// const firestore = firebase.firestore();

// for image store
// const storage = getStorage(firebase.app);
const storage = getStorage(app);
const database = getDatabase(app);

export {storage,auth,database};