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
        <el-form label-position="top" class="plan-form">
          <el-form-item label="日程内容">
            <el-input v-model="calendarContent" type="textarea" rows="8"></el-input>
          </el-form-item>
          <!-- 按钮组 -->
          <div class="button-group">
            <el-button type="primary" @click="updateCalendar">更新日程</el-button>
            <el-button type="primary" @click="getPlan(true)">规划日程</el-button>
          </div>
        </el-form>
        <!-- 规划内容显示 -->
        <div class="plan-section">
          <h3 class="plan-title">规划后日程</h3>
          <div class="plan-content" v-html="planRender"></div>
        </div>
      </el-col>
    </el-row>
  </template>


<script lang="ts" setup>

import { computed, onMounted, ref, watch } from 'vue';
import { ElNotification } from 'element-plus'
import { getPlanAPI, getCalendarAPI, updateCalendarAPI, getHasCalendarAPI } from '@renderer/request/api';
import markdownit from 'markdown-it'

const md = markdownit();
const calendarContent = ref("");
const plan = ref("");
const planRender = ref("");
const planVisible = ref(false);
const selectDate = ref(new Date());
const selectMonth = computed(() => {
    return selectDate.value.getMonth();
});
const hasCalendarDays = ref<number[]>([]);

const getPlan = (forceUpdate) => {
    const date = selectDate.value.toLocaleDateString().split('/');
    const year = parseInt(date[0]);
    const month = parseInt(date[1]);
    const day = parseInt(date[2]);

    if (forceUpdate) {
        planVisible.value = false;
        getPlanAPI(year, month, day, true)
            .then((res) => {
                const data = res.data;
                const code = data['code'];
                if (code == 2002) {
                    ElNotification({
                        title: '规划中',
                        message: '规划中，请稍后查看',
                        type: 'info',
                    })
                    return;
                }
                else {
                    ElNotification({
                        title: '规划失败',
                        message: '规划失败，请稍后再试:' + data['msg'],
                        type: 'error',
                    })
                }
                return;
            })
            .catch((err) => {
                ElNotification({
                    title: '规划失败',
                    message: '规划失败，请稍后再试:' + err,
                    type: 'error',
                })
                return;
            });

        return;
    }
    getPlanAPI(year, month, day, false)
        .then((res) => {
            const code = res.data['code'];
            if (code == 2002) {
                ElNotification({
                    title: '规划中',
                    message: '规划中，请稍后查看',
                    type: 'info',
                })

                return;
            }
            else if (code == 0) {
                plan.value = res.data['data']['content'];
                planVisible.value = true;
                return;
            }
            else {
                ElNotification({
                    title: '规划失败',
                    message: '规划失败，请稍后再试:' + res.data['msg'],
                    type: 'error',
                })
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
                calendarContent.value = res.data['data']['content'];
            } else {
                ElNotification({
                    title: '获取失败',
                    message: '获取日程失败，请稍后再试:' + code,
                    type: 'error',
                })
                calendarContent.value = "";
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
});

watch(selectMonth, (newVal) => {
    const year = selectDate.value.getFullYear();
    const month = newVal;
    getHasCalendar(year, month + 1);

});


watch(plan, (newVal) => {
    newVal = newVal.replace(/\\n/g, "\n");
    planRender.value = md.render(newVal);

})
const updateCalendar = () => {
    const date = selectDate.value.toLocaleDateString().split('/');
    updateCalendarAPI(
        parseInt(date[0]),
        parseInt(date[1]),
        parseInt(date[2]),
        calendarContent.value
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

.plan-content {
  flex: 1;
  overflow-y: auto;
}

.el-button {
  margin-top: 10px;
}
</style>