<template>
  <el-container class="container">
    <el-aside width="850px">
      <div class="message-container" v-if="!showReport">
        <h2>留言板</h2>
        <el-form
          :model="messageForm"
          label-position="right"
          label-width="80px"
          :rules="messageRules"
          ref="messageFormRef"
        >
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="messageForm.title"
              placeholder="请输入标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="messageForm.name"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="messageForm.phone"
              placeholder="请输入电话号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="留言内容" prop="message">
            <el-input
              type="textarea"
              v-model="messageForm.message"
              :rows="5"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.prevent="handleSubmit"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-form
        ref="reportForm"
        :model="formData"
        :rules="formRules"
        label-width="80px"
        class="report-form"
        v-if="showReport"
      >
        <h2>举报</h2>
        <el-form-item label="举报类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio-button label="垃圾广告"></el-radio-button>
            <el-radio-button label="违法信息"></el-radio-button>
            <el-radio-button label="欺诈骗局"></el-radio-button>
            <el-radio-button label="色情低俗"></el-radio-button>
            <el-radio-button label="侵权盗版"></el-radio-button>
            <el-radio-button label="其他"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="举报内容" prop="content">
          <el-input
            type="textarea"
            v-model="formData.content"
            :rows="5"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="primary" @click="showReport = !showReport">{{
          showReport ? "返回留言" : "举报"
        }}</el-button>
      </div>
    </el-aside>
    <el-main>
      <h4 v-if="messageVisable">留言历史</h4>
      <Tip
        v-for="(item, index) in messageHistory"
        :key="item.id"
        :type="item.state"
        :id="String(item.id)"
        :heading="item.title"
        :content="item.detail"
        :request="item.reply"
        :time="item.create_time"
        @delete="messageDelete"
      />
      <h4 v-if="reportVisable">举报历史</h4>
      <Tip
        v-for="(item, index) in reportHistory"
        :key="item.id"
        :type="item.request ? 'success' : 'waiting'"
        :id="item.id"
        :heading="item.title"
        :content="item.detail"
        :time="item.create_time"
        :request="item.request"
        @delete="reportDelete"
      />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ElNotification } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";
import {
  addMessage,
  addReport,
  deleteMessage,
  deleteReport,
  fetchMessageList,
  fetchReportListByUserId,
} from "../api/message";
import Tip from "../components/tip.vue";
import { useUserStore } from "@/store/user";

const { userInfo } = useUserStore();

interface Form {
  user_id: string | null;
  title: string;
  name: string;
  phone: string;
  message: string;
}

interface Message {
  name: string;
  message: string;
}

interface FormData {
  user_id: string | null;
  type: string;
  content: string;
}

const messageForm = reactive<Form>({
  user_id: userInfo.id,
  name: "",
  phone: "",
  title: "",
  message: "",
});

const messageFormRef = ref<any>();

const formData = reactive<FormData>({
  user_id: userInfo.id,
  type: "",
  content: "",
});

const reportForm = ref<any>();

const showReport = ref<boolean>(false);

const messageHistory = ref<Message[]>([]);

const reportHistory = ref<Message[]>([]);

const user_id = localStorage.getItem("ms_id");

const messageVisable = ref<boolean>(false);

const reportVisable = ref<boolean>(false);

onMounted(() => {
  getMessageHistory();
});

// 获取留言历史
function getMessageHistory() {
  fetchMessageList({ user_id: user_id }).then((res: any) => {
    messageHistory.value = res.data;
    for (let key in messageHistory.value) {
      if (messageHistory.value[key].state == 1) {
        messageHistory.value[key].state = "success";
      } else if (messageHistory.value[key].state == 0) {
        messageHistory.value[key].state = "waiting";
      } else {
        messageHistory.value[key].state = "danger";
      }
    }
  });
  fetchReportListByUserId({ user_id: user_id }).then((res: any) => {
    reportHistory.value = res.data;
  });
}

watch(
  () => messageHistory.value,
  (newVal, oldVal) => {
    if (newVal[0]) {
      messageVisable.value = true;
    } else {
      messageVisable.value = false;
    }
  },
  { deep: true }
);

watch(
  () => reportHistory.value,
  (newVal, oldVal) => {
    if (newVal[0]) {
      reportVisable.value = true;
    } else {
      reportVisable.value = false;
    }
  },
  { deep: true }
);

function messageDelete(id: number) {
  deleteMessage({ id: id }).then((res: any) => {
    if (res.code == 200) {
      ElNotification({
        title: "成功",
        message: "留言已删除",
        type: "success",
      });
      getMessageHistory();
    }
  });
}

function reportDelete(id: number) {
  deleteReport(id).then((res: any) => {
    if (res.code == 200) {
      ElNotification({
        title: "成功",
        message: "举报已删除",
        type: "success",
      });
      getMessageHistory();
    }
  });
}

function handleSubmit() {
  messageFormRef.value.validate((valid: boolean) => {
    if (valid) {
      addMessage(messageForm).then((res: any) => {
        if (res.code == 200) {
          ElNotification({
            title: "成功",
            message: "留言已保存，等待回复",
            type: "success",
          });
        }
        messageFormRef.value.resetFields();
        getMessageHistory();
      });
    } else {
      return false;
    }
  });
}

const messageRules = {
  title: [{ required: true, message: "请填写留言标题", trigger: "blur" }],
  name: [{ required: true, message: "请填写姓名", trigger: "blur" }],
  phone: [{ required: true, message: "请填写手机号", trigger: "blur" }],
  message: [{ required: true, message: "请填写留言内容", trigger: "blur" }],
};

const formRules = {
  type: [{ required: true, message: "请选择举报类型", trigger: "change" }],
  content: [{ required: true, message: "请填写举报内容", trigger: "blur" }],
};

function submitForm() {
  reportForm.value.validate((valid: boolean) => {
    if (valid) {
      addReport(formData).then((res: any) => {
        if (res.code == 200) {
          ElNotification({
            title: "成功",
            message: "举报已提交，等待处理",
            type: "success",
          });
          reportForm.value.resetFields();
          getMessageHistory();
        }
      });
    } else {
      return false;
    }
  });
}
</script>

<style lang="less">
.message-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 100px 10px 0;
}

.message-history {
  max-width: 600px;
  margin: 50px auto;
}

h2 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
