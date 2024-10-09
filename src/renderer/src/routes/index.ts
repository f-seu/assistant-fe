/*
  Copyright (c) 2024, Li Yaning,Zu Yuankun/Southeast University
  Licensed under the GPL3 License (see LICENSE file for details) 
*/
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
  {
    // /search/screens -> /search?q=screens
    path: '/',
    redirect: () => {
      // 方法接收目标路由作为参数
      // return 重定向的字符串路径/路径对象
      return { path: '/chat' }
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@pages/Home.vue')
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@pages/Chat.vue')
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('@pages/Calendar.vue')
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: () => import('@pages/Recommend.vue')
  }
]
// 路由
const router = createRouter({
  history: createWebHistory(),
  routes
})
// 导出
export default router
