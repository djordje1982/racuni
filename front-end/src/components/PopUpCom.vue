<template>
  <div class="popup" @click.stop="clearPopUp">
    <p>{{ poruka }}</p>
    <div class="progress">
      <div class="inner" :style="{ width: sirina + '%' }"></div>
    </div>
  </div>
</template>
<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const sirina = ref(0);
    const setSirina = () => {
      sirina.value = 0;
      store.commit("mutShowPopUp");
      setTimeout(() => {
        let interval = setInterval(() => {
          if (sirina.value < 100) {
            sirina.value++;
          } else {
            store.commit("mutHidePopUp");
            clearInterval(interval);
          }
        }, 25);
      }, 1200);
    };
    const poruka = computed(() => {
      return store.getters.getServerPoruka;
    });
    onMounted(() => {
      setSirina();
    });
    return {
      sirina,
      setSirina,
      poruka,
    };
  },
};
</script>

<style scoped>
.popup {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: fixed;
  width: 300px;
  height: 100px;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  cursor: pointer;

  z-index: 100;
}

.progress {
  position: relative;
  height: 8px;
  width: 250px;
  border: 1px solid #2c3e50;
  border-radius: 3px;
}

.inner {
  position: absolute;
  height: 6px;
  border-radius: 3px;
  background-color: #2c3e50;
}

.popUp-enter-from,
.popUp-leave-to {
  right: -320px !important;
}

.popUp-enter-active {
  transition: all 1.2s ease-in-out;
}
.popUp-leave-active {
  transition: all 1s ease-in-out;
}
</style>
