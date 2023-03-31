<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card style="margin-bottom: 10px">
          距离考试结束还有：
          <exam-timer
            v-model="paperData.leftSeconds"
            :leftSeconds="paperData.leftSeconds"
            @timeout="doHandler"
          />

          <el-button
            :loading="loading"
            style="float: right; margin-top: -10px"
            type="primary"
            icon="Plus"
            @click="handHandExam()"
          >
            {{ handleText }}
          </el-button>
        </el-card>
      </el-col>

      <el-col :span="5" :xs="24" style="margin-bottom: 10px">
        <el-card class="content-h">
          <p class="card-title">答题卡</p>
          <el-row :gutter="24" class="card-line" style="padding-left: 10px">
            <el-tag type="info">未作答</el-tag>
            <el-tag type="success">已作答</el-tag>
          </el-row>

          <div
            v-if="
              paperData.radioList !== undefined &&
              paperData.radioList.length > 0
            "
          >
            <p class="card-title">单选题</p>
            <el-row :gutter="24" class="card-line">
              <el-tag
                v-for="item in paperData.radioList"
                :type="cardItemClass(item.answered, item.sort)"
                @click="handSave(item.sort)"
              >
                {{ item.sort + 1 }}</el-tag
              >
            </el-row>
          </div>

          <div
            v-if="
              paperData.multiList !== undefined &&
              paperData.multiList.length > 0
            "
          >
            <p class="card-title">多选题</p>
            <el-row :gutter="24" class="card-line">
              <el-tag
                v-for="item in paperData.multiList"
                :type="cardItemClass(item.answered, item.sort)"
                @click="handSave(item.sort)"
                >{{ item.sort + 1 }}</el-tag
              >
            </el-row>
          </div>

          <div
            v-if="
              paperData.judgeList !== undefined &&
              paperData.judgeList.length > 0
            "
          >
            <p class="card-title">判断题</p>
            <el-row :gutter="24" class="card-line">
              <el-tag
                v-for="item in paperData.judgeList"
                :type="cardItemClass(item.answered, item.sort)"
                @click="handSave(item.sort)"
                >{{ item.sort + 1 }}</el-tag
              >
            </el-row>
          </div>
        </el-card>
      </el-col>

      <el-col :span="19" :xs="24">
        <el-card class="qu-content content-h">
          <p v-if="cardItem?.question_content">
            {{ cardItem.sort + 1 }}.{{ cardItem?.question_content }}
          </p>
          <div v-if="cardItem.quType === 1 || cardItem.quType === 3">
            <el-radio-group v-model="radioValue">
              <el-radio
                v-for="(item, index) in cardItem.count"
                :key="index"
                :label="index"
                @change="handChange(index)"
              >
                {{ String.fromCharCode(65 + index) }}.{{
                  cardItem?.["option" + String.fromCharCode(65 + index)]
                }}
              </el-radio>
            </el-radio-group>
          </div>

          <div v-if="cardItem.quType === 2">
            <el-checkbox-group v-model="multiValue">
              <el-checkbox
                v-for="(item, index) in cardItem?.count"
                :key="index"
                :label="index"
                @change="multiChange(index)"
                >{{ String.fromCharCode(65 + index) }}.{{
                  cardItem?.["option" + String.fromCharCode(65 + index)]
                }}
              </el-checkbox>
            </el-checkbox-group>
          </div>

          <div
            style="margin-top: 20px; display: flex; justify-content: flex-end"
          >
            <el-button
              v-if="showPrevious"
              type="primary"
              icon="Back"
              @click="handPrevious()"
            >
              上一题
            </el-button>

            <el-button
              v-if="showNext"
              type="warning"
              icon="Right"
              @click="handNext()"
            >
              下一题
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="ExamProcess">
import {
  handExam,
  createRecord,
  saveExam,
  getPaperInfo,
} from "@/api/paper/exam";
import { ElMessageBox } from "element-plus";
import { ref, onMounted, reactive, watch, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import ExamTimer from "./components/ExamTimer.vue";
import { useExamStore } from "@/store/exam";

const useExam = useExamStore();

const showPrevious = ref(false);
const showNext = ref(true);
const loading = ref(false);
const handleText = ref("交卷");
// 试卷ID
const paperId = ref("");
// 当前答题卡
const cardItem = ref({});
const allItem = ref([]);
// 试卷信息
const paperData = reactive({
  leftSeconds: 99999,
  radioList: [],
  multiList: [],
  judgeList: [],
});

// 单选选定值
const radioValue = ref();
// 多选选定值
const multiValue = ref([]);
// 获取时间
const leftSeconds = ref(0);
// 定义路由
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const examList = useExam.examList.value;
  paperData.radioList = examList.radioList;
  paperData.multiList = examList.multipleList;
  paperData.judgeList = examList.judgeList;
  paperData.leftSeconds = examList.totalTime;
  cardItem.value = paperData.radioList[0];
  // 将所有题目放入数组allItem
  allItem.value = paperData.radioList.concat(
    paperData.multiList,
    paperData.judgeList
  );
  paperId.value = route.params.id as string;
  // 如果用户刷新页面，获取时间信息
  getPaperInfo({ paperId: paperId.value }).then((res: any) => {
    if (res) {
      paperData.leftSeconds = res.data.total_time - res.data.user_time;
      allItem.value.forEach((item: any) => {
        res.data.answer.forEach((v: any) => {
          if (item.id === v.paperId && v.userAnswer !== null) {
            if (item.quType === 1 && item.userAnswer != 0) {
              item.answered = true;
              item.userAnswer = v.userAnswer;
              item.index = Number(item.userAnswer.charCodeAt() - 65);
            } else if (item.quType === 2 && item.userAnswer !== "0") {
              let str: any = [];
              item.userAnswer.split("").forEach((v: any) => {
                str.push(Number(v.charCodeAt() - 65));
              });
              item.index = str;
            } else if (item.quType === 3 && item.userAnswer != 0) {
              item.answered = true;
              item.userAnswer = v.userAnswer;
              item.index = Number(item.userAnswer.charCodeAt() - 65);
            } else {
              item.index = [];
            }
          }
        });
        if (String(item.sort) === res.data.sort) {
          cardItem.value = item;
          if (
            res.data.answer[res.data.sort].quType === 1 ||
            res.data.answer[res.data.sort].quType === 3
          ) {
            radioValue.value = cardItem.value.index;
          } else {
            multiValue.value = cardItem.value.index;
          }
        }
      });
      handButton();
    }
  });
});

