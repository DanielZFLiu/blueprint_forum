<!--
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
Set-ExecutionPolicy -Scope CurrentUser Restricted-->
<template>
  <div class="city" @keypress="key_press">
    <div class="light">
    </div>
    <div id="background"></div>
    <div id="building1"></div>
    <div id="building2"></div>
    <div id="building3"></div>
    <div id="building4">
      <div id="building4_window1" @click="building4_window2_change" @mouseleave="building4_window2_change_end" @mouseenter="building4_change">
        <div class="building4_window_bridge1"></div>
        <div class="building4_window_bridge2"></div>
        <div class="building4_left_bridge"></div>
        <div class="building4_right_bridge"></div>
      </div>
      <div id="building4_bridge"></div>
      <div id="building4_window2">
        <div class="building4_window_bridge1"></div>
        <div class="building4_window_bridge2"></div>
      </div>
    </div>
    <div class="building5"></div>
    <div class="building9"></div>
    <div class="building7"></div>
    <div class="building6"></div>
    <div id="building8"></div>
  </div>
</template>

<script>
import Firebase from "@/firebase/init";
import firebase from "firebase";

var firebaseDatabase = Firebase.firestore();

export default {
  name: "City",
  props: ["posts", "login"],

  data() {
    return {
      counter: 0,
      windows: 
      [
        [
          ["width", "height", "left", "top", "border", "background-color"],
          ["border", "background-color", "box-shadow", "transition"],
          ["width", "height", "margin-left", "background-color", "display"],
          ["width", "height", "margin-top", "background-color", "display"]
        ],
        [
          ["14%", "20%", "10%", "5%", "3px solid black", "background-color: rgb(24, 24, 24)"],
          ["3px solid black", "#fff", "0 0 60px 30px #fff, 0 0 100px 60px #f0f, 0 0 140px 90px #0ff", "all 300ms ease-in"],
          ["7%", "100%", "46.5%", "black", "block"],
          ["100%", "7%", "-51%", "black", "block"]
        ],
      ]
    };
  },

  methods: {
    building4_window2_change(){
      if (this.counter == 0){
        this.counter = 1

        var element = document.getElementById("building4_bridge")
        element.style.transitionDelay = "0ms"
        element.style.width = "20%"
        element.style.opacity = "50%"

        setTimeout(function(){ 
          var element2 = document.getElementById("building4_window2");
          element2.style.backgroundPosition = "left bottom"
          element2.style.boxShadow = "0 0 10px 2px rgb(122, 248, 248)";  
        }, 250); //run the code after 250ms

        setTimeout(() => { 
          this.$router.push({ name: 'Profile', params: { id: 'DanielZFLiu' } }) //vuejs specific; redirects to /Profile/DanielZFLiu
        }, 1300)
        
      }
    },

    building4_window2_change_end(){
      if (this.counter == 1){
        console.log("u geh")
        this.counter = 0

        var element = document.getElementById("building4_window1")
        element.style.transitionDelay = "1500ms"

        var element2 = document.getElementById("building4_window2");
        element2.style.backgroundPosition = "right bottom"
        element2.style.boxShadow = "none"; 

        var element3 = document.getElementById("building4_bridge")
        element3.style.transitionDelay = "1s"
        element3.style.width = "0%"
        element3.style.opacity = "0%"

        setTimeout(function(){ 
          var element2 = document.getElementById("building4_window2");
          element.style.transitionDelay = "200ms"
        }, 1510);
      }

      // setTimeout(function(){ 
      //   var background = document.getElementById("background")
      //   console.log(background)
      //   background.style.opacity = "0%"

      //   var building1 = document.getElementById("building1")
      //   building1.style.backgroundImage = "none"

      //   var building3 = document.getElementById("building3")
      //   building3.style.backgroundImage = "none"

      //   var building4 = document.getElementById("building4")
      //   building4.style.backgroundImage = "none"

      //   var building8 = document.getElementById("building8")
      //   building8.style.backgroundImage = "none"
      // }, 200);
    },

    building4_change(){
      var background = document.getElementById("background")
      console.log(background)
      background.style.opacity = "100%"

      var building1 = document.getElementById("building1")
      building1.style.backgroundImage = "linear-gradient(180deg,black, rgb(20, 20, 20), rgb(34, 37, 37), rgb(54, 60, 61), rgb(69, 104, 104), rgb(35, 214, 214))"

      var building3 = document.getElementById("building3")
      building3.style.backgroundImage = "linear-gradient(180deg,black, rgb(38, 42, 42), rgb(77, 105, 105),rgb(42, 219, 219))"

      var building4 = document.getElementById("building4")
      building4.style.backgroundImage = "linear-gradient(180deg,black, rgb(74, 95, 95), rgb(57, 230, 230))"

      var building8 = document.getElementById("building8")
      building8.style.backgroundImage = "linear-gradient(180deg,black, rgb(34, 39, 39), rgb(60, 73, 73), rgb(76, 95, 98), rgb(78, 141, 141), rgb(28, 202, 202))"
    },

    key_press(){
      console.log("hello")
    }
  }

};
</script>

