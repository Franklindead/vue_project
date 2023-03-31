//引入pinia
import { defineStore } from "pinia";

export const useExamStore = defineStore("exam", {
  state: () => {
    return {
      examList: {},
    };
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "examList",
        storage: localStorage,
      },
    ],
  },
});
