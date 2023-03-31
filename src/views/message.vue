<template>
<<<<<<< HEAD
  <div class="container">
=======
  <el-container class="container">
>>>>>>> 2day
    <el-aside width="850px">
      <div class="message-container" v-if="!showReport">
        <h2>留言板</h2>
        <el-form :model="form" label-position="right" label-width="80px">
<<<<<<< HEAD
          <el-form-item label="标题" prop="name">
            <el-input v-model="form.name"></el-input>
=======
          <el-form-item label="标题" prop="name" required>
            <el-input v-model="form.name" placeholder="请输入标题"></el-input>
>>>>>>> 2day
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
<<<<<<< HEAD
=======
        <h2>举报</h2>
>>>>>>> 2day
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
<<<<<<< HEAD
      <div class="notifications-container">
        <div class="success">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="succes-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <div class="success-prompt-wrap">
              <p class="success-prompt-heading">标题</p>
              <div class="success-prompt-prompt">
                <p>
                  You're happy now? Does this impulsive action is really going
                  to satisfy you? Don't answer me, answer yourself. Anyway, your
                  party-size pizza combo is on it's way.
                </p>
              </div>
              <div class="success-button-container">
                <button type="button" class="success-button-main">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </div>
=======
      <Tip type="success" heading="什么是" content="厉害" />
    </el-main>
  </el-container>
>>>>>>> 2day
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
<<<<<<< HEAD
=======
import Tip from "../components/tip.vue";
>>>>>>> 2day

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
<<<<<<< HEAD
  padding: 100px 10px;
=======
  padding: 100px 10px 0;
>>>>>>> 2day
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
<<<<<<< HEAD
.notifications-container {
  width: 320px;
  height: auto;
  font-size: 0.875rem;
  line-height: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.flex {
  display: flex;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.report-form {
  max-width: 600px;
  margin: 0 auto;
  margin-top: 20px;
  padding: 100px 0;

  @media screen and (max-width: 767px) {
    max-width: 80%;
  }
}

.success {
  padding: 1rem;
  border-radius: 0.375rem;
  background-color: rgb(240 253 244);
}

.succes-svg {
  color: rgb(74 222 128);
  width: 1.25rem;
  height: 1.25rem;
}

.success-prompt-wrap {
  margin-left: 0.75rem;
}

.success-prompt-heading {
  font-weight: bold;
  color: rgb(22 101 52);
}

.success-prompt-prompt {
  margin-top: 0.5rem;
  color: rgb(21 128 61);
}

.success-button-container {
  display: flex;
  margin-top: 0.875rem;
  margin-bottom: -0.375rem;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
}

.success-button-main {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background-color: #ecfdf5;
  color: rgb(22 101 52);
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: bold;
  border-radius: 0.375rem;
  border: none;
}

.success-button-main:hover {
  background-color: #d1fae5;
}
=======
>>>>>>> 2day
</style>
