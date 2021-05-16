<template>
  <div class="editDeletePost" v-if="this.login">
    <div id="EorDPost" @click="EditOrDeleteTextChange">Edit Post</div>
    <p class="searchText">Search (by post #tags, title, or body):</p>
    <input class="searchBox" type="text" v-model="searchTerm" @click="showNewestPosts()" />
      <!--v-model binds the inputted text with the variable searchterm.-->

    <div id="addPostBackground">
      <p id="tagFormatting"></p>
      <!--added for formatting reasons-->
      <div id="addTagInputBox">
        <input
          class="addTagInput"
          type="text"
          maxlength="50"
          v-model="tag"
          @keyup="addTag"
          @click="resetInputTextTag"
        />
        <!--keyup calls the function addTag everytime a key is lifted-->
      </div>

      <div id="tagDisplaySection">
        <div
          class="tagDisplay"
          v-for="(tag, index) in post.tags"
          :key="index"
          @click="deleteTag(`${tag}`)"
        >
          <p>{{tag}}</p>
        </div>
      </div>

      <button id="finishAddingTagsButton" @click="editPost">Edit Post</button>

      <div id="enterPostTitleBox">
        <input class="enterPostTitle" type="text" maxlength="60" v-model="post.title" />
      </div>

      <textarea id="enterPostBody" maxlength="7200" v-model="post.body"></textarea>
      <button id="editPostButton" @click="finishEditingPost">Finish Editing</button>
    </div>
    <div id="addPostBackground2" @click="hideEditPost"></div>

    <div
      class="postSection"
      v-for="post in filteredPosts"
      :key="post.id"
      @click="editOrDeletePost(post)"
    >
      <!--<router-link :to="{name: 'Post', params: {id: post.id}}">-->
      <div id="innerPostSection">
        <h3 class="postTitle">{{post.title}}</h3>
        <!--using filter to make post body shown only certain chars long
          filter is a computed property where the output is changed 
        but the value of the variables are not-->
        <p class="postBody">{{post.body | filter1}}</p>
      </div>
      <!--</router-link>-->
    </div>

    <div v-if="showSOPButton()" class="seeOlderPosts" @click="clickSOPButton()">Show Older Posts</div>
    <!--shows the button only when there are >12 posts in this.posts-->
  </div>
</template>

<script>
//import firebase services
import Firebase from "@/firebase/init";
import firebase from "firebase";

var firebaseDatabase = Firebase.firestore();
var storage = Firebase.storage();

export default {
  name: "EditDeletePost",
  props: ["posts", "login"], //passed from App.vue
  data() {
    return {
      searchTerm: "",
      showPostUpperBound: 12,
      showPostLowerBound: -1,
      user: "",
      userEmail: "",
      userEmailVerification: false,
      userPosts: [],
      post: {
        title: "Title",
        body: "Body",
        tags: [],
        id: "",
        timestamp: 1,
        comments: [],
        commenters: [],
        pictureUrls: [],
        pictureNames: []
      },
      tag: "Press Enter to Add a Tag"
    };
  },
  methods: {
    resetInputTextTag() {
      //reset the input text in edit tag section
      if (this.tag == "Press Enter to Add a Tag") {
        this.tag = "";
      }
    },
    addTag(event) {
      //When enter is pressed, add tag entered to post.tags
      if (event.key === "Enter") {
        //remove all spaces before tag
        while (this.tag.charAt(0) == " ") {
          this.tag = this.tag.slice(1);
        }
        if (this.tag != "") {
          var tagText = "#" + `${this.tag}`;
          //no more than 3 tags can be entered
          if (this.post.tags.length == 3) {
            this.tag = "";
          }
          //repetitive tags cannot be entered
          else if (
            this.post.tags.findIndex(
              item => `${this.tag}`.toLowerCase() === item.toLowerCase()
            ) > -1 ||
            this.post.tags.findIndex(
              item => tagText.toLowerCase() === item.toLowerCase()
            ) > -1
          ) {
            this.tag = "";
          } else {
            //add # before tag
            if (this.tag.charAt(0) != "#") {
              this.tag = "#" + this.tag;
            }
            this.post.tags.push(`${this.tag}`);
            this.tag = "";
          }
        } else {
          this.tag = "Press Enter to Add a Tag";
        }
      }
    },
    //if the tag is clicked, find tag position in tags and delete the tag
    deleteTag(tagText) {
      this.post.tags = this.post.tags.filter(item => {
        return item !== tagText;
      });
    },
    editPost() {
      //shows the edit post section but hides the edit tags section
      document.getElementById("tagFormatting").style.display = "none";
      document.getElementById("addTagInputBox").style.display = "none";
      document.getElementById("tagDisplaySection").style.display = "none";
      document.getElementById("finishAddingTagsButton").style.display = "none";
      document.getElementById("enterPostTitleBox").style.display = "block";
      document.getElementById("enterPostBody").style.display = "block";
      document.getElementById("editPostButton").style.display = "block";
      this.tag = "Press Enter to Add a Tag";
    },
    finishEditingPost() {
      //save all the changes after editing the post
      console.log("edited post " + this.post.id);
      firebaseDatabase
        .collection("posts")
        .doc(this.post.id)
        .set({
          body: this.post.body,
          tags: this.post.tags,
          timestamp: this.post.timestamp,
          title: this.post.title,
          userId: this.user,
          comments: this.post.comments,
          commenters: this.post.commenters,
          pictureUrls: this.post.pictureUrls,
          pictureNames: this.post.pictureNames
        })
        .then(() => {
          location.reload();
        });
    },
    hideEditPost() {
      //hides the edit post section
      document.getElementById("addPostBackground").style.display = "none";
      document.getElementById("addPostBackground2").style.display = "none";
      this.tag = "Press Enter to Add a Tag";
    },
    EditOrDeleteTextChange() {
      //switches between edit post or delete post
      if (document.getElementById("EorDPost").innerHTML == "Edit Post") {
        document.getElementById("EorDPost").innerHTML = "Delete Post";
      } else if (
        document.getElementById("EorDPost").innerHTML == "Delete Post"
      ) {
        document.getElementById("EorDPost").innerHTML = "Edit Post";
      }
    },
    editOrDeletePost(post) {
      //edits or deletes a post
      if (document.getElementById("EorDPost").innerHTML == "Edit Post") {
        //edit the clicked post
        console.log("editing post " + post.id);
        this.post.title = post.title;
        this.post.body = post.body;
        this.post.tags = post.tags;
        this.post.timestamp = post.timestamp;
        this.post.id = post.id;
        this.post.comments = post.comments;
        this.post.commenters = post.commenters;
        this.post.pictureUrls = post.pictureUrls;
        this.post.pictureNames = post.pictureNames;
        document.getElementById("addPostBackground").style.display = "block";
        document.getElementById("addPostBackground2").style.display = "block";
        document.getElementById("tagFormatting").style.display = "block";
        document.getElementById("addTagInputBox").style.display = "block";
        document.getElementById("finishAddingTagsButton").style.display =
          "block";
        document.getElementById("tagDisplaySection").style.display = "block";
        document.getElementById("enterPostTitleBox").style.display = "none";
        document.getElementById("enterPostBody").style.display = "none";
        document.getElementById("editPostButton").style.display = "none";
      } else if (
        document.getElementById("EorDPost").innerHTML == "Delete Post"
      ) {
        //deletes the clicked post from the posts collection
        console.log("deleted post " + post.id);
        firebaseDatabase
          .collection("posts")
          .doc(post.id)
          .delete();
        this.userPosts = this.userPosts.filter(postSample => {
          if (postSample.id != post.id) {
            return postSample;
          }
        });

        var userEmail = firebase.auth().currentUser.email;
        var userPostsIds = [];
        for (var i = 0; i < this.userPosts.length; i++) {
          userPostsIds.push(this.userPosts[i].id); //create an array of the post IDs of the posts that the user posted
        }
        firebaseDatabase
          .collection("users")
          .doc(this.user)
          .set({
            //deletes the clicked post from the userPosts array in the users collection
            accountExistence: true,
            email: userEmail,
            emailVerification: this.userEmailVerification,
            userPosts: userPostsIds
          })
          .then(() => {
            this.$emit("deletePost", post.id); //sends the data from child component to parent component (App.vue)
            var storageRef = storage.ref();
            for (var i = 0; i < post.pictureNames.length; i++) {
              console.log(post.pictureNames[i] + " delete successful");
              var deleteRef = storageRef.child(post.pictureNames[i]);
              deleteRef.delete().catch(function(error) {
                console.log(error.message);
              });
            }
          });
      }
    },

    //shows the Show Older Posts button only under certain conditions so it doesn't mess up formatting
    showSOPButton() {
      var SearchedPosts = this.userPosts.filter(post => {
        var postsLength = this.userPosts.length;
        var postTagExistence = false;

        for (var i = 0; i < post.tags.length; i++) {
          if (post.tags[i].toLowerCase().match(this.searchTerm.toLowerCase())) {
            postTagExistence = true;
            i = post.tags.length;
          }
        }

        //shows post if the search term matches or if a tag is searched
        if (
          post.title.toLowerCase().match(this.searchTerm.toLowerCase()) ||
          post.body.toLowerCase().match(this.searchTerm.toLowerCase()) ||
          postTagExistence
        ) {
          return post;
        }
      });

      var searchPosts = SearchedPosts.filter(post => {
        //shows the post if its in between the upperBound and lowerBound. See comments near data().showPostUpperBound to see what they are for.
        if (
          SearchedPosts.indexOf(post) > this.showPostLowerBound &&
          SearchedPosts.indexOf(post) < this.showPostUpperBound
        ) {
          return post;
        }
      });

      if (searchPosts.length == 12) {
        return true;
      } else {
        return false;
      }
    },

    //changes the upperBound and lowerBound, which changes the posts shown.
    clickSOPButton() {
      if (this.userPosts.length > this.showPostUpperBound) {
        this.showPostUpperBound = this.showPostUpperBound + 12;
        this.showPostLowerBound = this.showPostLowerBound + 12;
      }
    },
    //when click on search bar, changes posts shown to newest 12 posts.
    showNewestPosts() {
      this.showPostUpperBound = 12;
      this.showPostLowerBound = -1;
    }
  },
  created() {
    firebaseDatabase
      .collection("users")
      .get()
      .then(snapshot => {
        snapshot.forEach(USER => {
          let User = USER.data();
          if (firebase.auth().currentUser.email == User.email) {
            //set the current user as the identity that was retrieved from firestore
            //set the current userEmail as the one that was retrieved from firestore
            //set the current emailVerification status as the one that was retrieved from firestore
            this.user = USER.id;
            this.userEmail = User.email;
            this.userEmailVerification = User.emailVerification;
          }
        });
      })
      .then(() => {
        this.userPosts = this.posts.filter(post => {
          //filter through this.posts and return the posts
          //that has the current username as author
          if (post.userId == this.user) {
            return post;
          }
        });
      });
  },
  computed: {
    filteredPosts() {
      //this section returns post searched
      var searchedPosts = this.userPosts.filter(post => {
        var postsLength = this.userPosts.length;
        var postTagExistence = false;

        for (var i = 0; i < post.tags.length; i++) {
          if (post.tags[i].toLowerCase().match(this.searchTerm.toLowerCase())) {
            postTagExistence = true;
            i = post.tags.length;
          }
        }

        //shows post if the search term matches or if a tag is searched
        if (
          post.title.toLowerCase().match(this.searchTerm.toLowerCase()) ||
          post.body.toLowerCase().match(this.searchTerm.toLowerCase()) ||
          postTagExistence
        ) {
          return post;
        }
      });

      return searchedPosts.filter(post => {
        //shows the post if its in between the upperBound and lowerBound. See comments near data().showPostUpperBound to see what they are for.
        if (
          searchedPosts.indexOf(post) > this.showPostLowerBound &&
          searchedPosts.indexOf(post) < this.showPostUpperBound
        ) {
          return post;
        }
      });
    }
  }
};
</script>

<style scoped>
.editDeletePost {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  -ms-overflow-style: none;  /* hide scroll bar for IE and Edge */
  scrollbar-width: none;  /* hide scroll bar for Firefox */
  font-family: Roboto, "Open Sans", "Helvetica Neue";
}
/* Hide scrollbar for Chrome, Safari and Opera */
.editDeletePost::-webkit-scrollbar {
  display: none;
}

#addPostBackground {
  background-color: black;
  width: 80%;
  height: 100%;
  z-index: 4;
  position: fixed;
  top: 0%;
  left: 5.8%;
  display: none;
  padding-left: 9.0%;
}

