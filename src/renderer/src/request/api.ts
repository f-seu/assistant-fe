import instance from './request'


export const chatListTotalAPI = () => instance.get(`/chat/nums`)
export const chatListAPI =
    (start: number, end: number) =>
        instance.get(`/chat?start=${start}&end=${end}`)
export const newChatAPI = (message: string) => { instance.post("/chat", { "message": message }) }

export const getMessageAPI =
    (chatid: number) =>
        instance.get(`/message?start=${chatid}`)

export const newMessageAPI =
    (message: string) =>
        instance.post(`/message`, { "message": message } ) 