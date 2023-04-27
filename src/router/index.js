import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Reset from '@/components/Reset'
import LeafletDemo from '@/views/LeafletDemo'
import Test from '@/views/Test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LeafletDemo',
      component: LeafletDemo
    },
    {
      path: '/LeafletDemo',
      name: 'LeafletDemo',
      component: LeafletDemo
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Reset',
      name: 'Reset',
      component: Reset
    },
    {
      path: '/Test',
      name: 'Test',
      component: Test
    }
  ]
})
