<template>
  <div class="profile">
    <div id="happy_birthday_text">Happy</div>
    <div id="happy_birthday_text2">Birthday</div>
    <img v-if="daniels_profile()" id="daniel_kushaan" alt="" src="@/assets/DanielZFLiu_Kushaan3.jpg"/>
    <div id="computer_screen" @click="next_dialogue">
      <img v-if="profileExist()" id="profilePic1" alt="" :src="return_source()"/>
      <div id="chat_box"><p id="chat_dialogue">{{chat_dialogue}}</p></div>
    </div>
    <!-- id caret is a shadow div of id terminal, they contain the exact same elements
    with exact same css properties; except that the caret div displays █ as the fake caret -->
    <div id="caret">
      <p id="caretPos">{{terminal_non_edittable_text}}</p>
      <textarea 
        id="caretPos2" 
        data-gramm_editor="false" 
        spellcheck="false" 
        v-model="terminal_caret_position"></textarea> 
    </div>
    <div id="terminal" @click="click" @scroll="scroll">
      <p class="terminal_non_edittable">{{terminal_non_edittable_text}}</p>
      <textarea 
        id="terminal_input" 
        @keyup="key_up" 
        @keydown="key_down"
        @mousedown="mouseDown"
        @mouseup="mouseUp"
        @input="input"
        data-gramm_editor="false" 
        spellcheck="false" 
        v-model="terminal_initial_value"></textarea> 
        <!-- oninput='this.style.height = ""; this.style.height = this.scrollHeight + "px"'></textarea>  -->
        <!-- resets the height of this text area to its scroll height everytime an input is entered -->
    </div>
  </div>
</template>

<script>
import Firebase from "@/firebase/init";
import firebase from "firebase";

var firebaseDatabase = Firebase.firestore();

