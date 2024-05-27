import {initializeApp} from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBdGZM5967ir6qpDO3ML0Mh4JnBWnJhVMw",
    authDomain: "ofspades-252ab.firebaseapp.com",
    databaseURL: "https://ofspades-252ab-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ofspades-252ab",
    storageBucket: "ofspades-252ab.appspot.com",
    messagingSenderId: "954967829491",
    appId: "1:954967829491:web:3b2b05411507fee7a10086"
  };


const firebaseApp =  initializeApp(firebaseConfig)

export const appDatabase = getDatabase(firebaseApp);

export default firebaseApp

