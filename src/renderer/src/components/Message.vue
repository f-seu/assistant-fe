<template>
  <el-col :span="18" class="chat-container">
    <el-row class="message-list-container">
      <el-scrollbar class="message-list">
        <div v-for="item in messages" :key="item.id" class="message-content" :class="{ 'is-user': item.role == 'user', 'is-assistant': item.role != 'user' }">
          <!-- <div class="message-header">{{ item.role == 'user' ? 'You' : 'Assistant' }}</div> -->
          <div class="message-box">{{ item.content }}</div>
        </div>
      </el-scrollbar>
    </el-row>
    <el-row class="input-container">
      <el-col :span="20">
        <el-input v-model="inputMessage" :rows="6" type="textarea" placeholder="请输入内容" class="message-input" @keyup.enter="handleSendMessage" />
      </el-col>
      <el-col :span="4"><el-button type="primary" @click="handleSendMessage" :loading="sendLoading">发送</el-button></el-col>
    </el-row>
  </el-col>
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useChatStore } from '@store/chat';
import { getMessageAPI, newChatAPI } from "@renderer/request/api";

const store = useChatStore();
const { chatItems, messages, selectedChatId } = storeToRefs(store);
const inputMessage = ref<string>("");
const sendLoading = ref<boolean>(false);

const sendMessage = (messageContent: string) => {
  messages.value.push({ id: Date.now(), content: messageContent, role: "user" });
  fetch("/api/chat-message/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatid: selectedChatId.value,
      message: messageContent,
    }),
  })
    .then((response) => {
      if (response.body === null) {
        throw new Error("Response body is null");
      }
      let first = true;
      const reader = response.body.getReader();
      return new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                sendLoading.value = false;
                return;
              }
              const text = new TextDecoder("utf-8").decode(value);
              processText(text, first);
              first = false;
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

};

const processText = (text, first) => {
  inputMessage.value = "";
  const lines = text.split("\n\n");
  lines.forEach(line => {
    if (line.startsWith("data: ")) {
      const messageResp = JSON.parse(line.slice(6));
      if (first) {
        messages.value.push({ id: Date.now(), content: messageResp.text, role: "assistant" });
      } else {
        const len = messages.value.length - 1;
        messages.value[len].content += messageResp.text;
      }
    }
  });
}
const handleSendMessage = () => {
  if(sendLoading.value) {
    return;
  }
  sendLoading.value = true;
  if (!inputMessage.value.trim()) {
    alert("消息内容不能为空！");
    sendLoading.value = false;
    return;
  }
  if (selectedChatId.value === 0) {
    {
      newChatAPI(
        inputMessage.value
      )
        .then((res) => {
          const code = res.data['code']
          if (code != 0) {
            alert("新建聊天失败：" + res.data['msg']);
            sendLoading.value = false;
            return
          }
          const id = res.data['data'].id;
          const name = res.data['data'].name;
          if (chatItems.value.length >= 10) {
            chatItems.value.pop();
          }
          chatItems.value.unshift({ id: id, name: name });
          selectedChatId.value = id;
          sendMessage(inputMessage.value);
        })
        .catch((err) => {
          alert("新建聊天失败：" + err.message);
          sendLoading.value = false;
        });

    }

  } else {
    sendMessage(inputMessage.value);
  }
};

const getMessage = () => {
  if (selectedChatId.value == 0) {
    messages.value = [];
    return;
  }
  getMessageAPI(selectedChatId.value)
    .then((res) => {
      messages.value = res.data['data'];
    })
    .catch((err) => {
      alert("请求消息列表失败：" + err.message);
    });
}

watch(() => selectedChatId.value, () => {
    getMessage();
 
});

onMounted(() => {
  getMessage();
});
</script>

<style>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.input-container {
  padding: 10px;
}

.message-list-container {
  flex-grow: 1;
  overflow: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}
.message-list {
  width: 100%;
  display: grid; /* 使用网格布局 */
  grid-template-columns: 1fr; /* 单列布局 */
}

.message-content {
  display: block; /* 让宽度根据内容自动调整 */
  word-wrap: break-word;
  background-color: #f0f0f0;
  color: #333;
  border-radius: 15px;
  padding: 10px;
  max-width: 70%; /* 最大宽度限制 */
  width: fit-content; /* 根据内容自动调整宽度 */
  clear: both; /* 防止浮动元素相互覆盖 */
}

.is-user {
  background-color: #d4f1c5;
  border-radius: 15px 15px 0 15px;
  float: right; /* 用户消息右对齐 */
}

.is-assistant {
  background-color: #f0f0f0;
  border-radius: 15px 15px 15px 0;
  float: left; /* 助手消息左对齐 */
}
.message-box{
  text-align: left;
  word-wrap: break-word;
  user-select: text;
}
</style>
