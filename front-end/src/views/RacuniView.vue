<template>
  <div class="home" @click.self="hideForm">
    <transition name="slide" appear>
      <NovRacun
        :racuni="racuni"
        :editMode="false"
        :menu="1"
        @hideForm="hideForm"
        v-if="formVis"
      />
    </transition>
    <div class="spisak-racuna" @click.self="hideForm">
      <div class="pretraga" @click="hideForm">
        <div class="form-element">
          <label>Poverilac:</label>
          <select v-model="pretragaPoverilac" @change="resetStranica">
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
          <label>Mesec:</label>
          <select v-model="pretragaMesec" @change="resetStranica">
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
        <div class="form-element">
          <label>Godina:</label>
          <select v-model="pretragaGodina" @change="resetStranica">
            <option value="">---</option>
            <option v-for="g in godine" :key="g.godina" :value="g.godina">
              {{ g.godina }}
            </option>
          </select>
        </div>
        <div class="form-element">
          <label>Minimum:</label>
          <div>
            <number
              v-model="pretragaMin"
              v-bind="number"
              class="input"
              @change="resetStranica"
            ></number>
          </div>
        </div>
        <div class="form-element">
          <label>Maximum:</label>
          <div>
            <number
              v-model="pretragaMax"
              v-bind="number"
              class="input"
              @change="resetStranica"
            ></number>
          </div>
        </div>
        <div class="form-element">
          <label>Status:</label>
          <select v-model="pretragaStatus" @change="resetStranica">
            <option value="">---</option>
            <option value="plaćeno">plaćeno</option>
            <option value="delimično plaćeno">delimično plaćeno</option>
            <option value="neplaćeno">neplaćeno</option>
          </select>
        </div>
      </div>
      <div class="spisak" @click="hideForm">
        <div class="header">
          <div class="p1" @click="sortirajRacune(2)">
            <p>Poverilac</p>
            <transition mode="out-in" name="fade" appear>
              <img v-if="sortId === 2" src="../assets/up.png" alt="" />
              <img v-else-if="sortId === 3" src="../assets/down.png" alt="" />
            </transition>
          </div>
          <div class="p2" @click="sortirajRacune(0)">
            <p>Period</p>
            <transition mode="out-in" name="fade" appear>
              <img v-if="sortId === 0" src="../assets/up.png" alt="" />
              <img v-else-if="sortId === 1" src="../assets/down.png" alt="" />
            </transition>
          </div>
          <div class="p3" @click="sortirajRacune(4)">
            <p>Status</p>
            <transition mode="out-in" name="fade" appear>
              <img v-if="sortId === 4" src="../assets/up.png" alt="" />
              <img v-else-if="sortId === 5" src="../assets/down.png" alt="" />
            </transition>
          </div>
          <div class="p4" @click="sortirajRacune(10)">
            <p>Plaćeno</p>
            <transition mode="out-in" name="fade" appear>
              <div class="nosac-slike">
                <img v-if="sortId === 10" src="../assets/up.png" alt="" />
                <img
                  v-else-if="sortId === 11"
                  src="../assets/down.png"
                  alt=""
                />
              </div>
            </transition>
          </div>
          <div class="p5" @click="sortirajRacune(6)">
            <p>Preostalo</p>
            <div class="nosac-slike">
              <transition mode="out-in" name="fade" appear>
                <img v-if="sortId === 6" src="../assets/up.png" alt="" />
                <img v-else-if="sortId === 7" src="../assets/down.png" alt="" />
              </transition>
            </div>
          </div>
          <div class="p6" @click="sortirajRacune(8)">
            <p>Iznos računa</p>
            <div class="nosac-slike">
              <transition mode="out-in" name="fade" appear>
                <img v-if="sortId === 8" src="../assets/up.png" alt="" />
                <img v-else-if="sortId === 9" src="../assets/down.png" alt="" />
              </transition>
            </div>
          </div>
        </div>
        <transition name="switch" mode="out-in" appear>
          <h5 v-if="pages.length === 0">Nema računa za odabir</h5>
          <transition-group tag="ul" name="list" appear v-else>
            <li v-for="r in pages[stranica - 1]" :key="r.racunId">
              <Racun
                :poverilacKrace="r.poverilacKrace"
                :periodMesec="r.periodMesec"
                :periodGodina="r.periodGodina"
                :iznosRacuna="r.iznosRacuna"
                :statusPlacanja="r.statusPlacanja"
                :razlika="r.razlika"
                :racunId="r.racunId"
                :placeno="r.SumOfIznosPlacanja"
                @click="goToDetails(r.racunId)"
              />
            </li>
          </transition-group>
        </transition>
      </div>
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
    <div class="specifikacija">
      <div class="spec-det">
        <div class="pozicija">
          <p>Broj računa</p>
          <p>{{ filterRacuni.length }}</p>
        </div>
        <div class="pozicija">
          <p>Plaćeni računi</p>
          <p>{{ placeniRacuni.length }}</p>
        </div>
        <div class="pozicija">
          <p>Delimično plaćeni</p>
          <p>{{ delimicnoPlaceni.length }}</p>
        </div>
        <div class="pozicija">
          <p>Neplaćeni računi</p>
          <p>{{ neplaceniRacuni.length }}</p>
        </div>
        <div class="pozicija">
          <p>Ukupno računi</p>
          <p>
            {{
              new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(ukupnoRacuni)
            }}
          </p>
        </div>
        <div class="pozicija">
          <p>Ukupno plaćeno</p>
          <p>
            {{
              new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(ukupnoPlaceni)
            }}
          </p>
        </div>
        <div class="pozicija">
          <p>Za plaćanje</p>
          <p>
            {{
              new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(zaPlacanje)
            }}
          </p>
        </div>
      </div>
      <button class="nov" @click="showForm">Nov račun</button>
      <div class="chart">
        <pie-chart
          :data="grafData"
          thousands="."
          decimal=","
          loading="Loading..."
          empty="Nema podataka"
          :download="true"
          :colors="['rgba(0,100,0,0.45)', 'rgba(100,0,0,0.45)']"
          :round="2"
          :zeros="true"
          width="100%"
          height="100%"
          :library="library4"
        ></pie-chart>
      </div>
    </div>
  </div>
