import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyAGmuIJxmkzIBr9c9_7v059vxLd-UHYHp8",
    authDomain: "todo-2fde5.firebaseapp.com",
    databaseURL: "https://todo-2fde5-default-rtdb.firebaseio.com",
    projectId: "todo-2fde5",
    storageBucket: "todo-2fde5.appspot.com",
    messagingSenderId: "250715521533",
    appId: "1:250715521533:web:adc2e4a6c1979c4ef75994",
    measurementId: "G-3VKRLYT9M1"
  };

  const app = initializeApp(firebaseConfig);

// Get a Firestore instance
const db = getFirestore(app);

export { db }; 

