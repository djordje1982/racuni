<template>
  <div class="placanje">
    <h5 v-if="placanja.length == 0">Nema evidentiranih uplata za ovaj račun</h5>

    <div class="gore" v-if="placanja.length > 0">
      <transition-group tag="ul" name="list" appear>
        <li
          v-for="p in placanja"
          :key="p.placanjeId"
          :class="{ aktivna: aktId === p.placanjeId }"
          @click="aktiviraj(p.datumPlacanja, p.iznosPlacanja, p.placanjeId)"
        >
          <p class="hidden">{{ p.placanjeId }}</p>
          <p>{{ p.datumPlacanja }}</p>
          <p>
            {{
              new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(p.iznosPlacanja)
            }}
          </p>
        </li>
      </transition-group>
    </div>

    <div class="form">
      <form @submit.prevent="sendData">
        <div class="form-element">
          <label>Datum:</label>
          <input type="date" v-model="formD.datumPlacanja" required />
        </div>
        <div class="form-element">
          <label>Iznos:</label>
          <number
            v-model="formD.iznosPlacanja"
            v-bind="number"
            class="input text-desno"
          ></number>
        </div>
        <div class="form-element">
          <button>
            <transition name="roto" mode="out-in">
              <span v-if="!editMode">Evidentiraj plaćanje</span>
              <span v-else>Promeni plaćanje</span>
            </transition>
          </button>
        </div>
      </form>
      <button class="abs" v-if="editMode" @click="deletePayment">
        Obriši plaćanje
      </button>
    </div>
  </div>
</template>

<script>
import { number } from "@coders-tm/vue-number-format";
import { reactive, ref, computed, watch, toRef } from "vue";
import { useStore } from "vuex";
export default {
  components: {
    number,
  },
  props: ["placanja", "racunId"],
  setup(props) {
    const store = useStore();
    const formD = reactive({
      iznosPlacanja: "",
      datumPlacanja: "",
    });
    const menu = toRef(props, "placanja");
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
    const racun = reactive({});
    const aktId = ref("");
    const editMode = ref(false);
    const sendData = () => {
      const formData = {
        racunId: props.racunId,
        iznosPlacanja: formD.iznosPlacanja,
        datumPlacanja: formD.datumPlacanja,
        placanjeId: aktId.value,
      };
      if (!editMode.value) {
        store.dispatch("actAddPlacanje", formData);
      } else {
        store.dispatch("actEditPayment", formData);
      }
    };
    const deletePayment = () => {
      store.dispatch("actDelPlacanje", {
        placanjeId: aktId.value,
      });
    };
    const aktiviraj = (datumPlacanja, iznosPlacanja, placanjeId) => {
      if (aktId == placanjeId) {
        editMode.value = false;
        formD.datumPlacanja = "";
        formD.iznosPlacanja = "";
        aktId = "";
      } else {
        editMode.value = true;
        aktId.value = placanjeId;
        formD.datumPlacanja = datumPlacanja;
        formD.iznosPlacanja = parseFloat(iznosPlacanja);
      }
    };
    const statusServera = computed(() => {
      return store.getters.getServerStatus;
    });
    watch(statusServera, (newVal, oldVal) => {
      if ((newVal === 201 && !editMode.value) || newVal === 200) {
        formD.datumPlacanja = "";
        formD.iznosPlacanja = 0;
      }
    });
    return {
      placanja,
      aktId,
      sendData,
      number,
      editMode,
      deletePayment,
      aktiviraj,
    };
  },
};
</script>

<style scoped>
.placanje {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 20px;
}

ul {
  list-style-type: none;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  gap: 5px;
}

li {
  width: 100%;
  padding: 5px 25px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.list-enter-from {
  opacity: 0;
  transform: scale(0.6);
}
.list-enter-to {
  opacity: 1;
  transform: scale(1);
}

.list-enter-active {
  transition: all 0.4s ease;
}

.list-leave-from {
  opacity: 1;
  transform: scale(1);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

.list-leave-active {
  transition: all 0.4s ease;
  position: absolute;
}

.list-move {
  transition: all 0.3s ease;
}

.gore {
  width: 100%;
  height: 50%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.form {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  position: relative;
  border: 1px sold black;
  padding: 30px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  gap: 15px;
  height: 50%;
  padding: 15px;
}

.form-element {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  width: 60%;
}

.form-element:last-of-type {
  align-items: center;
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
  width: 100%;
}

.input {
  text-align: right;
}

input {
  text-align: center;
}

label {
  font-size: 15px;
}

button {
  width: 100px;
  background-color: #2c3e50;
}

.roto-enter-from,
.roto-leve-to {
  opacity: 0;
}

.roto-enter-active,
.roto-leave-active {
  transition: all 0.3s ease;
}

.aktivna {
  background-color: #2c3e50;
  color: white;
}

.abs {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.det {
  width: 100%;
  height: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid #2c3e50;
}

.det div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 120px;
}
</style>
