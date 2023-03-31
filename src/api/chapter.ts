import { post } from "@/utils/request";

// 获取章节列表
export function getChapterList(data: any) {
  return post("/chapter/getChapterList", data);
}

// 获取章节详情
export function getChapterDetail(data: any) {
  return post("/chapter/getChapterDetail", data);
}

// 获取视频地址
export function getVideoUrl(data: any) {
  return post("/chapter/getVideoUrl", data);
}

// 获取章节试题
export function getChapterTest(data: any) {
  return post("/chapter/getTest", data);
}

// 更新测试题
export function updateTest(data: any) {
  return post("/chapter/updateTest", data);
}

// 更新状态
export function updateUserStatus(data: any) {
  return post("/chapter/updateUserState", data);
}