#addPostBackground2 {
  background-color: #1f2833;
  width: 100%;
  height: 100%;
  z-index: 3;
  position: fixed;
  top: 0%;
  left: 0%;
  display: none;
}

#tagFormatting {
  margin-top: 35%;
  margin-bottom: 0%;
  display: block;
}

#addTagInputBox {
  width: 70%;
  height: 5%;
  position: fixed;
  top: 32%;
  left: 15%;
  z-index: 5;
  display: block;
}

.addTagInput {
  width: 100%;
  height: 100%;
  font-size: 130%;
  color: white;
  background-color: black;
  outline: none;
  border: none;
  border-bottom: 1px solid white;
  /*By default, some browsers will add a blue outline 
  around the input when it gets focus (clicked on).
  outline:none disables that*/
}

.addTagInput:focus {
  border: none;
  border-bottom: 1.2px solid cyan;
}

#tagDisplaySection {
  display: block;
}

.tagDisplay {
  width: 27.92%;
  height: 7.8%;
  margin-right: 2%;
  float: left;
  clear: none;
  word-wrap: break-word;/*this part makes sure the tag text run over to the next line*/
  color: white;
  z-index: 5;
  text-align: center;
  border-style: solid;
  border-color: white;
  border-radius: 30px;
}

.tagDisplay:hover {
  /*these css codes apply when mouse hover upon the HTML tags with tagDisplay*/
  animation-name: changeColor;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

@keyframes changeColor {
  /*an animation that changes color of border and text*/
  from {
    border-color: white;
    color: white;
  }
  to {
    border-color: #34dddd;
    color: cyan;
  }
}

#finishAddingTagsButton {
  width: 8%;
  height: 4%;
  position: fixed;
  right: 14.5%;
  bottom: 2%;
  display: block;
  z-index: 5;
  border: 1px solid white;
  background-color: black;
  color: white;
}

