<template>
  <el-col :span="18" class="chat-container">
    <el-row class="message-list-container">
      <el-scrollbar class="message-list">
        <div v-for="item in messages" :key="item.id" class="message-content"
          :class="{ 'is-user': item.role == 'user' }">
          <h3 v-if="item.role == 'user'">You</h3>
          <h3 v-if="item.role != 'user'">Assistant</h3>
          {{ item.content }}
        </div>
      </el-scrollbar>
    </el-row>
    <el-row class="input-container">
      <el-col :span="20">
        <el-input v-model="inputMessage" :rows="6" type="textarea" placeholder="请输入内容" class="message-input"
          @keyup.enter="handleSendMessage" />
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