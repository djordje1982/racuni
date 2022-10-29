<template>
  <div class="nov" @click.self="hideForm">
    <form @submit.prevent="sendData">
      <div class="form-element">
        <label>Pun naziv poverioca</label>
        <input type="text" required v-model="formData.poverilacNaziv" />
      </div>
      <div class="form-element">
        <label>Kraći naziv</label>
        <input type="text" required v-model="formData.poverilacKrace" />
      </div>
      <div class="form-element">
        <label>Tekući račun</label>
        <input type="text" required v-model="formData.tekRacun" />
      </div>
      <div class="form-element">
        <label>Model plaćanja</label>
        <input
          type="text"
          class="lastInput"
          max="2"
          v-model="formData.modelPlacanja"
        />
      </div>
      <div class="form-element">
        <button>
          <span v-if="!editMode">Dodaj poverioca</span>
          <span v-else>Promeni poverioca</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: [
    "poverilacId",
    "poverilacNaziv",
    "poverilacKrace",
    "modelPlacanja",
    "tekRacun",
    "editMode",
  ],
  data() {
    return {
      formData: {
        poverilacId: "",
        poverilacNaziv: "",
        poverilacKrace: "",
        tekRacun: "",
        modelPlacanja: "",
      },
    };
  },
  methods: {
    hideForm() {
      this.$emit("hideForm");
    },
    edit() {
      if (this.editMode) {
        this.formData.poverilacId = this.poverilacId;
        this.formData.poverilacNaziv = this.poverilacNaziv;
        this.formData.poverilacKrace = this.poverilacKrace;
        this.formData.tekRacun = this.tekRacun;
        this.formData.modelPlacanja = this.modelPlacanja;
      } else {
        this.formData.poverilacId = "";
        this.formData.poverilacNaziv = "";
        this.formData.poverilacKrace = "";
        this.formData.tekRacun = "";
        this.formData.modelPlacanja = "";
      }
    },
    sendData() {
      const formD = {
        poverilacId: this.formData.poverilacId,
        poverilacNaziv: this.formData.poverilacNaziv,
        poverilacKrace: this.formData.poverilacKrace,
        tekRacun: this.formData.tekRacun,
        modelPlacanja: this.formData.poverilacId,
        userId: this.userId,
      };
      if (!this.editMode) {
        this.$store.dispatch("actAddPoverilac", formD);
      } else {
        this.$store.dispatch("actEditPoverilac", formD);
      }
    },
  },
  computed: {
    userId() {
      return this.$store.getters.USERID;
    },
    statusServera() {
      return this.$store.getters.getServerStatus;
    },
  },
  created() {
    this.edit();
  },
  watch: {
    statusServera(newVal, oldVal) {
      if (newVal === 201) {
        this.hideForm();
      }
    },
  },
};
</script>

<style scoped>
.nov {
  position: absolute;
  right: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 20px;
  z-index: 15;
}

form {
  width: 100%;
  background-color: rgb(130, 130, 130);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  border-radius: 16px;
}

.form-element {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
}

.form-element:last-of-type {
  align-items: center;
}

label {
  font-size: 15px;
  color: white;
}

input {
  width: 100%;
  padding: 5px 10px;
  border: none;
  border-radius: 6px;
  outline: none;
}

.lastInput {
  width: 40px;
}
</style>
