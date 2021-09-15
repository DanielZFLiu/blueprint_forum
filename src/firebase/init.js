//firebase act as a backend server to this website
import firebase from 'firebase'
//firestore real time database
import firestore from 'firebase/firestore'


//Firebase configuration
var firebaseConfig = {
    apiKey: ...,
    authDomain: "blueprint-club-forum.firebaseapp.com",
    databaseURL: "https://blueprint-club-forum.firebaseio.com",
    projectId: "blueprint-club-forum",
    storageBucket: "blueprint-club-forum.appspot.com",
    messagingSenderId: ...,
    appId: ...,
    measurementId: ...
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebaseApp.firestore().settings({timestampsInSnapshots: true})

//export firebase
export default firebase
//export default firebaseApp.firestore()
