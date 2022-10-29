import router from "../router/index";

export default {
  mutShowPopUp(state, payload) {
    state.popUpActive = true;
  },

  mutHidePopUp(state, payload) {
    state.popUpActive = false;
    state.serverPoruka = "";
    state.serverStatus = "";
  },

  mutSignup(state, payload) {
    //   state.showLoader = false;
    state.serverPoruka = payload.message;
    state.serverStatus = payload.status;
    state.popUpActive = true;
    if (payload.status === 201) {
      router.push("/login/");
    }
  },

  mutLogin(state, payload) {
    // state.showLoader = false;
    state.serverPoruka = payload.message;
    state.serverStatus = payload.status;
    state.popUpActive = true;

    if (payload.status === 200) {
      window.localStorage.setItem("token", payload.token);
      window.localStorage.setItem("userId", payload.userId);
      window.localStorage.setItem("userName", payload.userName);
      window.localStorage.setItem("logeddInAt", payload.logout);

      state.token = window.localStorage.getItem("token");
      state.userId = window.localStorage.getItem("userId");
      state.userName = window.localStorage.getItem("userName");
      state.logeddInAt = window.localStorage.getItem("logeddInAt");

      router.push("/");
    }
  },

  mutLogout(state, payload) {
    state.serverPoruka = "Izlogovali ste se";

    state.popUpActive = true;
    window.localStorage.clear();
    state.token = null;
    state.userId = null;
    state.userName = null;
    state.logeddInAt = null;
    router.push("/login/");
  },

  mutTimeWarning(state, payload) {
    state.serverPoruka = payload.message;
    state.popUpActive = true;
  },

  mutGetPoverioci(state, payload) {
    state.poverioci = payload;
  },

  mutGetUser(state, payload) {
    state.user = payload;
  },

  mutGetRacuni(state, payload) {
    state.racuni = payload;
  },

  mutGetGodine(state, payload) {
    state.godine = payload;
  },

  mutGetPeriodi(state, payload) {
    state.periodi = payload;
  },

  mutAddBill(state, payload) {
    state.showLoader = false;
    state.serverPoruka = payload.message;
    state.serverStatus = payload.status;
    state.popUpActive = true;
  },
  mutObavestenjeLogin(state, payload) {
    state.serverPoruka = "Niste ulogovani";
    state.popUpActive = true;
  },

  mutGreskaForma(state, payload) {
    state.serverPoruka = payload.message;
    state.popUpActive = true;
  },

  mutAddBill(state, payload) {
    state.showLoader = false;
    state.serverPoruka = payload.message;
    state.serverStatus = payload.status;
    state.popUpActive = true;
  },

  mutEditBill(state, payload) {
    state.showLoader = false;
    state.serverPoruka = payload.message;
    state.serverStatus = payload.status;
    state.popUpActive = true;
  },

  mutDeleteBill(state, payload) {
    state.showLoader = false;
    state.serverPoruka = payload.message;
    state.serverStatus = payload.status;
    state.popUpActive = true;
  },

  mutGetPlacanja(state, payload) {
    state.placanja = payload;
  },

  mutAddPlacanje(state, payload) {
    state.showLoader = false;
    state.serverPoruka = payload.message;
    state.serverStatus = payload.status;
    state.popUpActive = true;
  },

  mutEditPayment(state, payload) {
    state.showLoader = false;
    state.serverPoruka = payload.message;
    state.serverStatus = payload.status;
    state.popUpActive = true;
  },

  mutDelPlacanje(state, payload) {
    state.showLoader = false;
    state.serverPoruka = payload.message;
    state.serverStatus = payload.status;
    state.popUpActive = true;
  },

  mutAddPoverilac(state, payload) {
    state.showLoader = false;
    state.serverPoruka = payload.message;
    state.serverStatus = payload.status;
    state.popUpActive = true;
  },

  mutEditPoverilac(state, payload) {
    state.showLoader = false;
    state.serverPoruka = payload.message;
    state.serverStatus = payload.status;
    state.popUpActive = true;
  },

  mutDelPoverilac(state, payload) {
    state.showLoader = false;
    state.serverPoruka = payload.message;
    state.serverStatus = payload.status;
    state.popUpActive = true;
  },

  mutGraf1(state, payload) {
    state.graf1 = payload;
  },

  mutGraf12(state, payload) {
    state.graf12 = payload;
  },

  mutGraf2(state, payload) {
    state.graf2 = payload;
  },

  mutGraf22(state, payload) {
    state.graf22 = payload;
  },

  mutGraf31(state, payload) {
    state.graf31 = payload;
  },

  mutGraf32(state, payload) {
    state.graf32 = payload;
  },

  mutGraf33(state, payload) {
    state.graf33 = payload;
  },

  mutGraf34(state, payload) {
    state.graf34 = payload;
  },
};
