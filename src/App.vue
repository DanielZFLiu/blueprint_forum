<template>
  <div 
    id="app"
    @mousemove= "move_pic"
  >
    <NavBar 
      :login="login()" 
      v-on:move_picture="update_move_picture"
    /> <!--v-on:move_picture="update_move_picture" receives data sent by $emit in NavBar.vue-->

    <!--to read on passing data from child to parent, use the link 
    https://dev-notes.eu/2018/05/passing-data-between-vue-components/#:~:text=Pass%20Data%20from%20Child%20to,the%20data%20value%20to%20pass.
    -->

    <router-view
      v-on:deletePost="deletePost($event)"
      v-on:commentsUpdate="commentsUpdate($event)"
      :posts="posts"
      :login="login()"
    />
    <!--:posts pass this.posts to other "classes" or .vue files.-->
    <!--v-on:deletePost="deletePost($event) receives data send by $emit in EditDeletePost.vue-->
  </div>
</template>

<script>
//import the NavBar class
import NavBar from "./NavBar";
//import firebase database and other firebase services
import Firebase from "@/firebase/init";
import firebase from "firebase";

var firebaseDatabase = Firebase.firestore();

export default {
  name: "App",
  components: {
    NavBar: NavBar
  },
  data() {
    return {
      posts: [],
      Move_Picture: false,
      picture_coordinates: {
        x: 0,
        y: 0,
      }
    };
  },
  methods: {
    update_move_picture(value){
      this.Move_Picture = value
    },

    move_pic(){ //to drag the minimized logo in case it blocks any elements of the website
      if (this.Move_Picture == true){
        this.picture_coordinates.x = event.pageX - 35
        this.picture_coordinates.y = event.pageY - 35
        this.picture_coordinates.x = this.picture_coordinates.x.toString()
        this.picture_coordinates.y = this.picture_coordinates.y.toString()
        this.picture_coordinates.x = this.picture_coordinates.x.concat("px")
        this.picture_coordinates.y = this.picture_coordinates.y.concat("px")
        document.getElementById("logo").style.left = this.picture_coordinates.x
        document.getElementById("logo").style.top = this.picture_coordinates.y
      }
    },

    commentsUpdate(Post) {
      //updates the comments in a specific post
      //by changing posts
      this.posts = this.posts.filter(post => {
        if (post.id != Post.id) {
          return post;
        } else {
          post.comments = Post.comments;
          post.commenters = Post.commenters;
          return post;
        }
      });
    },

    //this functions checks if the user is logged in or not
    //putting login in methods instead of computed means that this computed value will update
    //"immediately" when firebase.auth().currentUser is changed.
    //If put in computed:{}, a page refresh is needed for updating the login value
    login() {
      if (firebase.auth().currentUser != null) {
        return true;
      } else {
        return false;
      }
    },
    deletePost(postId) {
      //deletes a post locally
      this.posts = this.posts.filter(postSample => {
        if (postSample.id != postId) {
          return postSample;
        }
      });
    }
  },
  created() {
    //fetch data from firestore
    //firebaseDatabase.collection('posts').get() returns a promise, which takes sometime to do,
    //.then waits for the promise
    firebaseDatabase
      .collection("posts")
      .get()
      .then(snapshot => {
        //.then runs when firebaseDatabase.collection('posts').get() is complete
        //snapshot is the state 'posts' is at when it is accessed from the database
        snapshot.forEach(Post => {
          //cycles through each post in 'posts
          let post = Post.data();
          post.id = Post.id;
          this.posts.push(post);
        });
        //sorts the posts array from newest posts to oldest posts using bubble sort
        var postsAmount = this.posts.length;
        var swapsNumber = -1;
        var tempPost;
        while (swapsNumber != 0) {
          swapsNumber = 0;
          for (var i = 0; i < postsAmount - 1; i++) {
            if (this.posts[i + 1].timestamp > this.posts[i].timestamp) {
              tempPost = this.posts[i];
              this.posts[i] = this.posts[i + 1];
              this.posts[i + 1] = tempPost;
              swapsNumber++;
            }
          }
        }

        /*this.posts.sort(function (a, b) {
        return b.timestamp - a.timestamp;
      })*/
      });
  }
};
</script>

<style>
#app {
  background-color: black;
  color: white;
  height: 100%;
  width: 100%;
  /*fixed as to viewer's eyes*/
  position: fixed;
  top: 0%;
  left: 0%;
  /*z-index is priority level of display when overlap of elements occur*/
  z-index: 0;
  font-family: Roboto, "Open Sans", "Helvetica Neue";
}
</style>
