import firebase from 'firebase';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDE2REj3gjhpbJu5KEfOJboOVxXBcpOSAc",
  authDomain: "on-air-classroom.firebaseapp.com",
  projectId: "on-air-classroom",
  storageBucket: "on-air-classroom.appspot.com",
  messagingSenderId: "618988809262",
  appId: "1:618988809262:web:6f50bacd7a62847d6883bf",
  measurementId: "G-NNTLX92MFD",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const firestoreDB = firebase.firestore();

export {firebase, firestoreDB} ;
