<template>
  <div>
    <div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover" class="mgb20" style="height: 252px">
            <div class="user-info">
              <el-avatar :size="120" :src="imgurl" />
              <div class="user-info-cont">
                <div class="user-info-name">{{ userInfo.userName }}</div>
                <div>{{ role }}</div>
              </div>
            </div>
            <div>欢迎回来，Administrator</div>
          </el-card>
          <el-card shadow="hover" style="height: 252px">
            <template #header>
              <div class="clearfix">
                <span>系统构成</span>
              </div>
            </template>
            Vue
            <el-progress :percentage="79.4" color="#42b983"></el-progress>
            TypeScript
            <el-progress :percentage="14" color="#f1e05a"></el-progress>
            CSS
            <el-progress :percentage="5.6"></el-progress>
            HTML
            <el-progress :percentage="1" color="#f56c6c"></el-progress>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-row :gutter="20" class="mgb20">
            <el-col :span="8">
              <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-1">
                  <el-icon class="grid-con-icon"><User /></el-icon>
                  <div class="grid-cont-right">
                    <div class="grid-num">
                      {{ countList.userCount ? countList.userCount : 0 }}
                    </div>
                    <div>用户数量</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-2">
                  <el-icon class="grid-con-icon"><ChatDotRound /></el-icon>
                  <div class="grid-cont-right">
                    <div class="grid-num">
                      {{ countList.messageCount ? countList.messageCount : 0 }}
                    </div>
                    <div>今日留言数</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-3">
                  <el-icon class="grid-con-icon"><Promotion /></el-icon>
                  <div class="grid-cont-right">
                    <div class="grid-num">
                      {{ countList.TodayCount ? countList.TodayCount : 0 }}
                    </div>
                    <div>今日访问量</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-card shadow="hover" style="height: 403px">
            <template #header>
              <div class="clearfix">
                <span>公告</span>
                <el-button
                  style="float: right; padding: 3px 0"
                  text
                  @click="dialogVisible = true"
                  >发布新公告</el-button
                >
              </div>
            </template>

            <el-table
              :show-header="false"
              :data="todoList"
              style="width: 100%"
              height="300"
            >
              <el-table-column align="center">
                <template #default="scope">
                  <div
                    class="todo-item"
                    :class="{
                      'todo-item-del': scope.row.status,
                    }"
                  >
                    {{ scope.row.title }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center">
                <template #default="scope">
                  {{ scope.row.content }}
                </template>
              </el-table-column>
              <el-table-column align="center">
                <template #default="scope">
                  {{ scope.row.create_time }}
                </template>
              </el-table-column>
              <el-table-column align="center">
                <template #default="scope">
                  <el-popconfirm
                    title="确定删除吗?"
                    @confirm="deleteMessage(scope.row)"
                  >
                    <template #reference>
                      <el-button type="danger" :icon="Delete" circle />
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card shadow="hover">
            <schart
              ref="bar"
              class="schart"
              canvasId="bar"
              :options="options"
            ></schart>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog v-model="dialogVisible" title="发布新公告">
      <el-form :model="messForm">
        <el-form-item label="标题">
          <el-input v-model="messForm.title" autocomplete="标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="messForm.content" placeholder="公告内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addMessage"> 添加 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="dashboard">
import Schart from "vue-schart";
import { reactive, onMounted, watch, ref } from "vue";
import imgurl from "../assets/img/img.jpg";
import { useUserStore } from "@/store/user";
import { deleteOne, fetchList, saveData } from "@/api/common";
import { Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const { userInfo } = useUserStore();

const role: string = userInfo.rank === "admin" ? "管理员" : "学生";
const dialogVisible = ref(false);
const messForm = ref({
  title: "",
  content: "",
});
const options = {
  type: "bar",
  title: {
    text: "最近一周用户预约图",
  },
  xRorate: 25,
  labels: ["周一", "周二", "周三", "周四", "周五"],
  datasets: [
    {
      label: "8:00-10:00",
      data: [234, 278, 270, 190, 230],
    },
    {
      label: "10:20-12:00",
      data: [164, 178, 190, 135, 160],
    },
    {
      label: "14:20-16:00",
      data: [144, 198, 150, 235, 120],
    },
    {
      label: "16：20-18:00",
      data: [188, 25, 43, 125, 100],
    },
  ],
};
const todoList = ref([]);

const countList = ref([]);

onMounted(() => {
  getHomeNotice();
  fetchList("/home/getCount", null).then((res: any) => {
    countList.value = res.data;
  });
});

watch(
  () => todoList.value,
  (val) => {
    val.forEach((item: any) => {
      const diffInMs = Date.now() - new Date(item.create_time).getTime();
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      if (diffInDays > 10) {
        deleteOne("/home/deleteMessage", { id: item.id }).then((res) => {
          getHomeNotice();
        });
      }
    });
  },
  { deep: true }
);

const getHomeNotice = () => {
  todoList.value = [];
  fetchList("/home/message", null).then((res) => {
    Object.assign(todoList.value, res.data);
  });
};

const addMessage = () => {
  saveData("/home/addMessage", messForm.value).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success("发布成功");
    }
    getHomeNotice();
  });
  dialogVisible.value = false;
};

const deleteMessage = (row: any) => {
  deleteOne("/home/deleteMessage", { id: row.id }).then((res) => {
    getHomeNotice();
  });
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
