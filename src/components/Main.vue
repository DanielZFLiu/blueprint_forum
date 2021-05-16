<template>
  <!--shows blueprint logo when clicked-->
  <div id="main">
    <h1 class="mainTitle">Blueprint Club</h1>
    <!--title-->
    <p class="slogan">Innovate. Collaborate. Automate.</p>
    <!--subtitle-->
  </div>
  <!--container tag-->
</template>

<script>
//import firebase
import firebase from "firebase";
import Firebase from "@/firebase/init";

var firebaseDatabase = Firebase.firestore();

export default {
  name: "Main",
  data() {
    return {};
  },
  methods: {},
  created() {
    //in case the user tries to sign in using email link
    //First confirm the link is a sign in with email link.
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      // If user tries to authenticate email, Get the email if available.
      var email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        //if user tries authenticate email from another device
        email = prompt("Confirm your email: ");
      }

      var userId = "";
      var userPosts = [];
      firebaseDatabase
        .collection("users")
        .get()
        .then(snapshot => {
          snapshot.forEach(USER => {
            let User = USER.data();
            if (email == User.email) {
              //get user data from firebase
              userId = USER.id;
              userPosts = User.userPosts; //technically the user might post before verifying the email,
              //so userPosts = User.userPosts is neccessary
            }
          });
        })
        .then(() => {
          //set the current user as the identity that was retrieved from firebase
          firebaseDatabase
            .collection("users")
            .doc(userId)
            .set({
              accountExistence: true,
              email: email,
              emailVerification: true, //set email verification to true
              userPosts: userPosts
            })
            .catch(err => {
              //catch any error
              console.log(err.message);
            })
            .then(() => {
              window.localStorage.removeItem("emailForSignIn"); //clear the local item
              window.open(
                "https://blueprint-club-forum.firebaseapp.com/#/", //https://blueprint-club-forum.firebaseapp.com/#/
                "_self"
              );
            });
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#main {
  background-color: black;
  height: 100%;
  width: 100%;
  /*fixed as to viewer's eyes*/
  position: fixed;
  top: 0%;
  left: 0%;
  /*z-index is priority level of display when overlap of elements occur*/
  z-index: 1;
}

.mainTitle {
  color: #34dddd;
  margin-top: 20%;
  margin-bottom: auto;
  text-align: center;
  font-size: 700%;
  font-family: "Helvetica", Roboto, "Open Sans";
  font-weight: bold;
}

.slogan {
  text-align: center;
}
</style>
