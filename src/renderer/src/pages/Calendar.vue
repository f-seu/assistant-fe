<!-- 
  Copyright (c) 2024, Li Yaning,Zu Yuankun/Southeast University
  Licensed under the GPL3 License (see LICENSE file for details) 
-->

<template>
    <el-row class="calendar-container">
        <!-- 左侧容器 -->
        <el-col :span="12" class="left-container">
            <!-- 日历组件 -->
            <el-calendar v-model="selectDate">
                <template #date-cell="{ data }">
                    <div :class="['custom-date', { 'is-selected': data.isSelected }]">
                        {{ data.day.split('-').slice(1).join('-') }}
                        <div v-if="hasCalendarDays.includes(data.date.getDate())"> ✔️ </div>
                    </div>
                </template>
            </el-calendar>
        </el-col>
        <!-- 右侧容器 -->
        <el-col :span="12" class="right-container">
            <!-- 日程输入和更新 -->
            <h3 class="calendar-content-title">日程内容</h3>
            <span v-if="calendarObj.userUpdate">更新于 {{ formatDateTime(calendarObj.updateAt) }}</span>
            <span v-else>今日未更新过日程</span>
            <el-input v-model="calendarObj.content" type="textarea" rows="8"></el-input>
            <!-- 按钮组 -->
            <div class="button-group">
                <el-button type="primary" @click="updateCalendar">更新日程</el-button>
                <el-button type="primary" @click="getPlan(true)">获取已规划日程</el-button>
                <el-button type="primary" @click="updatePlan()">重新规划</el-button>

            </div>
            <!-- 规划内容显示 -->
            <div class="plan-section">
                <h3 class="plan-title">规划后日程</h3>
                <div v-if="planInProgress == true">正在更新</div>
                <div v-else-if="planObj.hasProcessed == false">暂无规划</div>
                <div v-else>更新于{{ formatDateTime(planObj.update_at) }}</div>
                <el-scrollbar height="350px">
                    <div class="plan-content" v-html="planObj.planRender"></div>
                </el-scrollbar>

            </div>
        </el-col>
    </el-row>
</template>


<script lang="ts" setup>

import { computed, onMounted, reactive, ref, watch } from 'vue';
import { ElNotification } from 'element-plus'
import { getPlanAPI, updatePlanAPI, getCalendarAPI, updateCalendarAPI, getHasCalendarAPI } from '@renderer/request/api';
import markdownit from 'markdown-it'

const md = markdownit();
const calendarObj = reactive({
    content: "",
    updateAt: "",
    userUpdate: false,
});
const planObj = reactive({
    content: "",
    update_at: "",
    planRender: "",
    hasProcessed: false,
});

const selectDate = ref(new Date());
const selectMonth = computed(() => {
    return selectDate.value.getMonth();
});
const hasCalendarDays = ref<number[]>([]);
const planInProgress = ref(false);

const getPlan = (showNotification) => {
    const date = selectDate.value.toLocaleDateString().split('/');
    const year = parseInt(date[0]);
    const month = parseInt(date[1]);
    const day = parseInt(date[2]);


    getPlanAPI(year, month, day)
        .then((res) => {
            const data = res.data;
            const code = data['code'];

            if (code == 0) {
                planObj.content = data['data']['content'];
                planObj.update_at = data['data']['update_at'];
                planObj.hasProcessed = data['data']['has_processed'];
                planInProgress.value = false;
                if (showNotification) {
                    ElNotification({
                        title: '获取成功',
                        message: '获取成功',
                        type: 'success',
                    })
                }
            }
            else if (code == 2002) {
                ElNotification({
                    title: '规划中',
                    message: data['msg'],
                    type: 'info',
                })
                planInProgress.value = true;
                planObj.content = "";
                planObj.update_at = "正在规划中";
            }
            else {
                ElNotification({
                    title: '获取失败',
                    message: data['msg'],
                    type: 'error',
                })
                planInProgress.value = false;
                planObj.content = "";
                planObj.update_at = "暂无更新信息";
            }
            return;
        })
        .catch((err) => {
            ElNotification({
                title: '规划失败',
                message: '规划失败，请稍后再试:' + err,
                type: 'error',
            })
            planInProgress.value = false;
            planObj.content = "";
            planObj.update_at = "暂无更新信息";
            return;
        });

    return;
}

