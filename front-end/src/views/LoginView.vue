<template>
  <div class="login">
    <form @submit.prevent="sendData">
      <div class="form-element">
        <label>User email:</label>
        <input type="email" v-model="formData.userEmail" required />
      </div>
      <div class="form-element">
        <label>User pass:</label>
        <input type="password" v-model="formData.userPass" required />
      </div>
      <div class="form-element">
        <button>Log In</button>
      </div>
      <p>
        Don't have an account?
        <br />
        <router-link to="/signup/">Sign Up</router-link> instead.
      </p>
    </form>
  </div>
</template>

<script>
import { reactive } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const formData = reactive({
      userEmail: "",
      userPass: "",
    });

    const sendData = () => {
      store.dispatch("actLogin", formData);
    };
    document.title = "AER - Login";
    return { formData, sendData };
  },
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100vh;
  padding-top: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

a {
  color: inherit;
}

form {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 280px;
  padding: 20px;
  gap: 20px;
}

.form-element {
  width: 240px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 60px;
  gap: 5px;
}

.form-element:last-of-type {
  align-items: center;
  height: 40px;
}

input {
  width: 240px;
  padding: 5px 10px;
  background-color: white;
  border: none;
  border-radius: 6px;
  color: inherit;
  outline: none;
  font-size: 15px;
}

button {
  width: 90px;
  height: 35px;
  font-size: 15px;
}
</style>
