<template>
  <div class="container">
    <div
      v-if="breakShow"
      style="cursor: pointer; padding: 20px 0"
      @click="toExam"
    >
      <el-alert
        title="您有正在进行的考试，离线太久考试将被作废哦，点击此处可继续考试！"
        type="error"
        effect="light"
        :closable="false"
      ></el-alert>
    </div>
    <data-table ref="pagingTable" :options="options" :list-query="listQuery">
      <template #filter-content>
        <el-input
          v-model="listQuery.params.title"
          placeholder="搜索考试名称"
          style="width: 200px"
          class="filter-item"
        ></el-input>
      </template>
      <template #data-columns>
        <el-table-column label="考试名称" prop="title" show-overflovw-tooltip />
        <el-table-column label="考试时间" width="220px" align="center">
          <template v-slot="scope">
            <span v-if="scope.row.timeLimit">
              {{ scope.row.statTime }} ~ {{ scope.row.endTime }}
            </span>
            <span v-else>不限时</span>
          </template>
        </el-table-column>
        <el-table-column label="考试时长" align="center">
          <template v-slot="scope"> {{ scope.row.totalTime }}分钟 </template>
        </el-table-column>

        <el-table-column label="考试总分" prop="totalScore" align="center" />

        <el-table-column label="及格线" prop="qualifyScore" align="center" />

        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button
              v-if="scope.row.examState === 0"
              icon="CaretRight"
              type="primary"
              @click="handlePre(scope.row.id)"
              :disabled="breakShow"
              >去考试</el-button
            >
            <el-button v-if="scope.row.examState === 1" icon="Lock" disabled
              >已禁用</el-button
            >
            <el-button v-if="scope.row.examState === 2" icon="Warning" disabled
              >待开始</el-button
            >
            <el-button
              v-if="scope.row.examState === 3"
              icon="CirecleClose"
              disabled
              >已结束</el-button
            >
            <el-button
              v-if="scope.row.state === 4"
              icon="CaretRight"
              type="primary"
              @click="handlePre(scope.row.id)"
              :disabled="breakShow"
              >去测试</el-button
            >
          </template>
        </el-table-column>
      </template>
    </data-table>
  </div>
</template>

<script setup lang="ts">
import { checkProcess } from "@/api/paper/exam";
import DataTable from "@/components/public/DataTable.vue";
import { useUserStore } from "@/store/user";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

//定义变量
const breakShow = ref(false);
const breakId = ref("");
const examList = ref();
const paperId = ref("");
const listQuery = reactive({
  current: 1,
  size: 10,
  params: {
    title: "",
  },
});
const user = useUserStore();

const router = useRouter();

const options = reactive({
  //批量操作
  multi: false,
  // 列表请求URL
  listUrl: "/exam/list",
});

onMounted(() => {
  check();
});
// 开始考试
const handlePre = (examId: string) => {
  router.push({ name: "preview", params: { examId } });
};

// 继续考试
const toExam = () => {
  router.push({
    name: "startexam",
    params: { examId: breakId.value, id: paperId.value },
    query: {
      examList: JSON.stringify(examList.value),
    },
  });
};
const user_id = localStorage.getItem("ms_id");

// 获取正在进行的考试
const check = () => {
  checkProcess({
    id: user_id,
  }).then((res: any) => {
    if (res.code === 200) {
      examList.value = res.data;
      paperId.value = res.data.paperId;
      breakShow.value = true;
      breakId.value = res.data.exam_id;
    }
  });
};
</script>

<style lang="less" scoped></style>
