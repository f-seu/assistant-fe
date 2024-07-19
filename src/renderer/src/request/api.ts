import instance from './request'


export const chatNumAPI = () => instance.get(`/chat-num`)
export const chatListAPI =
    (start: number, end: number) =>
        instance.get(`/chat-list?start=${start}&end=${end}`)



export const getChatAPI = (chatid: number) => { instance.get(`/chat?chatid=${chatid}`) }


export const getMessageAPI =
    (chatid: number) =>
        instance.get(`/chat-message?chatid=${chatid}`)

export const newChatAPI =
    ( message: string) =>
        instance.post(`/chat/`, { "message": message })

export const getCalendarMessageAPI = (year: number, month: number, day: number) => 
    instance.get(`/calendar?year=${year}&month=${month}&day=${day}`);

export const newCalendarMessageAPI = (year: number, month: number, day: number, content: string) => 
    instance.put(`/calendar/`, { "year":year, "month":month, "day":day, "content":content });
