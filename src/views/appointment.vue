<template>
  <el-container class="container">
    <el-aside class="classroom-booking" width="800px">
      <h2>教室预约申请</h2>
      <div class="booking">
        <div class="select">
          <el-select
            :disabled="able"
            v-model="day"
            class="m-2"
            placeholder="请选择预约日期"
          >
            <el-option
              v-for="(item, index) in dates"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-select
            :disabled="day !== '' ? false : true"
            v-model="ruleForm.room"
            class="m-2"
            placeholder="请选择预约教室"
          >
            <el-option-group
              v-for="group in roomList"
              :key="group.floor"
              :label="group.label"
              :value="group.floor"
            >
              <el-option
                v-for="item in group.roomList"
                :key="item.room_id"
                :label="item.room_id"
                :value="item.room_id"
              />
            </el-option-group>
          </el-select>
          <el-select
            :disabled="ruleForm.room !== '' ? false : true"
            v-model="startTime"
            class="m-2"
            placeholder="请选择时间"
          >
            <el-option
              v-for="item in timeList"
              :key="item.id"
              :label="item.start_time"
              :value="item.start_time"
            />
          </el-select>
        </div>

        <el-form
          v-if="disabled"
          class="form"
          @submit.prevent="submitForm"
          label-position="left"
          label-width="100px"
          :rules="rules"
          ref="ruleFormRef"
          :model="ruleForm"
        >
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="ruleForm.name"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="学号" prop="studentId">
            <el-input
              v-model="ruleForm.studentId"
              placeholder="请输入学号"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input
              v-model="ruleForm.phone"
              placeholder="请输入联系电话"
            ></el-input>
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
          <el-form-item label="用途" prop="purpose">
            <el-select
              v-model="ruleForm.purpose"
              placeholder="请选择用途"
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
            >
              <el-option label="自习" value="自习"></el-option>
              <el-option label="讲座" value="讲座"></el-option>
              <el-option label="会议" value="会议"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit">提交申请</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-aside>
    <el-main>
      <Tip
        v-for="(item, index) in bookList"
        :key="index"
        type="success"
        :heading="item.room_id"
        :content="item.useing"
        :time="item.start_time"
        :id="item.id"
        @delete="deleteBook"
      />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ElNotification, FormInstance } from "element-plus";
import { nextTick, onMounted, reactive, ref, toRaw, watch } from "vue";
import {
  getByFloor,
  getRoomTime,
  submitBook,
  getBookList,
  cancelBook,
} from "../api/book";
import Tip from "../components/tip.vue";

// 定义状态变量
const disabled = ref<boolean>(false);
const time = ref<[Date, Date]>([new Date(), new Date()]);
const roomList = ref<Object>([]);
const day = ref<string>("");
const dates = ref<string[]>([]);
const ruleFormRef = ref<FormInstance>();
let data = ref<object>({
  room_id: "",
  week: "",
});
const able = ref<boolean>(false);
const startTime = ref<string>("");
const timeList = ref<string[]>([]);
const bookList = ref<string[]>([]);
let user_id = localStorage.getItem("ms_id");

onMounted(async () => {
  const today = new Date();
  for (let i = 1; i <= 10; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);
    dates.value.push(String(nextDay.getMonth() + 1 + `.` + nextDay.getDate()));
  }

  // 获取预约列表
  getUserList();
  if (bookList.value.length > 2) {
    able.value = true;
    ElNotification({
      title: "提示",
      message: "您已经预约了三次，无法再次预约",
      type: "warning",
    });
  }
});

const getUserList = () => {
  getBookList({ user_id: user_id }).then((res: any) => {
    bookList.value = res.data;
  });
};

const ruleForm = reactive({
  name: "",
  room: "",
  studentId: "",
  phone: "",
  purpose: "",
});

const rules = {
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  studentId: [{ required: true, message: "请输入学号", trigger: "blur" }],
  phone: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
  purpose: [{ required: true, message: "请选择用途", trigger: "blur" }],
};

// 删除预约
function deleteBook(id: string) {
  cancelBook({ id: id }).then((res: any) => {
    if (res.code === 200) {
      ElNotification({
        title: "提示",
        message: "取消预约成功",
        type: "success",
      });
      getUserList();
    }
  });
}

