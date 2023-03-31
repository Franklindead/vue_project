<template>
  <div class="container">
    <div class="main-body">
      <div class="progress">
        <span>学习进度</span>
        <el-progress
          :text-inside="true"
          :stroke-width="20"
          :percentage="parseFloat(value5)"
          :status="value5 !== 100 ? '' : 'success'"
        />
      </div>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item
          v-show="group.name"
          v-for="(group, index) in chapterList"
          :key="group.id"
          :title="group.name"
          :name="group.id"
        >
          <div
            class="text"
            v-for="(item, i) in group.subChapterList"
            :key="item.id"
            @click="handlestudy(item)"
          >
            {{ Number(index) + 1 }}.{{ Number(i) + 1 }} {{ item.name }}
            <!-- 标记 -->
            <div class="checkbox-input">
              <input
                checked=""
                value="color-1"
                name="color"
                :id="item.userState ? 'color-1' : ''"
                type="checkbox"
              />
              <label for="color-1">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
                    <g
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      id="SVGRepo_tracerCarrier"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g id="Interface / Check">
                        <path
                          stroke-linejoin="round"
                          stroke-linecap="round"
                          stroke-width="2"
                          stroke="#ffffff"
                          d="M6 12L10.2426 16.2426L18.727 7.75732"
                          id="Vector"
                        ></path>
                      </g>
                    </g>
                  </svg>
                </span>
              </label>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="right-body" v-if="videoUrl">
      <el-scrollbar height="900px">
        <h2>{{ chapter.name }}</h2>
        <Video
          v-show="true"
          :videoSrc="videoUrl"
          :width="750"
          :height="450"
          :autoplay="false"
          :controls="true"
          :loop="false"
          :muted="false"
          preload="auto"
          :showPlay="true"
          :playWidth="96"
          zoom="cotain"
        />
        <button class="button" type="button" @click="downLOad">
          <span class="button__text">Download</span>
          <span class="button__icon"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 35 35"
              id="bdd05811-e15d-428c-bb53-8661459f9307"
              data-name="Layer 2"
              class="svg"
            >
              <path
                d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"
              ></path>
              <path
                d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"
              ></path>
              <path
                d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"
              ></path>
            </svg>
          </span>
        </button>
        <div class="test">
          <h3>章节测试</h3>
          <div
            class="test-item"
            v-for="(group, index) in testList"
            :key="index"
          >
            <h4>{{ Number(index) + 1 }}.{{ group.question_content }}</h4>
            <div v-if="group.quType === 1">
              <el-radio-group v-model="radioRes" :disabled="disabled">
                <el-radio v-for="(item, i) in group.count" :key="i" :label="i"
                  >{{ String.fromCharCode(65 + i) }}.{{
                    group?.["option" + String.fromCharCode(65 + i)]
                  }}</el-radio
                >
              </el-radio-group>
              <div class="answer" v-if="disabled">
                <span>正确答案：{{ group.answer }}</span>
              </div>
            </div>
            <div v-else-if="group.quType === 2">
              <el-checkbox-group v-model="checkRes" :disabled="disabled">
                <el-checkbox
                  v-for="(item, i) in group.count"
                  :key="i"
                  :label="i"
                  >{{ String.fromCharCode(65 + i) }}.{{
                    group?.["option" + String.fromCharCode(65 + i)]
                  }}</el-checkbox
                >
              </el-checkbox-group>
              <div class="answer" v-if="disabled">
                <span>正确答案：{{ group.answer }}</span>
              </div>
            </div>
            <div v-else>
              <el-radio-group v-model="judgeRes" :disabled="disabled">
                <el-radio v-for="(item, i) in group.count" :key="i" :label="i"
                  >{{ String.fromCharCode(65 + i) }}.{{
                    group?.["option" + String.fromCharCode(65 + i)]
                  }}</el-radio
                >
              </el-radio-group>
              <div class="answer" v-if="disabled">
                <span>正确答案：{{ group.answer }}</span>
              </div>
            </div>
          </div>
          <el-button type="primary" size="default" @click="handleSubmit"
            >提交</el-button
          >
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import {
  getChapterList,
  getVideoUrl,
  getChapterTest,
  updateTest,
  updateUserStatus,
} from "@/api/chapter";
import Video from "@/components/public/Video.vue";
import { useUserStore } from "@/store/user";

const { userInfo } = useUserStore();

const activeNames = ref<string[]>([]);

const chapterList = ref({});

const value5 = ref(0);

const handleChange = (val: any) => {
  console.log(val);
};

const disabled = ref(false);

onMounted(() => {
  getChapter();
});

// 可以本地静态资源路径
const videoUrl = ref();
// const videoCover = ref(
//   new URL("@/assets/images/Bao.jpg", import.meta.url).href
// );

const user_id = localStorage.getItem("ms_id");

function getChapter() {
  getChapterList({ user_id: user_id, level: userInfo.grade }).then(
    (res: any) => {
      chapterList.value = res.data;
      let i = 1;
      value5.value = ((res.data.finished / res.data.total) * 100).toFixed(1);
      for (let key in res.data) {
        if (res.data[key].name) {
          res.data[key].name = `第${i++}章 ${res.data[key].name}`;
          activeNames.value.push(String(res.data[key].id));
        }
      }
    }
  );
}