// 答题卡样式
function cardItemClass(answered: any, sort: Number) {
  if (sort === cardItem.value.sort) {
    return "warning";
  }

  if (answered) {
    return "success";
  }

  if (!answered) {
    return "info";
  }
}
// 单选选项改变
function handChange(index: any) {
  allItem.value[cardItem.value.sort].answered = true;
  allItem.value[cardItem.value.sort].userAnswer = String.fromCharCode(
    65 + index
  );
  allItem.value[cardItem.value.sort].index = index;
  // 保存答案
  // handSave(cardItem.value);
}
// 多选选项变化
function multiChange(index: any) {
  allItem.value[cardItem.value.sort].answered = true;
  // 存入多个选项
  let answers = "";
  if (multiValue.value.length > 0) {
    multiValue.value.forEach((item: any) => {
      // 将String.fromCharCode(65 + item)添加到answers后，并用，分隔
      answers += String.fromCharCode(65 + item);
      answers = answers.split("").sort().join("");
      allItem.value[cardItem.value.sort].userAnswer = answers;
    });
  } else {
    allItem.value[cardItem.value.sort].userAnswer = "";
  }
  allItem.value[cardItem.value.sort].index = multiValue.value;
  // 保存答案
  // handSave(cardItem.value);
}
/**
 * 统计有多少题没答的
 * @returns {number}
 */
function countUnAnswer() {
  let count = 0;
  paperData.radioList.forEach((item) => {
    if (!item.answered) {
      count++;
    }
  });
  paperData.multiList.forEach((item) => {
    if (!item.answered) {
      count++;
    }
  });
  paperData.judgeList.forEach((item) => {
    if (!item.answered) {
      count++;
    }
  });
  return count;
}
/**
 * 下一题
 */
function handNext() {
  cardItem.value = allItem.value[cardItem.value.sort + 1];
  // 判断cardItem.value.index是否有值，有值就将该值赋值给radioValue
  if (cardItem.value.index) {
    radioValue.value = cardItem.value.index;
    multiValue.value = cardItem.value.index;
  } else {
    radioValue.value = "";
    multiValue.value = [];
  }

  handSave(undefined);
}
/**
 * 上一题
 */
function handPrevious() {
  cardItem.value = allItem.value[cardItem.value.sort - 1];
  const sort = cardItem.value.sort;
  if (cardItem.value.index) {
    radioValue.value = cardItem.value.index;
    multiValue.value = cardItem.value.index;
  } else {
    radioValue.value = "";
    multiValue.value = [];
  }
  handSave(undefined);
}
// 交卷
function doHandler(time: any) {
  leftSeconds.value = time;
  if (time <= 1) {
    handleText.value = "正在交卷，请等待...";
    loading.value = true;
    saveUserExam(1);
  }
}

