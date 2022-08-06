import Vuex from 'vuex'
import axios from 'axios'

export default new Vuex.Store({
  state: {
    routes: ["yo "],
    userMode: "view",
    mapLocal: null,
    localServer: false,
    serverUrl: null,
    signedInUser: null
  },
  getters: {
  },
  mutations: {
    setRoutes(state, newRoutes){
      this.state.routes = newRoutes
    },
    setMapLocal(state, mapLocal){
      this.state.mapLocal = mapLocal
    },
    setLocalServer(state, isLocalServer){
      this.state.localServer = isLocalServer
      if(isLocalServer){
        this.state.serverUrl = 'http://localhost:8000'
      }
      else{
        this.state.serverUrl = 'https://www.rutascolectivos.info'
      }
    },
    setSignedInUser(state, user){
      this.state.signedInUser = user
      if(user.token != null){
        localStorage.setItem("loginToken", JSON.stringify(user.token));
      }
    },
    signOutUser(state){
      this.state.signedInUser = null
      localStorage.setItem("loginToken", null)
    }
  },
  actions: {
    getRoutesFromServer(){
      axios('http://localhost:8000/getRoutes', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'encoding': 'utf-8', 'Access-Control-Allow-Origin': '*' }
      }).then(response => {
        console.log(response.data)
        this.commit("setRoutes", response.data)
      })
    },
    initialiseStore(){
      console.log("initializing store")
      if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === ""){
        this.commit("setLocalServer", true)
      }
      // else{
      //   this.commit("setLocalServer", false)
      // }
    },
    
  },
  modules: {
  }
});
