<template>
  <el-col :span="6" class="chat-list-col">
    <el-row class="new-chat-container">
      <el-button type="primary" @click="newChat">新建</el-button>
    </el-row>
    <el-scrollbar class="chat-list-container">
      <ul class="chat-list">
        <el-row v-for="item in chatItems" :key="item.id" class="chat-list-item" @click="handleItemClick(item)">
          {{ truncatedName(item.name) }}
        </el-row>
      </ul>
    </el-scrollbar>
    <el-row class="pagination-container">
      <el-pagination small layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page="currentPage"
        @current-change="handlePageChange" />
    </el-row>
  </el-col>
</template>

<script setup lang="ts">
import { ref, onMounted} from "vue";
import { chatListAPI, chatNumAPI } from "@renderer/request/api";
import { useChatStore } from '@store/chat';
import { storeToRefs } from "pinia";

const store = useChatStore();
const { chatItems, selectedChatId } = storeToRefs(store);

const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

const loadTotal = () => {
  chatNumAPI()
    .then((res) => {
      total.value = res.data['data'];
    })
    .catch((err) => {
      alert("请求消息总数失败：" + err.message);
    });
};

const loadChatList = () => {
  chatListAPI(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  )
    .then((res) => {
      chatItems.value = res.data['data'];
    })
    .catch((err) => {
      alert("请求消息列表失败：" + err.message);
    });
};

const handleItemClick = (selectedItem) => {
  selectedChatId.value = selectedItem.id;
};

const handlePageChange = (page) => {
  currentPage.value = page;
  loadChatList();
};

const newChat = () => {
  selectedChatId.value = 0;
};
const truncatedName = (name: string) => {
  if (name.length > 10) {
    return name.slice(0, 10) + '...';
  }
  return name;
};
onMounted(() => {
  loadTotal();
  loadChatList();
});
</script>

<style>
.chat-list-col {
  height: 100vh;
  padding: 0;
  margin: 0;
  list-style: none;
  overflow: auto;
  border-right: 1px solid #ccc;
  text-align: center;
}

.chat-list-container {
  height: 90vh;
  padding: 0;
  margin: 0;
  list-style: none;
  overflow: auto;
}

.chat-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.chat-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
  cursor: pointer;
}
</style>