import { post } from "../utils/request";

// 获取所有设备
export function fetchAllEquip() {
  return post("/equip/getEquipList");
}