const updatePlan = () => {
    const date = selectDate.value.toLocaleDateString().split('/');
    const year = parseInt(date[0]);
    const month = parseInt(date[1]);
    const day = parseInt(date[2]);

    updatePlanAPI(year, month, day)
        .then((res) => {
            const code = res.data['code'];
            if (code == 0) {
                ElNotification({
                    title: '规划中',
                    message: '规划中，请稍后查看',
                    type: 'info',
                })
                planInProgress.value = true;
                planObj.content = "";
                planObj.update_at = "暂无更新信息";
                return;
            }
            else {
                ElNotification({
                    title: '规划失败',
                    message: '规划失败，请稍后再试:' + res.data['msg'],
                    type: 'error',
                })
                planInProgress.value = false;
                planObj.content = "";
                planObj.update_at = "暂无更新信息";
                return;
            }

        })
        .catch((err) => {
            ElNotification({
                title: '获取失败',
                message: '获取失败，请稍后再试:' + err,
                type: 'error',
            })
        });
}





const getCalendarContent = (date) => {
    getCalendarAPI(
        parseInt(date[0]),
        parseInt(date[1]),
        parseInt(date[2])
    )
        .then((res) => {
            const code = res.data['code'];
            if (code == 0) {
                calendarObj.content = res.data['data']['content'];
                calendarObj.updateAt = res.data['data']['update_at'];
                calendarObj.userUpdate = res.data['data']['user_update'];
            } else {
                ElNotification({
                    title: '获取失败',
                    message: '获取日程失败，请稍后再试:' + code,
                    type: 'error',
                })
                calendarObj.content = "";
                calendarObj.updateAt = "";
                calendarObj.userUpdate = false;
            }
        })
        .catch((err) => {
            ElNotification({
                title: '获取失败',
                message: '获取日程失败，请稍后再试:' + err,
                type: 'error',
            })
        });
}

const getHasCalendar = (year, month) => {
    console.log("get has")
    getHasCalendarAPI(
        year,
        month
    )
        .then((res) => {
            const code = res.data['code'];
            if (code == 0) {
                hasCalendarDays.value = res.data['data'].map(item => item.day);
                console.log(hasCalendarDays);
            } else {
                ElNotification({
                    title: '获取失败',
                    message: '获取本月日程失败，请稍后再试:' + code,
                    type: 'error',
                })
            }
        })
        .catch((err) => {
            ElNotification({
                title: '获取失败',
                message: '获取本月日程失败，请稍后再试:' + err,
                type: 'error',
            })
        });
}
watch(selectDate, (newVal) => {
    const date = newVal.toLocaleDateString().split('/');
    console.log(newVal.toLocaleDateString());
    getCalendarContent(date);
    getPlan(false);
});

watch(selectMonth, (newVal) => {
    const year = selectDate.value.getFullYear();
    const month = newVal;
    getHasCalendar(year, month + 1);

});


watch(planObj, (newVal) => {
    if (newVal.content == "") {
        planObj.planRender = "";
        return;
    }
    newVal.content = newVal.content.replace(/\\n/g, "\n");
    planObj.planRender = md.render(newVal.content);

})
const updateCalendar = () => {
    const date = selectDate.value.toLocaleDateString().split('/');
    updateCalendarAPI(
        parseInt(date[0]),
        parseInt(date[1]),
        parseInt(date[2]),
        calendarObj.content
    )
        .then((res) => {
            const code = res.data['code'];
            if (code == 0) {
                ElNotification({
                    title: '更新成功',
                    message: '更新成功',
                    type: 'success',
                })
                getHasCalendar(selectDate.value.getFullYear(), selectDate.value.getMonth() + 1);
                getCalendarContent(date);
            } else {
                ElNotification({
                    title: '更新失败',
                    message: '更新失败，请稍后再试:' + code,
                    type: 'error',
                })
            }
        })
        .catch((err) => {
            ElNotification({
                title: '更新失败',
                message: '更新失败，请稍后再试:' + err,
                type: 'error',
            })
        });
}

onMounted(() => {
    const date = selectDate.value.toLocaleDateString().split('/');
    getCalendarContent(date);
    getHasCalendar(selectDate.value.getFullYear(), selectDate.value.getMonth() + 1);
});

const formatDateTime = (dateInput: string | Date): string => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

</script>

<style scoped>
.calendar-container {
    padding: 20px;
}

.left-container,
.right-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.custom-date {
    text-align: center;
}

.is-selected {
    color: #1989fa;
}

.plan-form {
    margin-bottom: 20px;
}

.button-group {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.plan-section {
    flex: 1;
    border: 1px solid #ebeef5;
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.plan-title {
    margin: 0 0 10px 0;
    font-size: 16px;
    font-weight: bold;
}

.calendar-content-title {
    margin: 0 0 10px 0;
    font-size: 16px;
    font-weight: bold;
}

.plan-content {
    flex: 1;
    overflow-y: auto;

    text-align: left;
}

.el-button {
    margin-top: 10px;
}
</style>