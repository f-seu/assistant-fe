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
    
export const deleteChatAPI = (chatid: number) => instance.delete(`/chat?chatid=${chatid}`);



export const getCalendarAPI = (year: number, month: number, day: number) => 
    instance.get(`/calendar?year=${year}&month=${month}&day=${day}`);
export const getHasCalendarAPI = (year: number, month: number) => 
    instance.get(`/has-calendar?year=${year}&month=${month}`);
export const updateCalendarAPI = (year: number, month: number, day: number, content: string) => 
    instance.put(`/calendar/`, { "year":year, "month":month, "day":day, "content":content });
export const getPlanAPI = (year: number, month: number, day: number,force_update:boolean) =>
    instance.get(`/plan?year=${year}&month=${month}&day=${day}&force_update=${force_update}`);



export const getRecommendAPI = (type:string) =>
    instance.get(`/recommend?type=${type}`);