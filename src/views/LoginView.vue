<template>
    <div class="root">
        <transition name="modalLogin">
        <form class="modal">
            <button @click="$emit('close')">close</button>
            <h3>Sign In</h3>
 
            <div class="form-group">
                <label>Email address</label>
                <input type="email" class="form-control form-control-lg" />
            </div>
 
            <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control form-control-lg" />
            </div>
 
            <button type="submit" class="btn btn-dark btn-lg btn-block">Sign In</button>
 
            <p class="forgot-password text-right mt-2 mb-4">
                <router-link to="/forgot-password">Forgot password ?</router-link>
            </p>
        </form>
        </transition>
    </div>
</template>
 
<script setup>
import {defineEmit} from 'vue'
const emit = (['close'])
</script>

<script>
export default {
  name: 'LoginView'
}
</script>

<style>
.root{
    position: relative;
}

.modal{
    position:absolute;
}
</style>