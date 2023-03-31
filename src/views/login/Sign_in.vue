<!-- sign_in -->
<template>
  <div class="container b-container" id="b-container">
    <el-form
      ref="loginForm"
      :model="loginFrom"
<<<<<<< HEAD
      label-width="80"
=======
      label-width="80px"
>>>>>>> 2day
      class="form"
      id="b-form"
    >
      <el-form-item> <h2 class="form_title title">登录网站</h2></el-form-item>
      <el-form-item label="用户名" prop="username" class="form__input">
        <el-input
          v-model="loginFrom.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" class="form__input">
        <el-input
          v-model.lazy="loginFrom.password"
          type="password"
          show-password
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码">
        <el-input
          class="identify"
          v-model="code"
          maxlength="6"
          placeholder="请输入验证码"
        ></el-input>
        <!-- 验证码 -->
        <Identify :identifyCode="identifyCode" @click="refreshCode"
      /></el-form-item>
      <el-form-item>
        <a class="form__link" @click="dialogVisible = true"
          >忘记密码？</a
        ></el-form-item
      >
      <el-form-item>
        <el-button
          class="form__button button submit"
          type="primary"
          @click="submitForm"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 找回密码 -->
    <el-dialog
      v-model="dialogVisible"
      title="密码找回"
      width="40%"
      :before-close="handleClose"
    >
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="Step 1" />
        <el-step title="Step 2" />
      </el-steps>
      <div v-if="active === 0">
        <el-form
          class="form"
          :model="codeForm"
          label-width="80px"
          style="padding-top: 30px"
        >
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="codeForm.email"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input
              class="identify"
              v-model="codeForm.code"
              placeholder="验证码"
            ></el-input
            ><el-button
              type="primary"
              size="large"
              @click="sendCode()"
              style="width: 100px"
              :disabled="text == '发送验证码' ? false : true"
            >
              {{ text }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="active === 1">
        <el-input v-model="changePwd" placeholder="请输入密码"></el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="active == 1" @click="active--">上一步</el-button>
          <el-button
            v-if="active == 0"
            type="primary"
            @click="dialogVisible = false"
          >
            取消
          </el-button>
          <el-button v-if="active == 1" type="primary" @click="updatePwd()"
            >修改密码</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive, watch, getCurrentInstance } from "vue";
import useEmitter from "../../hooks/useEmitter";
import Identify from "../identify.vue";
import { sendEmailCode, updatePassword, login } from "../../api/index";
import { useUserStore } from "../../store/user";
import { useRouter } from "vue-router";
import { useTagsStore } from "../../store/tags";
import { usePermissStore } from "../../store/permiss";
const router = useRouter();
const store = useUserStore();
const { ctx } = getCurrentInstance();
let active = ref(0);
const dialogVisible = ref(false);
const isOpen = ref(true);
const emitter = useEmitter();
let emailCode = ref("");
const code = ref("");
const identifyCode = ref("1234");
const identifyCodes = ref("1234567890abcdefjhijklinopqrsduvwxyz");
// forget表单
const codeForm = reactive({
  email: "",
  code: "",
});
const changePwd = ref("");
// 表单数据
const loginFrom = reactive({
  username: "",
  password: "",
});
// 修改密码
const updatePwd = async () => {
  if (changePwd.value) {
    const result = await updatePassword(codeForm.email, changePwd.value);
    if (result.code == 200) {
      Elmessage.success("修改成功");
      dialogVisible.value = false;
    }
  } else {
    Elmessage.error("请输入修改后的密码");
  }
};

let text = ref("发送验证码");
// 获取邮箱验证码
const sendCode = async () => {
  if (codeForm.email) {
    let count = 60; // 初始计数值为60秒
    const timer = setInterval(function () {
      text.value = count;
      count--; // 每秒递减1

      if (count <= 0) {
        // 计时器结束
        clearInterval(timer); // 清除计时器
        text.value = "发送验证码";
      }
    }, 1000); // 每秒执行一次计时器回调函数
    const res = await sendEmailCode(codeForm.email);
    if (res) {
      emailCode.value = res.message;
    } else {
      ElMessage("发送失败，请重试");
    }
  } else {
    ElMessage({ message: "请输入邮箱", type: "error" });
  }
};

// 重置验证码
const refreshCode = () => {
  identifyCode.value = "";
  makeCode(identifyCode, 4);
};

const makeCode = (o, l) => {
  for (let i = 0; i < l; i++) {
    identifyCode.value +=
      identifyCodes.value[randomNum(0, identifyCodes.value.length)];
  }
};

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const permiss = usePermissStore();

// 登录按钮
const submitForm = async () => {
  const { username, password } = loginFrom;
  if (username && password) {
    if (identifyCode.value === code.value) {
      let res = await login(username, password);
      if (res.code === 200) {
<<<<<<< HEAD
        ElMessage.success("登录成功");
        localStorage.setItem("ms_username", username);
        const keys =
          permiss.defaultList[username == "9527" ? "admin" : "user"];
=======
        let data = res.data[0];
        ElNotification.success("登录成功");
        localStorage.setItem("ms_username", data.userName);
        const keys =
          permiss.defaultList[data.rank == "admin" ? "admin" : "user"];
>>>>>>> 2day
        permiss.handleSet(keys);
        localStorage.setItem("ms_keys", JSON.stringify(keys));
        router.push("/");
      } else {
        ElMessage.error(`${res.message}`);
      }
    } else {
      ElMessage.error("验证码错误,请重试");
      refreshCode();
      code.value = "";
    }
  } else {
    ElMessage.error("请输入用户名和密码");
  }
};

const handleClose = (done) => {
  ElMessageBox.confirm("你确定退出吗?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
// 监测邮箱验证码
watch(
  () => codeForm.code,
  (newValue, oldValue) => {
    if (newValue === emailCode.value) {
      active.value++;
    }
  }
);
<<<<<<< HEAD

=======
// 重置标签
>>>>>>> 2day
const tags = useTagsStore();
tags.clearTags();

onMounted(() => {
  refreshCode();
  emitter.on("change", (isOpen) => {
    watch: {
      isOpen: {
        let bContainer = document.querySelector("#b-container");
        bContainer.classList.toggle("is-txl");
        bContainer.classList.toggle("is-z200");
        ctx.$refs.loginForm.resetFields(); //重置表单
      }
    }
  });
});
</script>
<style scoped>
@import "../../assets/css/login.css";
</style>
