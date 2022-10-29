<template>
  <div class="signup">
    <form @submit.prevent="sendData">
      <div class="form-element">
        <label>First name:</label>
        <input type="text" v-model="formData.userFirstName" required />
      </div>
      <div class="form-element">
        <label>Last name:</label>
        <input type="text" v-model="formData.userLastName" required />
      </div>
      <div class="form-element">
        <label>User email:</label>
        <input type="email" v-model="formData.userEmail" required />
      </div>
      <div class="form-element">
        <label>User pass:</label>
        <input
          type="password"
          @keydown="greskaPass = ''"
          v-model="formData.userPass"
          required
        />
      </div>
      <div class="form-element">
        <label>Confirm password:</label>
        <input
          type="password"
          @keydown="greskaPass = ''"
          v-model="formData.confirmPass"
          required
        />
        <small v-if="greskaPass">{{ greskaPass }}</small>
      </div>
      <div class="form-element">
        <button>Sign Up</button>
      </div>
      <p>
        Already have an account?
        <br />
        <router-link to="/login/">Log In</router-link> instead.
      </p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        userFirstName: "",
        userLastName: "",
        userEmail: "",
        userPass: "",
        confirmPass: "",
      },
      greskaPass: "",
    };
  },
  methods: {
    sendData() {
      if (this.formData.userPass !== this.formData.confirmPass) {
        this.greskaPass = "Passwords must match!";
      } else {
        this.$store.dispatch("actSignup", this.formData);
      }
    },
  },
  created() {
    document.title = "AER - Signup";
  },
};
</script>

<style scoped>
.signup {
  width: 100%;
  height: 100vh;
  padding-top: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
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

a {
  color: inherit;
}

small {
  color: rgb(255, 51, 0);
}
</style>
