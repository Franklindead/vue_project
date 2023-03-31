import { post } from "../utils/request";

// 获取所有留言
export function fetchAllMessage() {
  return post("/message/list");
}

// 获取留言列表
export function fetchMessageList(data: any) {
  return post("/message/listByUserId", data);
}

// 添加留言
export function addMessage(data: any) {
  return post("/message/add", data);
}

// 删除留言
export function deleteMessage(data: any) {
  return post("/message/delete", data);
}

// 获取举报列表
export function fetchReportList() {
  return post("/message/reportList");
}

// 根据用户id获取举报列表
export function fetchReportListByUserId(data: any) {
  return post("/message/getReportById", data);
}

// 添加举报信息
export function addReport(data: any) {
  return post("/message/addReport", data);
}

// 删除举报信息
export function deleteReport(data: any) {
  return post("/message/deleteReport", data);
}
