<template>
  <div class="login-container">
    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>

    <!-- if username or password are incorrect, invalid variable becomes true, and div bellow appears-->
    <div v-if="invalid" class="invalid">
        <p>Incorrect credentials</p>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginForm",
  data() {
    return {
      username: "",
      password: "",
      invalid: false
    };
  },
  methods: {
    async login() {
        try {
            const res = await axios.post("http://localhost:5050/api/auth/login", {
                username: this.username,
                password: this.password
            });

            this.invalid = false;
            const token = res.data.token;
            console.log("Login successful. Received token:", token);

            // Store token in sessionStorage
            sessionStorage.setItem("token", token);
            this.$emit("login", token);

        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.warn("Login failed: Invalid credentials");
                this.invalid = true;
            } else {
                console.error("Login request failed:", error);
                alert("Something went wrong. Please try again.");
                this.invalid = false;
            }
        }
    }
  }
};
</script>
<style>

    .login-container{
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .invalid p{
        padding: 0px;
        margin: 0px;
        font-size: 1em;
        text-align: center;
        color: var(--alert);
    }
</style>