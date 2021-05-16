<template>
  <div class="posts">
    <p class="searchText">Search (by post #tags, title, or body):</p>
    <input class="searchBox" type="text" v-model="searchTerm" @click="showNewestPosts()" />

    <div v-if="this.login" class="addPostLogo" @click="showAddPost">Add Post</div>

    <div id="addPostBackground">
      <p id="tagFormatting"></p>
      <!--added for formatting reasons-->
      <div id="addTagInputBox">
        <input
          class="addTagInput"
          type="text"
          maxlength="50"
          v-model="tag"
          @keydown="addTag"
          @click="resetInputTextTag"
        />
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
        <input
          class="enterPostTitle"
          type="text"
          maxlength="60"
          v-model="post.title"
          @click="resetInputTextTitle"
        />
      </div>
      <textarea
        id="enterPostBody"
        maxlength="7200"
        v-model="post.body"
        @keyup="formerEdit"
        @click="resetInputTextBody"
      ></textarea>
      <div id="uploadPhoto">
        <p id="uploadPhotoText">Upload a Picture:</p>
        <input
          id="uploadPhotoButton"
          type="file"
          value="upload"
          accept=".jpg, .png"
          @change="uploadPhoto"
        />
      </div>
      <button id="publishPostButton" @click="publishPost">Publish</button>
    </div>
    <div id="addPostBackground2" @click="hideAddPost"></div>

    <div class="postSection" v-for="post in filteredPosts" :key="post.id">
      <router-link :to="{name: 'Post', params: {id: post.id}}">
        <div class="innerPostSection">
          <h3 class="postTitle">{{post.title}}</h3>
          <!--using filter1 to make post body shown only certain chars long
                        filter1 is a computed property where the output is changed 
          but the value of the variables are not-->
          <p class="postBody">{{post.body | filter1}}</p>
        </div>
      </router-link>
    </div>

    <div v-if="showSOPButton()" class="seeOlderPosts" @click="clickSOPButton()">Show Older Posts</div>
  </div>
</template>

<script>
import Firebase from "@/firebase/init";
import firebase from "firebase";

var firebaseDatabase = Firebase.firestore();
var storage = Firebase.storage();

export default {
  name: "Posts",
  props: ["posts", "login"],
  data() {
    return {
      searchTerm: "",
      formerPostBody: "",
      tempPostBodyStore: "",
      counter: 1, //used for formerEdit function
      pictures: [],
      post: {
        title: "Title",
        body: "Body",
        tags: [],
        getTitle: function() {
          return `${this.title}`;
        },
        getBody: function() {
          return `${this.body}`;
        },
        getTags: function() {
          var Tags = [];
          for (var i = 0; i < this.tags.length; i++) {
            Tags.push(`${this.tags[i]}`);
          }
          return Tags;
        }
      },
      tag: "Press Enter to Add a Tag",
      //upperBound value and lowerBound value are used for limiting amount of posts on 1 page.
      //The two values are adjusted when the Show Older Posts button is clicked
      showPostUpperBound: 12,
      showPostLowerBound: -1
    };
  },
  methods: {
    //showAddPost and hideAddPost show and hide the elements #addPostBackground and #addPostBackground2
    showAddPost() {
      document.getElementById("addPostBackground").style.display = "block";
      document.getElementById("addPostBackground2").style.display = "block";
      document.getElementById("tagFormatting").style.display = "block";
      document.getElementById("addTagInputBox").style.display = "block";
      document.getElementById("finishAddingTagsButton").style.display = "block";
      document.getElementById("tagDisplaySection").style.display = "block";
      document.getElementById("enterPostTitleBox").style.display = "none";
      document.getElementById("enterPostBody").style.display = "none";
      document.getElementById("uploadPhoto").style.display = "none";
      document.getElementById("publishPostButton").style.display = "none";
    },
    hideAddPost() {
      document.getElementById("addPostBackground").style.display = "none";
      document.getElementById("addPostBackground2").style.display = "none";
      document.getElementById("uploadPhotoText").innerHTML =
        "Upload a Picture Here:";
      this.tag = "Press Enter to Add a Tag";
      this.pictures = [];

      //clear the picture anchors(anchors that shows where a picture will be place)
      this.post.body = this.post.body.replace(/Will be Placed Here}}}/g, "");
      this.post.body = this.post.body.replace(/{{{Picture 1/g, "");
      this.post.body = this.post.body.replace(/{{{Picture 2/g, "");
      this.post.body = this.post.body.replace(/{{{Picture 3/g, "");
      document.getElementById("uploadPhotoButton").value = ""; //clear the value or files uploaded in the upload photo button
    },
    //resetInputTextTag(), resetInputTextTitle(), and resetInputTextBody(), resets the input text shown under certain conditions.
    resetInputTextTag() {
      if (this.tag == "Press Enter to Add a Tag") {
        this.tag = "";
      }
    },
    resetInputTextTitle() {
      if (
        this.post.title == "Title" ||
        this.post.title == "You must enter a post title."
      ) {
        this.post.title = "";
      }
    },
    formerEdit(event) {
      if (this.post.body == "" && event.keyCode == 8) {
        console.log("empty body and you pressed delete");
      } else if (
        event.keyCode != 9 &&
        event.keyCode != 16 &&
        event.keyCode != 17 &&
        event.keyCode != 18 &&
        event.keyCode != 20 &&
        event.keyCode != 27 &&
        event.keyCode != 37 &&
        event.keyCode != 38 &&
        event.keyCode != 39 &&
        event.keyCode != 40 &&
        event.keyCode != 91 &&
        event.keyCode != 93 &&
        event.keyCode != 112 &&
        event.keyCode != 113 &&
        event.keyCode != 114 &&
        event.keyCode != 115 &&
        event.keyCode != 116 &&
        event.keyCode != 117 &&
        event.keyCode != 118 &&
        event.keyCode != 119 &&
        event.keyCode != 120 &&
        event.keyCode != 121 &&
        event.keyCode != 122 &&
        event.keyCode != 123
      ) {
        //if key doesnt equal to tab, shift, ctrl, alt/option, command keys(91/93), caps lock, left/top/down/right arrow keys, escape, f1 to f12
        if (this.counter == 1) {
          this.tempPostBodyStore = `${this.post.body}`;
          this.counter = this.counter + 1;
        } else {
          this.formerPostBody = `${this.tempPostBodyStore}`;
          this.tempPostBodyStore = `${this.post.body}`;
        }
      }
    },
    resetInputTextBody() {
      if (
        this.post.body == "Body" ||
        this.post.title == "You must enter a post body."
      ) {
        this.post.body = "";
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
    //hide all elements about adding tags and show elements about editing post body and title
    editPost() {
      document.getElementById("tagFormatting").style.display = "none";
      document.getElementById("addTagInputBox").style.display = "none";
      document.getElementById("tagDisplaySection").style.display = "none";
      document.getElementById("finishAddingTagsButton").style.display = "none";
      document.getElementById("enterPostTitleBox").style.display = "block";
      document.getElementById("enterPostBody").style.display = "block";
      document.getElementById("uploadPhoto").style.display = "block";
      document.getElementById("publishPostButton").style.display = "block";
      this.tag = "Press Enter to Add a Tag";
    },
    uploadPhoto(event) {
      document.getElementById("uploadPhotoText").innerHTML =
        "Upload a Picture Here:";

      //get the file
      var file = event.target.files[0];

      //make sure the user doesn't try to upload repetitive files
      var repetitiveFiles = false;
      for (var k = 0; k < this.pictures.length; k++) {
        if (file.name == this.pictures[k].name) {
          repetitiveFiles = true;
          document.getElementById("uploadPhotoText").innerHTML =
            "Do not upload the same pictures.";
          k = this.pictures.length;
        }
      }

      //make sure user does not upload a file bigger than 2mb. 1mb=1048576(bytes)
      var fileTooBig = false;
      if (file.size > 2097152) {
        fileTooBig = true;
        document.getElementById("uploadPhotoText").innerHTML =
          "Do not upload a picture bigger than 2mb.";
      }

      //only continue to perform the function if the user has uploaded <3 file and
      //have no repetitive files and the file does not exceed limit size
      if (
        this.pictures.length < 3 &&
        repetitiveFiles == false &&
        fileTooBig == false
      ) {
        //storing the file; the file will be uploaded to firebase only if the user publishes the post
        this.pictures.push(file);
        var pictureNumber = String(this.pictures.length);

        //placing an anchor which will be replaced by the picture when shown in /post/postId
        var currentPostBody = `${this.post.body}`;
        var formerPostBody = `${this.formerPostBody}`;
        if (
          this.post.body == "Body" ||
          this.post.body == "" ||
          this.formerPostBody == "" ||
          currentPostBody == formerPostBody
        ) {
          this.post.body =
            this.post.body +
            " {{{Picture " +
            pictureNumber +
            " Will be Placed Here}}} ";
        } else {
          var loopLength;
          var string1 = "";
          var string2 = "";
          var repeatedLettersDetection = true;

          if (currentPostBody.length < formerPostBody.length) {
            loopLength = currentPostBody.length;
          } else {
            loopLength = formerPostBody.length;
          }

          for (var i = 1; i < loopLength + 1; i++) {
            if (
              currentPostBody.charAt(currentPostBody.length - i) !=
              formerPostBody.charAt(formerPostBody.length - i)
            ) {
              string1 = currentPostBody.slice(
                0,
                currentPostBody.length - i + 1
              );
              string2 = currentPostBody.slice(
                currentPostBody.length - i + 1,
                currentPostBody.length
              );
              i = loopLength + 1;
              for (var e = 0; e < string2.length - 1; e++) {
                if (string2[e] != string2[e + 1]) {
                  repeatedLettersDetection = false;
                  e = string2.length - 1;
                }
              }
              if (repeatedLettersDetection == true) {
                this.post.body =
                  this.post.body +
                  " {{{Picture " +
                  pictureNumber +
                  " Will be Placed Here}}} ";
              } else {
                this.post.body =
                  string1 +
                  " {{{Picture " +
                  pictureNumber +
                  " Will be Placed Here}}} " +
                  string2;
              }
            } else if (i == loopLength && string1 == "" && string2 == "") {//in the case that the user didn't enter any body
              this.post.body =
                this.post.body +
                " {{{Picture " +
                pictureNumber +
                " Will be Placed Here}}} ";
            }
          }
        }
      } else if (this.pictures.length == 3) {
        document.getElementById("uploadPhotoText").innerHTML =
          "You may only upload a max of 3 pictures.";
      }
    },

    //publishPost add a new post object to the posts array and the firebase database
    //In this new post object the title and body is entered by the user in .enterPostTitle and .enterPostBody
    publishPost() {
      //makes sure that the post actually contains a body and title
      if (
        (this.post.title == "" && this.post.body == "") ||
        (this.post.title == "You must enter a post title." &&
          this.post.body == "You must enter a post body.")
      ) {
        this.post.title = "You must enter a post title.";
        this.post.body = "You must enter a post body.";
      } else if (
        this.post.title == "" ||
        this.post.title == "You must enter a post title."
      ) {
        this.post.title = "You must enter a post title.";
      } else if (
        this.post.body == "" ||
        this.post.title == "You must enter a post body."
      ) {
        this.post.body = "You must enter a post body.";
      }
      //if post have title and body, publishes the post
      else {
        //instances of objects or this.XXX cannot be called in nested .then()s
        //and local variables have to be used in replacement
        var test = ""; //used for getting urls of pictures later
        var pictureUrls = []; //used for storing urls of pictures later
        var pictureAmount = this.pictures.length;
        var pictures = this.pictures;
        var Post = {
          id: 1,
          userId: "",
          timestamp: Date.now(),
          title: this.post.getTitle(),
          body: this.post.getBody(),
          tags: this.post.getTags(),
          comments: [],
          commenters: [],
          pictureUrls: [],
          pictureNames:[]
        };
        var user = {
          email: "",
          emailVerification: ""
        };

        if(pictureAmount!=0){
            for(var i=0;i<pictureAmount;i++){
                Post.pictureNames.push(this.pictures[i].name)
            }
        }

        switch (pictureAmount) {
          case 0:
            //to know what .then and .forEach does, read comments written in created(){ in App.vue
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
                    Post.userId = USER.id;
                    user.email = User.email;
                    user.emailVerification = User.emailVerification;
                  }
                });
              })
              .then(() => {
                firebaseDatabase
                  .collection("posts")
                  .add({
                    userId: Post.userId,
                    timestamp: parseInt(`${Post.timestamp}`, 10),
                    title: Post.title,
                    body: Post.body,
                    tags: Post.tags,
                    comments: [],
                    commenters: [],
                    pictureUrls: pictureUrls,
                    pictureNames: Post.pictureNames
                  })
                  .catch(err => {
                    console.log(err.message);
                  });

                //this part set the Post id to the auto generated id from firebase
                firebaseDatabase
                  .collection("posts")
                  .get()
                  .then(snapshot => {
                    //.then runs when firebaseDatabase.collection('posts').get() is complete
                    //snapshot is the state 'posts' is at when it is accessed from the database
                    snapshot.forEach(POST => {
                      //cycles through each post in 'posts'
                      let post = POST.data();
                      if (Post.timestamp == post.timestamp) {
                        Post.id = POST.id;
                      }
                    });
                  })
                  .then(() => {
                    //this part adds the id of the post to the database (firestore).
                    //under the user identity there is an field called userPosts of type array
                    //this array keeps an record of all posts the user posted
                    var userposts = [];
                    let Ref = firebaseDatabase
                      .collection("users")
                      .doc(Post.userId);
                    Ref.get()
                      .then(doc => {
                        let identity = doc.data();
                        userposts = identity.userPosts;
                      })
                      .then(() => {
                        userposts.push(Post.id);
                        firebaseDatabase
                          .collection("users")
                          .doc(Post.userId)
                          .set({
                            accountExistence: true,
                            email: user.email,
                            emailVerification: user.emailVerification,
                            userPosts: userposts
                          })
                          .then(() => {
                            location.reload();
                          });
                      });
                  });
              });
            break;
          case 1:
            //to know what .then and .forEach does, read comments written in created(){ in App.vue
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
                    Post.userId = USER.id;
                    user.email = User.email;
                    user.emailVerification = User.emailVerification;
                  }
                });
              })
              .then(() => {
                document.getElementById("publishPostButton").innerHTML="Publishing."
                console.log("there are " + pictureAmount + " pictures");
                console.log("uploading 1st picture " + pictures[0].name);
                var storageRef = storage.ref(pictures[0].name);
                storageRef
                  .put(pictures[0]) //upload photo 1 to firebase storage
                  .then(function(snapshot) {
                    var progress =
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(
                      "uploading of the 1st picture is " + progress + "% done"
                    );
                  })
                  .then(function() {
                    //get url of 1st pic
                    storageRef
                      .getDownloadURL()
                      .then(function(downloadURL) {
                        console.log("picture available at", downloadURL);
                        test = downloadURL;
                        document.getElementById("publishPostButton").innerHTML="Publishing.."
                      })
                      .then(() => {
                        pictureUrls.push(test);
                        Post.pictureUrls = pictureUrls;

                        firebaseDatabase
                          .collection("posts")
                          .add({
                            userId: Post.userId,
                            timestamp: parseInt(`${Post.timestamp}`, 10),
                            title: Post.title,
                            body: Post.body,
                            tags: Post.tags,
                            comments: [],
                            commenters: [],
                            pictureUrls: pictureUrls,
                            pictureNames: Post.pictureNames
                          })
                          .catch(err => {
                            console.log(err.message);
                          });
                        document.getElementById("publishPostButton").innerHTML="Publishing..."

                        //this part set the Post id to the auto generated id from firebase
                        firebaseDatabase
                          .collection("posts")
                          .get()
                          .then(snapshot => {
                            //.then runs when firebaseDatabase.collection('posts').get() is complete
                            //snapshot is the state 'posts' is at when it is accessed from the database
                            snapshot.forEach(POST => {
                              //cycles through each post in 'posts'
                              let post = POST.data();
                              if (Post.timestamp == post.timestamp) {
                                Post.id = POST.id;
                              }
                            });
                          })
                          .then(() => {
                            //this part adds the id of the post to the database (firestore).
                            //under the user identity there is an field called userPosts of type array
                            //this array keeps an record of all posts the user posted
                            var userposts = [];
                            let Ref = firebaseDatabase
                              .collection("users")
                              .doc(Post.userId);
                            Ref.get()
                              .then(doc => {
                                let identity = doc.data();
                                userposts = identity.userPosts;
                              })
                              .then(() => {
                                userposts.push(Post.id);
                                firebaseDatabase
                                  .collection("users")
                                  .doc(Post.userId)
                                  .set({
                                    accountExistence: true,
                                    email: user.email,
                                    emailVerification: user.emailVerification,
                                    userPosts: userposts
                                  })
                                  .then(() => {
                                    location.reload();
                                  });
                              });
                          });
                      });
                  });
              });

            break;
          case 2:
            //to know what .then and .forEach does, read comments written in created(){ in App.vue
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
                    Post.userId = USER.id;
                    user.email = User.email;
                    user.emailVerification = User.emailVerification;
                  }
                });
              })
              .then(() => {
                document.getElementById("publishPostButton").innerHTML="Publishing"
                console.log("there are " + pictureAmount + " pictures");
                console.log("uploading 1st picture " + pictures[0].name);
                var storageRef = storage.ref(pictures[0].name);
                storageRef
                  .put(pictures[0]) //upload photo 1 to firebase storage
                  .then(function(snapshot) {
                    var progress =
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(
                      "uploading of the 1st picture is " + progress + "% done"
                    );
                  })
                  .then(function() {
                    //get url of 1st pic
                    storageRef
                      .getDownloadURL()
                      .then(function(downloadURL) {
                        console.log("picture available at", downloadURL);
                        test = downloadURL;
                        document.getElementById("publishPostButton").innerHTML="Publishing."
                      })
                      .then(() => {
                        pictureUrls.push(test);
                        console.log(
                          "uploading 2nd picture " + pictures[1].name
                        );
                        var storageRef = storage.ref(pictures[1].name);
                        storageRef
                          .put(pictures[1]) //upload 2nd photo to storage
                          .then(function(snapshot) {
                            var progress =
                              (snapshot.bytesTransferred /
                                snapshot.totalBytes) *
                              100;
                            console.log(
                              "uploading of the 2nd picture is " +
                                progress +
                                "% done"
                            );
                          })
                          .then(function() {
                            //get url of 2nd pic
                            storageRef
                              .getDownloadURL()
                              .then(function(downloadURL) {
                                console.log(
                                  "picture available at",
                                  downloadURL
                                );
                                test = downloadURL;
                                document.getElementById("publishPostButton").innerHTML="Publishing.."
                              })
                              .then(() => {
                                pictureUrls.push(test);

                                Post.pictureUrls = pictureUrls;

                                firebaseDatabase
                                  .collection("posts")
                                  .add({
                                    userId: Post.userId,
                                    timestamp: parseInt(
                                      `${Post.timestamp}`,
                                      10
                                    ),
                                    title: Post.title,
                                    body: Post.body,
                                    tags: Post.tags,
                                    comments: [],
                                    commenters: [],
                                    pictureUrls: pictureUrls,
                                    pictureNames: Post.pictureNames
                                  })
                                  .catch(err => {
                                    console.log(err.message);
                                  });
                                document.getElementById("publishPostButton").innerHTML="Publishing..."
                                //this part set the Post id to the auto generated id from firebase
                                firebaseDatabase
                                  .collection("posts")
                                  .get()
                                  .then(snapshot => {
                                    //.then runs when firebaseDatabase.collection('posts').get() is complete
                                    //snapshot is the state 'posts' is at when it is accessed from the database
                                    snapshot.forEach(POST => {
                                      //cycles through each post in 'posts'
                                      let post = POST.data();
                                      if (Post.timestamp == post.timestamp) {
                                        Post.id = POST.id;
                                      }
                                    });
                                  })
                                  .then(() => {
                                    //this part adds the id of the post to the database (firestore).
                                    //under the user identity there is an field called userPosts of type array
                                    //this array keeps an record of all posts the user posted
                                    var userposts = [];
                                    let Ref = firebaseDatabase
                                      .collection("users")
                                      .doc(Post.userId);
                                    Ref.get()
                                      .then(doc => {
                                        let identity = doc.data();
                                        userposts = identity.userPosts;
                                      })
                                      .then(() => {
                                        userposts.push(Post.id);
                                        firebaseDatabase
                                          .collection("users")
                                          .doc(Post.userId)
                                          .set({
                                            accountExistence: true,
                                            email: user.email,
                                            emailVerification:
                                              user.emailVerification,
                                            userPosts: userposts
                                          })
                                          .then(() => {
                                            location.reload();
                                          });
                                      });
                                  });
                              });
                          });
                      });
                  });
              });
            break;
          case 3:
            //gets the identity from the firestore
            //to know what .then and .forEach does, read comments written in created(){ in App.vue
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
                    Post.userId = USER.id;
                    user.email = User.email;
                    user.emailVerification = User.emailVerification;
                  }
                });
              })
              .then(() => {
                document.getElementById("publishPostButton").innerHTML="Publishing"
                console.log("there are " + pictureAmount + " pictures");
                console.log("uploading 1st picture " + pictures[0].name);
                var storageRef = storage.ref(pictures[0].name);
                storageRef
                  .put(pictures[0]) //upload photo 1 to firebase storage
                  .then(function(snapshot) {
                    var progress =
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(
                      "uploading of the 1st picture is " + progress + "% done"
                    );
                  })
                  .then(function() {
                    //get url of 1st pic
                    storageRef
                      .getDownloadURL()
                      .then(function(downloadURL) {
                        console.log("picture available at", downloadURL);
                        test = downloadURL;
                        document.getElementById("publishPostButton").innerHTML="Publishing."
                      })
                      .then(() => {
                        pictureUrls.push(test);
                        console.log(
                          "uploading 2nd picture " + pictures[1].name
                        );
                        var storageRef = storage.ref(pictures[1].name);
                        storageRef
                          .put(pictures[1]) //upload 2nd photo to storage
                          .then(function(snapshot) {
                            var progress =
                              (snapshot.bytesTransferred /
                                snapshot.totalBytes) *
                              100;
                            console.log(
                              "uploading of the 2nd picture is " +
                                progress +
                                "% done"
                            );
                          })
                          .then(function() {
                            //get url of 2nd pic
                            storageRef
                              .getDownloadURL()
                              .then(function(downloadURL) {
                                console.log(
                                  "picture available at",
                                  downloadURL
                                );
                                test = downloadURL;
                                document.getElementById("publishPostButton").innerHTML="Publishing.."
                              })
                              .then(() => {
                                pictureUrls.push(test);
                                console.log(
                                  "uploading 3rd picture " + pictures[2].name
                                );
                                var storageRef = storage.ref(pictures[2].name);
                                storageRef
                                  .put(pictures[2]) //upload 3rd photo to storage
                                  .then(function(snapshot) {
                                    var progress =
                                      (snapshot.bytesTransferred /
                                        snapshot.totalBytes) *
                                      100;
                                    console.log(
                                      "uploading of the 3rd picture is " +
                                        progress +
                                        "% done"
                                    );
                                  })
                                  .then(function() {
                                    //get url of 3rd pic
                                    storageRef
                                      .getDownloadURL()
                                      .then(function(downloadURL) {
                                        console.log(
                                          "picture available at",
                                          downloadURL
                                        );
                                        test = downloadURL;
                                        document.getElementById("publishPostButton").innerHTML="Publishing..."
                                      })
                                      .then(() => {
                                        pictureUrls.push(test);
                                        console.log(pictureUrls);
                                        Post.pictureUrls = pictureUrls;

                                        firebaseDatabase
                                          .collection("posts")
                                          .add({
                                            userId: Post.userId,
                                            timestamp: parseInt(
                                              `${Post.timestamp}`,
                                              10
                                            ),
                                            title: Post.title,
                                            body: Post.body,
                                            tags: Post.tags,
                                            comments: [],
                                            commenters: [],
                                            pictureUrls: pictureUrls,
                                            pictureNames: Post.pictureNames
                                          })
                                          .catch(err => {
                                            console.log(err.message);
                                          });

                                        //this part set the Post id to the auto generated id from firebase
                                        firebaseDatabase
                                          .collection("posts")
                                          .get()
                                          .then(snapshot => {
                                            //.then runs when firebaseDatabase.collection('posts').get() is complete
                                            //snapshot is the state 'posts' is at when it is accessed from the database
                                            snapshot.forEach(POST => {
                                              //cycles through each post in 'posts'
                                              let post = POST.data();
                                              if (
                                                Post.timestamp == post.timestamp
                                              ) {
                                                Post.id = POST.id;
                                              }
                                            });
                                          })
                                          .then(() => {
                                            //this part adds the id of the post to the database (firestore).
                                            //under the user identity there is an field called userPosts of type array
                                            //this array keeps an record of all posts the user posted
                                            var userposts = [];
                                            let Ref = firebaseDatabase
                                              .collection("users")
                                              .doc(Post.userId);
                                            Ref.get()
                                              .then(doc => {
                                                let identity = doc.data();
                                                userposts = identity.userPosts;
                                              })
                                              .then(() => {
                                                userposts.push(Post.id);
                                                firebaseDatabase
                                                  .collection("users")
                                                  .doc(Post.userId)
                                                  .set({
                                                    accountExistence: true,
                                                    email: user.email,
                                                    emailVerification:
                                                      user.emailVerification,
                                                    userPosts: userposts
                                                  })
                                                  .then(() => {
                                                    location.reload();
                                                  });
                                              });
                                          });
                                      });
                                  });
                              });
                          });
                      });
                  });
              });
            break;
        }
      }
    },

    //basically shows the Show Older Posts button only under certain conditions so it doesn't mess up formatting
    showSOPButton() {
      var SearchedPosts = this.posts.filter(post => {
        var postsLength = this.posts.length;
        var postTagExistence = false;

        for (var i = 0; i < post.tags.length; i++) {
          //sentinel loop
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
      if (this.posts.length > this.showPostUpperBound) {
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
  computed: {
    //returns post searched
    filteredPosts() {
      var searchedPosts = this.posts.filter(post => {
        var postsLength = this.posts.length;
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
  },

  //lifecycle hooks
  beforeCreate() {},
  created() {},
  beforeUpdate() {}
};
</script>

<style scoped>
.posts {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  -ms-overflow-style: none;  /* hide scroll bar for IE and Edge */
  scrollbar-width: none;  /* hide scroll bar for Firefox */
  font-family: Roboto, "Open Sans", "Helvetica Neue";
}
/* Hide scrollbar for Chrome, Safari and Opera */
.posts::-webkit-scrollbar {
  display: none;
}

.searchText {
  font-size: 135%;
  font-weight: bold;
  margin-top: 10%;
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

.postSection a {
  text-decoration: none;
}

.innerPostSection {
  width: 100%;
  height: 100%;
  color: white;
  border-style: solid;
  border-color: white;
  z-index: 1;
}
.innerPostSection:hover {
  animation-name: changeColor;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.postTitle {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 50ch;
  margin-left: 3%;
  margin-right: 3%;
  font-family: "Helvetica", Roboto, "Open Sans";
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
  font-family: "Open Sans", "Helvetica", Roboto;
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

.addPostLogo {
  background-color: #34dddd;
  width: 5%;
  height: 8%;
  z-index: 1;
  position: fixed;
  right: 1%;
  bottom: 2%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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
  word-wrap: break-word;
  color: white;
  z-index: 5;
  text-align: center;
  border-style: solid;
  border-color: white;
  border-radius: 30px;
}

.tagDisplay:hover {
  animation-name: TagChangeColor;
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
    box-shadow: 0px 0px 40px 6px #0ff;
  }
}

@keyframes TagChangeColor {
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

#uploadPhoto {
  position: fixed;
  top: 10.8%;
}

#uploadPhotoText {
  margin-top: 0%;
  margin-bottom: 0%;
  margin-left:1.5%;
  font-size: 90%;
}

#uploadPhotoButton {
  display: block;
  margin-left:1.5%;
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

#publishPostButton {
  width: 8%;
  height: 4%;
  position: fixed;
  right: 14.5%;
  bottom: 2%;
  display: none;
  z-index: 6;
  border: 1px solid white;
  background-color: black;
  color: white;
}

#publishPostButton:hover {
  border: 1.2px solid cyan;
  color: cyan;
}

</style>