#finishAddingTagsButton:hover {
  border: 1.2px solid cyan;
  color: cyan;
}


#enterPostTitleBox {
  width: 70%;
  height: 5%;
  position: fixed;
  top: 3%;
  left: 15%;
  display: none;
  z-index: 6;
}

.enterPostTitle {
  width: 100%;
  height: 100%;
  font-size: 130%;
  color: white;
  border: none;
  border-bottom: 1px solid white;
  background-color: black;
  outline: none;
}

.enterPostTitle:focus {
  border: none;
  border-bottom: 1.2px solid cyan;
}

#enterPostBody {
  width: 70%;
  height: 72.5%;
  position: fixed;
  left: 15%;
  bottom: 8%;
  font-size: 110%;
  color: white;
  display: none;
  z-index: 6;
  border: 1px solid white;
  background-color: black;
  outline: none;
}

#enterPostBody:focus {
  border: 1.2px solid cyan;
}

#editPostButton {
  width: 10%;
  height: 4%;
  position: fixed;
  right: 14.5%;
  bottom: 2%;
  display: block;
  z-index: 6;
  border: 1px solid white;
  background-color: black;
  color: white;
}

#editPostButto:hover {
  border: 1.2px solid cyan;
  color: cyan;
}

.postSection {
  margin-top: 5%;
  margin-left: 2.5%;
  width: 30%;
  height: 50%;
  float: left;
  clear: none;
  word-wrap: break-word;
  z-index: 0;
  cursor: pointer;
}