function submitForm() {
  if (!ruleFormRef.value) return;
  // 校验表单
  ruleFormRef.value?.validate((valid) => {
    if (valid) {
      time.value.forEach((item, index) => {
        // 将时间字符串转换为时间戳
        const timestamp = Date.parse(item.toString());
        // 根据时间戳创建一个 Date 对象
        const date = new Date(timestamp);
        // 获取各个日期组成部分
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        // 拼接成日期字符串
        const dateTimeString =
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hour +
          ":" +
          minute +
          ":" +
          second;
        if (index === 0) {
          ruleForm.startTime = dateTimeString;
        } else {
          ruleForm.endTime = dateTimeString;
        }
      });
      if (Object.keys(bookList.value).length > 0) {
        for (const key in bookList.value) {
          const userDay = new Date(bookList.value[key].start_time).getDay();
          console.log(day.value.split(".")[1]);

          if (userDay === Number(day.value.split(".")[1])) {
            ElNotification({
              title: "警告",
              message: "您已经预约了该日期",
              type: "warning",
            });
            ruleFormRef.value?.resetFields();
            return false;
          }
        }
      }
      ruleForm.week = data.value.week;
      ruleForm.user_id = localStorage.getItem("ms_id");
      submitBook(ruleForm).then((res: any) => {
        if (res.code === 200) {
          ElNotification({
            title: "Success",
            message: "预约成功",
            type: "success",
          });
          ruleFormRef.value?.resetFields();
          getUserList();
        } else {
          ElNotification({
            title: "Error",
            message: "预约失败",
            type: "error",
          });
          return false;
        }
      });
    } else {
      ElNotification({
        title: "警告",
        message: "请填写相关信息后重试",
        type: "warning",
      });
      return false;
    }
  });
}
// 保存初始值
const initialRuleForm = toRaw(ruleForm);

// 监听room变化
watch(day, (newVal, oldVal) => {
  //假设用户选择的日期格式是4.15将用户选择的日期转换为星期数
  const dateParts = newVal.split(".");
  const year = new Date().getFullYear(); // 假设年份为当前年份
  const month = parseInt(dateParts[0]) - 1; // 月份需要减1，因为JavaScript中月份从0开始
  const Day = parseInt(dateParts[1]);
  const date = new Date(year, month, Day);
  const week = date.getDay();
  if (newVal !== oldVal) {
    if (week === 0 || week === 6) {
      ElNotification({
        title: "Warning",
        message: "周末不可预约",
        type: "warning",
      });
      // 使用nextTick()方法，等待数据更新后再执行
      nextTick(() => {
        day.value = "";
      });
    } else {
      for (let key in bookList.value) {
        const dt = new Date(bookList.value[key].start_time);
        const newDay = dt.getDate();
        if (newDay === Day) {
          ElNotification({
            title: "Warning",
            message: "该时间段已经预约过了",
            type: "warning",
          });
          // 使用nextTick()方法，等待数据更新后再执行
          nextTick(() => {
            day.value = "";
          });
        }
      }
      getByFloor().then((res: any) => {
        roomList.value = res.data;
      });
      data.value.week = week;
      if (ruleForm.room !== "") {
        getRoomTime(data.value).then((res: any) => {
          timeList.value = res.data;
        });
      }
    }
  }
});

watch(
  () => ruleForm.room,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      data.value.room_id = newVal;
      getRoomTime(data.value).then((res: any) => {
        let today = new Date();
        timeList.value = res.data;
      });
    }
  }
);

watch(startTime, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    disabled.value = true;
    const dateParts = day.value.split(".");
    const year = new Date().getFullYear(); // 假设年份为当前年份
    const month = parseInt(dateParts[0]) - 1; // 月份需要减1，因为JavaScript中月份从0开始
    const nowday = parseInt(dateParts[1]);
    const hour = Number(newVal.split(":")[0]);
    const minute = Number(newVal.split(":")[1]);
    const startDate = new Date(year, month, nowday, hour, minute);
    const endDate = new Date(year, month, nowday, hour + 2, 0);
    time.value[0] = startDate;
    time.value[1] = endDate;
  }
});
</script>

<style scoped lang="less">
.classroom-booking {
  margin: 20px;
}
.booking {
  display: flex;
  flex-direction: column;

  .select {
    max-width: 500px;
    display: flex;
    flex-direction: row;
    margin: 20px auto;
    padding: 20px;
  }
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
