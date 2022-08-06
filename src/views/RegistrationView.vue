<template>
    <div class="modal">
        <button class="closeButton" @click="$emit('close')" style="float:right">X</button>
        <br>
        <img src="https://i.ibb.co/XjwhkdC/3.png" class="modalLogo">

        <h3>{{ $t('create_account')}}</h3>

        <div class="form-group">
            <label>{{ $t('username') }}</label><br>
            <input type="text" v-model="username" class="form-control form-control-lg" />
            <br><span class="error" v-if="errorUsername">{{ errorUsername }}</span>
        </div>

        <div class="form-group">
            <label>{{ $t('email_address')}}</label><br>
            <input type="email" v-model="email" class="form-control form-control-lg" />
            <br><span class="error" v-if="errorEmail">{{ errorEmail }}</span>
        </div>

        <div class="form-group">
            <label>{{ $t('password')}}</label><br>
            <input type="password" v-model="password" class="form-control form-control-lg" @keyup.enter="this.signUp()"/>
            <br><span class="error" v-if="error">{{ error }}</span>
        </div>

        <button type="submit" class="functionalButton giveMeSpace" @click="this.signUp()">{{$t('create_account')}}</button>
        <br>
        <span>{{ $t('already_account') }}<a href="#" class="internalLink"
                    @click="$emit('goLogin')">{{ ' ' + $t('log_in') }}</a></span>
        <!-- <p class="forgot-password text-right">
                Already registered 
                <router-link :to="{name: 'login'}">sign in?</router-link>
            </p> -->
    </div>
</template>
 
<script>
import { defineEmits } from 'vue'
import axios from "axios"
import i18next from 'i18next';   
const emit = defineEmits(['close', 'signInUser', 'goToRegistration'])
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
            if (this.username == null || this.username?.length < 5) {
                this.errorUsername = i18next.t('username_length')
                allow = false
            }
            if (this.password == null || this.password?.length < 7) {
                this.error = i18next.t('password_length')
                allow = false
            }
            if (this.email == null || !this.email.includes("@") || this.email?.length < 5) {
                this.errorEmail = i18next.t('valid_email')
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
                axios.post(serverUrl + "/signUp", { username: this.username, email: this.email, password: this.password }).then(x => {
                    console.log(x)
                    this.$store.commit("setSignedInUser", x.data)
                    console.log(this.$store.state.signedInUser)
                    this.$emit('signInUser');
                    this.$emit('close');
                    }).catch(error => {
                    console.log(error)
                    var status = error.response.status
                    if (status == 400) {
                        this.error = i18next.t('user_not_found')
                    }
                    else if (status == 401) {
                        this.error = i18next.t('user_exists')
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