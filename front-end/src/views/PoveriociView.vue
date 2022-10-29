<template>
  <div class="poverioci">
    <div class="backdrop" @click.self="toggleBackdrop" v-if="backDropVis">
      <div class="container">
        <div class="pitanje">
          <p>
            Da li želite da obrišete poverioca
            <b
              ><u>{{ odabraniPov.poverilacKrace }}</u></b
            >?
          </p>
        </div>
        <div class="odgovor">
          <button @click="delPoverilac">Da</button>
          <button @click="toggleBackdrop">Ne</button>
        </div>
      </div>
    </div>
    <NovPoverilac
      v-if="formVis"
      @hideForm="toggleForm"
      :poverilacId="odabraniPov.poverilacId"
      :poverilacNaziv="odabraniPov.poverilacNaziv"
      :poverilacKrace="odabraniPov.poverilacKrace"
      :modelPlacanja="odabraniPov.modelPlacanja"
      :tekRacun="odabraniPov.tekRacun"
      :editMode="odabraniPov.editMode"
    />
    <div class="spisak-poverilaca">
      <div class="pretraga">
        <input
          type="text"
          v-model="pretragaPovKrace"
          @keyup="resetStranica"
          placeholder="pretraga"
        />
        <p>Pronađenih: {{ filteredP.length }}</p>
      </div>
      <div class="spisak">
        <p v-if="paginacija.length == 0">
          Nema poverilaza za kriterijum pretrage
        </p>
        <transition-group tag="ul" name="list" appear>
          <li
            v-for="p in paginacija[stranica - 1]"
            :key="p.poverilacId"
            @click="
              aktiviraj(
                p.poverilacId,
                p.poverilacNaziv,
                p.poverilacKrace,
                p.modelPlacanja,
                p.tekRacun
              )
            "
            :class="{ aktivna: aktId == p.poverilacId }"
          >
            <p>{{ p.poverilacKrace }}</p>
          </li>
        </transition-group>
      </div>
      <button class="nov-poverilac" @click="toggleForm">Nov poverilac</button>
      <div class="paginacija" @click.self="hideForm">
        <div>
          <button :class="{ disabled: isPrva }" @click="goPrva">prva</button>
          <button :class="{ disabled: isPrva }" @click="goNazad">
            {{ prethodna }}
          </button>
          <p>{{ stranica }}</p>
          <button :class="{ disabled: isPoslednja }" @click="goNapred">
            {{ sledeca }}
          </button>
          <button :class="{ disabled: isPoslednja }" @click="goPoslednja">
            poslednja
          </button>
        </div>
        <div>
          <small>stranica {{ stranica }} od {{ brojStranica }}</small>
        </div>
      </div>
    </div>
    <div class="desnoDetalji">
      <transition name="fade" appear>
        <p class="uslovna" v-if="!aktId">
          Odaberite poverioca da biste videli detalje
        </p>
      </transition>
      <transition name="fade" appear>
        <div class="detalji" v-if="aktId">
          <div class="specifikacija">
            <h3>{{ aktivniPoverilac.poverilacNaziv }}</h3>
            <div class="group">
              <p>Tekući račun:</p>
              <b
                ><p>{{ aktivniPoverilac.tekRacun }}</p></b
              >
            </div>
            <div class="group">
              <p>Model plaćanja</p>
              <b
                ><p>{{ aktivniPoverilac.modelPlacanja }}</p></b
              >
            </div>
            <div class="komande">
              <button @click="toggleForm">Promeni</button>
              <button @click="toggleBackdrop">Obriši</button>
            </div>
          </div>
        </div>
      </transition>
      <transition name="fade" appear>
        <div class="spisak-racuna" v-if="aktId">
          <div class="pretraga-racuna">
            <div class="racuni-filter">
              <select v-model="pretragaMesec" @change="resetStranica2">
                <option value="">Mesec</option>
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
              <select v-model="pretragaGodina" @change="resetStranica2">
                <option value="">Godina</option>
                <option v-for="g in godine" :key="g.godina" :value="g.godina">
                  {{ g.godina }}
                </option>
              </select>

              <select v-model="pretragaStatus" @change="resetStranica2">
                <option value="">Status</option>
                <option value="plaćeno">Plaćeno</option>
                <option value="delimično plaćeno">Delimično plaćeno</option>
                <option value="neplaćeno">Neplaćeno</option>
              </select>
            </div>
            <div class="rezultat">
              <p>{{ brojPronadjenih }}</p>
            </div>
            <transition-group tag="ul" name="list" appear>
              <li
                v-for="r in paginacija2[stranica2 - 1]"
                :key="r.racunId"
                @click="goToDetails(r.racunId)"
              >
                <p>{{ r.periodMesec }} {{ r.periodGodina }}</p>
                <p>{{ r.statusPlacanja }}</p>
                <p>
                  {{
                    new Intl.NumberFormat("de-DE", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(r.iznosRacuna)
                  }}
                </p>
              </li>
            </transition-group>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import NovPoverilac from "../components/NovPoverilac.vue";
export default {
  components: { NovPoverilac },
  setup() {
    document.title = "Poverioci";
    const store = useStore();
    const router = useRouter();
    onMounted(() => {
      store.dispatch("actZaRacune");
    });
    const stranica = ref(1);
    const stranica2 = ref(1);
    const poStranici = ref(12);
    const pretragaPovKrace = ref("");
    const aktId = ref("");
    const pretragaMesec = ref("");
    const pretragaGodina = ref("");
    const pretragaStatus = ref("");
    const formVis = ref(false);
    const backDropVis = ref(false);
    const odabraniPov = reactive({
      editMode: false,
      poverilacId: "",
      poverilacNaziv: "",
      poverilacKrace: "",
      modelPlacanja: "",
      tekRacun: "",
    });
    const racuni = computed(() => {
      return store.getters.getRacuni;
    });
    const godine = computed(() => {
      return store.getters.getGodine;
    });
    const racuniZaPoverioca = computed(() => {
      return racuni.value.filter((r) => {
        return r.poverilacId == aktId.value;
      });
    });
    const filtriraniRac = computed(() => {
      const filter = racuniZaPoverioca.value.filter((r) => {
        return (
          (pretragaGodina.value === ""
            ? true
            : r.periodGodina === pretragaGodina.value) &&
          (pretragaMesec.value === ""
            ? true
            : r.periodMesec === pretragaMesec.value) &&
          (pretragaStatus.value == ""
            ? true
            : r.statusPlacanja == pretragaStatus.value)
        );
      });
      return filter;
    });
    const poverioci = computed(() => {
      return store.getters.getPoverioci;
    });
    const periodi = computed(() => {
      return store.getters.getPeriodi;
    });
    const filteredP = computed(() => {
      let spisak = poverioci.value.filter((p) => {
        return p.poverilacKrace
          .toLowerCase()
          .includes(pretragaPovKrace.value.toLowerCase());
      });
      return spisak;
    });
    const paginacija = computed(() => {
      const chunks = [];
      let kopija = [].concat(...filteredP.value);

      while (kopija.length) {
        chunks.push(kopija.splice(0, poStranici.value));
      }
      return chunks;
    });
    const paginacija2 = computed(() => {
      const chunks = [];
      let kopija = [].concat(...filtriraniRac.value);

      while (kopija.length) {
        chunks.push(kopija.splice(0, poStranici.value));
      }
      return chunks;
    });
    const brojPronadjenih = computed(() => {
      if (filtriraniRac.value.length == 0) {
        return `Nema računa za odabir`;
      } else {
        return `Broj računa: ${filtriraniRac.value.length}`;
      }
    });
    const brojStranica = computed(() => {
      return paginacija.value.length;
    });
    const brojStranica2 = computed(() => {
      return paginacija2.value.length;
    });
    const stranice = computed(() => {
      let stranice = [];
      for (let i = 1; i <= brojStranica.value; i++) {
        stranice.push(i);
      }
      return stranice;
    });
    const stranice2 = computed(() => {
      let stranice = [];
      for (let i = 1; i <= brojStranica2.value; i++) {
        stranice.push(i);
      }
      return stranice;
    });
    const prethodna = computed(() => {
      if (stranica > 1) {
        return stranica - 1;
      } else {
        return "---";
      }
    });
    const prethodna2 = computed(() => {
      if (stranica2.value > 1) {
        return stranica2.value - 1;
      } else {
        return "---";
      }
    });
    const sledeca = computed(() => {
      if (stranica.value < brojStranica.value) {
        return stranica.value + 1;
      } else {
        return "---";
      }
    });
    const sledeca2 = computed(() => {
      if (stranica2.value < brojStranica2.value) {
        return stranica2.value + 1;
      } else {
        return "---";
      }
    });
    const isPrva = computed(() => {
      if (stranica.value === 1) {
        return true;
      } else {
        return false;
      }
    });
    const isPrva2 = computed(() => {
      if (stranica2.value === 1) {
        return true;
      } else {
        return false;
      }
    });
    const isPoslednja = computed(() => {
      if (stranica.value === brojStranica.value) {
        return true;
      } else {
        return false;
      }
    });
    const isPoslednja2 = computed(() => {
      if (stranica2.value === brojStranica2.value) {
        return true;
      } else {
        return false;
      }
    });
    const aktivniPoverilac = computed(() => {
      let pov = [];
      if (aktId.value != "") {
        pov = filteredP.value.filter((p) => {
          return p.poverilacId == aktId.value;
        });
        let poverilac = pov[0];
        return poverilac;
      }
      return pov;
    });
    const toggleForm = () => {
      formVis.value = !formVis.value;
    };
    const toggleBackdrop = () => {
      backDropVis.value = !backDropVis.value;
    };
    const delPoverilac = () => {
      store.dispatch("actDelPoverilac", {
        poverilacId: odabraniPov.value.poverilacId,
      });
      toggleBackdrop();
      aktId.value = "";
      odabraniPov.poverilacId = "";
      odabraniPov.poverilacNaziv = "";
      odabraniPov.poverilacKrace = "";
      odabraniPov.modelPlacanja = "";
      odabraniPov.tekRacun = "";
      odabraniPov.editMode = false;
    };
    const goToDetails = (racunId) => {
      router.push(`/bills/${racunId}`);
    };
    const aktiviraj = (
      poverilacId,
      poverilacNaziv,
      poverilacKrace,
      modelPlacanja,
      tekRacun
    ) => {
      if (aktId == poverilacId) {
        aktId.value = "";
        odabraniPov.poverilacId = "";
        odabraniPov.poverilacNaziv = "";
        odabraniPov.poverilacKrace = "";
        odabraniPov.modelPlacanja = "";
        odabraniPov.tekRacun = "";
        odabraniPov.editMode = false;
      } else {
        aktId.value = poverilacId;
        odabraniPov.poverilacId = poverilacId;
        odabraniPov.poverilacNaziv = poverilacNaziv;
        odabraniPov.poverilacKrace = poverilacKrace;
        odabraniPov.modelPlacanja = modelPlacanja;
        odabraniPov.tekRacun = tekRacun;
        odabraniPov.editMode = true;
      }
    };
    const resetStranica = () => {
      stranica.value = 1;
    };
    const resetStranica2 = () => {
      stranica2.value = 1;
    };
    const goPrva = () => {
      if (stranica.value > 1) {
        stranica.value = 1;
      }
    };
    const goPrva2 = () => {
      if (stranica2.value > 1) {
        stranica2.value = 1;
      }
    };
    const goNazad = () => {
      if (stranica.value > 1) {
        stranica.value--;
      }
    };
    const goNazad2 = () => {
      if (stranica2.value > 1) {
        stranica2.value--;
      }
    };
    const goNapred = () => {
      if (stranica.value < brojStranica.value) {
        stranica.value++;
      }
    };
    const goNapred2 = () => {
      if (stranica2.value < brojStranica2.value) {
        stranica2.value++;
      }
    };
    const goPoslednja = () => {
      if (stranica.value < brojStranica.value) {
        stranica.value = brojStranica.value;
      }
    };
    const goPoslednja2 = () => {
      if (stranica2.value < brojStranica2.value) {
        stranica2.value = brojStranica2.value;
      }
    };

    window.addEventListener("resize", () => {
      if (window.innerHeight >= 815) {
        poStranici.value = 10;
      }
      if (window.innerHeight < 815 && window.innerHeight >= 670) {
        poStranici.value = 7;
      }
      if (window.innerHeight < 670 && window.innerHeight >= 565) {
        poStranici.value = 5;
        return;
      }
      if (window.innerHeight < 565) {
        poStranici.value = 3;
        return;
      }
    });

    onMounted(() => {
      if (window.innerHeight >= 815) {
        poStranici.value = 10;
        return;
      }
      if (window.innerHeight < 815 && window.innerHeight >= 670) {
        poStranici.value = 7;
        return;
      }
      if (window.innerHeight < 670 && window.innerHeight >= 565) {
        poStranici.value = 5;
        return;
      }
      if (window.innerHeight < 565) {
        poStranici.value = 3;
        return;
      }

      store.dispatch("actZaRacune");
    });
    return {
      aktId,
      aktiviraj,
      aktivniPoverilac,
      paginacija,
      paginacija2,
      backDropVis,
      brojStranica,
      brojStranica2,
      brojPronadjenih,
      delPoverilac,
      formVis,
      filteredP,
      godine,
      goPrva,
      goPrva2,
      goNapred,
      goNapred2,
      goNazad,
      goNazad2,
      goPoslednja,
      goPoslednja2,
      goToDetails,
      isPrva,
      isPrva2,
      isPoslednja,
      isPoslednja2,
      odabraniPov,
      pretragaGodina,
      pretragaPovKrace,
      pretragaMesec,
      pretragaStatus,
      prethodna,
      prethodna2,
      resetStranica,
      resetStranica2,
      sledeca,
      sledeca2,
      stranica,
      stranica2,
      toggleForm,
      toggleBackdrop,
    };
  },
};
</script>

<style scoped>
.poverioci {
  width: 100%;
  height: 100vh;
  padding-top: 90px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 30px;
}

.spisak-poverilaca {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: 400px;
  height: calc(100vh - 110px);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.pretraga {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.pretraga input {
  padding: 5px 10px;
  outline: none;
  border: none;
  border-radius: 6px;
  text-align: center;
}

.spisak {
  width: 100%;
  height: 600px;
}

.spisak ul {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  list-style-type: none;
  padding: 10px 20px;
  position: relative;
  min-height: 400px;
}

.spisak li {
  /* background: rgba(255, 255, 255, 0.2); */
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px 15px;
  width: 100%;
  cursor: pointer;
}

.spisak li:hover {
  background: #2c3e50;
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

.paginacija {
  position: absolute;
  bottom: 20px;
  left: 0;
  height: 55px;
  width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding-top: 27px;
  margin-top: 20px;
  border-top: 1px solid #2c3e50;
}

.paginacija div {
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.paginacija button,
.paginacija p {
  width: 40px;
}

.paginacija button:first-of-type,
.paginacija button:last-of-type {
  width: 75px;
}

.paginacija small {
  width: 100%;
}

.aktivna {
  background-color: #2c3e50;
  color: white;
}

.desnoDetalji {
  width: 860px;
  height: calc(100vh - 110px);
  display: flex;
  padding: 0 20px;
  align-items: center;
  justify-content: space-evenly;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
}

.detalji {
  width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  padding: 20px;
}

.specifikacija {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 0;
}

.komande {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.specifikacija button {
  width: 75px;
}

.spisak-racuna {
  width: 450px;
  height: calc(100vh - 110px);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  padding: 20px;
}
.pretraga-racuna {
  width: 100%;
  height: 650px;
}

.spisak-racuna ul {
  list-style-type: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 5px;
  position: relative;
}

.spisak-racuna ul li {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.spisak-racuna li p:nth-of-type(1) {
  width: 37%;
  text-align: left;
}
.spisak-racuna li p:nth-of-type(2) {
  width: 43%;
  text-align: left;
}
.spisak-racuna li p:last-of-type {
  width: 20%;
  text-align: right;
}

.racuni-filter {
  display: flex;
  width: 100%;
  height: 60px;
  align-items: center;
  justify-content: space-between;
}

.racuni-filter select {
  width: 30%;
  background-color: #2c3e50;
  color: white;
  padding: 5px;
  border: none;
  border-radius: 6px;
}

.disabled {
  color: #2c3e50;
  background-color: transparent;
  cursor: unset;
}

.disabled:hover {
  background: none;
}

.rezultat {
  width: 100%;
  margin-bottom: 20px;
}

.uslovna {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
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

.nov-poverilac {
  position: absolute;
  bottom: 85px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
