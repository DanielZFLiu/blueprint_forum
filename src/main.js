// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

//filters off parts of a post body that is >50 characters and linebreaks when shown in .postSection
Vue.filter('filter1', val => {
  if(!val || typeof(val) != 'string'){
    return '';
  } 

  else if(val.length>500){
    val = val.slice(0,500)
    var lastChar = val.slice(-1)
    while (lastChar == ' '){
      val = val.slice(0,val.length-1)
      lastChar = val.slice(-1)
    }

    val=val.replace(/Will be Placed Here}}}/g, "") 
    val=val.replace(/{{{Picture 1/g, "")
    val=val.replace(/{{{Picture 2/g, "") 
    val=val.replace(/{{{Picture 3/g, "") 
    return val+'...'
  }
  else{
    val=val.replace(/Will be Placed Here}}}/g, "") 
    val=val.replace(/{{{Picture 1/g, "")
    val=val.replace(/{{{Picture 2/g, "") 
    val=val.replace(/{{{Picture 3/g, "") 
    return val
  }
})

let app = null;

//wait for firebase authentication to initialize before creating the app
firebase.auth().onAuthStateChanged(() =>{
  //initialize app if not already created
  if(!app){
    app = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  }
})


