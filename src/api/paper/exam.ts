import { post } from "@/utils/request";

/**
 * 创建试卷
 * @param data
 */
export function createPaper(data: any) {
  return post("/exam/createPaper", data);
}

// 创建考试信息
export function saveExam(data: any) {
  return post("/exam/saveExam", data);
}

// 创建考试目录
export function createRecord(data: any) {
  return post("/exam/createRecord", data);
}

// 检测考试目录ID是否已存在
export function checkRecord(id: any) {
  return post("/exam/checkRecord", id);
}

// 获取考试信息
export function getPaperInfo(data: any) {
  return post("/exam/getPaperInfo", data);
}


// 获取错题列表
export function getWrongList(data: any) {
  return post("/exam/getWrongList", data);
}

/**
 * 检查是否有进行中的考试
 * @returns {*}
 */
export function checkProcess(data: any) {
  return post("/exam/checkExam", data);
}
