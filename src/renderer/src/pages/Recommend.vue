<!-- 
  Copyright (c) 2024, Li Yaning,Zu Yuankun/Southeast University
  Licensed under the GPL3 License (see LICENSE file for details) 
-->


<template>
  <el-main class="main-container">
    <el-scrollbar>
      <el-row class="app-container">
        <h2>应用推荐</h2>
        <h3 class="update-time">更新于 {{ appUpdateAt }}</h3>
        <el-row class="content-row">
          <el-col v-for="app in apps" :key="app.id" :span="10" class="app-col">
            <img v-if="appNameToIcon[app.name]" :src="getIconPath(app.name)" :alt="app.name" class="app-icon"
              @click="openApp(app.exec_command)" />
            <div>{{ app.name }}</div>
            <div>{{ app.reason }}</div>
          </el-col>
        </el-row>
      </el-row>
      <el-row class="music-container">
        <el-col :span="24">
          <h2>音乐推荐</h2>
          <h3 class="update-time">更新于 {{ musicUpdateAt }}</h3>
          <div class="carousel-wrapper">
            <el-carousel :autoplay="false" arrow="always">
              <el-carousel-item v-for="item in musics" :key="item.id" class="carousel-item">
                <div class="image-container">
                  <a :href="item.url" target="_blank"><img :src="item.poster" class="movie-poster"></a>
                </div>
                <div class="text-container">
                  <h3 class="movie-title">{{ item.title }}</h3>
                  <h4 class="movie-reason">{{ item.reason }}</h4>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
      </el-row>
      <!-- 电影推荐 -->
      <el-row class="movie-container">
        <el-col :span="24">
          <h2>电影推荐</h2>
          <h3 class="update-time">更新于 {{ movieUpdateAt }}</h3>
          <div class="carousel-wrapper">
            <el-carousel :autoplay="false" arrow="always" height="500px">
              <el-carousel-item v-for="item in movies" :key="item.id" class="carousel-item">
                <div class="image-container">
                  <a :href="item.url" target="_blank"><img :src="item.poster" class="movie-poster"></a>
                </div>
                <div class="text-container">
                  <h3 class="movie-title">{{ item.title }}</h3>
                  <h4 class="movie-reason">{{ item.reason }}</h4>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
      </el-row>
    
    </el-scrollbar>
  </el-main>
</template>


<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getRecommendAPI } from '@renderer/request/api';
import { ElNotification } from 'element-plus'

const wsUrl = import.meta.env.VITE_WS_BASE_URL + "/recommend";
let websocket: WebSocket | null = null;
const connectionStatus = ref('Disconnected');
const appUpdateAt = ref('');
const movieUpdateAt = ref('');
const musicUpdateAt = ref('');

import qqIcon from '../assets/app-icons/qq.png';
import feishuIcon from '../assets/app-icons/feishu.png';
import vscodeIcon from '../assets/app-icons/vscode.png';
import chromeIcon from '../assets/app-icons/chrome.png'
import wechatIcon from '../assets/app-icons/wechat.png'
import notebookIcon from '../assets/app-icons/notebook.png'

const appNameToIcon = {
  'qq': qqIcon,
  '飞书': feishuIcon,
  'vscode': vscodeIcon,
  '谷歌浏览器': chromeIcon,
  '微信': wechatIcon,
  '便利贴': notebookIcon,
}


const getIconPath = (appName) => {
  const icon = appNameToIcon[appName];
  return icon;
};

let isReconnecting = false;  // Flag to prevent multiple reconnections

