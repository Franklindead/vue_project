<!-- sign_up -->
<template>
  <div class="container a-container" id="a-container">
    <el-form
      class="form"
      :model="registerForm"
      ref="ruleForm"
      :rules="rules"
      label-width="80px"
      ><el-form-item> <h2 class="form_title title">创建账号</h2></el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model.trim="registerForm.username"
          autofocus
          placeholder="邮箱/手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          placeholder="密码"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          placeholder="确认密码"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="form__button button submit"
          type="primary"
          @click="submitForm(ruleForm)"
          >注册并登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive, getCurrentInstance } from "vue";
import useEmitter from "../../hooks/useEmitter";
import { getRegister, getUsername } from "../../api/index";
import { useUserStore } from "../../store/user";
import { useRouter } from "vue-router";
const { ctx } = getCurrentInstance();
const router = useRouter();
const store = useUserStore();
const registerForm = reactive({
  username: "",
  password: "",
  confirmPassword: "",
});
const ruleForm = ref(null);
const isOpen = ref(true);
const emitter = useEmitter();

const rules = {
  username: [
    { required: true, message: "请输入邮箱/手机号", trigger: "blur" },
    { validator: validateUsername, trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern: /^[a-zA-Z]\w{5,19}$/,
      message: "密码必须由字母开头，由6到20个字符组成",
      trigger: ["blur", "input"],
    },
  ],
  confirmPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    { validator: validateConfirmPassword, trigger: "blur" },
  ],
};

async function validateUsername(rule, value, callback) {
  if (!value) {
    callback(new Error("请输入邮箱/手机号"));
  } else {
    const phoneReg = /^1[3456789]\d{9}$/;
    const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const chineseReg = /[\u4e00-\u9fa5]/;
    if (phoneReg.test(value) || emailReg.test(value)) {
      if (chineseReg.test(value)) {
        callback(new Error("请输入正确的邮箱/手机号，不能含有汉字"));
      } else {
        const res = await getUsername(value);
        if (res.code == 200) {
          callback(new Error(`${res.message}`));
        }
        callback();
      }
    } else {
      callback(new Error("请输入正确的邮箱/手机号"));
    }
  }
}

function validateConfirmPassword(rule, value, callback) {
  if (value !== registerForm.password) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
}
// 提交表单
const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      let res = await getRegister(registerForm);
      if (res.code === 200) {
        store.account = registerForm.username.value;
        router.push("/dashboard");
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

onMounted(() => {
  emitter.on("change", (isOpen) => {
    watch: {
      isOpen: {
        let aContainer = document.querySelector("#a-container");
        aContainer.classList.toggle("is-txl");
        ctx.$refs.ruleForm.resetFields(); //重置表单
      }
    }
  });
});
</script>

<style scoped>
@import "../../assets/css/login.css";
/* 将源码中的css样式单独存放,在各组件中导入就可以。*/
</style>
