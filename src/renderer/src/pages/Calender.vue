<template>
    <el-row class="calendar-container">
        <el-scrollbar>
            <el-calendar v-model="selectDate">
                <template #date-cell="{ data }">
                    <p :class="data.isSelected ? 'is-selected' : ''">
                        {{ data.day.split('-').slice(1).join('-') }}
                        {{ data.isSelected ? '✔️' : '' }}
                        <div v-if="hasCalendarDays.includes( data.date.getDate() )"> 今日有日程 </div>
                    </p>
                </template>
            </el-calendar>
        </el-scrollbar>
    </el-row>
    <el-row class="bottom-container">
        <el-col :span="20" class="input-container">
            <el-input v-model="calendarContent" type="textarea" rows="6"></el-input>
        </el-col>
        <el-col :span="2" class="button-container">
            <el-button type="primary" @click="updateCalendar">更新</el-button>
            <el-button type="primary" @click="getPlan(false)">规划日程</el-button>
        </el-col>
    </el-row>
    <el-dialog v-model="planVisible" title="规划后日程" width="500">
        <div class="plan-content" v-html="planRender"></div>
        <template #footer>
            <div class="dialog-footer">
                <el-button class="button" @click="planVisible = false">关闭</el-button>
                <el-button class="button" type="primary" @click="getPlan(true)">
                    重新规划
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>


<script lang="ts" setup>

import { computed, onMounted, ref, watch } from 'vue';
import { ElNotification } from 'element-plus'
import { getPlanAPI, getCalendarAPI, updateCalendarAPI,getHasCalendarAPI } from '@renderer/request/api';
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

const getHasCalender = (year,month) => {
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
    getHasCalender(year,month+1);

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
    getHasCalender(selectDate.value.getFullYear(),selectDate.value.getMonth()+1);
});

</script>

<style scoped>
.is-selected {
    color: #1989fa;
}
.has-calendar {
    background-color: #e6f7ff;
    border-radius: 50%;
}

.plan-content * {
    text-align: left;
}

.calendar-container {
    margin: 10px;

}
.bottom-container {
    height: 20vh;
 
}
.el-button{
    margin-bottom: 10px;
}
.button-container {
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}


</style>


