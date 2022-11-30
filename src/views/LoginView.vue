<template>
    <div class="root">
        <div class="modal">
            <img src="../assets/x.svg" @click="$emit('close')" class="closeButton">

            <h3>{{ $t('log_in') }}</h3>

            <div class="form-group">
                <label>{{ $t('email_address') }}</label><br>
                <input v-model="email" type="email" class="form-control form-control-lg" />
                <br><span class="error" v-if="errorEmail">{{ errorEmail }}</span>
            </div>

            <div class="form-group">
                <label>{{ $t('password') }}</label><br>
                <input v-model="password" type="password" class="form-control form-control-lg"
                    @keyup.enter="this.SignIn()" />
                <br><span class="error" v-if="error">{{ error }}</span>
            </div>

            <button type="submit" class="functionalButton giveMeSpace" @click="this.SignIn()">Sign In</button>
            <br>
            <span>{{ $t('no_account') }}<a href="#" class="internalLink"
                    @click="$emit('goToRegistration')">{{ $t('create_one') }}</a></span>
            <!-- <p class="forgot-password text-right mt-2 mb-4">
                <router-link to="/forgot-password">Forgot password?</router-link>
            </p> -->
        </div>
    </div>
</template>

<script>
// import { defineEmits } from 'vue'
// const emit = defineEmits(['close', 'signInUser', 'goToRegistration'])
import axios from 'axios'
import i18next from 'i18next'
import store from '@/store';

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
        Validate() {
            var allow = true
            if (this.password.length < 7) {
                this.error = i18next.t('password_length');
                allow = false
            }
            if (!this.email.includes("@") || this.email.length < 5) {
                this.errorEmail = i18next.t('valid_email');
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
                    this.$store.commit("setSignedInUser", x.data)
                    console.log(this.$store.state.signedInUser)
                    this.$emit('signInUser')
                    this.$emit('close');
                    //if()
                }).catch(error => {
                    console.log(error)
                    var status = error.response.status
                    if (status == 400) {
                        this.error = i18next.t('user_not_found')
                    }
                    else if (status == 401) {
                        this.error = i18next.t('wrong_password')
                    }
                    else {
                        this.error = i18next.t('unknown_error')
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