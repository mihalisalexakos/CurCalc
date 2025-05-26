<template>
  <div class="app-outer-container">
    <div class="logo">
      <img src="@/assets/CurCalcLogo.png">      
      <h1>CurCalc</h1>

    </div>

    <div class="app-container">

      <!-- Currency converter section -->
      <CurrencyConverter ref="converter" />

      <div>
        <!-- Login section -->
        <p class="login-msg" v-if="!token">Wish to add, remove or edit rates? Log in!</p>
        <LoginForm v-if="!token" @login="onLogin" />
        <button v-if="token" @click="logout">Log out</button>

        <!-- Rate editor section -->
        <RateEditor @ratesChanged="handleRatesChanged" v-if="token" :token="token" />

      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LoginForm from "./components/LoginForm.vue";
import CurrencyConverter from "./components/CurrencyConverter.vue";
import RateEditor from "./components/RateEditor.vue";

export default {
  name: "App",
  components: {
    LoginForm,
    CurrencyConverter,
    RateEditor
  },
  data() {
    return {
      token: null,
      rates: []
    };
  },
  methods: {
    onLogin(token) {
      this.token = token;
      this.fetchRates();
    },
    async fetchRates() {
      try {

        const response = await axios.get("http://localhost:5050/api/rates");
        this.rates = response.data;

      } catch (error) {
        console.error("Error fetching rates:", error);
      }
    },
    handleRatesChanged(){

      if (this.$refs.converter && this.$refs.converter.fetchCurrencies) {
        
        // if user made changes to table, update data
        this.$refs.converter.fetchCurrencies();
      } 
    },
    logout(){

      // removes token from sessionStorage, sets token variable to null
      sessionStorage.removeItem("token");
      this.token = null;

      console.log("user successfully logged out");
    }
  },
  mounted() {
    this.fetchRates();
  }
};
</script>
<style>

  .app-container{
    display: flex;
    flex-direction: column;
    gap: 50px;
    max-width: 1000px;
    align-items: center;
  }

  .app-outer-container{
    margin: 50px;
  }

  h1{
    padding: 0px;
    margin: 0px;
  }

  .logo{
    margin-bottom: 50px;
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    cursor:default;
  }

  .logo img{
    width: 30px;
    height: 30px;
  }

  .login-msg{
    font-size: 0.7em;
    color: var(--shhtext);
    text-align: center;
  }


</style>