<template>
    <el-row class="calender-container">
        <el-scrollbar>
            <el-calendar v-model="selectDate">
                <template #date-cell="{ data }">
                    <p :class="data.isSelected ? 'is-selected' : ''">
                        {{ data.day.split('-').slice(1).join('-') }}
                        {{ data.isSelected ? '✔️' : '' }}
                    </p>
                </template>
            </el-calendar>
        </el-scrollbar>
    </el-row>
    <el-row>
        <el-col :span="20">
            <el-input v-model="calenderContent" type="textarea">

            </el-input>
        </el-col>
        <el-col :span="4">
            <el-button type="primary" @click="updateCalendar">更新</el-button>
            <el-button type="primary" @click="getPlan(false)">规划日程</el-button>
        </el-col>
    </el-row>
    <el-dialog v-model="planVisible" title="规划后日程" width="500">
        <div class="plan-content" v-html="planRender"></div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="planVisible = false">关闭</el-button>
                <el-button type="primary" @click="getPlan(true)">
                    重新规划
                </el-button>
            </div>
        </template>
    </el-dialog>

</template>

<script lang="ts" setup>

import { ref, watch } from 'vue';
import { ElNotification } from 'element-plus'
import { getPlanAPI, getCalendarAPI, updateCalendarAPI } from '@renderer/request/api';
import markdownit from 'markdown-it'

const md = markdownit();
const calenderContent = ref("");
const plan = ref("");
const planRender = ref("");
const planVisible = ref(false);
const selectDate = ref(new Date())

const getPlan = (forceUpdate) => {
    const date = selectDate.value.toLocaleDateString().split('/');
    const year = parseInt(date[0]);
    const month = parseInt(date[1]);
    const day = parseInt(date[2]);

    if (forceUpdate) {
        planVisible.value = false;
        getPlanAPI(year, month, day,true)
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
    getPlanAPI(year, month, day,false)
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

watch(selectDate, (newVal) => {
    const date = newVal.toLocaleDateString().split('/');
    console.log(newVal.toLocaleDateString());
    getCalendarAPI(
        parseInt(date[0]),
        parseInt(date[1]),
        parseInt(date[2])
    )
        .then((res) => {
            const code = res.data['code'];
            if (code == 0) {
                calenderContent.value = res.data['data']['content'];
            } else {
                ElNotification({
                    title: '获取失败',
                    message: '获取日程失败，请稍后再试:' + code,
                    type: 'error',
                })
                calenderContent.value = "";
            }
        })
        .catch((err) => {
            ElNotification({
                title: '获取失败',
                message: '获取日程失败，请稍后再试:' + err,
                type: 'error',
            })
        });
});

watch(plan,(newVal)=>{
    newVal = newVal.replace(/\\n/g, "\n");
    planRender.value = md.render(newVal);

})
const updateCalendar = () => {
    const date = selectDate.value.toLocaleDateString().split('/');
    updateCalendarAPI(
        parseInt(date[0]),
        parseInt(date[1]),
        parseInt(date[2]),
        calenderContent.value
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

</script>

<style scoped>
.is-selected {
    color: #1989fa;
}

.plan-content * {
    text-align: left;
}
</style>