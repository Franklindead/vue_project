<template>
  <div class="container">
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
      @searchChange="pageChange"
    >
      <template #filter-content>
        <el-input
          v-model="listQuery.params.title"
          placeholder="搜索考试名称"
          style="width: 200px"
          class="filter-item"
        />
      </template>

      <template #data-columns>
        <el-table-column label="考试名称" prop="title" />

        <el-table-column label="考试类型" align="center">
          <template #default="scope">
            <span v-if="scope.row.type === 1">测试练习</span>
            <span v-else>期末考核</span>
          </template>
        </el-table-column>

        <el-table-column label="考试时间" width="220px" align="center">
          <template #default="scope">
            <span v-if="scope.row.timeLimit">
              {{ scope.row.startTime }} ~ {{ scope.row.endTime }}
            </span>
            <span v-else>不限时</span>
          </template>
        </el-table-column>

        <el-table-column label="考试总分" prop="totalScore" align="center" />

        <el-table-column label="及格线" prop="qualifyScore" align="center" />

        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.state"
              class="ml-2"
              width="60px"
              size="large"
              inline-prompt
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
              active-text="启用"
              inactive-text="禁用"
              @click="handleExamStateChange(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="240px">
          <template #default="scope">
            <el-button
              type="primary"
              icon="Edit"
              @click="handleUpdateExam(scope.row)"
              >修改</el-button
            >
            <el-button
              type="warning"
              icon="User"
              @click="handleExamDetail(scope.row)"
              >考试详情</el-button
            >
          </template>
        </el-table-column>
      </template>
    </data-table>
    <el-drawer v-model="drawer" size="70%" :before-close="beforeSave">
      <div>
        <h3>组卷信息</h3>
        <el-card style="margin-top: 20px">
          <div style="float: right; font-weight: bold; color: #ff0000">
            试卷总分：{{ postForm.totalScore }}分
          </div>

          <div>
            <el-table
              :data="repoList"
              :border="false"
              empty-text="请点击上面的`添加题库`进行设置"
              style="width: 100%; margin-top: 15px"
            >
              <el-table-column
                label="题库"
                width="200"
                prop="title"
                align="center"
              >
              </el-table-column>
              <el-table-column label="单选数量" align="center">
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.radio_count"
                    :min="0"
                    :max="scope.row.total_radio"
                    :controls="false"
                    style="width: 50px"
                  />
                  / {{ scope.row.total_radio }}
                </template>
              </el-table-column>

              <el-table-column label="单选分数" align="center">
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.radio_score"
                    :min="0"
                    :controls="false"
                    style="width: 50%"
                  />
                </template>
              </el-table-column>

              <el-table-column label="多选数量" align="center">
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.multi_count"
                    :min="0"
                    :max="scope.row.total_multiple"
                    :controls="false"
                    style="width: 50px"
                  />
                  / {{ scope.row.total_multiple }}
                </template>
              </el-table-column>

              <el-table-column label="多选分数" align="center">
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.multi_score"
                    :min="0"
                    :controls="false"
                    style="width: 50%"
                  />
                </template>
              </el-table-column>

              <el-table-column label="判断题数量" align="center">
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.judge_count"
                    :min="0"
                    :max="scope.row.total_judge"
                    :controls="false"
                    style="width: 50px"
                  />
                  / {{ scope.row.total_judge }}
                </template>
              </el-table-column>

              <el-table-column label="判断题分数" align="center">
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.judge_score"
                    :min="0"
                    :controls="false"
                    style="width: 50%"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>

        <h3>考试配置</h3>
        <el-card style="margin-top: 20px">
          <el-form
            ref="postFormRef"
            :model="postForm"
            label-position="left"
            label-width="120px"
          >
            <el-form-item label="考试名称" prop="title">
              <el-input v-model="postForm.title" />
            </el-form-item>

            <el-form-item label="考试描述" prop="content">
              <el-input v-model="postForm.content" type="textarea" />
            </el-form-item>

            <el-form-item label="总分数" prop="totalScore">
              <el-input-number v-model="postForm.totalScore" disabled />
            </el-form-item>

            <el-form-item label="及格分" prop="qualifyScore">
              <el-input-number
                v-model="postForm.qualifyScore"
                :max="postForm.totalScore"
              />
            </el-form-item>

            <el-form-item label="考试时长(分钟)" prop="totalTime">
              <el-input-number v-model="postForm.totalTime" />
            </el-form-item>

            <el-form-item label="是否限时">
              <el-switch
                v-model="postForm.timeLimit"
                class="ml-2"
                style="
                  --el-switch-on-color: #13ce66;
                  --el-switch-off-color: #ff4949;
                "
              />
            </el-form-item>

            <el-form-item
              v-if="postForm.timeLimit"
              label="考试时间"
              prop="totalTime"
            >
              <el-date-picker
                v-model="dateValues"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-form>
        </el-card>

        <h3>考试类型</h3>
        <el-card style="margin-top: 20px">
          <el-radio-group
            v-model="postForm.openType"
            style="margin-bottom: 20px"
          >
            <el-radio :label="1" border>测试练习</el-radio>
            <el-radio :label="2" border>期末考核</el-radio>
          </el-radio-group>

          <el-alert
            v-if="postForm.openType === 1"
            title="开放的，任何人都可以进行考试！"
            type="warning"
          />

          <el-alert
            v-if="postForm.openType === 2"
            title="单次考试，只能考一次，考试结束后，成绩将会被锁定！"
            type="warning"
          />
        </el-card>

        <div style="margin-top: 20px; margin-left: 85%">
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="drawer = false">取消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="ExamList">
import { ref, reactive, onMounted, watch } from "vue";
import DataTable from "@/components/public/DataTable.vue";
import { fetchDetail, fetchList, saveData } from "@/api/common";
import { ElMessage, ElMessageBox } from "element-plus";
import { debounce } from "lodash";
import { useRoute, useRouter } from "vue-router";

