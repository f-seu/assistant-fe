<template>
    <el-row class="home-container">
        <!-- 左侧：个人信息 -->
        <el-col :span="6" class="personal-info">
            <div class="avatar-container">
                <el-avatar :size="100" :src="user.avatar"></el-avatar>
            </div>
            <el-divider></el-divider>
            <div class="user-name">{{ user.name }}</div>
        </el-col>

        <!-- 右侧：知识库管理 -->
        <el-col :span="18" class="knowledge-base">
            <h2>知识库管理</h2>
            <br>
            <div class="kb-header">

                <el-upload ref="uploadRef" drag multiple :http-request="uploadHttpRequest">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        拖动文件到此处或 <em>点击此处上传</em>
                    </div>
                </el-upload>
            </div>
            <el-table v-loading="loading" :data="fileInfoList" style="width: 100%;" :border="true" :fit="true">
                <el-table-column prop="name" label="文件名" min-width="200">
                </el-table-column>
                <el-table-column prop="size" label="大小" width="100">
                </el-table-column>
                <el-table-column prop="uploadTime" label="上传时间" min-width="180">
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template #default="scope">
                        <el-button type="danger" size="mini"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import { ElMessage, ElNotification } from 'element-plus';
import { getFileListAPI, deleteFileAPI, postFileAPI } from '@renderer/request/api';
import type { UploadInstance, UploadRequestOptions } from 'element-plus';

const user = ref({
    name: '太平羊羊',
    avatar: 'http://img.peacesheep.xyz/20230309162531.png',
});


const uploadRef = ref<UploadInstance | null>(null);

class FileInfo {
    name: string = '';
    size: number = 0;
    uploadTime: string = '';
}

const fileInfoList: FileInfo[] = reactive([]);
const loading = ref(false);

const fetchFileList = () => {
    loading.value = true;
    getFileListAPI().then(response => {
        const data = response.data.data;
        fileInfoList.splice(0, fileInfoList.length);
        console.log(data)
        data.forEach((item) => {
            const file = new FileInfo();
            file.name = item.file_name;
            file.size = item.file_size;
            file.uploadTime = item.create_time;
            fileInfoList.push(file);
        });
        loading.value = false;
    }).catch(error => {
        ElMessage.error('获取文件列表失败' + error);
        loading.value = false;
    });

};


const uploadHttpRequest = (param: UploadRequestOptions) => {
    const file = param.file;
    postFileAPI(file)
        .then(() => {
            ElNotification({
                title: '上传成功',
                message: '上传成功',
                type: 'success',
            });
            fetchFileList();
            uploadRef.value!.clearFiles();
        })
        .catch(error => {
           ElNotification({
                title: '上传失败',
                message: error,
                type: 'error',
            });
        });
}
const handleDelete = (index, row) => {
    deleteFileAPI([row.name])
        .then(() => {
            ElNotification({
                title: '删除成功',
                message: '删除成功',
                type: 'success',
            });
            fetchFileList();
        })
        .catch((err) => {
            ElNotification({
                title: '删除失败',
                message: err,
                type: 'error',
            });
        });
};

onMounted(() => {
    fetchFileList();
});

</script>
<style scoped>
.home-container {
    padding: 20px;
    box-sizing: border-box;
    overflow-x: hidden;
    /* 防止出现水平滚动条 */
}

.personal-info .el-card {
    text-align: center;
}

.avatar-container {
    margin-bottom: 20px;
}

.user-name {
    font-size: 18px;
    font-weight: bold;
}

.knowledge-base .el-card {
    padding: 20px;
}

.kb-header {
    margin-bottom: 20px;
}

.upload-demo {
    width: 100%;
    height: 200px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    background-color: #fafafa;
    position: relative;
    overflow: hidden;
}

.upload-demo i {
    font-size: 67px;
    color: #8c939d;
    line-height: 200px;
    text-align: center;
    width: 100%;
}

.upload-demo .el-upload__text {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    text-align: center;
    margin-top: -10px;
    font-size: 16px;
}

.upload-demo em {
    color: #409eff;
    font-style: normal;
}

.el-table {
    width: 100%;
    table-layout: fixed;
    /* 防止表格宽度超出容器 */
}

.el-table th,
.el-table td {
    word-wrap: break-word;
    /* 防止内容过长导致表格变宽 */
}

.el-table .el-table__body-wrapper {
    overflow-x: hidden;
    /* 防止表格内部出现水平滚动条 */
}
</style>