</template>

<script>
import NovRacun from "../components/NovRacun.vue";
import Racun from "../components/Racun.vue";
import { paginacija } from "@/functions";
import { number } from "@coders-tm/vue-number-format";
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: "HomeView",
  components: {
    number,
    NovRacun,
    Racun,
  },
  setup() {
    document.title = "Računi";
    const store = useStore();
    const router = useRouter();
    const formVis = ref(false);
    const sortId = ref(1);
    const editMode = ref(false);
    const stranica = ref(1);
    const poStranici = ref(1);
    const pretragaPoverilac = ref("");
    const pretragaMesec = ref("");
    const pretragaGodina = ref("");
    const pretragaMin = ref("");
    const pretragaMax = ref("");
    const pretragaStatus = ref("");

    const library4 = reactive({
      animation: {
        duration: 800,
        easing: "easeInOutQuad",
        delay: 600,
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 10,
              lineHeight: 0.6,
            },
            color: "#2c3e50",
          },
        },
      },
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
    const racuni = computed(() => {
      return store.getters.getRacuni;
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
    const viewport = computed(() => {
      return window.innerHeight;
    });

    const sortiraniRacuni = computed(() => {
      let sortirani = [];
      switch (sortId.value) {
        case 0:
          sortirani = racuni.value.sort((a, b) => {
            if (a.periodId < b.periodId) {
              return -1;
            }
            if (a.periodId > b.periodId) {
              return 1;
            }
            return 0;
          });
          break;
        case 1:
          sortirani = racuni.value.sort((a, b) => {
            if (a.periodId < b.periodId) {
              return 1;
            }
            if (a.periodId > b.periodId) {
              return -1;
            }
            return 0;
          });
          break;
        case 2:
          sortirani = racuni.value.sort((a, b) => {
            if (a.poverilacKrace < b.poverilacKrace) {
              return -1;
            }
            if (a.poverilacKrace > b.poverilacKrace) {
              return 1;
            }
            return 0;
          });
          break;
        case 3:
          sortirani = racuni.value.sort((a, b) => {
            if (a.poverilacKrace < b.poverilacKrace) {
              return 1;
            }
            if (a.poverilacKrace > b.poverilacKrace) {
              return -1;
            }
            return 0;
          });
          break;
        case 4:
          sortirani = racuni.value.sort((a, b) => {
            if (a.statusPlacanja < b.statusPlacanja) {
              return -1;
            }
            if (a.statusPlacanja > b.statusPlacanja) {
              return 1;
            }
            return 0;
          });
          break;
        case 5:
          sortirani = racuni.value.sort((a, b) => {
            if (a.statusPlacanja < b.statusPlacanja) {
              return 1;
            }
            if (a.statusPlacanja > b.statusPlacanja) {
              return -1;
            }
            return 0;
          });
          break;
        case 6:
          sortirani = racuni.value.sort((a, b) => {
            if (parseFloat(a.razlika) < parseFloat(b.razlika)) {
              return -1;
            }
            if (parseFloat(a.razlika) > parseFloat(b.razlika)) {
              return 1;
            }
            return 0;
          });
          break;
        case 7:
          sortirani = racuni.value.sort((a, b) => {
            if (parseFloat(a.razlika) < parseFloat(b.razlika)) {
              return 1;
            }
            if (parseFloat(a.razlika) > parseFloat(b.razlika)) {
              return -1;
            }
            return 0;
          });
          break;
        case 8:
          sortirani = racuni.value.sort((a, b) => {
            if (parseFloat(a.iznosRacuna) < parseFloat(b.iznosRacuna)) {
              return -1;
            }
            if (parseFloat(a.iznosRacuna) > parseFloat(b.iznosRacuna)) {
              return 1;
            }
            return 0;
          });
          break;
        case 9:
          sortirani = racuni.value.sort((a, b) => {
            if (parseFloat(a.iznosRacuna) < parseFloat(b.iznosRacuna)) {
              return 1;
            }
            if (parseFloat(a.iznosRacuna) > parseFloat(b.iznosRacuna)) {
              return -1;
            }
            return 0;
          });
          break;
        case 10:
          sortirani = racuni.value.sort((a, b) => {
            if (
              parseFloat(a.SumOfIznosPlacanja) <
              parseFloat(b.SumOfIznosPlacanja)
            ) {
              return -1;
            }
            if (
              parseFloat(a.SumOfIznosPlacanja) >
              parseFloat(b.SumOfIznosPlacanja)
            ) {
              return 1;
            }
            return 0;
          });
          break;
        case 11:
          sortirani = racuni.value.sort((a, b) => {
            if (
              parseFloat(a.SumOfIznosPlacanja) <
              parseFloat(b.SumOfIznosPlacanja)
            ) {
              return 1;
            }
            if (
              parseFloat(a.SumOfIznosPlacanja) >
              parseFloat(b.SumOfIznosPlacanja)
            ) {
              return -1;
            }
            return 0;
          });
          break;
      }
      return sortirani;
    });
    const filterRacuni = computed(() => {
      let maximum;
      if (pretragaMax.value == "" || pretragaMax.value == 0) {
        maximum = Infinity;
      } else {
        maximum = parseFloat(pretragaMax);
      }
      const filter = sortiraniRacuni.value.filter((r) => {
        return (
          (pretragaPoverilac.value === ""
            ? true
            : r.poverilacId === pretragaPoverilac.value) &&
          (pretragaGodina.value === ""
            ? true
            : r.periodGodina === pretragaGodina.value) &&
          (pretragaMesec.value === ""
            ? true
            : r.periodMesec === pretragaMesec.value) &&
          (pretragaMin.value === ""
            ? true
            : parseFloat(r.iznosRacuna) >= parseFloat(pretragaMin.value)) &&
          (pretragaMax.value === ""
            ? true
            : parseFloat(r.iznosRacuna) <= maximum) &&
          (pretragaStatus.value == ""
            ? true
            : r.statusPlacanja == pretragaStatus.value)
        );
      });
      return filter;
    });
    const placeniRacuni = computed(() => {
      let placeni = filterRacuni.value.filter((r) => {
        return r.statusPlacanja == "plaćeno";
      });
      return placeni;
    });
    const delimicnoPlaceni = computed(() => {
      let delimicno = filterRacuni.value.filter((r) => {
        return r.statusPlacanja == "delimično plaćeno";
      });
      return delimicno;
    });
    const neplaceniRacuni = computed(() => {
      let neplaceni = filterRacuni.value.filter((r) => {
        return r.statusPlacanja == "neplaćeno";
      });
      return neplaceni;
    });
    const ukupnoRacuni = computed(() => {
      let sum = 0;
      filterRacuni.value.forEach((r) => {
        sum += parseFloat(r.iznosRacuna);
      });
      return sum;
    });
    const ukupnoPlaceni = computed(() => {
      let sum = 0;
      filterRacuni.value.forEach((r) => {
        sum += parseFloat(r.SumOfIznosPlacanja);
      });
      return sum;
    });
    const zaPlacanje = computed(() => {
      let sum = 0;
      filterRacuni.value.forEach((r) => {
        sum += parseFloat(r.razlika);
      });
      return Math.floor(sum * 100) / 100;
    });
    const grafData = computed(() => {
      let data = [];
      data = [
        ["Plaćeno", Math.floor(ukupnoPlaceni.value * 100) / 100],
        ["Za plaćanje", Math.floor(zaPlacanje.value * 100) / 100],
      ];
      return data;
    });

    const pages = computed(() => {
      return paginacija(filterRacuni.value, poStranici.value);
    });

    const brojStranica = computed(() => {
      return pages.value.length;
    });

    const stranice = computed(() => {
      let stranice = [];
      for (let i = 1; i <= brojStranica.value; i++) {
        stranice.push(i);
      }
      return stranice;
    });
    const prethodna = computed(() => {
      if (stranica.value > 1) {
        return stranica.value - 1;
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

    const isPrva = computed(() => {
      if (stranica.stranica === 1) {
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
    const visinaEkrana = computed(() => {
      return window.innerHeight;
    });
    const showForm = () => {
      formVis.value = !formVis.value;
    };
    const hideForm = () => {
      formVis.value = false;
    };
    const sortirajRacune = (id) => {
      if (sortId.value === id) {
        if (sortId.value === 0) {
          sortId.value = 1;
          return;
        }
        if (sortId.value === 1) {
          sortId.value = 0;
          return;
        }

        if (sortId.value === 2) {
          sortId.value = 3;
          return;
        }
        if (sortId.value === 3) {
          sortId.value = 2;
          return;
        }

        if (sortId.value === 4) {
          sortId.value = 5;
          return;
        }
        if (sortId.value === 5) {
          sortId.value = 4;
          return;
        }

        if (sortId.value === 6) {
          sortId.value = 7;
          return;
        }
        if (sortId.value === 7) {
          sortId.value = 6;
          return;
        }

        if (sortId.value === 8) {
          sortId.value = 9;
          return;
        }
        if (sortId.value === 9) {
          sortId.value = 8;
          return;
        }
        if (sortId.value === 10) {
          sortId.value = 11;
          return;
        }
        if (sortId.value === 11) {
          sortId.value = 10;
          return;
        }
      } else {
        sortId.value = id;
        return;
      }
    };
    const resetStranica = () => {
      stranica.value = 1;
    };
    const goPrva = () => {
      if (stranica.value > 1) {
        stranica.value = 1;
      }
      hideForm();
    };
    const goNazad = () => {
      if (stranica.value > 1) {
        stranica.value--;
      }
      hideForm();
    };
    const goNapred = () => {
      if (stranica.value < brojStranica.value) {
        stranica.value++;
      }
      hideForm();
    };
    const goPoslednja = () => {
      if (stranica.value < brojStranica.value) {
        stranica.value = brojStranica.value;
      }
      hideForm();
    };
    const goToDetails = (racunId) => {
      router.push(`/bills/${racunId}`);
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
    });

    return {
      pages,
      brojStranica,
      delimicnoPlaceni,
      editMode,
      formVis,
      filterRacuni,
      godine,
      goToDetails,
      goPrva,
      goNazad,
      goNapred,
      goPoslednja,
      grafData,
      hideForm,
      isPrva,
      isPoslednja,
      library4,
      neplaceniRacuni,
      number,
      prethodna,
      placeniRacuni,
      pretragaPoverilac,
      poverioci,
      pretragaMesec,
      pretragaGodina,
      pretragaMin,
      pretragaMax,
      pretragaStatus,
      racuni,
      showForm,
      sledeca,
      sortirajRacune,
      sortId,
      stranica,
      resetStranica,
      ukupnoRacuni,
      ukupnoPlaceni,
      zaPlacanje,
    };
  },
};
</script>

<style scoped>
.home {
  width: 100%;
  height: 100vh;
  padding-top: 90px;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
}

.spisak-racuna {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);

  height: calc(100vh - 110px);
  width: 70vw;
  min-width: 890px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.spisak {
  width: 100%;
  min-width: 890px;
  height: calc(100% - 120px);
  border-bottom: 1px solid #2c3e50;
  padding: 10px;
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
  position: relative;
}

.spisak ul li {
  width: 100%;
  height: 40px;
}

.paginacija {
  position: relative;
  height: 55px;
  width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 7px;
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

.pretraga {
  width: calc(100% - 10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 55px;
}

.form-element {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 5px;
  width: calc((100% - 60px) / 6);
}

input,
select {
  border: none;
  background-color: #2c3e50;
  color: white;
  width: 100%;
  border-radius: 6px;
  padding: 7px 10px;
  outline: none;
}
label {
  font-size: 15px;
  padding-left: 6px;
}

.disabled {
  color: #2c3e50;
  background-color: transparent;
  cursor: unset;
}

.disabled:hover {
  background: none;
}

.input {
  text-align: right;
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

.switch-enter-from,
.switch-leave-to {
  opacity: 0;
  transform: translateX(200px);
}

.switch-enter-active,
.switch-leave-active {
  transition: all 0.5s ease;
}

.header {
  width: 100%;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid #2c3e50;
  padding: 10px 20px;
  border-radius: 10px;
}

.header div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  cursor: pointer;
}

.header div:nth-of-type(4),
.header div:nth-of-type(5),
.header div:nth-of-type(6) {
  justify-content: flex-end;
}

.p1 {
  width: 15%;
  text-align: left;
  min-width: 150px;
}
.p2 {
  width: 15%;
  text-align: left;
  min-width: 150px;
}
.p3 {
  width: 15%;
  text-align: left;
  min-width: 150px;
}
.p4 {
  width: 15%;
  text-align: right;
  min-width: 115px;
}
.p5 {
  width: 15%;
  text-align: right;
  min-width: 115px;
}
.p6 {
  width: 15%;
  text-align: right;
  min-width: 115px;
}

.nosac-slike {
  width: 25px;
  height: 25px;
}

.header img {
  width: 25px;
  height: 25px;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.nov {
  background: #2c3e50;

  min-width: 120px;
  font-size: 15px;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(300px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.specifikacija {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: 320px;
  height: calc(100vh - 110px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  padding: 20px;
}

.spec-det {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  gap: 5px;
}

.pozicija {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart {
  width: 100%;
  height: 60%;
}
</style>
