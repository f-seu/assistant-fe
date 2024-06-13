<template>
    <el-row>
        <el-col :span="6" class="chat-list-col">
            <el-scrollbar class="chat-list-container">
                <ul class="chat-list">
                    <el-row v-for="item in chatList.items.value" :key="item.name" class="chat-list-item"
                        @click="chatList.handleItemClick(item)">
                        {{ item.desc }}
                    </el-row>
                </ul>
            </el-scrollbar>
            <el-row class="pagination-container">
                <el-pagination small layout="prev, pager, next" :total="chatList.items.value.length"
                    :page-size="chatList.pageSize.value" :current-page="chatList.currentPage.value"
                    @current-change="chatList.handlePageChange" />
            </el-row>
        </el-col>
        <el-col :span="18" class="chat-container">
            <el-row class="message-list-container">
                <el-scrollbar class="message-list">
                    <div v-for="message in message.messages.value" :key="message.id" class="message-content"
                        :class="{ 'is-user': message.isUser }">
                        <h3 v-if="message.isUser">You</h3>
                        <h3 v-if="!message.isUser">Assistant</h3>

                        {{ message.text }}
                    </div>
                </el-scrollbar>
            </el-row>
            <el-row class="input-container">
                <el-col :span="20">
                    <el-input v-model="message.newMessage.value" :rows="6" type="textarea" @keyup.enter="message.sendMessage"
                        placeholder="请输入内容" class="message-input" />
                </el-col>
                <el-col :span="4"><el-button type="primary" @click="message.sendMessage">发送</el-button></el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { chatListAPI, chatListTotalAPI } from '@renderer/request/api';

interface ChatItemData {
    name: string;
    desc: string;
}
class ChatList {

    pageSize = ref(10);
    currentPage = ref(1);
    busy = ref(false);
    total = ref(100); // 假设总共有100条数据
    items = ref<ChatItemData[]>([
        { name: 'chat1', desc: 'chat1' },
        { name: 'chat2', desc: 'chat2' },
        { name: 'chat3', desc: 'chat3' },
        { name: 'chat4', desc: 'chat4' },
        { name: 'chat5', desc: 'chat5' },
        { name: 'chat6', desc: 'chat6' },
        { name: 'chat7', desc: 'chat7' },
        { name: 'chat8', desc: 'chat8' },
        { name: 'chat9', desc: 'chat9' },
        { name: 'chat10', desc: 'chat10' }
    ]);
    loadTotal = () => {
        chatListTotalAPI().then((res) => {
            this.total.value = res.data;
        }).catch((err) => {
            alert("请求消息总数失败：" + err.message)
        })
    };
    load = () => {
        if (this.busy.value || this.items.value.length >= this.total.value) {
            return;
        }
        this.busy.value = true;
        chatListAPI((this.currentPage.value - 1) * this.pageSize.value, this.currentPage.value * this.pageSize.value).then((res) => {
            this.items.value = this.items.value.concat(res.data);
            this.busy.value = false;
        }).catch((err) => {
            this.busy.value = false;
            alert("请求消息列表失败：" + err.message)
        })

    };
    handleItemClick = (item) => {
        alert(`Clicked on: ${item.name}`);
    };
    handlePageChange = (page) => {
        this.currentPage.value = page;
        this.load();
    };

}
interface MessageData {
    id: number;
    text: string;
    isUser: boolean;
}


class Message {

    newMessage = ref<string>('');
    messages = ref<MessageData[]>([
        { id: 1, text: 'Hello', isUser: false },
        { id: 2, text: 'Hi', isUser: true },
        { id: 3, text: 'How are you?', isUser: false },
        { id: 4, text: 'I am fine', isUser: true },
        { id: 5, text: 'Good to hear that', isUser: false },
        { id: 6, text: 'Thank you', isUser: true },
        { id: 7, text: 'You are welcome', isUser: false },
        { id: 8, text: 'Goodbye', isUser: true },
        { id: 9, text: 'See you later', isUser: false },
        { id: 10, text: 'Bye', isUser: true }
    ]);
    sendMessage = () => {
        if (this.newMessage.value.trim() !== '') {
            this.messages.value.push({
                id: this.messages.value.length + 1,
                text: this.newMessage.value,
                isUser: true
            });
            this.newMessage.value = '';  // 清空输入框
        }
    };
}
const message = new Message();
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