#innerPostSection {
  width: 100%;
  height: 100%;
  color: white;
  border-style: solid;
  border-color: white;
  z-index: 1;
}

#innerPostSection:hover {
  animation-name: changeColor;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

@keyframes changeColor {
  from {
    border-color: white;
    color: white;
  }
  to {
    border-color: #34dddd;
    color: cyan;
  }
}

.postTitle {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 50ch;
  margin-left: 3%;
  margin-right: 3%;
  font-size: 250%;
  font-weight: bold;
}
.postBody {
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
  margin-left: 3%;
  margin-right: 3%;
}
.searchText {
  font-size: 135%;
  font-weight: bold;
  margin-top: 3%;
  margin-left: 2.5%;
  margin-bottom: 0%;
}
.searchBox {
  border: none;
  border-bottom: 1px solid white;
  width: 95%;
  height: 5%;
  margin-left: 2.5%;
  background-color: black;
  font-size: 104%;
  color: white;
  outline: none;
  /*By default, some browsers will add a blue outline 
  around the input when it gets focus (clicked on).
  outline:none disables that*/
}
.searchBox:focus {
  border: none;
  border-bottom: 1.2px solid cyan;
}
#EorDPost {
  margin-top: 5%;
  text-align: center;
  font-size: 150%;
  display: inline-block;
  width: 100%;
  cursor: pointer;
}
#EorDPost:hover {
  color: cyan;
}
.seeOlderPosts {
  width: 9%;
  height: 5%;
  color: white;
  border-style: solid;
  border-color: white;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  left: 45.5%;
  top: 3%;
  margin-bottom: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>