<style scoped>
.light {
  position: relative;
  height: 300px;
  width: 300px;
  display: inline-block;
  margin-top: 20px;
}

.light img {/*Image inside*/
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.light:before {/*creates the bulb*/
  content: "";
  position: absolute;
  bottom: 100%;/*places above image*/
  left: 50%;
  height: 20px;
  width: 100px;
  border-radius: 50%;
  background: lightgray;
  transform: translateX(-50%);/*places in center of image*/
  z-index: 10;/*places in front of image*/
  border: 2px solid dimgray;/*borders add 3D effect to bulb*/
  border-bottom: none;
  border-top: 5px solid #222;
}

.light:after {/*creates the beam*/
  content: "";
  position: absolute;
  transition: all 0.4s;
  height: 0;
  width: 100px;
  top: -10px;
  left: 50%;
  transform: translateX(-50%) perspective(400px) rotateX(45deg);/*centers, makes as trapezium*/
  transform-origin: top center;
  background: linear-gradient(0deg, transparent, rgba(255, 255, 255, 0.8));/*adds fading light*/
  z-index: 5;/*places in front of image, but behind bulb*/
}

.light:hover:after {/*demo only, add this to .light:after in production*/
  height: 80%;
}

.city {
  width: 100%;
  height: 100%;
  font-family: Roboto, "Open Sans", "Helvetica Neue";
}

#background{
  width: 140%;
  height: 0%;
  top: 100%;
  left: -20%;
  position: fixed;
  box-shadow:
    0 0 200px 100px cyan;
  opacity: 0%;
  z-index: 4;
  transition: all 500ms ease-out
}

#building1{
  width: 10%;
  height: 75%;
  top: 25%;
  left: 5%;
  position: fixed;
  background-color: rgb(20, 20, 20);
  background-image: linear-gradient(180deg,rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20)); 
  /* linear-gradient(180deg,black, rgb(20, 20, 20), rgb(34, 37, 37), rgb(54, 60, 61), rgb(69, 104, 104), rgb(35, 214, 214)); */
  border: solid 1px black;
  z-index: 5;
  /* animation-name: building1_animation;
  animation-duration: 1.3s;
  animation-delay: 0s;
  animation-fill-mode: forwards;
  animation-iteration-count: 0; */
}

