<template>
  <div class="container">
    <data-table ref="pagingTable" :options="options" :list-query="listQuery">
      <template #filter-content>
        <el-select
          v-model="listQuery.params.quType"
          class="filter-item"
          clearable
        >
          <el-option
            v-for="item in quTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="listQuery.params.content"
          placeholder="搜索考试名称"
          style="width: 200px"
          class="filter-item"
        />
      </template>

      <template #data-columns>
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-row>
              <el-col :span="24" :offset="2" v-if="row.records.optionA">
                选项A:{{ row.records.optionA }}
              </el-col>
              <el-col :span="24" :offset="2" v-if="row.records.optionB">
                选项B:{{ row.records.optionB }}
              </el-col>
              <el-col :span="24" :offset="2" v-if="row.records.optionC">
                选项C:{{ row.records.optionC }}
              </el-col>
              <el-col :span="24" :offset="2" v-if="row.records.optionD">
                选项D:{{ row.records.optionD }}
              </el-col>
              <el-col :span="24" :offset="2" v-if="row.records.optionE">
                选项E:{{ row.records.optionE }}
              </el-col>
              <el-col :span="24" :offset="2" v-if="row.records.answer">
                答案:{{ row.records.answer }}
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="题目类型" show-overflow-tooltip>
          <template #default="{ row }">
            {{
              row.quType === 1
                ? "单选题"
                : row.quType === 2
                ? "多选题"
                : "判断题"
            }}
          </template>
        </el-table-column>
        <el-table-column label="题目" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.records.question_content }}
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

<script setup lang="ts" name="Mistake">
import { ref, reactive, computed, watch, onMounted } from "vue";
import DataTable from "@/components/public/DataTable.vue";
import { fetchExamRecord } from "@/api/exam";

const quTypes = reactive([
  {
    value: 1,
    label: "单选题",
  },
  {
    value: 2,
    label: "多选题",
  },
  {
    value: 3,
    label: "判断题",
  },
]);

const dialogVisible = ref(false);
const examId = ref("");
const listQuery = reactive({
  current: 1,
  size: 10,
  params: {
    userId: localStorage.getItem("ms_id"),
    content: "",
    quType: "",
  },
});
const userRecord = ref([]);
const options = reactive({
  listUrl: "/exam/getWrongList",
  multi: false,
});

onMounted(() => {
  fetchExamRecord(listQuery.params).then((res) => {
    userRecord.value = res.data;
  });
});
</script>

<style lang="less" scoped></style>