function initWebSocket() {
  if (websocket && websocket.readyState !== WebSocket.CLOSED) {
    websocket.close();
  }

  websocket = new WebSocket(wsUrl);

  websocket.onopen = () => {
    ElNotification({
      title: 'ws连接成功',
      message: 'ws连接成功',
      type: 'success',
    });
    connectionStatus.value = 'Connected';
    isReconnecting = false;  // Reset reconnection flag on successful connection
  };

  websocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    apps.value = data.content;
    appUpdateAt.value = formatTime(data.create_at);
  };

  websocket.onerror = (error) => {
    ElNotification({
      title: 'ws连接中断',
      message: 'ws连接中断，正在尝试重新连接:' + error,
      type: 'error',
    });
    handleReconnect();  // Trigger reconnection logic
  };

  websocket.onclose = () => {
    connectionStatus.value = 'Disconnected';
    console.log('WebSocket connection closed.');
    handleReconnect();  // Trigger reconnection logic
  };
}

function handleReconnect() {
  if (!isReconnecting) {  // Only attempt reconnect if not already reconnecting
    isReconnecting = true;
    setTimeout(() => {
      initWebSocket();  // Attempt to reconnect after delay
    }, 2000);
  }
}


const openApp = (execCommand) => {
  console.log("run command in Recommend.vue", execCommand);
  const [command, ...args] = execCommand.split(' ');
  window.electronAPI.runCommand(command, args);
};
interface App {
  id: number;
  name: string;
  reason: string;
  exec_command: string;
  path: string;
  icon: string;
}

interface Music {
  id: number;
  title: string;
  poster: string;
  url: string;
  reason: string;
}

interface Movie {
  id: number;
  title: string;
  poster: string;
  url: string;
  reason: string;
}

const apps = ref<App[]>([]);
const musics = ref<Music[]>([]);
const movies = ref<Movie[]>([]);

const getMusicRecommend = async () => {
  try {
    getRecommendAPI('music').then(res => {
      const code = res.data['code'];
      const msg = res.data['msg'];
      if (code !== 0) {
        ElNotification({
          title: '获取音乐推荐失败',
          message: msg,
          type: 'error',
        });
        return;
      }
      musics.value = res.data['data']['content'];
      musicUpdateAt.value = formatTime(res.data['data']['create_at']);
    });
  } catch (error) {
    console.error(error);
  }
};

const getMovieRecommend = async () => {
  try {
    getRecommendAPI('movie').then(res => {
      const code = res.data['code'];
      const msg = res.data['msg'];
      if (code !== 0) {
        ElNotification({
          title: '获取电影推荐失败',
          message: msg,
          type: 'error',
        });
        return;
      }
      movies.value = res.data['data']['content'];
      movieUpdateAt.value = formatTime(res.data['data']['create_at']);
    });
  } catch (error) {
    console.error(error);
  }
};
const formatTime = (isoString) => {
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
onMounted(() => {
  initWebSocket();
  getMovieRecommend();
  getMusicRecommend();
});

onUnmounted(() => {
  if (websocket) {
    websocket.close();
  }
});
</script>

<style scoped>
.main-container {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  background-color: rgb(255, 255, 255);
}

.app-container {
  width: 100%;
  text-align: center;
  background-color: rgb(239, 236, 236);
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.update-time {
  font-size: 14px;
  color: #666;
}

.content-row {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.app-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
}

.app-icon {
  height: 50px;
  margin: 10px;
}

.movie-container {
  margin-top: 20px;
  width: 100%;
  text-align: center;
  background-color: rgb(239, 236, 236);
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.music-container {
  margin-top: 20px;
  width: 100%;
  text-align: center;
  background-color: rgb(239, 236, 236);
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.carousel-wrapper {
  width: 100%;
  box-sizing: border-box;
}

.el-carousel {
  width: 100%;
}

.carousel-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 300px;
}

.image-container {
  display: flex;
  justify-content: center;
}

.movie-poster {
  width: auto;
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.text-container {
  margin-top: 20px;
  text-align: center;
}

.movie-title {
  font-size: 24px;
  margin: 10px 0;
}

.movie-reason {
  font-size: 18px;
  color: #666;
  margin: 10px 0;
}

.app-icon {
  height: 50px;
  margin: 10px;
}
</style>
