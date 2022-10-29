import { userRoute, billsRoute } from "../functions/index";

export default {
  actSignup(context, payload) {
    const url = `${userRoute}/signup/`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutSignup", res);
      })
      .catch((e) => console.log(e));
  },

  actLogin(context, payload) {
    const url = `${userRoute}/login/`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutLogin", res);
      })
      .catch((e) => console.log(e));
  },

  actGetPoverioci(context, payload) {
    const userId = context.getters.USERID;
    const token = context.getters.TOKEN;
    const url = `${billsRoute}/poverioci/${userId}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutGetPoverioci", res);
      });
  },

  actGetUser(context, payload) {
    const userId = context.getters.USERID;
    const token = context.getters.TOKEN;
    const url = `${userRoute}/${userId}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutGetUser", res);
      });
  },

  actGetPeriodi(context, payload) {
    const token = context.getters.TOKEN;
    const url = `${billsRoute}/periodi/`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => context.commit("mutGetPeriodi", res))
      .catch((e) => console.log(e));
  },

  actGetRacuni(context, payload) {
    const userId = context.getters.USERID;
    const token = context.getters.TOKEN;
    const url = `${billsRoute}/racuni/${userId}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => context.commit("mutGetRacuni", res))
      .catch((e) => console.log(e));
  },

  actZaRacune(context, payload) {
    context.dispatch("actGetRacuni");
    context.dispatch("actGetPoverioci");
    context.dispatch("actGetGodine");
    context.dispatch("actGetPeriodi");
    context.dispatch("actGetPlacanja");
  },

  actGetGodine(context, payload) {
    const token = context.getters.TOKEN;
    const url = `${billsRoute}/godine/`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutGetGodine", res);
      })
      .catch((e) => console.log(e));
  },

  actAddBill(context, payload) {
    const token = context.getters.TOKEN;
    const userId = context.getters.USERID;
    const url = `${billsRoute}/add-bill/`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutAddBill", res);
        context.dispatch("actGetRacuni", userId);
      })
      .catch((e) => console.log(e));
  },

  actEditBill(context, payload) {
    const token = context.getters.TOKEN;
    const userId = context.getters.USERID;
    const url = `${billsRoute}/edit-bill/`;
    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutEditBill", res);
        context.dispatch("actGetRacuni", userId);
      })
      .catch((e) => console.log(e));
  },

  actDeleteBill(context, payload) {
    const token = context.getters.TOKEN;
    const userId = context.getters.USERID;
    const id = payload.racunId;

    const url = `${billsRoute}/delete-bill/${id}`;

    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json;",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutDeleteBill", res);
        context.dispatch("actGetRacuni", userId);
      })
      .catch((e) => console.log(e));
  },

  actGetPlacanja(context, payload) {
    const token = context.getters.TOKEN;
    const url = `${billsRoute}/get-payments/`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutGetPlacanja", res);
      })
      .catch((e) => console.log(e));
  },

  actAddPlacanje(context, payload) {
    const token = context.getters.TOKEN;
    const url = `${billsRoute}/add-payment/`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutAddPlacanje", res);
        context.dispatch("actZaRacune");
      })
      .catch((e) => console.log(e));
  },

  actEditPayment(context, payload) {
    const token = context.getters.TOKEN;
    const url = `${billsRoute}/edit-payment/`;

    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutEditPayment", res);
        context.dispatch("actZaRacune");
      })
      .catch((e) => console.log(e));
  },

  actDelPlacanje(context, payload) {
    const token = context.getters.TOKEN;

    const url = `${billsRoute}/delete-payment/`;

    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutDelPlacanje", res);
        context.dispatch("actZaRacune");
      })
      .catch((e) => console.log(e));
  },

  actAddPoverilac(context, payload) {
    const token = context.getters.TOKEN;

    const url = `${billsRoute}/nov-poverilac/`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutAddPoverilac", res);
        context.dispatch("actZaRacune");
      })
      .catch((e) => console.log(e));
  },

  actEditPoverilac(context, payload) {
    const token = context.getters.TOKEN;

    const url = `${billsRoute}/edit-poverilac/`;

    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutEditPoverilac", res);
        context.dispatch("actZaRacune");
      })
      .catch((e) => console.log(e));
  },

  actDelPoverilac(context, payload) {
    const token = context.getters.TOKEN;

    const url = `${billsRoute}/delete-creditor/`;

    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutDelPoverilac", res);
        context.dispatch("actZaRacune");
      })
      .catch((e) => console.log(e));
  },

  actGraf(context, payload) {
    context.dispatch("actGetPeriodi");
    context.dispatch("actGetGodine");
    context.dispatch("actGetPoverioci");
    context.dispatch("actGraf1");
    context.dispatch("actGraf12");
    context.dispatch("actGraf2");
    context.dispatch("actGraf22");
    context.dispatch("actGraf31");
    context.dispatch("actGraf32");
    context.dispatch("actGraf33");
    context.dispatch("actGraf34");
  },

  actGraf1(context, payload) {
    const token = context.getters.TOKEN;
    const userId = context.getters.USERID;

    const url = `${billsRoute}/graf1/${userId}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutGraf1", res);
      })
      .catch((e) => console.log(e));
  },

  actGraf12(context, payload) {
    const token = context.getters.TOKEN;
    const userId = context.getters.USERID;

    const url = `${billsRoute}/graf12/${userId}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutGraf12", res);
      })
      .catch((e) => console.log(e));
  },

  actGraf2(context, payload) {
    const token = context.getters.TOKEN;
    const userId = context.getters.USERID;

    const url = `${billsRoute}/graf2/${userId}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutGraf2", res);
      })
      .catch((e) => console.log(e));
  },

  actGraf22(context, payload) {
    const token = context.getters.TOKEN;
    const userId = context.getters.USERID;

    const url = `${billsRoute}/graf22/${userId}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutGraf22", res);
      })
      .catch((e) => console.log(e));
  },

  actGraf31(context, payload) {
    const token = context.getters.TOKEN;
    const userId = context.getters.USERID;

    const url = `${billsRoute}/graf31/${userId}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutGraf31", res);
      })
      .catch((e) => console.log(e));
  },

  actGraf32(context, payload) {
    const token = context.getters.TOKEN;
    const userId = context.getters.USERID;

    const url = `${billsRoute}/graf32/${userId}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutGraf32", res);
      })
      .catch((e) => console.log(e));
  },

  actGraf33(context, payload) {
    const token = context.getters.TOKEN;
    const userId = context.getters.USERID;

    const url = `${billsRoute}/graf33/${userId}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutGraf33", res);
      })
      .catch((e) => console.log(e));
  },

  actGraf34(context, payload) {
    const token = context.getters.TOKEN;
    const userId = context.getters.USERID;

    const url = `${billsRoute}/graf34/${userId}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        context.commit("mutGraf34", res);
      })
      .catch((e) => console.log(e));
  },

  actEditUser(context, payload) {
    const token = context.getters.TOKEN;
    const url = `${userRoute}/edit-user/`;

    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e));
  },
};
