<!--remember to add a limit to the amount of comments-->
<template>
  <div class="post">
    <div class="title">
      <h1 v-if="postExist()">{{this.post.title}}</h1>
      <h1 v-else>Post Doesn't Exist</h1>
    </div>
    <p class="body" v-if="postExist()">
      <!--v-if is just saying show the post only when postExist returns true-->
      Author: {{this.post.userId}}
      Time Published: {{this.timeDate}}
      Tags: {{this.tags}}
      <br />
      <!--br is line break-->
      <br />
    </p>
    <p v-for="textSection in textAndPics" :key="textSection.id" class="body">
      {{textSection[0]}}
      <img class="img" :src="imageSrc(textSection)" />
    </p>

    <h3 class="commentSectionTitle" v-if="postExist()&postNumCheck()">Comment Section</h3>
    <textarea
      class="enterCommentSection"
      v-if="postExist()&login"
      maxlength="400"
      v-model="comment"
      @keyup="addComment"
      @click="resetCommentText"
    ></textarea>
    <!--text area is the place to enter the comment-->
    <div class="commentBox" v-for="com in comments" :key="com.id">
      <!--displays all the posts by looping through comments-->
      <p class="commentTitle" v-if="postExist()">{{com[0]}}:</p>
      <!--the commenter identity-->
      <p class="commentText" v-if="postExist()">{{com[1]}}</p>
      <!--comment content-->
    </div>
  </div>
</template>

<script>
import Firebase from "@/firebase/init";
import firebase from "firebase";

var firebaseDatabase = Firebase.firestore();

export default {
  name: "Post",
  props: ["posts", "login"],
  data() {
    return {
      //id object is now equal to the id in route
      id: this.$route.params.id,
      post: {},
      timeDate: "",
      timestampDisplay: false,
      tags: "",
      comments: [],
      comment:
        "Please Enter a Comment (Press the Right Arrow Key to Publish the Comment)",
      currentUser: "",
      textAndPics: []
    };
  },
  methods: {
    imageSrc(textSection) {
      if (textSection[1] != null) {
        return this.post.pictureUrls[textSection[1]];
      } else {
        return "";
      }
    },
    addComment(event) {
      //trigger this method by pressing key 39 or right arrow key
      if (event.keyCode == 39 && this.comment != "") {
        var comments = [];
        var commenters = [];

        firebaseDatabase
          .collection("users")
          .get()
          .then(snapshot => {
            //loops through users and find the current logged in user
            snapshot.forEach(USER => {
              let User = USER.data();
              if (firebase.auth().currentUser.email == User.email) {
                //set the current user as the identity that was retrieved from firebase
                this.currentUser = USER.id;
              }
            });
          })
          .then(() => {
            this.comments.unshift([`${this.currentUser}`, `${this.comment}`]); //create a nested array, easy for display using v-for
            this.comment = "";
            for (var i = 0; i < this.comments.length; i++) {
              //firebase cannot store nested array,
              //so this section breaks apart the nested array into 2 arrays
              commenters.push(this.comments[i][0]);
              comments.push(this.comments[i][1]);
              if (i == 29) {
                //so there can be a max of 30 posts
                i = this.comments.length;
              }
            }
          })
          .then(() => {
            firebaseDatabase
              .collection("posts")
              .doc(this.post.id)
              .set({
                //update the post document witht the new comment
                body: this.post.body,
                tags: this.post.tags,
                timestamp: this.post.timestamp,
                title: this.post.title,
                userId: this.post.userId,
                comments: comments,
                commenters: commenters,
                pictureUrls: this.post.pictureUrls,
                pictureNames: this.post.pictureNames
              });
          });

        var Post = {
          //Post object
          id: this.post.id,
          comments: comments,
          commenters: commenters
        };

        this.$emit("commentsUpdate", Post); //pass this to App.vue, and App.vue will update this.posts with the new comment
      }
    },
    updateId() {
      //making sure that the template updates when this.$route.params.id is changed
      this.id = this.$route.params.id;
    },
    //checks if the link (/post/id) actually exist
    postExist() {
      //if the current /post/id matches one of the ids of the posts, this route exist
      var postExist = this.posts.filter(post => {
        if (post.id == this.id) {
          return post;
        }
      });

      //if the route exist,
      //update this.post to the post with the route id
      //and turn timestamp syntax to date and time that can be displayed on the post
      if (postExist.length == 1 && this.timestampDisplay == false) {
        this.post = postExist[0];

        var postBody = `${this.post.body}`;
        var pictureNumber = this.post.pictureUrls.length;
        if (pictureNumber != 0) {
          postBody = postBody.split(" Will be Placed Here}}}");
          for (var i = 0; i < postBody.length; i++) {
            if (postBody[i].match("{{{Picture 1")) {
              postBody[i] = postBody[i].replace("{{{Picture 1", "");
              this.textAndPics.push([postBody[i], 0]);
            } else if (postBody[i].match("{{{Picture 2")) {
              postBody[i] = postBody[i].replace("{{{Picture 2", "");
              this.textAndPics.push([postBody[i], 1]);
            } else if (postBody[i].match("{{{Picture 3")) {
              postBody[i] = postBody[i].replace("{{{Picture 3", "");
              this.textAndPics.push([postBody[i], 2]);
            } else {
              this.textAndPics.push([postBody[i], null]);
            }
          }

          console.log(this.textAndPics);
        } else if (pictureNumber == 0) {
          this.textAndPics.push([this.post.body, null]);
        }

        for (var i = 0; i < this.post.comments.length; i++) {
          //format comments data into nested array
          this.comments.push([this.post.commenters[i], this.post.comments[i]]);
        }

        var tags = ""; //format the tags so it looks better
        for (var i = 0; i < this.post.tags.length; i++) {
          if (i < this.post.tags.length - 1) {
            tags = tags + `${this.post.tags[i]}` + ", ";
          } else {
            tags = tags + `${this.post.tags[i]}`;
          }
        }
        this.tags = tags;

        var timestamp = Number(`${this.post.timestamp}`); //changing the timestamp to understandable date
        var date = new Date(timestamp).toString();

        var GMTpos = date.indexOf("GMT");
        if (GMTpos != -1) {
          //to make the date format look nicer
          date = date.substring(0, GMTpos);
        }

        this.timeDate = date;
        this.timestampDisplay = true;
        return true;
      } else if (postExist.length == 1) {
        //you only need to run formatting codes once, thus the existence of this else if statement
        return true;
      } else {
        return false;
      }
    },
    postNumCheck() {
      //this function returns false when there are no comments and also the user is not logged in.
      //In that case do not show the comments section
      if (this.comments.length == 0 && this.login == false) {
        return false;
      } else {
        return true;
      }
    },
    resetCommentText() {
      //as the name suggest
      if (
        this.comment ==
        "Please Enter a Comment (Press the Right Arrow Key to Publish the Comment)"
      ) {
        this.comment = "";
      }
    }
  },
  watch: {
    //watches the postId in the link, if user enters a new post/postId, update the page content immediately to suit the new postId
    $route: "updateId"
  }
};
</script>

