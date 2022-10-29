<template>
  <div class="dashboard">
    <div class="container">
      <div class="pretraga">
        <div>
          <select v-model="poverilac">
            <option value="">poverilac</option>
            <option
              v-for="p in poverioci"
              :key="p.poverilacId"
              :value="p.poverilacKrace"
            >
              {{ p.poverilacKrace }}
            </option>
          </select>
        </div>
      </div>
      <div class="chart">
        <bar-chart
          :data="graf1filt"
          thousands="."
          decimal=","
          loading="Loading..."
          empty="Nema podataka"
          :download="true"
          :colors="['#2c3e50']"
          label="Iznos računa"
          :round="2"
          :zeros="true"
          width="100%"
          height="100%"
          :library="library1"
        ></bar-chart>
      </div>
      <div class="chart">
        <area-chart
          :data="graf2filt"
          thousands="."
          decimal=","
          loading="Loading..."
          empty="Nema podataka"
          :download="true"
          :colors="['#2c3e50']"
          label="Iznos računa"
          :round="2"
          :zeros="true"
          width="100%"
          height="100%"
          :library="library2"
        ></area-chart>
      </div>
    </div>
    <div class="container">
      <div class="pretraga">
        <div>
          <select v-model="mesec">
            <option value="">mesec</option>
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
        <div>
          <select v-model="godina">
            <option value="">godina</option>
            <option v-for="g in godine" :key="g.godina" :value="g.godina">
              {{ g.godina }}
            </option>
          </select>
        </div>
      </div>
      <div class="chart">
        <column-chart
          :data="graf3filt"
          thousands="."
          decimal=","
          loading="Loading..."
          empty="Nema podataka"
          :download="true"
          :colors="['#2c3e50']"
          label="Iznos računa"
          :round="2"
          :zeros="true"
          width="100%"
          height="100%"
          :library="library3"
        ></column-chart>
      </div>
      <div class="chart">
        <pie-chart
          :data="graf3filt"
          thousands="."
          decimal=","
          loading="Loading..."
          empty="Nema podataka"
          :download="true"
          :colors="boje"
          :dataset="{ borderWidth: 1 }"
          legend="left"
          :round="2"
          :zeros="true"
          :library="library4"
        ></pie-chart>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      poverilac: "",
      mesec: "",
      godina: "",
      library1: {
        animation: {
          duration: 800,
          easing: "easeInOutBack",
        },
        scales: {
          y: {
            ticks: {
              color: "#2c3e50",
              font: {
                size: 12,
              },
            },
          },
          x: {
            // not 'xAxes: [{' anymore (not an array anymore)
            ticks: {
              color: "#2c3e50",
              font: {
                size: 12,
              },
            },
          },
        },
      },
      library2: {
        animation: {
          duration: 800,
          easing: "easeInOutBack",
          delay: 200,
        },
        scales: {
          y: {
            ticks: {
              color: "#2c3e50",
              font: {
                size: 12,
              },
            },
          },
          x: {
            // not 'xAxes: [{' anymore (not an array anymore)
            ticks: {
              color: "#2c3e50",
              font: {
                size: 12,
              },
            },
          },
        },
      },
      library3: {
        animation: {
          duration: 800,
          easing: "easeInOutBack",
          delay: 400,
        },
        scales: {
          y: {
            ticks: {
              color: "#2c3e50",
              font: {
                size: 12,
              },
            },
          },
          x: {
            // not 'xAxes: [{' anymore (not an array anymore)
            ticks: {
              color: "#2c3e50",
              font: {
                size: 12,
              },
            },
          },
        },
      },
      library4: {
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
      },
    };
  },
  computed: {
    periodi() {
      return this.$store.getters.getPeriodi;
    },
    godine() {
      return this.$store.getters.getGodine;
    },
    poverioci() {
      return this.$store.getters.getPoverioci;
    },
    period() {
      if (this.mesec == "" || this.godina == "") {
        return;
      } else {
        let per = this.periodi.filter((p) => {
          return p.periodMesec == this.mesec && p.periodGodina == this.godina;
        });
        let period = per[0].periodId;
        return period;
      }
    },
    graf1() {
      return this.$store.getters.getGraf1;
    },
    graf12() {
      return this.$store.getters.getGraf12;
    },
    graf2() {
      return this.$store.getters.getGraf2;
    },
    graf22() {
      return this.$store.getters.getGraf22;
    },
    graf31() {
      return this.$store.getters.getGraf31;
    },
    graf32() {
      return this.$store.getters.getGraf32;
    },
    graf33() {
      return this.$store.getters.getGraf33;
    },
    graf34() {
      return this.$store.getters.getGraf34;
    },

    graf1filt() {
      let poPoveriocu;
      if (this.poverilac != "") {
        poPoveriocu = this.graf1.filter((g) => {
          return g.poverilacKrace == this.poverilac;
        });
      } else {
        poPoveriocu = this.graf12;
      }
      let x = poPoveriocu.map(Object.values);
      if (this.poverilac != "") {
        x.forEach((e) => {
          return e.splice(1, 1);
        });
        return x;
      } else {
        return x;
      }
    },
    graf2filt() {
      let poPoveriocu;
      if (this.poverilac != "") {
        poPoveriocu = this.graf2.filter((g) => {
          return g.poverilacKrace == this.poverilac;
        });
      } else {
        poPoveriocu = this.graf22;
      }
      let x = poPoveriocu.map(Object.values);
      if (this.poverilac != "") {
        x.forEach((e) => {
          return e.splice(1, 1);
        });
        return x;
      } else {
        return x;
      }
    },
    graf3filt() {
      let poVremenu;
      if (this.mesec == "" && this.godina == "") {
        poVremenu = this.graf31;
      }
      if (this.mesec != "" && this.godina == "") {
        poVremenu = this.graf32.filter((g) => {
          return g.periodMesec == this.mesec;
        });
      }
      if (this.mesec == "" && this.godina != "") {
        poVremenu = this.graf33.filter((g) => {
          return g.periodGodina == this.godina;
        });
      }
      if (this.mesec != "" && this.godina != "") {
        poVremenu = this.graf34.filter((g) => {
          return g.periodId == this.period;
        });
      }
      let x = poVremenu.map(Object.values);
      if (
        (this.mesec != "" && this.godina == "") ||
        (this.godina != "" && this.mesec == "") ||
        (this.godina != "" && this.mesec != "")
      ) {
        x.forEach((e) => {
          return e.splice(1, 1);
        });
        return x;
      } else {
        return x;
      }
    },
    boje() {
      let colors = [];
      for (let i = 0; i <= this.graf3filt.length; i++) {
        colors.push(
          `rgba(${this.getRandomInt()},${this.getRandomInt()},${this.getRandomInt()},0.75)`
        );
      }
      return colors;
    },
  },
  methods: {
    getRandomInt() {
      return Math.floor(Math.random() * 256);
    },
  },
  created() {
    document.title = "Dashboard";
  },
};
</script>

<style scoped>
.dashboard {
  width: 100%;
  height: 100vh;
  padding: 90px 20px 20px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.container {
  width: calc(50% - 30px);
  height: calc(100vh - 110px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
}

.pretraga {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  gap: 30px;
}

.pretraga div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
  height: 100%;
  width: 150px;
}

select {
  width: 100%;
  text-align: left;
}

select {
  padding: 4px 8px;
  border: none;
  outline: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  background-color: #2c3e50;
}

.chart {
  width: 100%;
  height: calc(50% - 20px);
}
</style>
