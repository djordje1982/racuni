<template>
  <nav class="desktop" v-if="desktop">
    <div class="navigacija">
      <router-link to="/">Home</router-link>
      <router-link to="/bills/">Računi</router-link>
      <router-link to="/creditors/">Poverioci</router-link>
      <router-link to="/dashboard/">Dashboard</router-link>
    </div>
    <div class="auth">
      <transition name="slide" appear mode="out-in">
        <div class="meni" v-if="meniVis">
          <button v-if="!userName" @click="goToLogin">Log In</button>
          <button v-if="!userName" @click="goToSignup">Sign Up</button>
          <button v-if="userName" @click="logOut">Log Out</button>
          <button v-if="userName" @click="goToUser">
            <img src="../assets/settings.png" alt="" />
          </button>
        </div>
      </transition>
      <p class="time" v-if="vreme.vis">
        <span>Sesija: </span>
        <span> {{ vreme.minuti }}:{{ vreme.sekunde }}</span>
      </p>
      <p class="userName">{{ userName }}</p>
      <div class="user">
        <img src="../assets/user.png" alt="" @click="toggleMenu" />
      </div>
    </div>
  </nav>
  <nav class="mobile" v-else>
    <div class="menu" @click="toggleMobileMenu">
      <p>MENU</p>
    </div>
    <transition name="mobile">
      <div class="mobile-nav" v-if="mobileMenu">
        <router-link to="/" @click="toggleMobileMenu">Home</router-link>
        <router-link to="/bills/" @click="toggleMobileMenu">Računi</router-link>
        <router-link to="/creditors/" @click="toggleMobileMenu"
          >Poverioci</router-link
        >
        <router-link to="/dashboard/" @click="toggleMobileMenu"
          >Dashboard</router-link
        >
      </div>
    </transition>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      desktop: true,
      isAuth: true,
      meniVis: false,
      vreme: {
        minuti: "00",
        sekunde: "00",
        vis: false,
      },
      sirinaEkrana: window.innerWidth,
      mobileMenu: false,
    };
  },
  methods: {
    toggleMenu() {
      this.meniVis = !this.meniVis;
    },
    toggleMobileMenu() {
      this.mobileMenu = !this.mobileMenu;
    },
    goToLogin() {
      this.$router.push("/login/");
      this.toggleMenu();
    },
    goToSignup() {
      this.$router.push("/signup/");
      this.toggleMenu();
    },
    logOut() {
      this.$store.commit("mutLogout");
      this.toggleMenu();
    },
    goToUser() {
      this.$router.push("/user/");
      this.toggleMenu();
    },
    countDown() {
      let x = setInterval(() => {
        let end = this.vremeLogOut;
        let start = Date.now();
        let razlika = end - start;
        if (razlika <= 301000 && razlika >= 300000) {
          this.$store.commit("mutTimeWarning", {
            message: "Sesija Vam ističe za 5 minuta",
          });
        }
        if (razlika <= 61000 && razlika >= 60000) {
          this.$store.commit("mutTimeWarning", {
            message: "Sesija Vam ističe za 1 minut",
          });
        }
        if (razlika > 0) {
          this.vreme.vis = true;
        } else {
          this.vreme.vis = false;
        }
        let min = Math.floor(razlika / 1000 / 60);
        let sek = Math.floor((razlika - min * 60 * 1000) / 1000);
        let minuti, sekunde;
        min < 10 ? (minuti = `0${min}`) : (minuti = min);
        sek < 10 ? (sekunde = `0${sek}`) : (sekunde = sek);

        this.vreme.minuti = minuti;
        this.vreme.sekunde = sekunde;

        if (razlika <= 0) {
          this.$store.commit("mutLogout");
          clearInterval(x);
        }
      }, 1000);
    },
  },
  computed: {
    userName() {
      return this.$store.getters.USERNAME;
    },
    vremeLogOut() {
      return parseInt(this.$store.getters.getLoggedInAt);
    },
  },
  mounted() {
    if (this.userName) {
      this.vreme.vis = true;
    }
    this.countDown();
    window.onresize = () => {
      this.sirinaEkrana = window.innerWidth;
    };
    if (this.sirinaEkrana > 1000) {
      this.desktop = true;
    } else {
      this.desktop = false;
    }
  },
  watch: {
    userName(newVal, oldVal) {
      if (newVal > 0) {
        this.vreme.vis = true;
      } else {
        this.vreme.vis = false;
      }
    },
    sirinaEkrana(newVal, oldVal) {
      if (newVal > 1000) {
        this.desktop = true;
      } else {
        this.desktop = false;
      }
    },
  },
};
</script>

<style scoped>
.desktop {
  /* From https://css.glass */
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: fixed;
  /**** */
  top: 10px;
  left: 10px;
  z-index: 10;
  width: calc(100% - 20px);
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
}

.auth {
  width: 320px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  position: relative;
}

img {
  height: 26px;
  width: 26px;
}

.user,
.user img {
  width: 48px;
  height: 48px;
  cursor: pointer;
}

.meni {
  position: absolute;
  top: 58px;
  right: 0;
  width: 185px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  z-index: 3;
}

.meni button {
  width: 70px;
  height: 35px;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.navigacija {
  width: 500px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: inherit;
}

a {
  color: inherit;
  text-decoration: none;

  letter-spacing: 1px;
  padding: 5px 15px;
  border-radius: 6px;
  transition: all 0.5s ease;
}

a.router-link-exact-active {
  background: #2c3e50;
  color: white;
}

.time {
  width: 220px;
}

.time span {
  width: 80px;
}

.userName {
  width: 250px;
}

.mobile .menu {
  position: fixed;
  top: 0;
  right: 0;
  height: 60px;
  width: 60px;
  margin: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #2c3e50;
  color: white;
  border-radius: 14px;
  z-index: 10;
  cursor: pointer;
}

.mobile-nav {
  background: rgba(155, 155, 155, 0.9);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: fixed;
  top: 90px;
  right: 0;
  width: 200px;
  height: calc(100vh - 90px);
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  padding-top: 20px;
  border-top-left-radius: 16px;
}

.mobile-enter-from,
.mobile-leave-to {
  right: -200px;
  opacity: 0;
}

.mobile-enter-active,
.mobile-leave-active {
  transition: all 0.3s ease;
}
</style>
