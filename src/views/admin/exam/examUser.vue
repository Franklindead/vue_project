<template>
  <div class="container">
    <data-table ref="pagingTable" :options="options" :list-query="listQuery">
      <template #filter-content>
        <el-input
          v-model="listQuery.params.title"
          placeholder="搜索考试名称"
          style="width: 200px"
          class="filter-item"
        />
      </template>

      <template #data-columns>
        <el-table-column
          label="考试人员"
          prop="username"
          show-overflow-tooltip
          align="center"
        />

        <el-table-column label="考试次数" prop="tryCount" align="center" />

        <el-table-column label="最高分" prop="maxScore" align="center" />

        <el-table-column label="是否通过" align="center">
          <template v-slot="scope">
            <span v-if="scope.row.passed" style="color: #00ff00">通过</span>
            <span v-else style="color: #ff0000">未通过</span>
          </template>
        </el-table-column>

        <el-table-column
          label="最后考试时间"
          prop="updateTime"
          align="center"
        />

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" icon="View" @click="getDetail(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </template>
    </data-table>
    <el-dialog v-model="dialogVisible" title="考试明细" width="60%">
      <div class="el-dialog-div">
        <el-card
          v-for="(item, index) in userRecord"
          :key="index"
          :body-style="{ padding: '20px' }"
        >
          <el-row :gutter="24">
            <el-col :span="12" :offset="0"
              >考试时间：{{ item.create_time }}</el-col
            >
            <el-col :span="12" :offset="0"
              >考试用时：{{ Math.ceil(item.user_time / 60) + "分钟" }}</el-col
            >
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12" :offset="0"
              >考试得分：{{ item.user_score }}</el-col
            >
            <el-col :span="12" :offset="0"
              >是否合格：{{
                item.user_score >= item.qualify_score ? "是" : "否"
              }}</el-col
            >
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12" :offset="0"
              >考试状态：{{ item.state ? "已考完" : "考试中" }}</el-col
            >
          </el-row>
        </el-card>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="ExamUser">
import { ref, reactive, computed, watch, onMounted } from "vue";
import DataTable from "@/components/public/DataTable.vue";
import { fetchExamRecord } from "@/api/exam";
import { fetchList } from "@/api/common";
import { useRoute } from "vue-router";

const route = useRoute();

const dialogVisible = ref(false);
const examId = ref("");
const listQuery = reactive({
  current: 1,
  size: 10,
  params: {
    exam_id: route.query.id,
    title: "",
  },
});
const userRecord = ref([]);
const options = reactive({
  listUrl: "/exam/getPaperInfoByExamId",
  multi: false,
});

const getDetail = (row: any) => {
  dialogVisible.value = true;
  fetchExamRecord(row).then((res) => {
    userRecord.value = res.data;
  });
};
</script>

<style lang="less" scoped></style>
