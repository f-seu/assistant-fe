import instance from './request'


export const chatListTotalAPI =() =>instance.get(`/chat/nums`) 
export const chatListAPI =
    (start: number, end: number) =>
        instance.get(`/chat/list?start=${start}&end=${end}`) 
