<template>
    <el-container>
        <el-aside class="chat-list">
            <el-scrollbar class="infinite-list">
                <div v-infinite-scroll="load" :infinite-scroll-disabled="busy">
                    <div v-for="item in chatList" :key="item.name" class="infinite-list-item">
                        {{ item.name }}
                    </div>
                </div>
            </el-scrollbar>
        </el-aside>
        <el-main class="chat-window">
            <el-scrollbar class="messages">
                <div v-for="message in messages" :key="message.id" class="message"
                    :class="{ 'is-user': message.isUser }">
                    {{ message.text }}
                </div>
            </el-scrollbar>
            <div class="input-container">
                <input v-model="newMessage" @keyup.enter="sendMessage" type="textarea" placeholder="请输入内容" class="message-input">
                <el-button type="primary" @click="sendMessage">发送</el-button>
            </div>
        </el-main>
    </el-container>
</template>


<script setup>
import { ref } from 'vue'


const chatList = ref([
    { name: 'chat1', desc: 'chat1' },
    { name: 'chat2', desc: 'chat2' },
    { name: 'chat3', desc: 'chat3' }])

const busy = ref(false);
const total = ref(100); // 假设总共有100条数据

const load = () => {
    console.log('load')
    if (busy.value || chatList.value.length >= total.value) {
        return
    }
    busy.value = true
    setTimeout(() => { // 模拟异步加载
        const nextItem = chatList.value.length + 1
        chatList.value.push({ name: `chat${nextItem}`, desc: `chat${nextItem}` })
        busy.value = false
    }, 1000)
}


const messages = ref([]);
const newMessage = ref('');
const sendMessage = () => {
    if (newMessage.value.trim() !== '') {
        messages.value.push({
            id: messages.value.length + 1,
            text: newMessage.value,
            isUser: true
        });
        newMessage.value = '';  // 清空输入框
    }
};

</script>
<style>
.infinite-list {
    height: 100vh;
    padding: 0;
    margin: 0;
    list-style: none;
    overflow: auto;
}

.infinite-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    margin: 10px;
    color: var(--el-color-primary);
}

.chat-list {
    height: 100vh;
    border-right: 1px solid #dcdfe6;
    overflow: auto;
    width: 160px;
}

.chat-window {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.messages {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
}

.message {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 10px;
    background-color: #f0f0f0;
}

.message.is-user {
    background-color: #blue;
    align-self: flex-end;
}

.input-container {
    display: flex; /* 使用 flex 布局 */
    padding: 10px;
}

.message-input {
    flex: 1; /* 输入框占据剩余空间 */
    margin-right: 10px; /* 与发送按钮的间距 */
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
}
</style>
