import { post } from "@/utils/request";

export function getByFloor() {
  return post("/book/getRoomByFloor");
}

export function getRoomTime(data: any) {
  return post("/book/getScheduleByRoomId", data);
}

// 提交预约申请
export function submitBook(data: any) {
  return post("/book/createBook", data);
}

// 获取预约信息
export function getBookList(user_id: any) {
  return post("/book/getBookByUserId",user_id);
}

// 取消预约
export function cancelBook(data: any) {
  return post("/book/deleteBookById", data);
}