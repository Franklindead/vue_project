<template>
  <el-container class="container">
    <el-aside class="classroom-booking" width="800px">
      <h2>教室预约申请</h2>
      <el-form
        class="form"
        @submit.prevent="submitForm"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="姓名">
          <el-input v-model="name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="studentId" placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="预约日期">
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="请选择预约日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="预约时间">
          <el-time-picker
            v-model="time"
            is-range
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="请选择预约时间范围"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="用途">
          <el-select v-model="purpose" placeholder="请选择用途">
            <el-option label="自习" value="self-study"></el-option>
            <el-option label="讲座" value="lecture"></el-option>
            <el-option label="会议" value="meeting"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预约教室">
          <el-select v-model="classroom" placeholder="请选择预约教室">
            <el-option label="101" value="101"></el-option>
            <el-option label="102" value="102"></el-option>
            <el-option label="103" value="103"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">提交申请</el-button>
        </el-form-item>
      </el-form>
    </el-aside>
    <el-main>
      <Tip type="success" heading="你好" content="123"/>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Tip from "../components/tip.vue";

const name = ref<string>("");
const studentId = ref<string>("");
const phone = ref<string>("");
const date = ref<string>("");
const time = ref<string>("");
const purpose = ref<string>("");
const classroom = ref<string>("");

function submitForm() {
  // 提交表单数据的逻辑代码
}
</script>

<style scoped lang="less">
.classroom-booking {
  margin: 20px;
}
h2 {
  text-align: center;
}
.form {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
}
.el-form-item__label {
  width: 80px;
  text-align: right;
}
.file-uploader-icon {
  font-size: 28px;
  color: #c0c4cc;
  display: block;
  margin-top: 10px;
  text-align: center;
}
.el-image {
  width: 100%;
  height: 200px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #f7f7f7;
  padding: 20px;
  box-sizing: border-box;
}
.el-button {
  margin-top: 20px;
}
</style>
