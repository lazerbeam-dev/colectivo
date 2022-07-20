<template>
    <div class="modal">
        <button class="closeButton" @click="$emit('close')" style="float:right">X</button>
        <br>
        <h3>Sign Up</h3>

        <div class="form-group">
            <label>Username</label><br>
            <input type="text" v-model="username" class="form-control form-control-lg" />
            <br><span class="error" v-if="errorUsername">{{ errorUsername }}</span>
        </div>

        <div class="form-group">
            <label>Email address</label><br>
            <input type="email" v-model="email" class="form-control form-control-lg" />
            <br><span class="error" v-if="errorEmail">{{ errorEmail }}</span>
        </div>

        <div class="form-group">
            <label>Password</label><br>
            <input type="password" v-model="password" class="form-control form-control-lg" @keyup.enter="SignUp()"/>
            <br><span class="error" v-if="error">{{ error }}</span>
        </div>

        <button type="submit" class="functionalButton giveMeSpace" @click="signUp()">Create Account</button>

        <!-- <p class="forgot-password text-right">
                Already registered 
                <router-link :to="{name: 'login'}">sign in?</router-link>
            </p> -->
    </div>
</template>
 
<script>
import axios from "axios"

export default {
    name: 'RegistrationView',
    data: function () {
        return {
            username: null,
            email: null,
            password: null,
            error: null,
            errorUsername: null,
            errorEmail: null
        }
    },
    methods: {
        Validate() {
            var allow = true
            if (this.username.length < 5) {
                this.errorUsername = "please use a username 5 characters or longer"
                allow = false
            }
            if (this.password.length < 7) {
                this.error = "please use a password 7 characters or longer"
                allow = false
            }
            if (!this.email.includes("@") || this.email.length < 5) {
                this.errorEmail = "please use a real email address"
                allow = false
            }
            return allow;
        },
        signUp() {
            if (this.Validate()) {
                console.log("trying to sign up")
                var serverUrl = this.$store.state.serverUrl;
                console.log(serverUrl)
                console.log(this.username)
                axios.post(serverUrl + "/signUp", { username: this.username, email: this.email, password: this.password }).then(x => console.log(x))
            }

        }
    }
}
</script>

<script setup>
import { defineEmit } from 'vue'
const emit = (['close'])
</script>