export default {
  name: "Profile",
  props: ["posts", "login"],

  data() {
    return {
      //id object is now equal to the id in route
      id: this.$route.params.id,
      source: "",
      source_ending: ".png",
      terminal_initial_value: ">",
      terminal_non_edittable_text: "",
      terminal_caret_position: ">",
      mouse_down: true,
      original_pos: -1,


      chat_dialogue: "",
      current_command: "",
      counter: 0,
      time_out_functions: [],
      dialogue_number: 0,
      hb_kushaan: [["If you are watching this, how are you doing Kush? Long time no see.", "2.png"],
      ["We've known each other for like, what, 3 years?", "2.png"],  
      ["I think I first really started talking to you in the Fujian CAS trip in grade 10.", "_Kushaan.jpg"], 
      ["We shared the same dorm for a night, and you told me shit about the your life in Canada. Tim Hortans and timmies and timbits or something, I had a fever and was barely alive when I listened to you, so I don't remember all the details.", "2.png"], 
      ["And then in the summer of grade 11, we went to the same summer camp. We were the only two grade 11s there, so naturally we got to know each other much better.", "2.png"], 
      ["My god, you were lazy in camp. Wait your parents shouldn't see this. (Let's just say that I would jokingly describe you with two words: netflix and reddit)", "2.png"], 
      ["Those were great memories; Ethiopean food, political debates, those trash talks, and me carrying you in coding projects....................................... I'm kidding.", "_Kushaan2.jpg"], 
      ["Speaking of which, its almost your birthday. You are officially 18, big man.", "2.png"],
      ["Happy birthday Kush. I wish you good luck in Waterloo studying finance and computing. Visit me one day if able. I'm right here in downtown toronto waiting for your visit.", "2.png"], ]
      //We've known each other for like, what, 3 years? 
      //I think I first really started talking to you in the Fujian CAS trip in grade 10. 
      //We shared the same dorm for a night, and you told me shit about the your life in Canada. Tim Hortans and timmies and timbits or something, I had a fever and was barely alive when I listened to you, so I don't remember all the details.
      //And then in the summer of grade 11, we went to the same summer camp. We were the only two grade 11s there, so naturally we got to know each other much better.
      //My god, you were lazy in camp. Wait your parents shouldn't see this. (Let's just say that I would jokingly describe you with two words: netflix and reddit)
      //Those were great memories; Ethiopean food, political debates, me carrying you in coding projects, and those trash talks....... I'm kidding.
      //Speaking of which, its almost your birthday.
      //Happy birthday Kush. I wish you good luck in Waterloo studying finance and computing. Visit me one day if able. I'm right here in downtown toronto.

    };
  },

  methods: {
    daniels_profile(){
      if(this.id == "DanielZFLiu"){
        return true
      }
      else{
        return false
      }
    },

    next_dialogue(){
      var computer_screen = document.getElementById("computer_screen")
      var profile_pic_1 = document.getElementById("profilePic1")
      if(this.chat_dialogue == ""){
        var start_line = "Hi, this is Daniel."
        this.print_dialogue(start_line)

        //so transition between different image have no delay
        profile_pic_1.style.transition = "none"
      }
      else if(this.current_command == "happy birthday kushaan"){
        //clear all time out functions
        for (var i=0; i<this.time_out_functions.length; i++) {
          clearTimeout(this.time_out_functions[i]);
        }
        this.time_out_functions = []

        //print the next dialogue
        if(this.dialogue_number < this.hb_kushaan.length){
          this.source_ending = this.hb_kushaan[this.dialogue_number][1]
          this.print_dialogue(this.hb_kushaan[this.dialogue_number][0])
          this.dialogue_number += 1
        }

        else if(this.dialogue_number == this.hb_kushaan.length){
          computer_screen.style.transition = "width 1000ms linear, background-color 500ms linear"
          computer_screen.style.backgroundColor = "black"

          profile_pic_1.style.opacity = "0%"

          this.dialogue_number += 1
        }

        else if(this.dialogue_number == this.hb_kushaan.length+1){
          computer_screen.style.transition = "width 1000ms linear, opacity 500ms linear, background-color 500ms linear, margin-top 500ms linear"
          computer_screen.style.marginTop = "17%"

          this.chat_dialogue = "Happy birthday."
          this.dialogue_number += 1
        }

        else if(this.dialogue_number == this.hb_kushaan.length+2){
          var happy = document.getElementById("happy_birthday_text")
          var birthday = document.getElementById("happy_birthday_text2")
          var photo = document.getElementById("daniel_kushaan")
          happy.style.display = "block"
          birthday.style.display = "block"
          photo.style.display = "block"
          setTimeout(()=>{
            photo.style.opacity = "100%"
          },500)
          setTimeout(()=>{
            happy.style.marginLeft = "37.85%"
          },2000)
          setTimeout(()=>{
            birthday.style.marginLeft = "34.25%"
          },3000)
          setTimeout(()=>{
            happy.style.transition = "all 1000ms ease-in"
            happy.style.marginLeft = "100%"
          },6000)
          setTimeout(()=>{
            birthday.style.transition = "all 1000ms ease-in"
            birthday.style.marginLeft = "-32%"
          },7000)
          setTimeout(()=>{
            photo.style.opacity = "0%"
          },9000)
          setTimeout(()=>{
            happy.style.display = "none"
            birthday.style.display = "none"
            photo.style.display = "none"
          },10000)


          this.dialogue_number += 1
        }

        else{
          computer_screen.style.opacity = "0%"
          computer_screen.style.marginTop = "2%"

          this.chat_dialogue = ""
          this.source_ending = ".png"

          var terminal = document.getElementById("terminal")
          var caret = document.getElementById("caret")
          terminal.style.display = "block"
          caret.style.display = "block"

          profile_pic_1.style.transition = "opacity 700ms linear"
        }
      }
    },

    print_dialogue(line){
      //print out a dialogue line one character at a time
      this.counter = 0
      this.chat_dialogue = ""
      for (var i=0; i<line.length; i+=1){
        var time = (i+1)*50
        this.time_out_functions.push(
          setTimeout(()=>{
            this.chat_dialogue = `${this.chat_dialogue}`+line.charAt(this.counter)
            this.counter += 1
          }, time)
        )
      }
    },

    profileExist(){
      if (this.id == "DanielZFLiu"){
        this.source = "DanielZFLiu"
        return true
      }
      else{
        return false
      }
    },

    return_source(path){
      return require('@/assets/' + this.source + this.source_ending)
    },

    add_class_to_element(id, className) { 
      //add a class to an element
      var element, name, arr;
      element = document.getElementById(id);
      name = className;
      arr = element.className.split(" ");
      if (arr.indexOf(name) == -1) {
        element.className += " " + name;
      }
    },

    scroll(){
      //sync scroll position of the two divs with id caret and id terminal
      document.getElementById("caret").scrollTop = document.getElementById("terminal").scrollTop; 
    },

    key_up(event){
      if (event.key == "Enter"){
        //ensures that the terminal logs what the user entered
        if(this.terminal_non_edittable_text.charAt(this.terminal_non_edittable_text.length-1)!="\n" && this.terminal_non_edittable_text != ""){
          this.terminal_non_edittable_text = `${this.terminal_non_edittable_text}`.concat("\n", document.getElementById("terminal_input").value)
        }
        else{
          this.terminal_non_edittable_text = `${this.terminal_non_edittable_text}`.concat(document.getElementById("terminal_input").value)
        }

        //list of commands
        if (this.terminal_initial_value == ">/help\n"){
          this.current_command = "help"
          this.help()
        }
        else if(this.terminal_initial_value == ">/speak\n"){
          this.current_command = "speak"
          this.speak()
        }
        else if(this.terminal_initial_value == ">/Happy Birthday Kushaan\n" && this.current_command == "speak"){
          this.current_command = "happy birthday kushaan"
          var terminal = document.getElementById("terminal")
          var caret = document.getElementById("caret")
          terminal.style.display = "none"
          caret.style.display = "none"
          terminal.style.top = "15%"
          caret.style.top = "15%"
        }

        //ensures that each time user press enter, the new line starts with >
        this.terminal_initial_value = ">"
        this.terminal_caret_position = ">"
        document.getElementById("terminal_input").style.height = "18%"
        document.getElementById("caretPos2").style.height = "18%"

      }
      else if(event.key == "Backspace"){
        //update the height of the input when text are deleted in the input area
        document.getElementById("terminal_input").style.height = document.getElementById("terminal_input").scrollHeight
        document.getElementById("caretPos2").style.height = document.getElementById("terminal_input").scrollHeight

        //fake caret positioning
        this.terminal_caret_position = `${this.terminal_initial_value}`
          //if user tries to delete text when the real caret position is at the end of the input text, add the fake caret █ to the end of the text.
        if(event.target.selectionStart == this.terminal_initial_value.length){
          this.terminal_caret_position = this.terminal_caret_position.concat("█")
        }
          //move the fake caret back to the original location of the real caret
        else if(this.mouse_down == true){
          this.terminal_caret_position = this.setCharAt(`${this.terminal_caret_position}`, this.original_pos, "█")
        }
          //move the fake caret to the current location of the real caret
        else{
          this.terminal_caret_position = this.setCharAt(`${this.terminal_caret_position}`, event.target.selectionStart, "█")
        }
      }

      //update the position of the fake caret to the position real caret when the real caret is moved by right&left arrow keys
      if(event.key == "ArrowLeft"){
        this.terminal_caret_position = `${this.terminal_initial_value}`
        this.terminal_caret_position = this.setCharAt(`${this.terminal_caret_position}`, event.target.selectionStart, "█")
      }
      else if(event.key == "ArrowRight"){
        this.terminal_caret_position = `${this.terminal_initial_value}`
        if(event.target.selectionStart != this.terminal_initial_value.length){
          this.terminal_caret_position = this.setCharAt(`${this.terminal_caret_position}`, event.target.selectionStart, "█")
        }
        else{
          this.terminal_caret_position = this.terminal_caret_position.concat("█")
        }
      }

      //make the fake caret not blink when the user is typing(css animation delayed for 1 sec)
      else{
        setTimeout(function(){ 
          document.getElementById("caret").style.animationIterationCount = "infinite"
        }, 1000);
      }
    },

    //string in javascript are immutable, so to change the char at a certain index
    //i need to use: str.substring(0,index) + chr + str.substring(index+1)
    setCharAt(str, index, chr) {
      if(index > str.length-1) return str;
      //█ is wider than a character, under that assumption that if i use str.substring(0,index) + chr + str.substring(index+1)
      //the shadow div with id caret and div with id terminal will not align in terms of text. 
      //test it out to see what i mean
      return str.substring(0,index) + chr; 
    },

    key_down(event){
      document.getElementById("caret").style.animationIterationCount = "0"
      document.getElementById("caret").scrollTop = document.getElementById("terminal").scrollTop;

      //prevents the user from deleting >
      if(event.target.selectionStart == 1 && event.key == "Backspace"){ 
        event.preventDefault()
      }
      //prevents the user from moving the real caret to somewhere before >
      else if(event.key == "ArrowLeft" && event.target.selectionStart == 1){
        event.preventDefault()
      }
      //prevent using the mouse to temporarily move the real caret and then trying to backspace or type
      else if(this.mouse_down == true){ 
        event.preventDefault()
      }
      //prevent the user from typing when the real caret is placed before >
      else if(event.target.selectionStart == 0 && event.key!="ArrowRight"){
        event.preventDefault()
      }
    },
    
    click(){
      //prevents moving the real caret through mouse click
      document.getElementById("terminal_input").selectionStart = this.original_pos
      document.getElementById("terminal_input").selectionEnd = this.original_pos
    },

    mouseDown(){
      this.mouse_down = true

      //make sure the 2 divs (Terminal and caret) can have the same text contained/shown
      this.terminal_caret_position = `${this.terminal_initial_value}`
      //record down the current position of the real caret
      this.original_pos = event.target.selectionStart
      if(this.original_pos==-1){
        this.original_pos = this.terminal_initial_value.length
      }
    },

    mouseUp(){
      this.mouse_down = false

      //place the fake caret at the original position of the real caret
      if(this.original_pos == this.terminal_initial_value.length){
        this.terminal_caret_position = this.terminal_caret_position.concat("█")
      }
      else{
        this.terminal_caret_position = this.setCharAt(`${this.terminal_caret_position}`, this.original_pos, "█")
      }
    },

    input(){
      //resizing the textarea box as the user input anything
      document.getElementById("terminal_input").style.height = ""; 
      document.getElementById("terminal_input").style.height = document.getElementById("terminal_input").scrollHeight + "px"
      document.getElementById("caretPos2").style.height = ""; 
      document.getElementById("caretPos2").style.height = document.getElementById("terminal_input").scrollHeight + "px"

      //make sure the 2 divs (Terminal and caret) can have the same text contained/shown
      this.terminal_caret_position = `${this.terminal_initial_value}`

      //place the fake caret at the original position of the real caret
      if(event.target.selectionStart == this.terminal_initial_value.length){
        this.terminal_caret_position = this.terminal_caret_position.concat("█")//▮
      }
      else{
        this.terminal_caret_position = this.setCharAt(`${this.terminal_caret_position}`, event.target.selectionStart, "█")
      }
    },

    help(){
      var commands = "/ls: Print the current document. \n/speak: Daniel will say something.\n"
      this.terminal_non_edittable_text = `${this.terminal_non_edittable_text}`.concat(commands)
    },

    speak(){
      var terminal = document.getElementById("terminal")
      terminal.style.top = "67%"
      terminal.style.height = "26.6%"

      var caret = document.getElementById("caret")
      caret.style.top = "67%"
      caret.style.height = "26.6%"

      setTimeout(()=> {
        var computer_screen = document.getElementById("computer_screen")
        computer_screen.style.opacity = "100%"
        computer_screen.style.width = "50%"
      }, 600)

      setTimeout(()=> {
        var chat_box = document.getElementById("chat_box")
        chat_box.style.opacity = "100%"
      }, 1600)

      setTimeout(()=> {
        var profile_pic_1 = document.getElementById("profilePic1")
        profile_pic_1.style.opacity = "100%"
      }, 2100)
    }

  },

  mounted(){ 
    //elements can only be located by id at the mounted life cycle (and after)
    if (this.id == "DanielZFLiu"){
      this.add_class_to_element("profilePic1", "DanielZFLiu_ProfilePic1")
    }
  }
};
</script>