// 视频下载
function downLOad() {
  const url = chapter.value.video_url;
  const name = chapter.value.name;
  let a = document.createElement("a");
  a.href = "../../../public/video/" + name + ".mp4";
  //路径中'/'为根目录，即index.html所在的目录
  a.download = name;
  a.click();
}

const chapter = ref({});

const dataList = ref({});

// 试题列表
const testList = ref([]);

const radioRes = ref();

const checkRes = ref([]);

const judgeRes = ref();

const handlestudy = (data: any) => {
  chapter.value = data;
  disabled.value = false;
  getVideoUrl({ videoPath: data.video_url }).then((res: any) => {
    videoUrl.value = new URL(res.data.video, import.meta.url).href;
  });
  getChapterTest({ chapter_id: data.id }).then((res: any) => {
    for (let key in res.data) {
      if (res.data[key].user_answer && res.data[key].user_answer !== null) {
        disabled.value = true;
        if (res.data[key].quType === 1) {
          radioRes.value = Number(res.data[key].user_answer);
        } else if (res.data[key].quType === 2) {
          checkRes.value = res.data[key].user_answer
            .split(",")
            .map((item: any) => {
              return Number(item);
            });
        } else {
          judgeRes.value = Number(res.data[key].user_answer);
        }
      } else if (!Array.isArray(res.data[key])) {
        if (res.data[key].quType === 1) {
          radioRes.value = "";
        } else if (res.data[key].quType === 2) {
          checkRes.value = [];
        } else {
          judgeRes.value = "";
        }
      }
    }
    for (let key in res.data.testList) {
      let k = 0;
      for (let i in res.data.testList[key]) {
        if (i.includes("option") && res.data.testList[key][i] !== null) {
          k++;
        }
      }
      res.data.testList[key].count = k;
    }
    dataList.value = res.data;
    testList.value = res.data.testList;
  });
};

const handleSubmit = () => {
  checkRes.value = checkRes.value.join(",");
  for (let key in dataList.value) {
    if (dataList.value[key].quType === 1) {
      updateTest({
        id: dataList.value[key].id,
        answer: radioRes.value,
        quType: dataList.value[key].quType,
      });
    } else if (dataList.value[key].quType === 2) {
      updateTest({
        id: dataList.value[key].id,
        answer: checkRes.value,
        quType: dataList.value[key].quType,
      });
    } else {
      updateTest({
        id: dataList.value[key].id,
        answer: judgeRes.value,
        quType: dataList.value[key].quType,
      });
    }
  }
  updateUserStatus({
    user_id: user_id,
    chapter_id: chapter.value.id,
    user_state: 1,
  });
  handlestudy(chapter.value);
  disabled.value = true;
  getChapter();
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: space-between;
  .main-body {
    width: 40%;
    padding: 5rem 5rem;
    .progress {
      // display: flex;
      // align-items: center;
      :deep(.el-progress-bar__outer) {
        margin-bottom: 2rem;
      }
    }
    .text {
      // box-shadow: 0 0 1px 1px #e0e0ea;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 10px 0;
      .checkbox-input {
        background-color: #fff;
        border-radius: 20px;
        display: flex;
      }

      .checkbox-input input[type="checkbox"] {
        display: none;
      }

      .checkbox-input input[type="checkbox"] + label {
        color: #333;
        font-family: Arial, sans-serif;
        font-size: 14px;
      }

      .checkbox-input input[type="checkbox"] + label span {
        display: inline-block;
        width: 15px;
        height: 15px;
        margin: -1px 4px 0 0;
        vertical-align: middle;
        cursor: pointer;
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.33);
        background-repeat: no-repeat;
        background-position: center;
        text-align: center;
      }

      .checkbox-input input[type="checkbox"] + label span svg {
        opacity: 0;
        transition: all 0.3s ease;
      }

      .checkbox-input input[type="checkbox"]#color-1 + label span {
        background-color: #2ecc71;
      }
    }
    .text:hover {
      color: #549dfc;
    }
  }
  .right-body {
    padding: 1rem 0.6rem;
    max-width: 750px;
    h2 {
      text-align: center;
      margin: 5rem 0 2rem 0;
    }
    .button {
      position: relative;
      width: 150px;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      border: 1px solid #17795e;
      background-color: #209978;
      overflow: hidden;
    }

    .button,
    .button__icon,
    .button__text {
      transition: all 0.3s;
    }

    .button .button__text {
      transform: translateX(22px);
      color: #fff;
      font-weight: 600;
    }

    .button .button__icon {
      position: absolute;
      transform: translateX(109px);
      height: 100%;
      width: 39px;
      background-color: #17795e;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .button .svg {
      width: 20px;
      fill: #fff;
    }

    .button:hover {
      background: #17795e;
    }

    .button:hover .button__text {
      color: transparent;
    }

    .button:hover .button__icon {
      width: 148px;
      transform: translateX(0);
    }

    .button:active .button__icon {
      background-color: #146c54;
    }

    .button:active {
      border: 1px solid #146c54;
    }
  }
  .test {
    h3 {
      text-align: center;
      padding: 2rem;
    }
    h4 {
      margin: 0.5rem 0;
    }
    .el-button {
      margin-left: 80%;
    }
    .red {
      color: red;
    }
    .green {
      color: green;
    }
  }
}
</style>
