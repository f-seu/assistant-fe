<template>
    <el-row>
        <el-col :span="6" class="chat-list-col">
            <el-scrollbar class="chat-list-container">
                <ul class="chat-list">
                    <el-row
v-for="item in chatList.items.value" :key="item.name" class="chat-list-item"
                        @click="chatList.handleItemClick(item)">
                        {{ item.name }}
                    </el-row>
                </ul>
            </el-scrollbar>
            <el-row class="pagination-container">
                <el-pagination
small layout="prev, pager, next" :total="chatList.total.value"
                    :page-size="10" :current-page="chatList.currentPage.value"
                    @current-change="chatList.handlePageChange" />
            </el-row>
        </el-col>
        <el-col :span="18" class="chat-container">
            <el-row class="message-list-container">
                <el-scrollbar class="message-list">
                    <div
                        v-for="item in message.messages.value" :key="item.id" class="message-content"
                        :class="{ 'is-user': item.role == 'user' }">
                        <h3 v-if="item.role == 'user'">You</h3>
                        <h3 v-if="item.role != 'user'">Assistant</h3>
                        {{ item.content}}
                    </div>
                </el-scrollbar>
            </el-row>
            <el-row class="input-container">
                <el-col :span="20">
                    <el-input
                        v-model="message.newMessage.value" :rows="6" type="textarea" placeholder="请输入内容"
                        class="message-input" @keyup.enter="message.sendMessage" />
                </el-col>
                <el-col :span="4"><el-button type="primary" @click="message.sendMessage">发送</el-button></el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { chatListAPI, chatNumAPI,getMessageAPI} from "@renderer/request/api";

interface ChatItemData {
    id:number;
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
interface MessageData {
    id: number;
    content: string;
    role:string;
}

class Message {
    newMessage = ref<string>("");
    messages = ref<MessageData[]>([
        
    ]);
    sendMessage = () => {
    if (!this.newMessage.value.trim()) {
      alert("消息内容不能为空或未选择聊天！");
      return;
    }

    fetch("/api/chat-message/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatid: 36,
        message: this.newMessage.value,
      }),
    })
      .then((response) => {
        if (response.body === null) {
          throw new Error("Response body is null");
        }
        let first=true;
        function processText(text,first) {
                const lines = text.split("\n\n");
                lines.forEach(line => {
                    if (line.startsWith("data: ")) {
                        const message1 = JSON.parse(line.slice(6));
                        if(first){
                            message.messages.value.push({ id: Date.now(), content: message1.text, role: "assistant" });
                        }else{
                            console.log(message.messages.value[-1])
                            const len = message.messages.value.length-1;
                            message.messages.value[len].content += message1.text;
                        }
                        
                    }
                });
            }
        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller) {
            function push() {
               
              reader.read().then(({ done, value }) => {
                
                if (done) {
                  controller.close();
                  return;
                }
                const text = new TextDecoder("utf-8").decode(value);
                console.log(text)
                processText(text,first);
                first= false;
                push();
              });
            }
            push();
          }
        });
      })
      .catch((err) => {
        alert("发送消息失败：" + err.message);
      });
    this.newMessage.value = "";
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