<style scoped>
.profile {
  width: 100%;
  height: 100%;
  font-family: Roboto, "Open Sans", "Helvetica Neue";
}

#happy_birthday_text{
  position: relative;
  z-index: 1000;

  font-size: 1000%;
  color:rgb(124, 253, 253);
  width: 24.3%;

  display: none;
  margin-left: -37.85%;
  /* -37.85%; */
  /* 100%; */
  /* 37.85%; */
  margin-top:7%;
  
  transition: all 2000ms ease-out;
}

#happy_birthday_text2{
  position: relative;
  z-index: 1000;

  font-size: 1000%;
  color:rgb(124, 253, 253);
  width: 31.5%;

  display: none;
  margin-left: 100%;
  /* 100%; */
  /* 34.25%; */
  /* -32%; */

  transition: all 2000ms ease-out;
}

#daniel_kushaan{
  position: absolute;
  width:25%;
  left: 37%;
  top: 3%;
  display: none;
  opacity: 0%;
  transition: opacity 1000ms linear;
}

#computer_screen{
  background-color: rgb(19, 17, 17);
  width:0%;
  height:60%;
  margin-left:25%;
  margin-top:2%;
  opacity:0%;
  transition: width 1000ms linear;
}

#profilePic1 {
  display:block;
  transition: opacity 700ms linear;
  transform: rotate(0deg) scale(1.0, 1.0);
}

