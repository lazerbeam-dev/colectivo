<template>
    <span>{{ username }}</span><br>
    <span>{{ email }}</span><br>
    <button type="submit" class="btn btn-dark btn-lg btn-block" @click="SignOut()">Sign Out</button>
</template>


<script>
export default {
  name: 'ProfileView',
  data: function(){
    return {
        username: null,
        email: null,
        error: null
    }
  },
  methods: {
    SignOut(){
        this.$store.commit("signOutUser")
    }
  }
}
</script>