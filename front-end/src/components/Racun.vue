<template>
  <div
    class="racun"
    :class="{
      placeno: statusPlacanja == 'plaćeno',
      neplaceno: statusPlacanja == 'neplaćeno',
      delimicno: statusPlacanja == 'delimično plaćeno',
    }"
  >
    <p class="hidden">{{ racunId }}</p>
    <p class="p1">{{ poverilacKrace }}</p>
    <p class="p2">{{ periodMesec }} {{ periodGodina }}</p>
    <p class="p3">{{ statusPlacanja }}</p>

    <p class="p4">
      {{
        new Intl.NumberFormat("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(placeno)
      }}
    </p>
    <p class="p5">
      {{
        new Intl.NumberFormat("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(razlika)
      }}
    </p>
    <p class="p6">
      {{
        new Intl.NumberFormat("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(iznosRacuna)
      }}
    </p>
  </div>
</template>

<script>
export default {
  props: [
    "racunId",
    "poverilacKrace",
    "periodMesec",
    "periodGodina",
    "razlika",
    "iznosRacuna",
    "statusPlacanja",
    "placeno",
  ],
};
</script>

<style scoped>
.racun {
  width: 100%;
  min-width: 815px;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  padding: 10px 20px;
  align-items: center;
  justify-content: space-between;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.racun:hover {
  background: rgba(44, 62, 80, 1);
  color: white;
  font-weight: 700;
  border: 1px solid white;
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
  padding-right: 25px;
}
.p5 {
  width: 15%;
  text-align: right;
  min-width: 115px;
  padding-right: 25px;
}
.p6 {
  width: 15%;
  text-align: right;
  min-width: 115px;
  padding-right: 25px;
}

.placeno {
  background-color: #c6efce;
  color: #006100;
}

.delimicno {
  background-color: #ffeb9c;
  color: #9c5700;
}

.neplaceno {
  background-color: #ffc7ce;
  color: #9c0006;
}
</style>
