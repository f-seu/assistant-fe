/*
  Copyright (c) 2024, Li Yaning,Zu Yuankun/Southeast University
  Licensed under the GPL3 License (see LICENSE file for details) 
*/

import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ChatItem {
  id: number;
  name: string;
}
interface MessageItem {
  content: string;
  role: string;
  id:number;
}
export const useChatStore = defineStore('chatList', () => {
  const chatItems = ref<ChatItem[]>([])
  const messages = ref<MessageItem[]>([]);
  const selectedChatId = ref(0);
  return { chatItems,messages,selectedChatId}
})

