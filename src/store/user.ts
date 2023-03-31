//引入pinia
import { getUserInfo } from "../api";
import { defineStore } from "pinia";
import { fetchDetail, saveData } from "@/api/common";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      userInfo: {},
    };
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "user",
        storage: localStorage,
      },
    ],
  },
  actions: {
    async fetchUserInfo(account: any) {
      try {
        const res = await getUserInfo(account); // call the getUserInfo API
        this.userInfo = res.data; // set the user info in the store
      } catch (error) {
        console.error(error);
      }
    },
  },
});