const listQuery = reactive({
  current: 1,
  size: 10,
  params: {
    title: "",
  },
});
const examState = ref(false);

const options = reactive({
  // 可批量操作
  multi: true,
  // 批量操作列表
  multiActions: [
    {
      value: "delete",
      label: "删除",
    },
  ],
  // 列表请求URL
  listUrl: "/exam/list",
  // 删除请求URL
  deleteUrl: "/exam/api/exam/exam/delete",
});

const loading = ref(true);

const pagingTable = ref();

const drawer = ref(false);

const router = useRouter();

const handleUpdateExam = (row: any) => {
  drawer.value = true;
  getRepoListById(row);
};

const handleExamDetail = (row: any) => {
  router.push({
    path: "/examUser",
    query: {
      id: row.id,
    },
  });
};

const pageChange = (page: number) => {
  listQuery.current = page;
};
const handleExamStateChange = debounce(async (val: any) => {
  let res = await saveData("/exam/updateExamById", val);
  if (res.code === 200) {
    ElMessage.success("操作成功");
  } else {
    ElMessage.error("操作失败");
  }
}, 100);

// drawer
const postForm = reactive({
  // 总分数
  totalScore: 0,
  // 题库列表
  repoList: [],
  // 开放类型
  openType: 1,
  // 考试班级列表
  departIds: [],
});

// 题库
const repoList = reactive([]);

// 选择的题库
const excludes = ref([]);

const dateValues = ref("");

// 获取题库及配置信息
const getRepoList = async (data: any) => {
  repoList.length = 0;
  const res = await fetchList("/exam/getAllQuestion");
  repoList.push(...res.data.list);
  repoList[0].repoId = data.id;
  Object.assign(postForm, data);
};

const getRepoListById = async (data: number) => {
  repoList.length = 0;
  const res = await fetchDetail("/exam/getAllQuestionById", data.id);
  repoList.push(...res.data.list);
  repoList[0].repoId = data.id;
  Object.assign(postForm, data);
};

watch(
  // 题库变换
  () => repoList,
  (val) => {
    postForm.totalScore = 0;
    let totalScore = 0;
    excludes.value = [];

    for (let i = 0; i < val.length; i++) {
      const item = repoList[i];
      totalScore += item.radio_count * item.radio_score;
      totalScore += item.multi_count * item.multi_score;
      totalScore += item.judge_count * item.judge_score;
      excludes.value.push(item.id);
    }
    postForm.totalScore = totalScore;
    postForm.repoList = repoList;
  },
  { deep: true }
);

watch(
  // 考试时间变化
  () => dateValues,
  (val) => {
    postForm.startTime = val[0];
    postForm.endTime = val[1];
  },
  { deep: true }
);

const handleAdd = () => {
  console.log(1);
};

const beforeSave = async () => {
  ElMessageBox.confirm("你希望就这样提交吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      handleSave();
    })
    .catch(() => {
      drawer.value = false;
      ElMessage({
        type: "info",
        message: "已取消提交",
      });
    });
};

const handleSave = async () => {
  let res = await saveData("/exam/updateExamById", postForm);
  let res2 = await saveData("/exam/updateExamRepo", repoList[0]);
  if (res.code === 200 && res2.code === 200) {
    ElMessage.success("操作成功");
    drawer.value = false;
    pagingTable.value.getList();
  } else {
    ElMessage.error("操作失败");
  }
};
</script>

<style lang="less" scoped></style>
