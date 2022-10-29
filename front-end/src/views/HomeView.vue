<template>
  <div class="home">
    <div class="logo">
      <div>
        <svg
          class="intro"
          ref="svg"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="-250 -300 1920 1080"
          style="enable-background: new 0 0 1920 1080"
          xml:space="preserve"
        >
          <path
            ref="path1"
            class="st0"
            d="M432.64,278.86H304.83l-39.18,52.12h-68.21L380.31,95.15h73.45l52.3,235.83h-62.93L432.64,278.86z
		 M424.2,239.6l-18.53-94.91l-71.34,94.91H424.2z"
          />
          <path
            ref="path2"
            class="st0"
            d="M547.57,330.98l67.39-235.83h239.23l-11.28,39.41H670.17l-15.4,53.57h167.2l-11.28,39.41H643.43l-18.41,64.02
		h185.67l-11.01,39.41H547.57z"
          />
          <path
            ref="path3"
            class="st0"
            d="M915.01,330.98h-66.19l67.33-235.83h143.44c26.49,0,46.27,2.09,59.34,6.27c13.06,4.18,23.67,10.93,31.82,20.26
		c8.14,9.33,12.21,21.11,12.21,35.37c0,20.9-8.54,37.65-25.62,50.24c-17.08,12.59-41.64,20.39-73.66,23.39
		c8.95,5.92,17.72,14.31,26.31,25.18c14.26,18.23,29.94,43.27,47.05,75.12h-71.38c-2.84-6.65-12.44-24.73-28.78-54.23
		c-8.53-15.12-16.39-25.79-23.57-32.01c-5.21-4.39-10.51-7.39-15.9-9c-5.39-1.61-14.47-2.41-27.22-2.41h-27.15L915.01,330.98z
		 M953.19,197.94h34.98c33.29,0,55.8-1.26,67.53-3.78c11.72-2.52,21.48-7.16,29.27-13.92c7.79-6.76,11.68-14.21,11.68-22.36
		c0-8.9-4.93-15.39-14.77-19.46c-5.73-2.57-18.26-3.86-37.59-3.86h-72.91L953.19,197.94z"
          />
        </svg>
      </div>
    </div>
    <div class="naslov">
      <h2>
        <b
          ><u><span>A</span></u></b
        >plikacija za
        <b
          ><u><span>E</span></u></b
        >videntiranje
        <b
          ><u><span>R</span></u></b
        >ačuna
      </h2>
    </div>
    <div>
      <p v-if="userName">Welcome {{ userName }}</p>
      <p v-else>
        Niste ulogovani. <router-link to="/login/">ulogujte se</router-link> ili
        se <router-link to="/signup/">prijavite</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  setup() {
    const store = useStore();
    const userName = computed(() => {
      return store.getters.USERNAME;
    });
    document.title = "AER - Home";
    return { userName };
  },
};
</script>

<style scoped>
.home {
  width: 100%;
  height: 100vh;
  padding-top: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 300px;
}

.logo div {
  width: 100%;
}

.st0 {
  fill: transparent;
  stroke: #2c3e50;
  stroke-miterlimit: 10;
}

.intro {
  fill: transparent;
}

.intro path:nth-child(1) {
  stroke-dasharray: 1296.0574951171875;
  stroke-dashoffset: 1296.0574951171875;
  animation: inanim 5s ease infinite 0.1s;
}

.intro path:nth-child(2) {
  stroke-dasharray: 1674.747802734375;
  stroke-dashoffset: 1674.747802734375;
  animation: inanim 5s ease infinite 0.1s;
}

.intro path:nth-child(3) {
  stroke-dasharray: 1565.1796875;
  stroke-dashoffset: 1565.1796875;
  animation: inanim 5s ease infinite 0.1s;
}

@keyframes inanim {
  40% {
    fill: transparent;
  }
  50% {
    stroke-dashoffset: 0;
    fill: #2c3e50;
  }
  75% {
    fill: transparent;
  }
  100% {
  }
}

a {
  color: inherit;
}

p {
  font-size: 16px;
}

span {
  font-size: 35px;
}
</style>