<style>
.post {
  overflow-y: scroll; /*if the text exeed the current length of the page, make a verticle scroll bar and extend the page*/
  width: 100%;
  height: 100%;
  -ms-overflow-style: none;  /* hide scroll bar for IE and Edge */
  scrollbar-width: none;  /* hide scroll bar for Firefox */
  font-family: Roboto, "Open Sans", "Helvetica Neue";
}
/* Hide scrollbar for Chrome, Safari and Opera */
.post::-webkit-scrollbar {
  display: none;
}
.title {
  text-align: center;
  margin-top: 5%;
  -moz-hyphens: auto; /*this part actually just makes sure the title goes to the next line when a certain length a reached*/
  -ms-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
}
.body {
  margin-left: 20%;
  margin-right: 20%;
  -moz-hyphens: auto; /*this part actually just makes sure the body goes to the next line when a certain length a reached for a line of text*/
  -ms-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
  white-space: pre-line;
  word-wrap: break-word;
}
.img {
  display: inline-block;
  max-width: 100%;
}
.commentSectionTitle {
  margin-top: 34%;
  text-align: center;
  font-size: 150%;
  margin-bottom: 2%;
  font-weight: bold;
}
.enterCommentSection {
  width: 60%;
  height: 7%;
  margin-left: 20%;
  margin-bottom: 1%;
  font-size: 100%;
  color: white;
  background-color: black;
  border: 1px solid white;
}
.enterCommentSection:focus {
  outline: none;
  border: 1.2px solid cyan;
  border-radius: 5px;
}
.commentBox {
  width: 60%;
  margin-left: 20%;
  margin-bottom: 1%;
}

.commentTitle {
  font-weight: bold;
  color: cyan;
  font-size: 115%;
  margin: 0px;
}
.commentText {
  -moz-hyphens: auto; /*if a line of comment is too long, end the line and start a new line */
  -ms-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
  white-space: pre-line;
  word-wrap: break-word;
  margin: 0px;
}
</style>
