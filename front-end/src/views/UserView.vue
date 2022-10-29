<template>
  <div class="user">
    <div class="backdrop" v-if="dataFormVis" @click.self="toggleDataForm">
      <form @submit.prevent="sendDataForm">
        <div class="form-element">
          <label>User first name:</label>
          <input type="text" required v-model="firstName" />
        </div>
        <div class="form-element">
          <label>User last name:</label>
          <input type="text" required v-model="lastName" />
        </div>
        <div class="form-element">
          <label>User email:</label>
          <input type="email" required v-model="email" />
        </div>
        <div class="form-element">
          <button>Promeni</button>
        </div>
      </form>
    </div>
    <h3>{{ user.userFirstName }} {{ user.userLastName }}</h3>
    <h4>{{ user.userEmail }}</h4>
    <button @click="toggleDataForm">Promeni podatke</button>
    <button>Promeni lozinku</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      dataFormVis: false,
      passFormFalse: false,
    };
  },
  methods: {
    toggleDataForm() {
      this.dataFormVis = !this.dataFormVis;
      this.firstName = this.user.userFirstName;
      this.lastName = this.user.userLastName;
      this.email = this.user.userEmail;
    },
    sendDataForm() {
      const formData = {
        userId: this.user.userId,
        userFirstName: this.firstName,
        userLastName: this.lastName,
        userEmail: this.email,
      };
      this.$store.dispatch("actEditUser", formData);
    },
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
};
</script>

<style scoped>
.user {
  width: 100%;
  height: 100vh;
  padding-top: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  z-index: 2;
  position: relative;
}

.backdrop {
  width: 340px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 20px;
  position: absolute;
  top: 0;
  right: 0;
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 25px;
  padding: 20px;
  background-color: #2c3e50;
  color: white;
  border-radius: 16px;
}

.form-element {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 7px;
  width: 100%;
}

.form-element:last-of-type {
  align-items: center;
}

input {
  padding: 5px 7px;
  border: none;
  outline: none;
  border-radius: 6px;
  width: 100%;
}

form button {
  border: 1px solid white;
}
</style>
