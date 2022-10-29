<template>
  <div class="specifikacija">
    <div class="spec-det gore">
      <h4>Filter</h4>
      <div class="pozicija">
        <p>Poverilac:</p>
        <p>{{ specPoverilac }}</p>
      </div>
      <div class="pozicija">
        <p>Mesec:</p>
        <p>{{ specMesec }}</p>
      </div>
      <div class="pozicija">
        <p>Godina:</p>
        <p>{{ specGodina }}</p>
      </div>
      <div class="pozicija">
        <p>Minimum:</p>
        <p>
          {{
            new Intl.NumberFormat("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(specMin)
          }}
        </p>
      </div>
      <div class="pozicija">
        <p>Maximum:</p>
        <p>
          {{
            new Intl.NumberFormat("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(specMax)
          }}
        </p>
      </div>
      <div class="pozicija">
        <p>Status:</p>
        <p>{{ specStatus }}</p>
      </div>
    </div>
    <div class="spec-det">
      <h4>Specifikacija</h4>
      <div class="pozicija">
        <p>Ukupno računa:</p>
        <div>
          <p>
            {{
              new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(brojRacuna)
            }}
          </p>
          <p>100,00%</p>
        </div>
      </div>
      <div class="pozicija">
        <p>Ukupan iznos:</p>
        <div>
          <p>
            {{
              new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(ukRacuni)
            }}
          </p>
          <p>100,00%</p>
        </div>
      </div>
      <div class="pozicija">
        <p>Plaćenih računa:</p>
        <div>
          <p>
            {{
              new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(brojPlacenih)
            }}
          </p>
          <p>
            {{
              new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(procenatBrojaPlacenih)
            }}%
          </p>
        </div>
      </div>
      <div class="pozicija">
        <p>Delimično plaćenih:</p>
        <div>
          <p>
            {{
              new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(delimicnoPlacenih)
            }}
          </p>
          <p>
            {{
              new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(procenatDelimicno)
            }}%
          </p>
        </div>
      </div>
      <div class="pozicija">
        <p>Neplaćenih računa:</p>
        <div>
          <p>
            {{
              new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(brojNeplacenih)
            }}
          </p>
          <p>
            {{
              new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(procenatNeplacenih)
            }}%
          </p>
        </div>
      </div>
      <div class="pozicija">
        <p>Ukupno plaćeno:</p>
        <div>
          <p>
            {{
              new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Math.floor(ukupnoPlaceno * 100) / 100)
            }}
          </p>
          <p>
            {{
              new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(procenatPlacenihSum)
            }}%
          </p>
        </div>
      </div>
      <div class="pozicija">
        <p>Ukupno za plaćanje:</p>
        <div>
          <p>
            {{
              new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(ukupnoNelacenoSum)
            }}
          </p>
          <p>
            {{
              new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(neplacenoProcenatSum)
            }}%
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "specPoverilac",
    "specMesec",
    "specGodina",
    "specMin",
    "specMax",
    "specStatus",
    "brojRacuna",
    "ukRacuni",
    "brojPlacenih",
    "procenatBrojaPlacenih",
    "delimicnoPlacenih",
    "procenatDelimicno",
    "brojNeplacenih",
    "procenatNeplacenih",
    "ukupnoPlaceno",
    "procenatPlacenihSum",
    "ukupnoNelacenoSum",
    "neplacenoProcenatSum",
  ],
};
</script>

<style scoped>
.specifikacija {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 45px;
  width: 100%;
  padding: 30px 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  height: 100%;
}

.spec-det {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 0;
  gap: 7px;
}

.pozicija {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
}

.pozicija div {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 10px;
}

.pozicija div p:last-of-type {
  width: 55px;
  text-align: right;
}

.gore .pozicija {
  width: 60%;
}
</style>
