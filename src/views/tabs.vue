<template>
  <div class="container">
    <el-tabs v-model="message">
      <el-tab-pane :label="`留言(${state.message.length})`" name="first">
        <el-alert
          title="温馨提示，下拉可查看回复，敲击回车即回复结束"
          type="success"
          effect="light"
        ></el-alert>

        <el-table
          :row-key="(row:any) => row.id"
          :expand-row-keys="expandedRowKeys"
          :data="state.message"
          :show-header="false"
          style="width: 100%"
          empty-text="暂无留言"
          fit
          @expand-change="expandOpen"
        >
          <el-table-column type="expand" :min-height="100">
            <template #default="{ row }">
              <div class="message-detail">
                <el-input
                  type="textarea"
                  v-model="row.reply"
                  @keyup.enter="updateMessage(row)"
                ></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="title"> </el-table-column>
          <el-table-column
            prop="detail"
            show-overflow-tooltip
            width="320"
          ></el-table-column>
          <el-table-column
            prop="reply"
            show-overflow-tooltip
            width="500"
          ></el-table-column>
          <el-table-column
            prop="create_time"
            width="180"
            align="center"
          ></el-table-column>
          <el-table-column align="center">
            <template #default="{ row }">
              <el-button type="danger" @click="deleteMessage(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="`举报(${state.report.length})`" name="second">
        <template v-if="message === 'second'">
          <el-table
            :data="state.report"
            :show-header="false"
            style="width: 100%"
            fit
          >
            <el-table-column>
              <template #default="{ row }">
                <span class="message-title">{{ row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="detail" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="request" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="create_time"
              align="center"
            ></el-table-column>
            <el-table-column width="120" align="center">
              <template #default="{ row }">
                <el-button type="success" @click="handleDel(row)"
                  >已阅</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="handle-row">
            <el-button type="success" @click="handleAll">回复所有</el-button>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts" name="tabs">
import { fetchList, saveData } from "@/api/common";
import { getMessageList } from "@/api/user";
import { ref, reactive, onMounted, watch } from "vue";

const expandedRowKeys = ref<string[]>([]);

const remove = (array: any[], val: any) => {
  const index = array.indexOf(val);
  if (index > -1) {
    array.splice(index, 1);
    return true;
  }
  return false;
};

const expandOpen = async (row: any, expand: any) => {
  if (!remove(expandedRowKeys.value, row.id)) {
    expandedRowKeys.value.push(row.id);
  }
};
const message = ref("first");
const state = reactive({
  message: [],
  report: [
  ],
});

const updateMessage = (row: any) => {
  saveData("/home/updateMessage", row).then((res: any) => {
    if (res.code === 200) {
      getMessage();
    }
  });
};

const deleteMessage = (row: any) => {
  saveData("/message/delete", row).then((res: any) => {
    if (res.code === 200) {
      getMessage();
    }
  });
};
const handleDel = (row: any) => {
  row.request = "已阅";
  saveData("/message/updateReport", row).then((res: any) => {
    if (res.code === 200) {
      getReport();
    }
  });
};
const handleAll = () => {
  state.report.forEach((item: any) => {
    item.request = "已阅";
    saveData("/message/updateReport", item).then((res: any) => {
      if (res.code === 200) {
        getReport();
      }
    });
  });
};

onMounted(() => {
  getMessage();
  getReport();
});
// 获取公告列表
const getMessage = () => {
  state.message = [];
  fetchList("/home/getAllMessage", null).then((res: any) => {
    Object.assign(state.message, res.data);
  });
};
// 获取举报列表
const getReport = () => {
  state.report = [];
  fetchList("/message/reportList", null).then((res: any) => {
    Object.assign(state.report, res.data);
  });
};
</script>

<style>
.message-title {
  cursor: pointer;
}
.handle-row {
  margin-top: 30px;
}
</style>
