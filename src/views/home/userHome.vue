<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="24" :offset="0">
        <el-carousel height="300px" pause-on-hover interval="5000">
          <el-carousel-item v-for="item in carouselList" :key="item">
            <img :src="item.imgUrl" alt="" />
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="10">
        <el-card shadow="hover" class="mgb20" style="height: 403px">
          <div class="introduction">
            <el-empty description="缺少展示数据" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card shadow="hover" style="height: 403px">
          <template #header>
            <div class="clearfix">
              <span>通知公告</span>
              <!-- <el-button style="float: right; padding: 3px 0" text
                >更多</el-button
              > -->
            </div>
          </template>
          <el-table
            :show-header="false"
            stripe
            :data="todoList"
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template #default="{ row }">
                <el-card shadow="hover" class="box-card">
                  <div slot="header" class="clearfix" v-if="row.content">
                    <span>{{ row.content }}</span>
                  </div>
                  <div v-else>
                    <span>无具体消息</span>
                  </div>
                </el-card>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="{ row }">
                <div class="todo-item">
                  {{ row.title }}
                </div>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="{ row }">
                <div class="todo-item">
                  {{ row.create_time }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card shadow="hover" style="height: 403px">
          <template #header>
            <span>不及格用户展示</span>
          </template>
          <el-table
            :show-header="false"
            stripe
            :data="fillList"
            style="width: 100%"
          >
            <el-table-column>
              <template #default="scope">
                <div class="todo-item">
                  {{ scope.row.userName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <div class="todo-item">
                  {{ scope.row.score }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-carousel
          height="340px"
          :autoplay="true"
          :interval="5000"
          :loop="true"
          trigger="hover"
          arrow="hover"
        >
          <el-carousel-item v-for="item in imgList" :key="item">
            <img :src="item.imgUrl" alt="" />
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <schart
            v-if="visable"
            class="schart"
            canvasId="line"
            :options="options2"
          ></schart>
          <el-empty
            v-else-if="Object.keys(userInfo).length == 0"
            description="游客没有数据哦"
          />
          <el-empty
            v-else
            description="当前还没有数据，要考试5次才会有记录哦"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <schart
            v-if="Object.keys(userInfo).length"
            class="schart"
            canvasId="ring"
            :options="options4"
          ></schart>
          <el-empty v-else description="游客没有数据哦" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="dashboard">
import Schart from "vue-schart";
import { onMounted, reactive, ref } from "vue";
import {
  getMessageList,
  getFailUserList,
  getRecentScore,
  getChapterList,
} from "@/api/user";
import imgurl from "@/assets/img/img.jpg";
import { useUserStore } from "@/store/user";

const { userInfo } = useUserStore();

const role: string = userInfo?.rank === "admin" ? "管理员" : "学生";

const carouselList = reactive([
  {
    imgUrl: "https://lsem.fudan.edu.cn/wz/websit/images/ban01.jpg",
  },
  {
    imgUrl: "https://lsem.fudan.edu.cn/wz/websit/images/ban02.jpg",
  },
  {
    imgUrl: "https://lsem.fudan.edu.cn/wz/websit/images/ban03.jpg",
  },
]);

const imgList = reactive([
  {
    imgUrl:
      "http://aqjy.tsinghua.edu.cn/upload/material_pic/upload_2adc8121_160673a820a__7ffe_00000002.tmp",
  },
  {
    imgUrl:
      "http://aqjy.tsinghua.edu.cn/upload/material_pic/upload_2adc8121_160673a820a__7ffe_00000003.tmp",
  },
  {
    imgUrl:
      "http://aqjy.tsinghua.edu.cn/upload/material_pic/upload_2adc8121_160673a820a__7ffe_00000004.tmp",
  },
  {
    imgUrl:
      "http://aqjy.tsinghua.edu.cn/upload/material_pic/upload_2adc8121_160673a820a__7ffe_00000005.tmp",
  },
  {
    imgUrl:
      "http://aqjy.tsinghua.edu.cn/upload/material_pic/upload_2adc8121_160673a820a__7ffe_00000006.tmp",
  },
  {
    imgUrl:
      "http://aqjy.tsinghua.edu.cn/upload/material_pic/upload_2adc8121_160673a820a__7ffe_00000007.tmp",
  },
]);
const options2 = reactive<any>({
  type: "line",
  title: {
    text: "近期测试成绩",
  },
  bgColor: "#fbfbfb",
  labels: ["第一次", "第二次", "第三次", "第四次", "第五次"],
  datasets: [
    {
      label: "成绩",
      data: [1, 2, 3, 4, 5],
    },
  ],
});
const options4 = reactive<any>({
  type: "pie",
  title: {
    text: "任务点完成情况",
  },
  showValue: false,
  legend: {
    position: "bottom",
    bottom: 40,
  },
  bgColor: "#fbfbfb",
  labels: ["完成", "未完成"],
  datasets: [
    {
      data: [500, 500],
    },
  ],
});
let todoList = reactive<any[]>([]);

// 不及格用户列表
let fillList = reactive<any[]>([]);

const user_id = localStorage.getItem("ms_id");

// 控制echart表显示与隐藏
const visable = ref(false);
onMounted(async () => {
  getMessageList().then((res: any) => {
    const dataArr = Object.keys(res.data).map((key) => {
      // 将create_time转换时间格式
      const date = new Date(res.data[key].create_time);
      const year = date.getUTCFullYear();
      const month = `0${date.getUTCMonth() + 1}`.slice(-2);
      const day = `0${date.getUTCDate()}`.slice(-2);
      const hours = `0${date.getUTCHours()}`.slice(-2);
      const minutes = `0${date.getUTCMinutes()}`.slice(-2);
      const seconds = `0${date.getUTCSeconds()}`.slice(-2);
      const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
      res.data[key].create_time = formattedDate;
      return res.data[key];
    });
    // 使用push将dataArr的值添加到todoList数组中在，只添加7条数据
    todoList.push(...dataArr.slice(0, 7));
  });
  getFailUserList().then((res: any) => {
    const dataArr = Object.keys(res.data).map((key) => {
      return res.data[key];
    });
    fillList.push(...dataArr);
  });
  getRecentScore({ user_id: user_id }).then((res: any) => {
    let k = 0;
    const dataArr = Object.keys(res.data).map((key) => {
      ++k;
      return res.data[key].user_score;
    });
    if (k > 4) {
      visable.value = true;
      // 将options2的数据替换
      options2.datasets[0].data = dataArr.map((item) => Number(item));
    }
  });
  const res = await getChapterList({ user_id: user_id });
  const dataArr = Object.keys(res.data).map((key) => {
    return res.data[key];
  });
  options4.datasets[0].data = dataArr.map((item) => Number(item));
});
</script>

<style lang="less" scoped>
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
  .introduction {
    span {
      font-size: 22px;
    }
    p {
      font-size: 17px;
      color: rgba(0, 0, 0, 0.39);
    }
    .success {
      color: #67c23a;
    }
    .warning {
      color: #e6a23c;
    }
  }
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.el-carousel__item {
  text-align: center;
  img {
    height: 100%;
  }
}
.schart {
  width: 100%;
  height: 300px;
}
</style>
