<template>
  <el-main class="main-container">
    <el-scrollbar>
      <!-- 电影推荐 -->
      <el-row class="movie-container">
        <el-col :span="24">
          <h2>电影推荐</h2>
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

const wsUrl = import.meta.env.VITE_RECOMMAND_WS_URL;
let websocket: WebSocket | null = null;
const connectionStatus = ref('Disconnected');
const message = ref('');

function initWebSocket() {
  websocket = new WebSocket(wsUrl);

  websocket.onopen = () => {
    ElNotification({
      title: 'ws连接成功',
      message: 'ws连接成功',
      type: 'success',
    });
    connectionStatus.value = 'Connected';
  };

  websocket.onmessage = (event) => {
    message.value = event.data;
  };

  websocket.onerror = (error) => {
    ElNotification({
      title: 'ws连接中断',
      message: 'ws连接中断，正在尝试重新连接:' + error,
      type: 'error',
    });
    initWebSocket();
  };

  websocket.onclose = () => {
    connectionStatus.value = 'Disconnected';
    console.log('WebSocket connection closed.');
  };
}

interface App {
  id: number;
  name: string;
  description: string;
}

interface Music {
  id: number;
  title: string;
  url: string;
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
      musics.value = res.data;
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
      console.log(movies.value);
    });
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  initWebSocket();
  getMovieRecommend();
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
  background-color: lightgray;
}

.movie-container {
  width: 100%;
  text-align: center;
  background-color: white;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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
  min-height: 500px;
  min-width: 300px;
  padding: 20px;
}

.image-container {
  width: 100%; /* 设置容器宽度 */
  display: flex;
  justify-content: center; /* 图片水平居中 */
}

.movie-poster {
  width: auto;
  max-width: 100%; /* 避免图片超出容器 */
  max-height: 300px; /* 限制图片最大高度 */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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
</style>
