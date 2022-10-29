<template>
  <div class="app">
    <TheNavBar />
    <transition name="popUp" appear @click="prekiniPopUp">
      <PopUp v-if="popUpActive" />
    </transition>
    <router-view v-slot="{ Component }">
      <transition name="route" mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import TheNavBar from "./components/TheNavBar.vue";
import PopUp from "./components/PopUpCom.vue";
export default {
  components: {
    TheNavBar,
    PopUp,
  },
  computed: {
    popUpActive() {
      return this.$store.getters.getPopUp;
    },
  },
  methods: {
    prekiniPopUp() {
      this.$store.commit("mutHidePopUp");
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,600;1,400&family=Open+Sans:ital,wght@0,600;1,600&family=Roboto:ital,wght@0,300;0,400;1,300;1,400&display=swap");
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  max-height: 100vh;
  overflow: hidden;
  position: relative;
  z-index: 2;
  background-image: url("~@/assets/back.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

select {
  cursor: pointer;
}

.text-desno {
  text-align: right;
}
.text-centar {
  text-align: center;
}
.text-levo {
  text-align: left;
}

p {
  font-size: 14px;
}
.app {
  width: 100%;
  min-height: 100vh;
  background-image: linear-gradient(
    to right bottom,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.5)
  );
}

button {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  outline: none;
}

button:hover {
  background-image: linear-gradient(
    to right bottom,
    rgba(122, 133, 151, 0.35),
    rgba(122, 133, 151, 7)
  );
}

.route-enter-from {
  opacity: 0;
  transform: translateY(200px);
}

.route-enter-active {
  transition: all 0.25s ease-out;
}

.route-leave-to {
  opacity: 0;
  transform: translateY(-200px);
}

.route-leave-active {
  transition: all 0.25s ease-in;
}

.hidden {
  display: none;
}
</style>
