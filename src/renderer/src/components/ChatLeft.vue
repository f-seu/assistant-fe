<template>

    <el-scrollbar class="chat-list-container">
        <ul class="chat-list">
            <el-row v-for="item in chatList.items.value" :key="item.name" class="chat-list-item"
                @click="chatList.handleItemClick(item)">
                {{ item.name }}
            </el-row>
        </ul>
    </el-scrollbar>
    <el-row class="pagination-container">
        <el-pagination small layout="prev, pager, next" :total="chatList.total.value" :page-size="10"
            :current-page="chatList.currentPage.value" @current-change="chatList.handlePageChange" />
    </el-row>

</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { chatListAPI, chatNumAPI, getMessageAPI } from "@renderer/request/api";

interface ChatItemData {
    id: number;
    name: string;
}
class ChatList {
    pageSize = ref(10);
    currentPage = ref(1);
    total = ref(0); // 假设总共有100条数据
    items = ref<ChatItemData[]>([

    ]);
    loadTotal = () => {
        chatNumAPI()
            .then((res) => {
                this.total.value = res.data['data'];
            })
            .catch((err) => {
                alert("请求消息总数失败：" + err.message);
            });
    };
    load = () => {
        chatListAPI(
            (this.currentPage.value - 1) * this.pageSize.value,
            this.currentPage.value * this.pageSize.value,
        )
            .then((res) => {
                this.items.value = res.data['data'];
                console.log(this.items.value)
            })
            .catch((err) => {
                alert("请求消息列表失败：" + err.message);
            });
    };
    handleItemClick = (item) => {
        getMessageAPI(item.id)
            .then((res) => {
                message.messages.value = res.data['data'];
            })
            .catch((err) => {
                alert("请求消息失败：" + err.message);
            });
    };
    handlePageChange = (page) => {
        this.currentPage.value = page;
        this.load();
    };
}
const chatList = new ChatList();

onMounted(() => {
    chatList.loadTotal();
    chatList.load();
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

.message-list-container {
    height: 70vh;
    overflow: auto;
    padding: 10px;
}

.input-container {
    padding: 10px;
    height: 30vh;
}

.pagination-container {
    display: flex;
    justify-content: center;
    width: 100%;
}

.message-list {
    padding: 0;
    margin: 0;
    list-style: none;
    width: 100%;
}
</style>
