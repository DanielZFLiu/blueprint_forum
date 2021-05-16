import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Posts from '@/components/Posts'
import Post from '@/components/Post'
import Signup from '@/components/Signup'
import EditDeletePost from '@/components/EditDeletePost'
import City from '@/components/City'
import Profile from '@/components/Profile'


Vue.use(Router)

//the router names and path
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/posts',
      name: 'Posts',
      component: Posts
    },
    {
      path: '/post/:id',
      name: 'Post',
      component: Post
    },
    {
      path: '/editDeletePost',
      name: 'EditDeletePost',
      component: EditDeletePost
    },
    {
      path: '/signupLogin',
      name: 'SignupLogin',
      component: Signup
    },
    {
      path: '/city',
      name: 'City',
      component: City
    },
    {
      path: '/profile/:id',
      name: 'Profile',
      component: Profile
    },
  ]
})