/* @keyframes building1_animation{
  5%{
    background-image: linear-gradient(180deg,rgb(19, 19, 19), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(22.8, 23.4, 23.4));
  }
  10%{
    background-image: linear-gradient(180deg,rgb(18, 18, 18), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(25.6, 26.8, 26.8));
  }
  15%{
    background-image: linear-gradient(180deg,rgb(17, 17, 17), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(28.4, 30.2, 30.2));
  }
  20%{
    background-image: linear-gradient(180deg,rgb(16, 16, 16), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(31.2, 33.6, 33.6));
  }

  25%{
    background-image: linear-gradient(180deg,rgb(15, 15, 15), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(34, 37, 37));
  }

  30%{
    background-image: linear-gradient(180deg,rgb(14, 14, 14), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(22.8, 23.4, 23.4), rgb(38, 41.6, 41.8));
  }
  35%{
    background-image: linear-gradient(180deg,rgb(13, 13, 13), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(25.6, 26.8, 26.8), rgb(42, 46.2, 46.6));
  }
  40%{
    background-image: linear-gradient(180deg,rgb(12, 12, 12), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(28.4, 30.2, 30.2), rgb(46, 50.8, 51.4));
  }
  45%{
    background-image: linear-gradient(180deg,rgb(11, 11, 11), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(31.2, 33.6, 33.6), rgb(50, 55.4, 56.2));
  }

  50%{
    background-image: linear-gradient(180deg,rgb(10, 10, 10), rgb(20, 20, 20), rgb(20, 20, 20), rgb(20, 20, 20), rgb(34, 37, 37), rgb(54, 60, 61));
  }

  55%{
    background-image: linear-gradient(180deg,rgb(9, 9, 9), rgb(20, 20, 20), rgb(20, 20, 20), rgb(22.8, 23.4, 23.4), rgb(38, 41.6, 41.8), rgb(57, 68.8, 69.6));
  }
  60%{
    background-image: linear-gradient(180deg,rgb(8, 8, 8), rgb(20, 20, 20), rgb(20, 20, 20), rgb(25.6, 26.8, 26.8), rgb(42, 46.2, 46.6), rgb(60, 77.6, 78.2));
  }
  65%{
    background-image: linear-gradient(180deg,rgb(7, 7, 7), rgb(20, 20, 20), rgb(20, 20, 20), rgb(28.4, 30.2, 30.2), rgb(46, 50.8, 51.4), rgb(63, 86.4, 86.8));
  }
  70%{
    background-image: linear-gradient(180deg,rgb(7, 7, 7), rgb(20, 20, 20), rgb(20, 20, 20), rgb(31.2, 33.6, 33.6), rgb(50, 55.4, 56.2), rgb(66, 95.2, 95.4));
  }

  75%{
    background-image: linear-gradient(180deg,rgb(5, 5, 5), rgb(20, 20, 20), rgb(20, 20, 20), rgb(34, 37, 37), rgb(54, 60, 61), rgb(69, 104, 104));
  }

  80%{
    background-image: linear-gradient(180deg,rgb(4, 4, 4), rgb(20, 20, 20), rgb(22.8, 23.4, 23.4), rgb(38, 41.6, 41.8), rgb(57, 68.8, 69.6), rgb(62.2, 126, 126));
  }
  85%{
    background-image: linear-gradient(180deg,rgb(3, 3, 3), rgb(20, 20, 20), rgb(25.6, 26.8, 26.8), rgb(42, 46.2, 46.6), rgb(60, 77.6, 78.2), rgb(55.4, 148, 148));
  }
  90%{
    background-image: linear-gradient(180deg,rgb(2, 2, 2), rgb(20, 20, 20), rgb(28.4, 30.2, 30.2), rgb(46, 50.8, 51.4), rgb(63, 86.4, 86.8), rgb(48.6, 170, 170));
  }
  95%{
    background-image: linear-gradient(180deg,rgb(1, 1, 1), rgb(20, 20, 20), rgb(31.2, 33.6, 33.6), rgb(50, 55.4, 56.2), rgb(66, 95.2, 95.4), rgb(41.8, 192, 192));
  }

  100%{
    background-image: linear-gradient(180deg,black, rgb(20, 20, 20), rgb(34, 37, 37), rgb(54, 60, 61), rgb(69, 104, 104), rgb(35, 214, 214));
  }
} */

#building2{
  width: 27%;
  height: 100%;
  top: 0%;
  left: 10%;
  position: fixed;
  background-color: rgb(20, 20, 20);
  background-image: none;
  /* linear-gradient(180deg,black, rgb(37, 37, 37), rgb(180, 180, 180)); */
  border: solid 1px black;
  z-index: 3;
}

#building3{
  width: 17%;
  height: 40%;
  top: 60%;
  left: 30%;
  position: fixed;
  background-color: rgb(20, 20, 20);
  background-image: none;
  /* linear-gradient(180deg,black, rgb(38, 42, 42), rgb(77, 105, 105),rgb(42, 219, 219)); */
  border: solid 1px black;
  z-index: 5;
}

#building4{
  width: 15%;
  height: 25%;
  top: 75%;
  left: 40%;
  position: fixed;
  background-color: rgb(20, 20, 20);
  background-image: none;
  /* linear-gradient(180deg,black, rgb(74, 95, 95), rgb(57, 230, 230)); */
  border: solid 1px black;
  z-index: 5;
}

.building5{
  width: 14%;
  height: 87%;
  top: 13%;
  left: 43%;
  position: fixed;
  background-color: rgb(20, 20, 20);
  background-image: none;
  /* linear-gradient(180deg,black, rgb(37, 37, 37), rgb(180, 180, 180)); */
  border: solid 1px black;
  z-index: 3;
}

.building6{
  width: 18%;
  height: 60%;
  top: 40%;
  left: 50%;
  position: fixed;
  background-color: rgb(20, 20, 20);
  background-image: none;
  /* linear-gradient(180deg,black, rgb(29, 29, 29), rgb(94, 94, 94), rgb(153, 151, 151), rgb(216, 216, 216)); */
  border: solid 1px black;
  z-index: 3;
}

.building7{
  width: 23%;
  height: 95%;
  top: 5%;
  left: 62%;
  position: fixed;
  background-color: rgb(20, 20, 20);
  background-image: none;
  /* linear-gradient(180deg,black, rgb(37, 37, 37), rgb(180, 180, 180)); */
  border: solid 1px black;
  z-index: 3;
}

#building8{
  width: 8%;
  height: 50%;
  top: 50%;
  left: 81.5%;
  position: fixed;
  background-color: rgb(20, 20, 20);
  background-image: none;
  /* linear-gradient(180deg,black, rgb(34, 39, 39), rgb(60, 73, 73), rgb(76, 95, 98), rgb(78, 141, 141), rgb(28, 202, 202)); */
  border: solid 1px black;
  z-index: 5;
}

