/*
  Copyright (c) 2024, Li Yaning,Zu Yuankun/Southeast University
  Licensed under the GPL3 License (see LICENSE file for details) 
*/

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
    (message: string) =>
        instance.post(`/chat/`, { "message": message })

export const deleteChatAPI = (chatid: number) => instance.delete(`/chat?chatid=${chatid}`);



export const getCalendarAPI = (year: number, month: number, day: number) =>
    instance.get(`/calendar?year=${year}&month=${month}&day=${day}`);
export const getHasCalendarAPI = (year: number, month: number) =>
    instance.get(`/has-calendar?year=${year}&month=${month}`);
export const updateCalendarAPI = (year: number, month: number, day: number, content: string) =>
    instance.put(`/calendar/`, { "year": year, "month": month, "day": day, "content": content });
export const getPlanAPI = (year: number, month: number, day: number) =>
    instance.get(`/plan?year=${year}&month=${month}&day=${day}`);

export const updatePlanAPI = (year: number, month: number, day: number) =>
    instance.put(`/plan/`, { "year": year, "month": month, "day": day });



export const getRecommendAPI = (type: string) =>
    instance.get(`/recommend?type=${type}`);


export const getFileListAPI = () => instance.get(`/knowledge_base/list_files?knowledge_base_name=samples`);

export const deleteFileAPI = (filenames: string[]) => instance.post(`/knowledge_base/delete_docs`, {

    knowledge_base_name: 'samples',
    file_names: filenames,
    delete_content: true,
    not_refresh_vs_cache: false,

});

export const postFileAPI = (file: File) => {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('knowledge_base_name', 'samples');
    return instance.post(`/knowledge_base/upload_docs`, formData);

}