.DanielZFLiu_ProfilePic1{
  padding-top: 0.4%;
  margin-left:9%;
  display:block;
  opacity: 0%;
  width:70%;
}

#chat_box{
  opacity:0%;
  width:99.35%;
  height:31%;
  background-color: black;
  border: solid 3px rgb(19, 17, 17);
  transition: opacity 200ms linear;
}

#chat_dialogue{
  margin-left:2%;
  width:96%;
  height:75%;
  
  overflow-y:hidden;

  word-wrap: break-word; /* break word into 2nd line if word is too long */
  white-space: pre-wrap; /* treats /n in text like going to the next line */
}

#caret{
  display:block;
  position: absolute;
  left:25%;
  top:15%;
  height:70%;
  width:50%;

  border:none;
  overflow-y: scroll;
  overflow-x: hidden;
  -ms-overflow-style: none;  /* IE and Edge hide scrollbar*/ 
  scrollbar-width: none;  /* Firefox hide scrollbar*/

  opacity:50%;
  animation-name: blink;
  animation-duration: 1.3s;
  animation-iteration-count: infinite;

  transition: top 500ms linear, height 500ms linear;
}

@keyframes blink {
  0%   {opacity:50%;}
  30% {opacity:50%;}
  35% {opacity:0%;}
  60%  {opacity:0%;}
  65% {opacity:50%;}
  100% {opacity:50%;}
}

