import instance from './request'


export const chatNumAPI = () => instance.get(`/chat-num`)
export const chatListAPI =
    (start: number, end: number) =>
        instance.get(`/chat-list?start=${start}&end=${end}`)



export const getChatAPI = (chatid: number) => { instance.get(`/chat?chatid=${chatid}`) }


export const getMessageAPI =
    (chatid: number) =>
        instance.get(`/chat-message?chatid=${chatid}`)

export const newMessageAPI =
    (chatid: number, message: string) =>
        instance.post(`/chat-message`, { "chatid": chatid, "message": message })

