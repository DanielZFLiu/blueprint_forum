//firebase act as a backend server to this website
import firebase from 'firebase'
//firestore real time database
import firestore from 'firebase/firestore'


//Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDoT-agzxm84y-5xfUtLapXmNcHdzJt7cU",
    authDomain: "blueprint-club-forum.firebaseapp.com",
    databaseURL: "https://blueprint-club-forum.firebaseio.com",
    projectId: "blueprint-club-forum",
    storageBucket: "blueprint-club-forum.appspot.com",
    messagingSenderId: "648208137715",
    appId: "1:648208137715:web:32855bec64fb8373346686",
    measurementId: "G-C817MJBTER"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebaseApp.firestore().settings({timestampsInSnapshots: true})

//export firebase
export default firebase
//export default firebaseApp.firestore()