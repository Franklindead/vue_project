<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>基础信息</span>
            </div>
          </template>
          <div class="info">
            <div class="info-image" @click="showDialog">
              <el-avatar :size="100" :src="userInfo.avatar" />
              <span class="info-edit">
                <i class="el-icon-lx-camerafill"></i>
              </span>
            </div>
            <div class="info-name">{{ userInfo.userName }}</div>
            <div class="info-desc">{{ userInfo.Introduction }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>账户编辑</span>
            </div>
          </template>
          <el-form label-width="90px">
            <el-form-item label="用户名：">
              <el-input
                v-if="disabled"
                v-model="userForm.userName"
                placeholder="用户名"
              ></el-input>
              <span v-else>{{ userInfo.userName }}</span>
            </el-form-item>
            <el-form-item label="姓名：">
              <el-input
                v-if="disabled"
                v-model="userForm.name"
                placeholder="姓名"
              ></el-input>
              <span v-else>{{ userInfo.name ? userInfo.name : "暂无" }}</span>
            </el-form-item>
            <el-form-item label="邮箱：">
              <el-input
                v-if="disabled"
                v-model="userForm.email"
                placeholder="邮箱"
              ></el-input>
              <span v-else>{{ userInfo.email ? userInfo.email : "暂无" }}</span>
            </el-form-item>
            <el-form-item label="密码：">
              <el-input
                v-if="disabled"
                v-model="userForm.password"
                placeholder="密码"
              ></el-input>
              <!-- 只显示密码的前3位，其他用*代替 -->
              <span v-else>{{
                userInfo.password.substring(0, 3) + "***"
              }}</span>
            </el-form-item>
            <el-form-item label="电话：">
              <el-input
                v-if="disabled"
                v-model="userForm.phone"
                placeholder="电话"
              ></el-input>
              <span v-else>{{ userInfo.phone ? userInfo.phone : "暂无" }}</span>
            </el-form-item>
            <el-form-item label="学号：">
              <el-input
                v-if="disabled"
                v-model="userForm.student_number"
                placeholder="学号"
              ></el-input>
              <span v-else>{{
                userInfo.student_number ? userInfo.student_number : "暂无"
              }}</span>
            </el-form-item>
            <el-form-item label="个人简介：">
              <el-input
                v-if="disabled"
                v-model="userForm.Introduction"
                placeholder="个人简介"
              ></el-input>
              <span v-else>{{ userInfo.Introduction }}</span>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                v-if="!disabled"
                @click="disabled = true"
              >
                编辑
              </el-button>
              <el-button type="primary" v-else @click="onSubmit">
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="裁剪图片" v-model="dialogVisible" width="600px">
      <vue-cropper
        ref="cropper"
        :src="imgSrc"
        :ready="cropImage"
        :zoom="cropImage"
        :cropmove="cropImage"
        style="width: 100%; height: 400px"
      ></vue-cropper>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="crop-demo-btn" type="primary"
            >选择图片
            <input
              class="crop-input"
              type="file"
              name="image"
              accept="image/*"
              @change="setImage"
            />
          </el-button>
          <el-button type="primary" @click="saveAvatar">上传并保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="user">
import { onMounted, reactive, ref } from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import { updateAvatar } from "@/api/user";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/user";
import { saveData } from "@/api/common";
const userStore = useUserStore();
const { userInfo } = useUserStore();
const disabled = ref(false);
const name = localStorage.getItem("ms_username");
const form = reactive({
  old: "",
  new: "",
  desc: "不可能！我的代码怎么可能会有bug！",
});
const onSubmit = () => {
  saveData("/home/updateUser", userForm).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success("修改成功");
      disabled.value = false;
      // userStore.fetchUserInfo2(userInfo.id);
    }
  });
};

const avatarImg = ref();
const imgSrc = ref("");
const cropImg = ref("");
const dialogVisible = ref(false);
const cropper: any = ref();

const showDialog = () => {
  dialogVisible.value = true;
  imgSrc.value = avatarImg.value;
};

const userForm = reactive({
  id: userInfo.id,
  userName: "",
  name: "",
  email: "",
  password: "",
  phone: "",
  student_number: "",
  Introduction: "",
});

const getUserInfo = () => {
  avatarImg.value = userInfo.avatar;
  userForm.name = userInfo.name;
  userForm.userName = userInfo.userName;
  userForm.email = userInfo.email;
  userForm.password = userInfo.password;
  userForm.phone = userInfo.phone;
  userForm.student_number = userInfo.student_number;
  userForm.Introduction = userInfo.Introduction;
};

onMounted(() => {
  getUserInfo();
  // userStore.fetchUserInfo2(userInfo.id);
});

const user_id = localStorage.getItem("ms_id");

// 定义一个函数，用于设置上传的图片
const setImage = (e: any) => {
  // 获取上传的文件
  const file = e.target.files[0];
  // 如果上传的文件类型不是图片，则直接返回
  if (!file.type.includes("image/")) {
    return;
  }
  // 创建 FileReader 对象，用于读取文件
  const reader = new FileReader();
  // 当 FileReader 读取文件完成时，执行 onload 回调函数
  reader.onload = (event: any) => {
    // 将弹窗显示出来
    dialogVisible.value = true;
    // 设置图片的源数据
    imgSrc.value = event.target.result;
    // 如果裁剪器对象存在，则使用读取的图片替换裁剪器中的图片
    cropper.value && cropper.value.replace(event.target.result);
  };
  // 开始读取文件，将文件内容读取为 base64 编码的数据
  reader.readAsDataURL(file);
};

// 定义一个函数，用于裁剪图片
const cropImage = () => {
  // 获取裁剪后的图片数据，将裁剪后的图片转换为 base64 编码的数据格式
  cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
};

// 定义一个函数，用于保存头像
const saveAvatar = () => {
  // 将裁剪后的图片数据设置为头像图片的数据
  avatarImg.value = cropImg.value;
  // 隐藏弹窗
  dialogVisible.value = false;
  // 创建 FormData 对象，用于向后端发送文件数据
  const formData = new FormData();
  formData.append("avatar", dataURItoBlob(avatarImg.value));
  formData.append("user_id", user_id || "");
  console.log(formData);

  // 调用 updateAvatar 函数将图片数据上传到后端
  updateAvatar(formData)
    .then((response: any) => {
      // 成功上传图片，显示成功提示
      ElMessage.success(response.message);
      // 更新头像图片的访问 URL
      // userStore.fetchUserInfo2(userInfo.id);
    })
    .catch((error) => {
      // 上传图片失败，显示错误提示
      ElMessage.error(error.message || "Failed to upload avatar");
    });
};
// 将 base64 编码的数据转换为 Blob 对象
function dataURItoBlob(dataURI: string) {
  const byteString = atob(dataURI.split(",")[1]);
  const type = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: type });
}
</script>

<style scoped>
.info {
  text-align: center;
  padding: 35px 0;
}
.info-image {
  position: relative;
  margin: auto;
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 50px;
  overflow: hidden;
}

.info-edit {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.info-edit i {
  color: #eee;
  font-size: 25px;
}
.info-image:hover .info-edit {
  opacity: 1;
}
.info-name {
  margin: 15px 0 10px;
  font-size: 24px;
  font-weight: 500;
  color: #262626;
}
.crop-demo-btn {
  position: relative;
}
.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
