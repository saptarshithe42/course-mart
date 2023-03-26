import firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyDpio08TZAuPkTGaFVC7Fmaap4_VzyZjKM",
  authDomain: "course-mart-cd1d3.firebaseapp.com",
  projectId: "course-mart-cd1d3",
  storageBucket: "course-mart-cd1d3.appspot.com",
  messagingSenderId: "447567930124",
  appId: "1:447567930124:web:f47da9452a1a7b10c15f29"
};



// initialize firebase
firebase.initializeApp(firebaseConfig)

// initialize services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

// timestamp
const timestamp = firebase.firestore.Timestamp

export { projectFirestore, projectAuth, timestamp, projectStorage }
