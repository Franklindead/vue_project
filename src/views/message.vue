<template>
  <el-container class="container">
    <el-aside width="850px">
      <div class="message-container" v-if="!showReport">
        <h2>留言板</h2>
        <el-form :model="form" label-position="right" label-width="80px">
          <el-form-item label="标题" prop="name" required>
            <el-input v-model="form.name" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="留言内容" prop="message">
            <el-input
              type="textarea"
              v-model="form.message"
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
      <Tip type="success" heading="什么是" content="厉害" />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import Tip from "../components/tip.vue";

interface Form {
  name: string;
  email: string;
  message: string;
}

interface Message {
  name: string;
  email: string;
  message: string;
  imageUrl: string;
}

interface FormData {
  type: string;
  content: string;
}

const form = reactive<Form>({
  name: "",
  email: "",
  message: "",
});

const imageUrl = ref<string>("");

const showReport = ref<boolean>(false);

const messageHistory = ref<Message[]>([]);

function handleSubmit() {
  // Push the form data into messageHistory array
  messageHistory.value.push({
    name: form.name,
    email: form.email,
    message: form.message,
    imageUrl: imageUrl.value,
  });

  // Clear the form fields and image preview after submission
  form.name = "";
  form.email = "";
  form.message = "";
  imageUrl.value = "";
}

const formData = reactive<FormData>({
  type: "",
  content: "",
});

const formRules = {
  type: [{ required: true, message: "请选择举报类型", trigger: "change" }],
  content: [{ required: true, message: "请填写举报内容", trigger: "blur" }],
};

function submitForm() {
  // 处理表单提交逻辑
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
