<template>
  <div class="signupLogin" v-if="!this.login">
    <div class="signupContainer">
      <h2 id="signuploginText" class="signupLoginText" @click="signUpLogin">Sign Up</h2>
      <div class="inputField">
        <label id="email" class="label" for="email">Email:</label>
        <!--input email-->
        <input class="input" type="email" name="email" v-model="email" @click="clearText" />
      </div>

      <div class="inputField">
        <label id="password" class="label" for="password">Password:</label>
        <!--input password-->
        <input class="input" type="password" name="password" v-model="password" @click="clearText" />
      </div>

      <div class="inputField">
        <label id="identity" class="label" for="identity">Identity:</label>
        <!--input identity-->
        <input class="input" type="text" name="identity" v-model="identity" @click="clearText" />
      </div>
      <button id="signuploginButton" class="signupLoginButton" @click="signupOrLogin">Sign Up</button>
    </div>
  </div>
</template>

<script>
import Firebase from "@/firebase/init";
import firebase from "firebase";

var firebaseDatabase = Firebase.firestore();

export default {
  name: "SignupLogin",
  props: ["login"],
  data() {
    return {
      email: "",
      password: "",
      identity: "",
      actionCodeSettings: {
        // After signup, and after the user clicked onto the link
        //sent to him/her by email, redirect back to this URL
        url: "https://blueprint-club-forum.firebaseapp.com/#/", //https://blueprint-club-forum.firebaseapp.com/#/',
        handleCodeInApp: true
      }
    };
  },
  methods: {
    //switches between the innerhtml of signup and login
    signUpLogin() {
      if (document.getElementById("signuploginText").innerHTML == "Sign Up") {
        document.getElementById("signuploginText").innerHTML = "Login";
        document.getElementById("signuploginButton").innerHTML = "Login";
      } else {
        document.getElementById("signuploginText").innerHTML = "Sign Up";
        document.getElementById("signuploginButton").innerHTML = "Sign Up";
      }
    },
    //clears text of input boxes under certain conditions
    clearText() {
      if (
        document.getElementById("identity").innerHTML != "Identity:" ||
        document.getElementById("email").innerHTML != "Email:" ||
        document.getElementById("password").innerHTML != "Password:"
      ) {
        this.identity = "";
        this.email = "";
        this.password = "";
        document.getElementById("identity").innerHTML = "Identity:";
        document.getElementById("email").innerHTML = "Email:";
        document.getElementById("password").innerHTML = "Password:";
      }
    },
    signupOrLogin() {
      //signup
      if (document.getElementById("signuploginText").innerHTML == "Sign Up") {
        if (this.email != "" && this.password != "" && this.identity != "") {
          //capitalize the first letter of each word in the identity
          var words = this.identity.toLowerCase().split(" ");
          for (var i = 0; i < words.length; i++) {
            words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
          }
          this.identity = words.join(" ");

          //checks if identity is a member of blueprint club
          //and check if an account already exist with that identity
          let Ref = firebaseDatabase.collection("users").doc(this.identity);
          Ref.get().then(doc => {
            if (doc.exists != true) {
              document.getElementById("identity").innerHTML =
                "This Identity is Not a Member of the Blueprint Club.";
            } else {
              let identity = doc.data();
              if (identity.accountExistence) {
                document.getElementById("identity").innerHTML =
                  "An Account With This Identity Already Exists.";
              } else {
                //if satisfies all condition then create the account
                //and change accountExistence on databaseto true to indicate that
                //An account with this identity already exists.
                firebase
                  .auth()
                  .createUserWithEmailAndPassword(this.email, this.password)
                  .catch(err => {
                    //this if else statement just determines the position the error message is shown
                    //either show err in the element with id 'password' or show in the element with id 'email'
                    if (
                      err.message.includes("password") ||
                      err.message.includes("Password")
                    ) {
                      document.getElementById("password").innerHTML =
                        err.message;
                    } else {
                      document.getElementById("email").innerHTML = err.message;
                    }
                  })
                  .then(() => {
                    
                    var email = `${this.email}`;
                    if (
                      document.getElementById("email").innerHTML == "Email:" &&
                      document.getElementById("password").innerHTML ==
                        "Password:"
                    ) {
                      firebaseDatabase
                        .collection("users")
                        .doc(this.identity)
                        .set({
                          accountExistence: true,
                          email: email,
                          emailVerification: false,
                          userPosts: []
                        })
                        .catch(err => {
                          console.log(err);
                        })
                        .then(() => {
                          console.log("Sign Up Successful");
                          console.log(firebase.auth().currentUser);
                        })
                        .then(() => {
                          //send an email authentication/login to user
                          ``;
                          firebase
                            .auth()
                            .sendSignInLinkToEmail(
                              this.email,
                              this.actionCodeSettings
                            )
                            .then(function() {
                              // The link was successfully sent. Inform the user.
                              console.log("email sent");
                              // Save the email locally so you don't need to ask the user for it again
                              // if they open the link on the same device.
                              window.localStorage.setItem(
                                "emailForSignIn",
                                email
                              );
                              document.getElementById("email").innerHTML =
                                "To complete the signup process, check your email.";
                            })
                            .catch(function(error) {
                              // Some error occurred, you can inspect the code: error.code
                              console.log(error);
                            });
                        });
                    }
                  });
              }
            }
          });
        }
        //check if email is entered
        else if (this.email == "") {
          document.getElementById("email").innerHTML =
            "Please Enter an Email Account.";
        }
        //check if password is entered
        else if (this.password == "") {
          document.getElementById("password").innerHTML =
            "Please Enter a Password:";
        }
        //check if identity is entered
        else if (this.identity == "") {
          document.getElementById("identity").innerHTML =
            "Please Enter an Identity.";
        }
      }

      //login
      else {
        if (this.email != "" && this.password != "" && this.identity != "") {
          let Ref = firebaseDatabase.collection("users").doc(this.identity);
          Ref.get().then(doc => {
            let identity = doc.data();
            if (doc.exists != true) {
              document.getElementById("identity").innerHTML =
                "This Identity is Not a Member of the Blueprint Club.";
            } else if (identity.emailVerification != true) {
              //you have to verify your email first before you can login
              document.getElementById("email").innerHTML =
                "Please verify this email first. A link was sent to your email when you signed up.";
            } else if (this.email != identity.email) {
              document.getElementById("email").innerHTML =
                "This Email Does Not Correspond to the Identity Entered.";
            } else {
              //sign the user in if the identity exist and the email address corresponds to the identity entered
              firebase
                .auth()
                .signInWithEmailAndPassword(this.email, this.password)
                .catch(err => {
                  if (
                    err.message.includes("password") ||
                    err.message.includes("Password")
                  ) {
                    document.getElementById("password").innerHTML = err.message;
                  } else {
                    document.getElementById("email").innerHTML = err.message;
                  }
                })
                .then(() => {
                  if (
                    document.getElementById("email").innerHTML == "Email:" &&
                    document.getElementById("password").innerHTML == "Password:"
                  ) {
                    console.log("Login Successful");
                    console.log(firebase.auth().currentUser);
                    this.$router.push({ name: "Main" });
                  }
                });
            }
          });
        }
        //check if email is entered
        else if (this.email == "") {
          document.getElementById("email").innerHTML =
            "Please Enter an Email Account.";
        }
        //check if password is entered
        else if (this.password == "") {
          document.getElementById("password").innerHTML =
            "Please Enter a Password:";
        }
        //check if identity is entered
        else if (this.identity == "") {
          document.getElementById("identity").innerHTML =
            "Please Enter an Identity.";
        }
      }
    }
  }
};
</script>

<style>
.signupLogin {
  width: 100%;
  height: 100%;
  font-family: Roboto, "Open Sans", "Helvetica Neue";
}
.signupContainer {
  margin-top: 11.5%;
  margin-left: 32%;
  height: 60%;
  width: 35%;
  color: white;
  border-style: solid;
  border-color: cyan;
  float: left;
  clear: none;
  visibility: visible;
}
.signupLoginText {
  text-align: center;
  font-size: 290%;
  cursor: pointer;
}
.signupLoginText:hover {
  color: cyan;
}

.inputField {
  margin-top: 5%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 80%;
}
.label {
  color: white;
  font-size: 115%;
}

.input {
  color: white;
  background-color: black;
}
.signupLoginButton {
  border-style: solid;
  border-color: cyan;
  background-color: black;
  color: white;
  font-size: 115%;
  width: 30%;
  height: 10%;
  top: 4%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  position: relative;
}
</style>