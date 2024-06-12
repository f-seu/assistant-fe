<template>
    <el-row>
        <el-col :span="4" class="chat-list-col">
            <el-scrollbar>
                <ul class="chat-list">
                    <li v-for="item in chatList" :key="item.name" class="chat-list-item">
                        {{ item.desc }}
                    </li>
                </ul>

            </el-scrollbar>
        </el-col>
        <el-col :span="20" class="chat-container">
            <el-row class="message-list-container">

                <el-scrollbar class="messages">
                    <div v-for="message in messages" :key="message.id" class="message-content"
                        :class="{ 'is-user': message.isUser }">
                        {{ message.text }}
                    </div>
                </el-scrollbar>

            </el-row>
            <el-row class="input-container">
                <input v-model="newMessage" @keyup.enter="sendMessage" type="textarea" placeholder="请输入内容"
                    class="message-input">
                <el-button type="primary" @click="sendMessage">发送</el-button>
            </el-row>
        </el-col>
    </el-row>
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
            isUser: messages.value.length%2==0
        });
        newMessage.value = '';  // 清空输入框
    }
};

</script>
<style>
.chat-list {
    height: 100vh;
    padding: 0;
    margin: 0;
    list-style: none;
    overflow: auto;
    border-right: 1px solid #ccc;
}

.chat-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    margin: 10px;
    color: var(--el-color-primary);
}

<<<<<<< HEAD
.infinite-list .infinite-list-item+.list-item {
    margin-top: 10px;
}

.chat-list {
    height: 100vh;
    border-right: 1px solid #dcdfe6;
}

.chat-list-scroll {
    height: 100%;
    overflow: auto;
}
</style>
=======
.message-content{
    
 
}

</style>
>>>>>>> 0a06da94968615eee5ed2b82dda140172eeff60f
