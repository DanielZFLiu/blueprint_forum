<template>
  <div 
    class="navbar"
  >
    <img
      id="logo"
      class="blueprintLogo"
      alt="Blueprint Logo"
      src="@/assets/BlueprintLogo.png"
      @dblclick="sidebarShow"
      @mousedown="move_picture_true"
      @mouseup = "move_picture_false"
    />
    <nav id="sidebar">
      <!--the sidebar contains all the router links-->
      <ul class="sidebarItems">
        <li id="sidebar_home">
          <router-link to="/">Home</router-link>
        </li>
        <!--the reason for the object {} instead of just "/posts" is because 
              its easier to update. If I want to change to "/postBoard, 
        I only need update the path in index.js from "/posts" to "/postBoard" to update all instance of /posts-->
        <br />
        <li id="sidebar_Posts">
          <router-link :to="{name: 'Posts'}">Posts</router-link>
        </li>
        <br v-if="this.login" />
        <li v-if="this.login" id="sidebar_editDeletePost">
          <router-link :to="{name: 'EditDeletePost'}">Edit/Delete Posts</router-link>
        </li>
        <!--router link is just link but to a webpage in this project-->
        <!--v-if shows the element if true, but when false it hides the element-->
        <br v-if="!this.login" />
        <li v-if="!this.login" id="sidebar_signupLogin">
          <router-link :to="{name: 'SignupLogin'}">Sign Up/Login</router-link>
        </li>
        <br v-if="this.login" />
        <li v-if="this.login" id="sidebar_logout">
          <a @click="logout">Logout</a>
        </li>
        <!--when user click on this section, call the method logout-->
      </ul>
    </nav>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "NavBar",
  props: ["login"],
  data() {
    return {
      move_picture: false,
    };
  },
  methods: {
    move_picture_true(){ //set move_picture true so the logo can be moved around
      var node = document.getElementById("logo");
      if (node.style.width == "6%" || node.style.width == ""){
        node.style.transition = "none"; 
        //the reason for '|| node.style.width == ""' is because the first time
        //node.style.width is requested after website renders will return ""
        node.ondragstart = function() { return false; }; //so the picture of the logo cannot be dragged around; instead the logo gets dragged
        this.move_picture = true
        this.$emit("move_picture", this.move_picture); //pass the move_picture variable to App.vue
      }
    },
    move_picture_false(){ //set move_picture false so the logo cannot be moved around
      var node = document.getElementById("logo");
      if (node.style.width == "6%" || node.style.width == ""){
        //the reason for '|| node.style.width == ""' is because the first time
        //node.style.width is requested after website renders will return ""
        this.move_picture = false
        this.$emit("move_picture", this.move_picture); //pass the move_picture variable to App.vue
      }
    },

    //shows or hide the sidebar when the blueprint logo is clicked.
    sidebarShow() {
      var node = document.getElementById("sidebar");
      var node2 = document.getElementById("logo");
      if (node.style.opacity == "0") {
        node2.style.transition = "all 250ms ease-in";
        node2.style.width = "13%";
        node2.style.left = "1%";
        node2.style.top = "3%";
        node.style.opacity = "1";
        node.style.zIndex = "6";

      } 
      else{
        node2.style.width = "6%";
        node.style.opacity = "0";
        node.style.zIndex = "2";
      }
    },
    //basically logs out the current user of the app in firebase authentication
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("Logout Successful");
          //after logout, goto to main page.
          window.open(
            "https://blueprint-club-forum.firebaseapp.com/#/",
            "_self"
          );
          location.reload(); //in case the user is already in https://blueprint-club-forum.firebaseapp.com/#/, hard refresh the page
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
.blueprintLogo {
  position: fixed; /*fixed to the viewer's eye*/
  display: block; /*its a block, blocks cannot overlap each other*/
  z-index: 3;
  cursor: pointer; /*mouse turns into pointer when hovering about his element*/
}

#logo {
  visibility: visible;
  width: 6%;
  left: 1%;
  top: 3%;
  transition: none; /*for aesthetic purposes */
  z-index: 7;
}

#sidebar {
  position: fixed;
  width: 15%;
  height: 100%;
  border: transparent;
  padding: 0px;
  margin: 0px;
  background-color: #1f2833;
  opacity: 0;
  z-index: 2; /*overlapping priority*/
  transition: all 300ms ease;
}

.sidebarItems {
  margin-top: 110%;
  margin-left: -8%;
  list-style-type: none;
}
.sidebarItems li a {
  color: white;
  font-size: 18px;
  text-decoration: none;
}
/*If the router link is active, the corresponding link on the sidebar is highlighted 
  by turning cyan and is underlined */
.sidebarItems li a.router-link-exact-active {
  color: #34dddd;
  text-decoration: underline;
}


</style>
