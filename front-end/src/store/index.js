import { createStore } from "vuex";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

export default createStore({
  state: {
    token: window.localStorage.getItem("token"),
    userId: window.localStorage.getItem("userId"),
    userName: window.localStorage.getItem("userName"),
    logeddInAt: window.localStorage.getItem("logeddInAt"),
    serverPoruka: "",
    serverStatus: "",
    popUpActive: false,
    progressBar: 0,
    user: [],
    poverioci: [],
    racuni: [],
    godine: [],
    periodi: [],
    placanja: [],
    graf1: [],
    graf12: [],
    graf2: [],
    graf22: [],
    graf31: [],
    graf32: [],
    graf33: [],
    graf34: [],
  },
  getters: getters,
  mutations: mutations,
  actions: actions,
  modules: {},
});