function handHandExam() {
  const count = countUnAnswer();
  if (count > 0) {
    ElMessageBox.confirm("您还有" + count + "道题未答，是否交卷？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        handleText.value = "正在交卷，请等待...";
        loading.value = true;
        saveUserExam(1);
      })
      .catch(() => {
        handleText.value = "交卷";
        loading.value = false;
      });
  } else {
    handleText.value = "正在交卷，请等待...";
    loading.value = true;
    saveUserExam(1);
  }
}

// 按钮的显示与隐藏
function handButton() {
  if (cardItem.value.sort === allItem.value[0].sort) {
    showPrevious.value = false;
  } else {
    showPrevious.value = true;
  }

  const last = allItem.value.length - 1;
  if (cardItem.value.sort === allItem.value[last].sort) {
    showNext.value = false;
  } else {
    showNext.value = true;
  }
}

//保存答案
function handSave(sort: Number | undefined) {
  if (sort !== undefined) {
    cardItem.value = allItem.value[sort];
    if (allItem.value[sort].index !== undefined) {
      radioValue.value = allItem.value[sort].index;
      multiValue.value = allItem.value[sort].index;
    } else {
      radioValue.value = "";
      multiValue.value = [];
    }
  }
  handButton();
  saveUserExam(0);
}
function saveUserExam(state: any) {
  // 存储考试记录
  const examRecord: any = {};
  const examList = useExam.examList.value;
  examRecord["id"] = paperId.value;
  examRecord["userId"] = localStorage.getItem("ms_id");
  examRecord["examId"] = route.params.examId;
  examRecord["title"] = examList.title;
  examRecord["total_time"] = examList.totalTime;
  examRecord["user_time"] = examList.totalTime - leftSeconds.value;
  examRecord["total_score"] = examList.totalScore;
  examRecord["qualify_score"] = examList.qualifyScore;
  examRecord["state"] = state;
  examRecord["sort"] = cardItem.value.sort;
  saveExam(examRecord).then(() => {
    if (state === 1) {
      router.push({
        name: "result",
        params: {
          paperId: paperId.value,
        },
      });
    }
  });
}
// 遍历allItem.value，监听userAnswer的变化
watch(
  () => allItem.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      newVal.forEach((item: any) => {
        watch(
          () => item.userAnswer,
          (newValue, oldValue) => {
            if (newValue === "") {
              item.answered = false;
            }
            const answer: any = {};
            if (newValue !== oldValue) {
              answer["id"] = paperId.value;
              answer["userId"] = localStorage.getItem("ms_id");
              answer["examId"] = route.params.examId;
              answer["paperId"] = item.id;
              answer["userAnswer"] =
                item.userAnswer.length > 0 ? item.userAnswer : "0";
              answer["quType"] = item.quType;
              answer["score"] = item.score;
              createRecord(answer);
            }
          },
          { deep: true }
        );
      });
    }
  },
  { deep: true }
);
</script>

<style lang="less" scoped>
.app-container {
  padding: 10px;
  .qu-content {
    div {
      line-height: 30px;
      width: 100%;
    }
  }
  .el-card__body {
    p {
      font-size: 20px;
      line-height: 40px;
    }
  }
  .el-tag {
    width: 60px;
    height: 30px;
    font-size: 16px;
  }
  .el-checkbox-grop {
    label {
      width: 100%;
    }
  }

  .el-radio-group {
    label {
      width: 100%;
    }
  }
  .card-title {
    background: #eee;
    line-height: 35px;
    text-align: center;
    font-size: 16px;
  }
  .card-line {
    padding-left: 10px;
  }
  .card-line {
    span {
      cursor: pointer;
      margin: 10px 5px;
    }
  }
  // 样式穿透
  :deep(.el-radio) {
    padding: 9px 20px 9px 10px;
    margin: 10px 0;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    width: 100%;
  }

  :deep(.el-checkbox) {
    padding: 9px 20px 9px 10px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    margin: 10px 0;
    width: 100%;
  }
  .is-checked {
    border: #409eff 1px solid;
  }
  :deep(.el-checkbox__inner) {
    display: none;
  }
  :deep(.el-radio__inner) {
    display: none;
  }

  :deep(.el-checkbox__label) {
    line-height: 30px;
  }

  :deep(.el-radio__label) {
    line-height: 30px;
  }
}
</style>
