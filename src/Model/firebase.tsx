// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDGpqn5vvwJchdcb902ZoWTCsR5PGGWT5I',
  authDomain: 'tpadesktopmz221.firebaseapp.com',
  projectId: 'tpadesktopmz221',
  storageBucket: 'tpadesktopmz221.appspot.com',
  messagingSenderId: '789527219779',
  appId: '1:789527219779:web:e41bf340cc1815e0fc4ef6',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export {firebaseApp, firebaseConfig};