#caret::-webkit-scrollbar {
  display: none;
}

#caretPos{
  position: relative;
  margin-top:0%;
  margin-bottom:0%;
  margin: none;
  padding:0%;
  width:100%;

  font-size: 150%;
  font-family: 'Courier New', Courier, monospace;
  color:gray;

  word-wrap: break-word; /* break word into 2nd line if word is too long */
  white-space: pre-wrap; /* treats /n in text like going to the next line */
}

#caretPos2{
  position: relative;
  margin-left:0%;
  padding:0%;
  height:17%;
  width:100%;

  overflow: hidden;
  resize: none;

  border: none;
  outline: none;
  background-color: transparent;

  font-size: 150%;
  font-family: 'Courier New', Courier, monospace;
  color:gray;
  caret-color: gray;
}

#terminal{
  display:block;
  position: absolute;
  left:25%;
  top:15%;
  height:70%;
  width:50%;

  border:none;
  overflow-y: scroll;
  overflow-x: hidden;
  -ms-overflow-style: none;  /* IE and Edge hide scrollbar*/ 
  scrollbar-width: none;  /* Firefox hide scrollbar*/

  transition: top 500ms linear, height 500ms linear;
}

#terminal::-webkit-scrollbar {
  display: none;
}

.terminal_non_edittable{
  position: relative;
  margin-top:0%;
  margin-bottom:0%;
  padding:0%;
  width:100%;

  font-size: 150%;
  font-family: 'Courier New', Courier, monospace;
  color:gray;

  word-wrap: break-word; /* break word into 2nd line if word is too long */
  white-space: pre-wrap; /* treats /n in text like going to the next line */

  margin: none;
}


#terminal_input{
  position: relative;
  margin-left:0%;
  padding:0%;
  height:17%;
  width:100%;

  overflow: hidden;
  resize: none;

  border: none;
  outline: none;
  background-color: transparent;

  font-size: 150%;
  font-family: 'Courier New', Courier, monospace;
  color:gray;
  caret-color: transparent;
}

</style>