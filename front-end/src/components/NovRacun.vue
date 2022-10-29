<template>
  <div class="novRacun" @click.self="hideForm">
    <form @submit.prevent="sendData">
      <div class="form-element">
        <label>Poverilac:</label>
        <select v-model="formD.poverilacId">
          <option value="">---</option>
          <option
            v-for="p in poverioci"
            :key="p.poverilacId"
            :value="p.poverilacId"
          >
            {{ p.poverilacKrace }}
          </option>
        </select>
      </div>
      <div class="form-element">
        <div class="form-column">
          <div class="form-element-2">
            <label>Mesec:</label>
            <select v-model="formD.periodMesec">
              <option value="">---</option>
              <option value="januar">januar</option>
              <option value="februar">februar</option>
              <option value="mart">mart</option>
              <option value="april">april</option>
              <option value="maj">maj</option>
              <option value="jun">jun</option>
              <option value="jul">jul</option>
              <option value="avgust">avgust</option>
              <option value="septembar">septembar</option>
              <option value="oktobar">oktobar</option>
              <option value="novembar">novembar</option>
              <option value="decembar">decembar</option>
            </select>
          </div>
          <div class="form-element-2">
            <label>Godina:</label>
            <select v-model="formD.periodGodina">
              <option value="">---</option>
              <option v-for="g in godine" :key="g.godina" :value="g.godina">
                {{ g.godina }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-element">
        <label>Poziv na broj:</label>
        <input type="text" v-model="formD.pozivNaBroj" />
      </div>
      <div class="form-element">
        <label>Iznos:</label>
        <number
          v-model="formD.iznosRacuna"
          v-bind="number"
          class="input text-desno"
        ></number>
      </div>
      <div class="form-element">
        <button>
          <span v-if="menu == 1">Dodaj račun</span>
          <span v-else>Promeni račun</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { number } from "@coders-tm/vue-number-format";
import { useStore } from "vuex";
import { computed, onMounted, watch, toRef, reactive } from "vue";
export default {
  components: {
    number,
  },
  props: [
    "racuni",
    "menu",
    "editMode",
    "poverilacId",
    "periodMesec",
    "periodGodina",
    "pozivNaBroj",
    "iznosRacuna",
    "",
    "racunId",
  ],
  setup(props, context) {
    const store = useStore();
    const formD = reactive({
      poverilacId: "",
      periodMesec: "",
      periodGodina: "",
      pozivNaBroj: "",
      iznosRacuna: 0,
    });
    const number = reactive({
      decimal: ",",
      separator: ".",
      prefix: "",
      suffix: "",
      precision: 2,
      nullValue: 0,
      masked: false,
      reverseFill: false,
      minimumFractionDigits: 2,
    });
    const greskaForm = (poruka) => {
      store.commit("mutGreskaForma", poruka);
    };
    const edit = () => {
      if (props.editMode) {
        formD.poverilacId = props.poverilacId;
        formD.periodMesec = props.periodMesec;
        formD.periodGodina = props.periodGodina;
        formD.pozivNaBroj = props.pozivNaBroj;
        formD.iznosRacuna = parseFloat(props.iznosRacuna);
      }
    };
    const sendData = () => {
      if (formD.poverilacId == "") {
        return greskaForm({
          message: "Niste izabrali poverioca",
        });
      }
      if (formD.periodMesec == "") {
        return greskaForm({
          message: "Niste izabrali mesec",
        });
      }
      if (formD.periodGodina == "") {
        return greskaForm({
          message: "Niste izabrali godinu",
        });
      }
      if (parseFloat(formD.iznosRacuna) <= 0) {
        return greskaForm({
          message: "Iznos računa mora biti veći od 0",
        });
      }

      if (
        props.editMode &&
        parseFloat(formD.iznosRacuna) < parseFloat(props.placeno)
      ) {
        return greskaForm({
          message: "Iznos ukupnuh plaćanja je veći od iznosa računa",
        });
      }

      const formData = reactive({
        periodId: periodId.value,
        poverilacId: formD.poverilacId,
        racunId: props.racunId,
        userId: userId.value,
        iznosRacuna: formD.iznosRacuna,
        pozivNaBroj: formD.pozivNaBroj,
      });

      if (props.menu != 1) {
        store.dispatch("actEditBill", formData);
      } else {
        store.dispatch("actAddBill", formData);
      }
    };
    const hideForm = () => {
      context.emit("hideForm");
    };
    const periodId = computed(() => {
      let pid = periodi.value.filter((p) => {
        return (
          p.periodMesec == formD.periodMesec &&
          p.periodGodina == formD.periodGodina
        );
      });

      return pid[0].periodId;
    });
    const userId = computed(() => {
      return store.getters.USERID;
    });
    const statusServera = computed(() => {
      return store.getters.getServerStatus;
    });
    const poverioci = computed(() => {
      return store.getters.getPoverioci;
    });
    const godine = computed(() => {
      return store.getters.getGodine;
    });
    const periodi = computed(() => {
      return store.getters.getPeriodi;
    });
    onMounted(() => {
      edit();
    });
    watch(statusServera, (newVal, oldVal) => {
      if (newVal === 201) {
        hideForm();
      }
    });
    const menu = toRef(props, "menu");
    return {
      hideForm,
      sendData,
      formD,
      poverioci,
      menu,
      number,
      godine,
    };
  },
};
</script>

<style scoped>
.novRacun {
  width: 400px;
  height: calc(100vh - 70px);
  position: absolute;
  right: 0;
  top: 70px;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  z-index: 5;
}

form {
  background: #c1c1c1;
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  gap: 20px;
}

.form-element {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 5px;
}

.form-column {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.form-element-2 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  width: 300px;
}

.form-element:last-of-type {
  align-items: center;
  height: 40px;
}

label {
  text-align: left;
}

label,
.input,
select,
input {
  width: 100%;
}

.input,
select,
input {
  padding: 5px 10px;
  color: white;
  background-color: #2c3e50;
  border: none;
  border-radius: 6px;
  outline: none;
  font-size: 15px;
}

button {
  width: 150px;
  height: 35px;
  font-size: 15px;
  color: #2c3e50;
  border: 1px solid white;
  color: white;
}

h5 {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 6px 10px;
  border-radius: 50%;
  background-color: #2c3e50;
  color: white;
  cursor: pointer;
}
</style>
