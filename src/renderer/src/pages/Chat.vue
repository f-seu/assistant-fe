<template>
    <el-container>
        <el-aside class="chat-list">
            <el-scrollbar class="chat-list-scroll">
                <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
                    <li v-for="(chat, index) in chatList" :key="index" class="infinite-list-item">{{ chat.name }}</li>
                </ul>
            </el-scrollbar>
        </el-aside>
    </el-container>

</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
const count = ref(0)
const chatList = reactive([
    { name: 'chat1', desc: 'chat1' },
    { name: 'chat2', desc: 'chat2' },
    { name: 'chat3', desc: 'chat2' },
    { name: 'chat4', desc: 'chat2' },
    { name: 'chat5', desc: 'chat2' },
    { name: 'chat6', desc: 'chat2' },
    { name: 'chat7', desc: 'chat2' },
    { name: 'chat8', desc: 'chat2' },
    { name: 'chat9', desc: 'chat3' }
]);

const load = () => {
    count.value += 2;
    chatList.push({ name: 'chat10', desc: 'chat10' });
}
</script>

<style>
.infinite-list {
    height: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
}

.infinite-list .infinite-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    margin: 10px;
    color: var(--el-color-primary);
}

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