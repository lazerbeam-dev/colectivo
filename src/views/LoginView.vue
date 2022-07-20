<template>
    <div class="root">
        <div class="modal">
            <button @click="$emit('close')" style="float:right">X</button>
            <br>
            <h3>Log In</h3>

            <div class="form-group">
                <label>Email address</label><br>
                <input v-model="email" type="email" class="form-control form-control-lg" />
                <br><span class="error" v-if="errorEmail">{{ errorEmail }}</span>
            </div>

            <div class="form-group">
                <label>Password</label><br>
                <input v-model="password" type="password" class="form-control form-control-lg" @keyup.enter="SignIn()"/>
                <br><span class="error" v-if="error">{{ error }}</span>
            </div>

            <button type="submit" class="functionalButton giveMeSpace" @click="SignIn()">Sign In</button>
            <br>
            <span>no account? <a href="#" class="internalLink" @click="$emit('goToRegistration')">sign up</a></span>
            <!-- <p class="forgot-password text-right mt-2 mb-4">
                <router-link to="/forgot-password">Forgot password ?</router-link>
            </p> -->
        </div>
    </div>
</template>
 
<script setup>
import { defineEmit } from 'vue'
import axios from 'axios'
const emit = (['close', 'signInUser', 'goToRegistration'])
</script>

<script>
export default {
    name: 'LoginView',
    data: function () {
        return {
            email: null,
            password: null,
            error: null,
            errorEmail: null
        }
    },
    methods: {
        Validate(){
             var allow = true
            if (this.password.length < 7) {
                this.error = "please use a password 7 characters or longer"
                allow = false
            }
            if (!this.email.includes("@") || this.email.length < 5) {
                this.errorEmail = "please use a valid email address"
                allow = false
            }
            return allow;
        },
        SignIn() {
            if (this.Validate()) {
                var serverUrl = this.$store.state.serverUrl;
                console.log(serverUrl)
                axios.post(serverUrl + "/signIn", { email: this.email, password: this.password }).then(x => {
                    console.log(x)
                    this.error = null
                    this.$store.commit("signInUser", x.data)
                    console.log(this.$store.state.signedInUser)
                    this.$emit('signInUser')
                    this.$emit('close');
                    //if()
                }).catch(error => {
                    var status = error.response.status
                    if (status == 400) {
                        this.error = "User not found"
                    }
                    else if (status == 401) {
                        this.error = "Wrong password"
                    }
                    else {
                        this.error = "Something unexpected went wrong"
                    }
                })
            }

        }
    }
}
</script>

<style>
@import "../sharedstyles.css";
</style>