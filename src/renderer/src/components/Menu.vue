<!-- 
  Copyright (c) 2024, Li Yaning,Zu Yuankun/Southeast University
  Licensed under the GPL3 License (see LICENSE file for details) 
-->
<template>
  <div class="menu">
    <div class="menu-item" :class="{ 'is-active': currentRoute === '/home' }" @click="navigateTo('/home')"  >
      <div  >
          <HomeIcon :class="{ 'is-active-icon': currentRoute === '/home','deactive-icon':currentRoute!='/home' }"  />
      </div>
      <h3>
        主页
      </h3>
    </div>
    <div class="menu-item" :class="{ 'is-active': currentRoute === '/chat' }" @click="navigateTo('/chat')">
      <div>
          <ChatIcon   :class="{ 'is-active-icon': currentRoute === '/chat','deactive-icon':currentRoute!='/chat'  }"   />
      </div>
      <h3>
        聊天
      </h3>
    </div>
    <div class="menu-item" :class="{ 'is-active': currentRoute === '/calendar' }" @click="navigateTo('/calendar')">
      <div >
          <CalendarIcon   :class="{ 'is-active-icon': currentRoute === '/calendar','deactive-icon':currentRoute!='/calendar'  }" />
      </div>
      <h3>
       日程
      </h3>
    </div>
    <div class="menu-item" :class="{ 'is-active': currentRoute === '/recommend' }" @click="navigateTo('/recommend')">
      <div >
          <RecommendIcon  :class="{ 'is-active-icon': currentRoute === '/recommend','deactive-icon':currentRoute!='/recommend'  }" />
      </div>
      <h3>
        推荐
      </h3>
    </div>
  </div>


</template>


<script lang="ts" setup>
import { useRouter } from 'vue-router'

import HomeIcon from '@assets/icons/home.svg'
import ChatIcon from '@assets/icons/chat.svg'
import CalendarIcon from '@assets/icons/calendar.svg'
import RecommendIcon from '@assets/icons/recommend.svg'

import { ref } from 'vue';

const currentRoute = ref("/home")

const router = useRouter();

function navigateTo(route) {
  router.push(route);
  currentRoute.value = route;
}
</script>

<style scoped>
.menu {
  min-height: 100vh;
  /* padding-top: 20vh; */
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #f0f0f0;
  background-color: #e4e9efa9;
  border-radius: 50px;
}

.deactive-icon{
  width: 25px;
  height: 25px;
  fill:#aca6a6
}


.is-active-icon{
  width: 25px;
  height: 25px;
  fill:#ffffff;
}
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

.menu-item {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 95%;

}
.is-active {
  background-color: #409eff;
  color: white;
  border-radius: 10px;
}

</style>
