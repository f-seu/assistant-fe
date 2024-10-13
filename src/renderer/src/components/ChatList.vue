<!-- 
  Copyright (c) 2024, Li Yaning,Zu Yuankun/Southeast University
  Licensed under the GPL3 License (see LICENSE file for details) 
-->

<template>
  <el-col :span="6" class="chat-list-col">
    <el-row class="new-chat-container">
      <el-button type="primary" @click="newChat">新建</el-button>
      <el-button type="primary" @click="loadAll">刷新</el-button>
    </el-row>
    <el-scrollbar class="chat-list-container">
      <ul class="chat-list">
        <el-row v-for="item in chatItems" :key="item.id" class="chat-list-item" @click="handleItemClick(item)">
          <el-row class="title-row">
            <el-col :span="22">
              <el-tooltip :content="item.name" placement="top">
                {{ truncatedName(item.name) }}
              </el-tooltip>
            </el-col>
            <el-col :span="2">
              <el-button class="delete-button" @click.stop="deleteChat(item.id)">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </el-col>
          </el-row>
          <el-row class="foot-row">
            <el-col :span="8" class="message_num">{{ item.message_num }}条消息</el-col>
            <el-col :span="16" class="create_at">{{ formatDateTime(item.created_at) }}</el-col>
          </el-row>
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
import { ref, onMounted } from "vue";
import { chatListAPI, chatNumAPI, deleteChatAPI } from "@renderer/request/api";
import { useChatStore } from '@store/chat';
import { storeToRefs } from "pinia";
import { ElNotification } from 'element-plus'

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
const deleteChat = (chatId: number) => {
  if (confirm("确定要删除这条聊天吗？")) {
    deleteChatAPI(chatId)
      .then(() => {
        ElNotification({
          title: '删除成功',
          message: '删除成功',
          type: 'success',
        })
        loadChatList(); // 重新加载聊天列表
        selectedChatId.value = 0;
      })
      .catch((err) => {
        ElNotification({
          title: '删除失败',
          message: '删除失败，请稍后再试:' + err,
          type: 'error',
        })
      });
  }
};
const truncatedName = (name: string) => {
  if (name.length > 10) {
    return name.slice(0,10) + '...';
  }
  return name;
};

const loadAll = () => {
  loadTotal();
  loadChatList();
};
onMounted(() => {
  loadAll();
});
const formatDateTime = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}
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
  max-height: 85vh;
  padding: 0;
  margin: 0;
  list-style: none;
  overflow: auto;
}

.new-chat-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 5vh;
}

.pagination-container {
  display: flex;
  justify-content: center;
}

.chat-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.chat-list-item {
  display: flex;
  height: 65px;
  background: var(--el-color-primary-light-9);
  align-items: center;
  justify-content: center;
  margin: 5px;
  color: var(--el-color-primary);
  cursor: pointer;
  border-radius: 10px;
  padding: 3px;
}

.delete-button {
  margin-left: auto;
  /* 保持图标按钮在右侧 */
  color: #f56c6c;
  /* 红色图标 */
  border: none;
  /* 无边框 */
  background: transparent !important;
  /* 重要：设置背景透明 */
  padding: 0;
  /* 去除内边距 */
}

.delete-button:hover {
  background: rgba(245, 108, 108, 0.1) !important;
  /* 悬停时轻微显示红色背景 */
}

.delete-button:focus {
  outline: none;
  /* 移除焦点时的轮廓线 */
  background: transparent !important;
  /* 确保焦点状态下背景透明 */
}

.foot-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.create_at {
  color: #666;
  text-align: right;
  font-size: 13px;
}

.message_num {
  color: #666;
  text-align: left;
  font-size: 13px;
}
.title-row {
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>