import Vuex from 'vuex'
import axios from 'axios'
import { toRaw } from 'vue';

export default new Vuex.Store({
  state: {
    routes: ["yo "],
    userMode: "view",
    mapLocal: null,
    localServer: false,
    serverUrl: null,
    signedInUser: null,
    startLocation: null,
    endLocation: null,
    waypoints: [],
    waypointLocations: [],
    directions: null,
    addingReturnDirections: false,
  },
  getters: {
    createGuid(state) {  
      function _p8(s) {  
         let p = (Math.random().toString(16)+"000000000").substring(2,8);  
         return s ? "-" + p.substring(0,4) + "-" + p.substring(4,4) : p ;  
      }  
      return _p8() + _p8(true) + _p8(true) + _p8();  
   }
    
  },
  mutations: {
    setDirections(state, newDirections){
      this.state.directions = newDirections
    },
    setStartLocation(state, newStart){
      this.state.startLocation = newStart
    },
    addWaypointLocation(state, newPoint){
      this.state.waypoints.push(newPoint);
      this.state.waypointLocations.push(toRaw(newPoint).position);
    },
    setWaypointLocation(state, {waypointIndex, ltlng}){
      this.state.waypointLocations[waypointIndex] = [ltlng.lat, ltlng.lng]
      //raw.position = newWaypoint;
    },
    setEndLocation(state, newEnd){
      this.state.endLocation = newEnd
    },
    removeWaypointAtIndex(state, i) {
      console.log()
      const raw = toRaw(this.state.waypoints[i])
      raw.setMap(null)
      this.state.waypoints.splice(i, 1)
      this.state.waypointLocations.splice(i, 1)
    },
    setRoutes(state, newRoutes){
      this.state.routes = newRoutes
      console.log(newRoutes)
    },
    setAddingReturn(state, addingReturn){
      this.state.addingReturnDirections = addingReturn;
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
      axios(this.state.serverUrl + "/getRoutes", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'encoding': 'utf-8', 'Access-Control-Allow-Origin': '*' }
      }).then(response => {
        console.log(response.data)
        this.commit("setRoutes", response.data)
      })
    },
    initialiseStore(){
      this.replaceState({
        routes: ["yo "],
        userMode: "view",
        mapLocal: null,
        localServer: false,
        serverUrl: null,
        signedInUser: null,
        startLocation: null,
        endLocation: null,
        waypoints: [],
        waypointLocations: [],
        directions: null,
        addingReturnDirections: false,
      })
      if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === ""){
        this.commit("setLocalServer", true)
      }
      else{
        this.commit("setLocalServer", false)
      }
    },
    
  },
  modules: {
  }
});
