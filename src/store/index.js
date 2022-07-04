import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    routes: ["yo "],
    userMode: "view",
    mapLocal: null
  },
  getters: {
  },
  mutations: {
    setRoutes(state, newRoutes){
      this.state.routes = newRoutes
    },
    setMapLocal(state, mapLocal){
      this.state.mapLocal = mapLocal
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
    }
  },
  modules: {
  }
})
