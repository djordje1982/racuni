<template>
  <div class="detalji">
    <NovRacun
      :editMode="true"
      :poverilacId="racun.poverilacId"
      :periodMesec="racun.periodMesec"
      :periodGodina="racun.periodGodina"
      :pozivNaBroj="racun.pozivNaBroj"
      :iznosRacuna="racun.iznosRacuna"
      :placeno="racun.SumOfIznosPlacanja"
      :racunId="racun.racunId"
      v-if="formVis"
      @hideForm="toggleForm"
    />
    <div class="backdrop" @click.self="toggleBackdrop" v-if="backDropVis">
      <div class="container">
        <div class="pitanje">
          <p>
            Da li želite da obrišete račun
            <b
              ><u>{{ racun.poverilacKrace }}</u></b
            >
            za period
            <b
              ><u>{{ racun.periodMesec }} {{ racun.periodGodina }}</u></b
            >?
          </p>
        </div>
        <div class="odgovor">
          <button @click="delRacun">Da</button>
          <button @click="toggleBackdrop">Ne</button>
        </div>
      </div>
    </div>
    <div class="specifikacija">
      <div class="gore">
        <div class="element">
          <p>Poverilac</p>
          <b
            ><p>{{ racun.poverilacKrace }}</p></b
          >
        </div>
        <div class="element">
          <p>Period</p>
          <b
            ><p>{{ racun.periodMesec }} {{ racun.periodGodina }}</p></b
          >
        </div>
        <div class="element">
          <p>Model i poziv na broj</p>
          <b
            ><p>{{ racun.modelPlacanja }} {{ racun.pozivNaBroj }}</p></b
          >
        </div>
        <button class="delDugme" @click="toggleBackdrop">Obriši račun</button>
        <button class="delDugme2" @click="toggleForm">Promeni račun</button>
      </div>
      <div class="dole">
        <div class="element">
          <p class="alignRight">Iznos računa</p>
          <b
            ><p class="alignRight">
              {{
                new Intl.NumberFormat("de-DE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(racun.iznosRacuna)
              }}
            </p></b
          >
        </div>
        <div class="element">
          <p class="alignRight">Plaćeno</p>
          <b
            ><p class="alignRight">
              {{
                new Intl.NumberFormat("de-DE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(racun.SumOfIznosPlacanja)
              }}
            </p></b
          >
        </div>
        <div class="element">
          <p class="alignRight">Preostalo</p>
          <b
            ><p class="alignRight">
              {{
                new Intl.NumberFormat("de-DE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(racun.razlika)
              }}
            </p></b
          >
        </div>
      </div>
    </div>
    <div class="placanja">
      <button class="delDugme" v-if="editMode" @click="delPlacanje">
        Obriši plaćanje
      </button>
      <div class="levo">
        <transition-group tag="ul" name="list" appear>
          <li
            v-for="p in placanjaZaRacun"
            :key="p.placanjeId"
            @click="aktiviraj(p.placanjeId, p.datumPlacanja, p.iznosPlacanja)"
            :class="{ aktivna: aktId == p.placanjeId }"
          >
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
      <div class="desno">
        <form @submit.prevent="sendData">
          <div class="form-element">
            <label>Datum plaćanja</label>
            <input type="date" v-model="datumPlacanja" />
          </div>
          <div class="form-element">
            <label>Iznos plaćanja</label>
            <number
              v-bind="number"
              v-model="iznosPlacanja"
              class="input"
            ></number>
          </div>
          <div class="form-element">
            <button>
              <span v-if="!editMode">Evidentiraj plaćanje</span>
              <span v-if="editMode">Promeni plaćanje</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { number } from "@coders-tm/vue-number-format";
import NovRacun from "../components/NovRacun.vue";
import { ref, reactive, computed, watch, toRef } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  components: { number, NovRacun },
  props: ["racunId"],
  setup(props) {
    const store = useStore();
    const router = useRouter();
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
    const editMode = ref(false);
    const datumPlacanja = ref("");
    const iznosPlacanja = ref("");
    const placanjeId = ref("");
    const aktId = ref("");
    const aktivnoPlacanje = ref(0);
    const backDropVis = ref(false);
    const formVis = ref(false);

    const aktiviraj = (placId, datPlac, iznosPl) => {
      if (aktId.value == placanjeId) {
        editMode.value = false;
        datumPlacanja.value = "";
        iznosPlacanja.value = "";
        placanjeId.value = "";
        aktId.value = "";
        aktivnoPlacanje.value = 0;
      } else {
        editMode.value = true;
        datumPlacanja.value = datPlac;
        iznosPlacanja.value = parseFloat(iznosPl);
        placanjeId.value = placId;
        aktId.value = placanjeId;
        aktivnoPlacanje.value = iznosPl;
      }
    };
    const sendData = () => {
      let maximum =
        parseFloat(racun.value.razlika) + parseFloat(aktivnoPlacanje.value);

      if (iznosPlacanja.value <= 0) {
        return store.commit("mutGreskaForma", {
          message: "Iznos plaćanja mora imati pozitivnu vrednost",
        });
      }

      if (parseFloat(iznosPlacanja.value) > maximum) {
        return store.commit("mutGreskaForma", {
          message: "Iznos plaćanja je veći od iznosa računa",
        });
      }
      const formData = {
        placanjeId: placanjeId.value,
        datumPlacanja: datumPlacanja.value,
        iznosPlacanja: iznosPlacanja.value,
        racunId: props.racunId,
      };

      if (!editMode.value) {
        store.dispatch("actAddPlacanje", formData);
      } else {
        store.dispatch("actEditPayment", formData);
      }
    };
    const delPlacanje = () => {
      store.dispatch("actDelPlacanje", {
        placanjeId: placanjeId.value,
      });
      editMode.value = false;
      datumPlacanja.value = "";
      iznosPlacanja.value = "";
      placanjeId.value = "";
      aktId.value = "";
      aktivnoPlacanje.value = 0;
    };
    const toggleBackdrop = () => {
      backDropVis.value = !backDropVis.value;
    };
    const toggleForm = () => {
      formVis.value = !formVis.value;
    };
    const delRacun = () => {
      store.dispatch("actDeleteBill", {
        racunId: props.racunId,
      });
      router.go(-1);
    };
    const placanja = computed(() => {
      return store.getters.getPlacanja;
    });
    const racuni = computed(() => {
      return store.getters.getRacuni;
    });
    const racun = computed(() => {
      let rac = racuni.value.filter((r) => {
        return r.racunId == props.racunId;
      });
      let single = rac[0];
      return single;
    });
    const placanjaZaRacun = computed(() => {
      let plac = placanja.value.filter((p) => {
        return p.racunId == props.racunId;
      });
      return plac;
    });
    const statusServera = computed(() => {
      return store.getters.getServerStatus;
    });
    watch(statusServera, (newVal, oldVal) => {
      if ((newVal === 201 && !editMode.value) || newVal === 200) {
        datumPlacanja.value = "";
        iznosPlacanja.value = 0;
      }
    });
    document.title =
      racun.value.poverilacKrace +
      " - " +
      racun.value.periodMesec +
      " " +
      racun.value.periodGodina;

    return {
      racun,
      formVis,
      toggleForm,
      toggleBackdrop,
      backDropVis,
      delRacun,
      editMode,
      delPlacanje,
      placanjaZaRacun,
      aktId,
      sendData,
      datumPlacanja,
      iznosPlacanja,
      number,
      aktiviraj,
    };
  },
};
</script>

<style scoped>
.detalji {
  width: 100%;
  height: 100vh;
  padding-top: 90px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
}

.specifikacija {
  min-width: 600px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 30px;
}

.gore,
.dole {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  width: 50%;
  gap: 20px;
  padding: 10px;
}

.gore {
  border-right: 1px solid #2c3e50;
}

.element {
  text-align: left;
  width: 100%;
}

.element p {
  font-size: 16px;
}

.placanja {
  min-width: 600px;
  min-height: 200px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  position: relative;
}

ul {
  list-style-type: none;
  width: 100%;
  position: relative;
}

li {
  width: 100%;
  padding: 5px 15px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  margin: 5px;
  display: flex;
  align-self: center;
  justify-content: space-between;
  font-size: 15px;
  position: relative;
}

.levo,
.desno {
  height: 100%;
  width: 240px;
  padding: 10px;
}

.levo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.desno {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

form {
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  gap: 10px;
}

.form-element {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  gap: 5px;
}

.form-element:last-of-type {
  align-items: center;
}

.input,
input {
  width: 100%;
  padding: 5px 10px;
  border: none;
  border-radius: 6px;
  text-align: center;
}

.input {
  text-align: right;
}

label {
  font-size: 15px;
  padding-left: 5px;
}

button {
  background-color: #2c3e50;
  padding: 10px;
  width: 150px;
}

.aktivna {
  background-color: #2c3e50;
  color: white;
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

.alignRight {
  width: 100%;
  text-align: right;
}

.delDugme {
  position: absolute;
  right: -170px;
}

.delDugme2 {
  position: absolute;
  right: -170px;
  top: 150px;
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 15;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  width: 550px;
  height: 150px;
  color: white;
  background-color: #2c3e50;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.pitanje,
.odgovor {
  height: 50%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
}
.container button {
  width: 60px;
  border: 1px solid white;
}
</style>
