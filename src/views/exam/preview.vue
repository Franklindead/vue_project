<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="24" style="margin-bottom: 20px">
        <el-alert
          title="点击`开始考试`后将自动进入考试，请诚信考试！"
          type="error"
          style="margin-bottom: 10px"
        />

        <el-card class="pre-exam">
          <div><strong>考试名称：</strong>{{ detailData.title }}</div>
          <div><strong>考试时长：</strong>{{ detailData.totalTime }}分钟</div>
          <div><strong>试卷总分：</strong>{{ detailData.totalScore }}分</div>
          <div><strong>及格分数：</strong>{{ detailData.qualifyScore }}分</div>
          <div><strong>考试描述：</strong>{{ detailData.content }}</div>
        </el-card>
      </el-col>

      <el-col :span="24">
        <el-button
          :loading="loading"
          type="primary"
          icon="CaretRight"
          @click="handleCreate"
        >
          开始考试
        </el-button>

        <el-button @click="handleBack"> 返回 </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { fetchDetail } from "@/api/exam";
import { createPaper, createRecord, saveExam } from "@/api/paper/exam";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useExamStore } from "@/store/exam";
const store = useExamStore();
const { examList } = useExamStore();

const detailData = ref({});

const postForm: any = {
  examId: "",
};
const loading = ref(false);

// 使用路由获取params参数
const router = useRouter();
const { examId } = router.currentRoute.value.params;

onMounted(() => {
  postForm.examId = examId;
  fetchData();
});

async function fetchData() {
  let res = await fetchDetail(postForm);
  if (res) {
    detailData.value = res.data;
  }
}

function handleCreate() {
  loading.value = true;
  const randoms = Math.floor(Math.random() * 99999);
  createPaper(postForm)
    .then((res: any) => {
      if (res.code === 200) {
        examList.value = res.data;
        if (localStorage.getItem("examList")) {
          localStorage.setItem("examList", JSON.stringify(res.data));
        }
        const examRecord: any = {};
        examRecord["id"] = randoms;
        examRecord["userId"] = localStorage.getItem("ms_id");
        examRecord["examId"] = res.data.exam_id;
        examRecord["title"] = res.data.title;
        examRecord["total_time"] = res.data.totalTime;
        examRecord["user_time"] = 0;
        examRecord["total_score"] = res.data.totalScore;
        examRecord["qualify_score"] = res.data.qualifyScore;
        examRecord["state"] = 0;
        examRecord["sort"] = 0;
        saveExam(examRecord);
        for (let key in res.data.radioList) {
          createRecord({
            id: randoms,
            userId: localStorage.getItem("ms_id"),
            examId: res.data.exam_id,
            paperId: res.data.radioList[key].id,
            userAnswer: 0,
            quType: 1,
            score: res.data.radioList[key].score,
          });
        }
        for (let key in res.data.multipleList) {
          createRecord({
            id: randoms,
            userId: localStorage.getItem("ms_id"),
            examId: res.data.exam_id,
            paperId: res.data.multipleList[key].id,
            userAnswer: "0",
            quType: 2,
            score: res.data.multipleList[key].score,
          });
        }
        for (let key in res.data.judgeList) {
          createRecord({
            id: randoms,
            userId: localStorage.getItem("ms_id"),
            examId: res.data.exam_id,
            paperId: res.data.judgeList[key].id,
            userAnswer: 0,
            quType: 3,
            score: res.data.judgeList[key].score,
          });
        }
        setTimeout(function () {
          loading.value = false;
          //将res.data传递给startExam.vue
          router.push({
            name: "startexam",
            params: {
              examId: res.data.id,
              id: randoms,
            },
          });
        }, 1000);
      }
    })
    .catch(() => {
      loading.value = false;
    });
}

function handleBack() {
  router.back();
}
</script>

<style lang="less" scoped>
.pre-exam div {
  line-height: 42px;
  color: #555555;
}
</style>