.building9{
  width: 12%;
  height: 79%;
  top: 21%;
  left: 83%;
  position: fixed;
  background-color: rgb(20, 20, 20);
  background-image: none;
  /* linear-gradient(180deg,black, rgb(37, 37, 37), rgb(180, 180, 180)); */
  border: solid 0.5px black;
  z-index: 3;
}


#building4_window1{
  width: 18%;
  height: 24%;
  margin-left: 18%;
  margin-top: 14.9%;
  border: 2px solid black;
  background-color: rgb(34, 34, 34);

  float: left;
  clear: none;
  cursor: pointer;
  transition: all 500ms ease-out;
  transition-delay: 200ms;

  
}

#building4_window1:hover{
  width: 18%;
  height: 24%;
  margin-left: 18%;
  margin-top: 14.9%;
  border: 2px solid black;
  background-color: rgb(122, 248, 248);
  box-shadow:
    0 0 10px 2px rgb(122, 248, 248); 
  transition: all 500ms ease-out;
  /* transition-delay: 2.2s;
  animation-name: building1_window_anime;
  animation-duration: 3s;
  animation-fill-mode: forwards; */
}

@keyframes building1_window_anime {
  0% {
    background-color: rgb(24, 24, 24);
  }

  3% {
    background-color: #fff;
  }

  6% {
    background-color: rgb(24, 24, 24);
  }

  30%{
    background-color: rgb(24, 24, 24);
  }

  31%{
    background-color: #fff;
  }

  32% {
    background-color: rgb(24, 24, 24);
  }

  37%{
    background-color: #fff;
  }

  42% {
    background-color: rgb(24, 24, 24);
  }

  70%{
    background-color: rgb(24, 24, 24);
  }

  100% {
    background-color: #fff;
  }
}

#building4_window2{
  width: 18%;
  height: 24%;
  margin-left: 62%;
  margin-top: -20.5%;
  border: 2px solid black;
  background: linear-gradient(to left, rgb(34, 34, 34) 50%, rgb(122, 248, 248) 50%);
  background-size: 300% 100%;
  background-position:right bottom;
  box-shadow: none; 
  transition:all 1s linear;
  float: left;
  clear: none;
}

.building4_window_bridge1{
  width: 3.5%;
  height: 100%;
  margin-left: 48%;
  background-color: black;
  display: block;
}

.building4_window_bridge2{
  width: 100%;
  height: 3.5%;
  margin-top: -55%;
  background-color: black;
  display: block;
}


#building4_bridge{
  transition: all 400ms linear;
  transition-delay: 1000ms;
  width:0%;
  height:0%;
  margin-top:25%;
  margin-left:40%;
  box-shadow:
    0 0 4px 4px rgb(138, 255, 255); 
  opacity: 0%;
}
/* 
.building4_left_bridge{
  transition: box-shadow 500ms linear, opacity 500ms linear, transform 500ms linear, width 500ms linear, transform 500ms linear;
  width:0%;
  height:0%;
  margin-top: -30%;
  margin-left:-108%;
  box-shadow:
    0 0 4px 4px rgb(138, 255, 255); 
  opacity: 0%;
  transform: rotate(27deg);
}

.building4 > .building4_window1:hover > .building4_left_bridge{
  transition: box-shadow 500ms linear, opacity 500ms linear, transform 500ms linear, width 500ms linear, transform 500ms linear;
  transition-delay: 450ms;
  width:85%;
  height:0%;
  margin-top: -30%;
  margin-left:-100%;
  box-shadow:
    0 0 4px 4px rgb(138, 255, 255); 
  opacity: 50%;
  transform: rotate(20deg);
}

.building4_right_bridge{
  transition: box-shadow 500ms linear, opacity 500ms linear, transform 500ms linear, width 500ms linear, transform 500ms linear;
  width:0%;
  height:0%;
  margin-top: -30%;
  margin-left:356%;
  box-shadow:
    0 0 4px 4px rgb(138, 255, 255); 
  opacity: 0%;
  transform: rotate(140deg);
}

.building4 > .building4_window1:hover > .building4_right_bridge{
  transition: box-shadow 500ms linear, opacity 500ms linear, transform 500ms linear, width 500ms linear, transform 500ms linear;
  transition-delay: 1900ms;
  width:90%;
  height:0%;
  margin-top: -30%;
  margin-left:359%;
  box-shadow:
    0 0 4px 4px rgb(138, 255, 255); 
  opacity: 50%;
  transform: rotate(160deg);
} */



</style>
