<template>
  <div id="container">
    <div id="floating-panel" class="center navbar">
      <div id="allDashboardContent">
        <div is="logoImage">
          <img src="https://i.ibb.co/XjwhkdC/3.png" class="noPointers" id="logo">
        </div>

        <div id="minimizableContent">
          <div id="dashboardContent">
            <input id="goToLocationInput" @keyup.enter="goToLocation" class="center" :placeholder="$t('search_routes')">
            <button id="goToLocationButton" :title="$t('search_routes')" class="functionalButton center marginRight"
            @click="goToLocation()">
              <img class="buttonImage" src="../assets/magnifying-glass.svg">
            </button>

            <div class="buttonCluster">
              <button class="functionalButton marginRight" @mouseenter="this.showProfileDropdown = true"
                @mouseleave="this.showProfileDropdown = false" title="Profile"
                @click="this.showProfileDropdown = !this.showProfileDropdown">
                  <img id="threeDotsButton" class="buttonImage" src="../assets/dots-three-vertical.svg"
                    alt="profile" :title="$t('profile')">
                  <span v-show="this.signedInUsername != null">{{ this.signedInUsername }} </span>
                
                  <div v-show="showProfileDropdown" class="dropdownContent">
                    <div class="dropdownItem capitalize" v-show="this.signedInUsername == null"
                      @click="showLogin = true; showRegistration = false">
                      {{ $t('log_in') }}
                    </div>
                    <div class="dropdownItem capitalize" v-show="this.signedInUsername == null"
                      @click="showRegistration = true; showLogin = false">
                      {{ $t('create_account') }}
                    </div>
                    <div class="dropdownItem capitalize" v-show="this.signedInUsername != null" @click="this.signOutUser()">
                      {{ $t('log_out') }}
                    </div>
                    <div class="dropdownItem capitalize" @click="this.showInformation = !this.showInformation">
                      {{ $t('information') }}
                    </div>
                  </div>
              </button>
            </div>

            <button v-if="signedInUsername != null" class="functionalButton marginRight" :title="$t('add_route')" @click="showAddRoute()">
              <img class="buttonImage" src="../assets/plus.svg" alt="Add Route">
            </button>
            
  
            <button class="functionalButton marginRight" :title="$t('select_language')">
              <select id="languageSelect" ref="languageSelectElem" @change="this.languageChange($refs.languageSelectElem)">
                <option value="es">ES</option>
                <option value="en">EN</option>
              </select>
            </button>
          </div>
      
        </div>
        <button class="functionalButton minimize" :title="$t('minimize')" v-show="this.minimized == false" @click="this.toggleMinimize()">
          <img class="buttonImage" src="../assets/arrow-line-left.svg">
        </button>

        <button class="functionalButton minimize" :title="$t('maximize')" v-show="this.minimized == true" @click="this.toggleMinimize()">
          <img class="buttonImage" src="../assets/arrow-line-right.svg">
        </button>   

      
      </div>
      <div v-show="this.addRoute">
        <AddRouteView @initDirections="x => this.initDirections(x)" @removeWaypointAtIndex="" @goToLocation="x => this.goToPoint(x)" @directions="this.findDirections()" @clickmode="x => this.clickmode = x" ref="addRoute">
        </AddRouteView>
      </div>   
    </div>

    <div>                                                  
      <div v-if="showLogin">
        <Teleport to="body">
          <LoginView @goToRegistration="showLogin = false; showRegistration = true" @close="showLogin = false"
            @signInUser="this.signInUser()">
          </LoginView>
        </Teleport>
      </div>
      <div v-if="showRegistration">
        <Teleport to="body">
          <RegistrationView @signInUser="this.signInUser()"
            @goLogin="this.showRegistration = false; this.showLogin = true" @close="showRegistration = false">
          </RegistrationView>
        </Teleport>
      </div>
      <div v-if="showInformation">
        <Teleport to="body">
          <InformationView @signInUser="this.signInUser()" @close="showInformation = false">
          </InformationView>
        </Teleport>
      </div>
      <div id="routeViewDiv" style="display: none;"></div>
    </div>
    <div id="map" style="height: 94%; position: inherit !important" />
    <div id="warnings-panel" />
  </div>
  <RouteView @updateRoute="(info) => this.updateRoute(info)" @editRoute="this.editRoute()" @goLogin="this.showLogin = true" ref="routeViewPanel"></RouteView>
</template>

<script>
// import { Loader } from 'google-maps'
import { Loader } from '@googlemaps/js-api-loader';
import { Geolocation } from '@capacitor/geolocation'
import { BackgroundTask } from '@robingenz/capacitor-background-task';
import { App } from '@capacitor/app';
import store from '@/store';
import RouteView from './RouteView.vue';
import RouteEditView from './RouteEditView.vue'
import router from '@/router';
import LoginView from './LoginView.vue';
import RegistrationView from './RegistrationView.vue';
import i18next from 'i18next'
import axios from 'axios'
import InformationView from './InformationView.vue';
import AddRouteView from './AddRouteView.vue';
import { toRaw } from 'vue';
export default {
  name: 'Home',
  components: {
    RouteView,
    LoginView,
    RegistrationView,
    RouteEditView,
    InformationView,
    AddRouteView
},
  data() {
    return {
      routes: [],
      taskId: null,
      points: [],
      returnPoints: [],
      polyline: [],
      overview_polyline: null,
      return_overview_polyline: null,
      polylines: [],
      overlays: [],
      markers: [],
      mode: 0,
      mapLocal: '',
      currentHighlightedRoute: null,
      currentHighlightedReturn: null,
      greenMarker: null,
      redMarker: null,
      directionsRendererLocal: null,
      currentEditId: null,
      confirmedStartLocation: null,
      confirmedEndLocation: null,
      infoPanelLocal: null,
      directionsRendered: null,
      userIp: null,
      locationInterval: null,
      currentRouteTrackLine: null,
      initialized: false,
      showingRoutes: true,
      editingDirections: false,
      standardRouteOpacity: 1,
      followPoints: [],
      debugIterator: 0,
      // editingReturn: false,
      myIp: 'https://www.rutascolectivos.info',
      windowHtml: null,
      google: null,
      maps: null,
      pollingForLocation: null,
      following: false,
      showLogin: false,
      showRegistration: false,
      showRouteDetails: false,
      showProfileDropdown: false,
      showInformation: false,
      showRouteEdit: false,
      signedInUsername: null,
      active: false,
      currentX: null,
      currentY: null,
      initialX: null,
      initialY: null,
      xOffset: 0,
      yOffset: 0,
      dragItem: null,
      dragContainer: null,
      minimized: false,
      addRoute: false,
      clickmode: "normal",
      startLocation: null,
      endLocation: null,
      waypoints: [],
      directions: null,
      routeEditing: null
    }
  },
  async mounted() {
    store.dispatch('initialiseStore')
    if (process.env.NODE_ENV === 'development') {
      this.myIp = 'http://localhost:8000'
    }
    this.tokenLogin()
    const loader = new Loader({
      apiKey: "AIzaSyBexCyJAH6Wnlu35vWiN3d1DtB9_RNBlC0",
      version: "weekly",
      libraries: ["places"]
    });

    // App.addListener('appStateChange', async ({ isActive }) => {
    //   if (isActive) {
    //     return
    //   }
    //   //now app is not active
    //   if (this.following) {
    //     console.log(this.following)
    //     this.startBackgroundTask()
    //   }
    // });

    this.dragItem = document.querySelector("#floating-panel");
    this.container = document.querySelector("#container");

    this.container.addEventListener("touchstart", this.dragStart, false);
    this.container.addEventListener("touchend", this.dragEnd, false);
    this.container.addEventListener("touchmove", this.drag, false);

    if (window.innerWidth >= 480) {
      this.container.addEventListener("touchstart", this.dragStart, false);
      this.container.addEventListener("touchend", this.dragEnd, false);
      this.container.addEventListener("touchmove", this.drag, false);
    }

    this.container.addEventListener("mousedown", this.dragStart, false);
    this.container.addEventListener("mouseup", this.dragEnd, false);
    this.container.addEventListener("mousemove", this.drag, false);

    this.google = await loader.load()
    this.initMap()
  },
  methods: {
    async startBackgroundTask() {
      // console.log('start background task ->')
      // console.log(this.following)
      // this.taskId = await BackgroundTask.beforeExit(async () => {
      //   // BackgroundTask.finish({ taskId });
      //   var toplus = 0
      //   this.pollingForLocation = setTimeout(async () => {
      //     const position = await Geolocation.getCurrentPosition()
      //     const pos = {
      //       lat: position.coords.latitude + toplus,
      //       lng: position.coords.longitude + toplus
      //     }
      //     placeNewMarker(pos)
      //     toplus++
      //     console.log(pos)
      //   }, 5000)

      // });
      //console.log(taskId)
    },
    initDirections(dir){
      if(dir != null){
        console.log(dir.start)
        this.setStartLocation({ lat: dir.start[0], lng: dir.start[1]})
        this.setEndLocation({ lat: dir.end[0], lng: dir.end[1]})
      }
      this.addDirectionsClickEvents()
     
    },
    toggleMinimize(){
      var mini = document.getElementById("minimizableContent");
      mini.classList.toggle("mini")
      this.minimized = !this.minimized
    },
    generateBoundsFromMarkers(){
      let bounds  = new google.maps.LatLngBounds();
      let boundsMarkers = [];
      boundsMarkers.push(this.startLocation);
      boundsMarkers.push(this.endLocation);
      for (let i = 0; i < boundsMarkers.length; i++) {
        const marker = boundsMarkers[i];
        console.log(i)
        bounds.extend(new google.maps.LatLng(marker.position.lat(), marker.position.lng()));
      }
      return bounds;
    },
    dragStart(e) {
      if (e.target === this.dragItem) {
        this.active = true;
      }
      else{
        return
      }
      if (e.type === "touchstart") {
        this.initialX = e.touches[0].clientX - this.xOffset;
        this.initialY = e.touches[0].clientY - this.yOffset;
      } else {
        this.initialX = e.clientX - this.xOffset;
        this.initialY = e.clientY - this.yOffset;
      }
    },

    dragEnd(e) {
      this.initialX = this.currentX;
      this.initialY = this.currentY;

      this.active = false;
    },

    drag(e) {
      if (this.active) {

        e.preventDefault();

        if (e.type === "touchmove") {
          this.currentX = e.touches[0].clientX - this.initialX;
          this.currentY = e.touches[0].clientY - this.initialY;
        } else {
          this.currentX = e.clientX - this.initialX;
          this.currentY = e.clientY - this.initialY;
        }

        this.xOffset = this.currentX;
        this.yOffset = this.currentY;

        this.setTranslate(this.currentX, this.currentY, this.dragItem);
      }
    },
    setTranslate(xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    },
    editRoute() {
      this.$refs.addRoute.populateInfo(this.routeEditing)
      this.addRoute = true
    },
    tokenLogin() {
      var serverUrl = this.$store.state.serverUrl;
      var tokey = localStorage.getItem("loginToken");
      var fullUrl = serverUrl + '/signIn';

      axios.post(fullUrl, {
        email: this.email, password: this.password, token: tokey,
      }).then(x => {
        this.error = null
        this.$store.commit("setSignedInUser", x.data)
        this.signInUser()
        //if()
      }).catch(error => {
        console.log(error)
      })
    },
    dragged(e) {
    },
    signInUser() {
      this.signedInUsername = this.$store.state.signedInUser.username
    },
    signOutUser() {
      this.$store.commit("signOutUser")
      this.signedInUsername = null
      console.log(this.$store.state.signedInUser)
    },
    setStartLocation(newLoc){
      if(this.startLocation == null){
                this.startLocation = this.placeNewMarker(newLoc, "green")
                this.google.maps.event.addListener(this.startLocation, 'dragend', (event) => {
                  this.$store.commit('setStartLocation', event.latLng)
                })
              }
              else{
                this.startLocation.setPosition(newLoc)
              }
              this.$store.commit("setStartLocation", this.startLocation.position)
    },
    setEndLocation(newLoc){
      if(this.endLocation == null){
                this.endLocation = this.placeNewMarker(newLoc, "red")
                this.google.maps.event.addListener(this.endLocation, 'dragend', (event) => {
                    this.$store.commit('setEndLocation', event.latLng)
                })
              }
              else{
                this.endLocation.setPosition(newLoc)
              }
              this.$store.commit("setEndLocation", this.endLocation.position)
    },
    addDirectionsClickEvents() {
      this.google.maps.event.clearListeners(this.mapLocal, 'click');
        this.google.maps.event.addListener(this.mapLocal, 'click', (clickEvent) => {
        console.log(this.clickmode)
          switch(this.clickmode){
            case "normal":
              break;
            case "addStart":
              this.setStartLocation(clickEvent.latLng)
              break;
            case "addEnd":
              this.setEndLocation(clickEvent.latLng)
              break;
            case "addWaypoint":
              let mark = this.placeNewMarker(clickEvent.latLng, "blue")
              let waypointIndex = this.waypoints.length;
              this.google.maps.event.addListener(mark, 'dragend', (event) => {
                console.log(event.latLng.lat(), event.latLng.lng())
                console.log(toRaw(event.latLng))
                let ltlng = {lat:event.latLng.lat(), lng: event.latLng.lng()}
                  this.$store.commit('setWaypointLocation', { waypointIndex, ltlng } )
              })
              this.waypoints.push(mark);
              this.$store.commit("addWaypointLocation", mark)
              break;
          }
        
      })
    },
    showAddRoute() {
      if (this.actionRequiresLogin() == true) {
        this.addRoute = !this.addRoute
        if(this.addRoute){
          this.$refs.addRoute.initCreateRoute()
        }
      }
    },
    populateInfo(route) {
      console.log(route)
      this.routeEditing = route
      this.$refs.routeViewPanel.populateInfo(route)
    },
    stopBackgroundTask() {
      console.log('stop background task')
      BackgroundTask.finish({ taskId: this.taskId });
      this.taskId = null
    },
    createGPSPoints() {

    },
    addAnotherRoute(button) {
      document.getElementById('routeInputPhase').value = 0
      document.getElementById('confirmButtonTop').style.display = 'block'
      document.getElementById(button.style.display = 'none')
      this.setInstructionText(0)
      this.points = []
      this.returnPoints = []
    },
    // collectivo = <div><h2 id="routeTitle" value="#title"></h2><p value="#contents"></p></div>
    showHideRoutes() {
      if (this.showingRoutes) {
        this.polylines.forEach(x => x.setMap(null))
        this.showingRoutes = false
      } else {
        this.drawRoutes()
        this.showingRoutes = true
      }
    },

    recalculateRoute() {
      if (this.directionsRendererLocal !== '') {
        this.directionsRendererLocal.setMap(null)
      }
      this.findDirections(this.editingDirections === 'return')
    },
    startFollowing() {
      this.following = true
      console.log(store.state.mapLocal)
      console.log(this.mapLocal)
      this.google.maps.event.addListener(this.mapLocal, 'click', (event) => {
        if (this.following) {
          this.placeNewMarker(event.latLng)
        }
      })


      // this.trackingPoints = []
      // this.pushMyLocation()
      // this.locationInterval = setInterval(() => {
      //   this.pushMyLocation()
      // }, 5000)
    },
    stopFollowing(save) {
      this.following = false;
      var gpsPoints = this.followPoints.map(function (x) { return [x.position.lat(), x.position.lng()] })
      this.saveGPSFollow(gpsPoints)

      // clearInterval(this.locationInterval)
    },
    saveGPSFollow(gpsPoints) {
      fetch(this.myIp + '/saveGPS', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gpsPoints)
      })
    },

    searchKeyPress(event) {
      var key = event.keyCode || event.which
      if (key === 13) {
        // search
      }
    },

    cancelDelete() {
      document.getElementById('reallyDeleteRouteButtonTop').style.display = 'none'
      document.getElementById('cancelDeleteButton').style.display = 'none'
    },

    deleteHighlightedRoute(really) {
      if (really === false) {
        document.getElementById('reallyDeleteRouteButtonTop').style.display = 'flex'
        document.getElementById('cancelDeleteButton').style.display = 'flex'
      } else if (really === true) {
        fetch(this.myIp + '/deleteRoute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: this.currentHighlightedRoute.id }) // here this is how you send your datas
        })
          .then(response => console.log(response.text)).then(x => {
            this.initMap()
          })
      }
    },

    editRoutePoints(moveMarkers) {
      if (this.currentHighlightedRoute) {
        this.currentHighlightedRoute.setOptions({ strokeOpacity: 0.3 })
        if (this.currentHighlightedReturn) {
          this.currentHighlightedReturn.setOptions({ strokeOpacity: 0.3 })
        }

        var path = this.currentHighlightedRoute.getPath()
        var trybesmart
        Object.keys(path).forEach(key => {
          if (path[key].length && path.length && path[key].length === path.length) {
            trybesmart = key
          }
        })
        console.log(trybesmart)
        this.greenMarker.setMap(this.mapLocal)
        this.redMarker.setMap(this.mapLocal)
        this.greenMarker.setPosition(path[trybesmart][0])

        this.redMarker.setPosition(path[trybesmart][path[trybesmart].length - 1])
        this.findDirections(this.editingDirections === 'return')
      }
    },

    getLineById(id) {
      this.polylines.forEach(element => {
        if (element.id === id) {
          return element
        }
      })
    },
    findNameOfLocation(loc, isReturn) {
      console.log('finding location ', loc)

      var geocoder = this.maps.Geocoder()

      // var latitude = greenMarker.getPosition().lat();
      // var longitude = greenMarker.getPosition().lng();
      // var latlng = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
      geocoder.geocode({ 'location': loc }, (results, status) => {
        if (status === this.maps.GeocoderStatus.OK) {
          var locationString = ''
          if (results[0].types.includes('plus_code')) {
            locationString += results[0].address_components[1].long_name
            locationString += ', '
            locationString += results[0].address_components[2].long_name
            console.log(results[0].address_components[2].long_name)
          } else {
            locationString += results[0].address_components[2].long_name
            locationString += ', '
            locationString += results[0].address_components[3].long_name
            console.log(results[0].address_components[2].long_name)
          }
          if (this.mode === 1) {
            this.setLocationName(locationString, isReturn)
          }

          if (results[1]) {
          } else {
            window.alert('No results found')
          }
        } else {
          window.alert('Geocoder failed due to: ' + status)
        }
      })
    },

    validateConfirm(phaseInt) {
      console.log(phaseInt)
      switch (phaseInt) {
        case 0:
          console.log(this.greenMarker)
          break
        case 1:
        case 2:
      }
      return true
    },

    confirmButtonPress() {
      var phaseint = document.getElementById('routeInputPhase').value
      var validate = this.validateConfirm(phaseint)
      if (validate === true) {
        phaseint++
        document.getElementById('routeInputPhase').value = phaseint
        this.setInstructionText(phaseint)
      } else {
        console.log(validate)
      }
    },

    goBackButtonPress() {
      var phaseint = document.getElementById('routeInputPhase').value
      phaseint--
      document.getElementById('routeInputPhase').value = phaseint
      this.setInstructionText(phaseint)
    },
    goToLocation(event) {
      if (event) {
        if (event.keyCode === 13) {
          this.search()
        }
      } else {
        this.search()
      }
    },
    toggleActive() {
      var el = document.getElementById("menuDropdown")
      el.classList.push("active")
    },
    clearAllLines() {
      if (this.polylines) {
        // console.log(this.polylines)
        this.polylines.forEach(x => x.setMap(null))
      }
    },
    getNewDirectionsRenderer() {
return new this.google.maps.DirectionsRenderer({ map: this.mapLocal, draggable: true, suppressMarkers: true, polylineOptions: { zIndex: 10, strokeColor: '#0000FF', strokeWeight: 10, strokeOpacity: 0.7 } })
    },
    findDirections(isReturnRoute) {

      if(this.directionsRendererLocal == null){
        this.directionsRendererLocal = this.getNewDirectionsRenderer()
      }

      const directionsService = new this.google.maps.DirectionsService()

      this.google.maps.event.addListener(this.directionsRendererLocal,
        'directions_changed',
        (dirs) => {
          this.clearAllLines()
          var directions = this.directionsRendererLocal.getDirections()
          console.log(dirs)
          this.onDirectionsChange(directions)
        }
      )

      //const stepDisplay = new this.google.maps.InfoWindow()
      this.calculateAndDisplayRoute(
        directionsService,
      )
    },

    drawRoutes() {
      fetch(this.myIp + '/getRoutes', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'encoding': 'utf-8', 'Access-Control-Allow-Origin': '*' }
      }).then(response => response.json()).then(x => {
        this.drawPolylines(x)
      })
    },
    goToPoint(point){
      this.mapLocal.setCenter(point)
    },
    search() {
      fetch(this.myIp + '/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: document.getElementById('goToLocationInput').value }) // here this is how you send your datas
      }).then(response => response.json()).then(x => {
        this.mapLocal.setCenter(x.results[0].geometry.location)
      })
    },

    uuidv4() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    },
    initialize() {
      var userLang = navigator.language || navigator.userLanguage
      if (userLang.includes('en')) {
        document.getElementById('languageSelect').selectedIndex = 1
        this.languageChange(-1)
      } else {
        document.getElementById('languageSelect').selectedIndex = 0
        this.languageChange(-1)
      }
      store.dispatch('getRoutesFromServer')

    },

    removeIsolatedPoints(sequence) {
      var prev = 10000
      var validSequences = []

      var currentSequence = []
      for (let index = 0; index < sequence.length; index++) {
        const element = sequence[index]
        if (Math.abs(element - prev) > 1) {
          if (!validSequences.includes(currentSequence)) {
            validSequences.push(currentSequence)
          }
          this.currentsequence = []
        } else {
          currentSequence.push(sequence[index])
        }

        prev = element
      }

      var fin = []
      validSequences.forEach(element => {
        fin = fin.concat(element)
      })

      return fin
    },

    getPercentages(outs, returns, isReturn) {
      var i = 0
      var indexes = []
      outs.forEach(element => {
        i++
        if (!returns.includes(element)) {
          // var jser = JSON.parse(element)
          // var submit = { lat: Number(jser[0]), lng: Number(jser[1]) }
          // placeNewMarker(submit)
          indexes.push(i)
        }
      })

      var noIsolated = indexes // removeIsolatedPoints(indexes)

      var percentages = []
      noIsolated.forEach(indexerino => {
        var percent = Math.round((indexerino / outs.length) * 100)
        if (!percentages.includes(percent)) {
          percentages.push(percent)
        }
      })

      return percentages
    },

    getOverlappingSegments(route) {
      if (route.returnPoints != null) {
        var resolution = 3

        var returns = route.returnPoints.map((eachElement) => {
          return JSON.stringify([eachElement[0].toFixed(3), eachElement[1].toFixed(3)])
        })

        // console.log(returns)
        // console.log(route.returnPoints)

        var outs = route.points.map((eachElement) => {
          return JSON.stringify([eachElement[0].toFixed(resolution), eachElement[1].toFixed(resolution)])
        })

        // var latlng = polyline.GetPointAtDistance(polyline.Distance()*(desiredPercentage)/100);

        var outPercents = this.getPercentages(outs, returns, false)
        var retPercents = this.getPercentages(returns, outs, true)

        console.log(outPercents)
        console.log(outs.length)

        return {
          out: outPercents,
          return: retPercents
        }
      }
    },

    drawPolylines(routes) {
      this.routes = routes
      routes.forEach(route => {
        var line = this.drawLine(route)
        var returnLine = this.drawLineFromPoints(route.returnPoints, route, true)

        this.setClickEvent(line, route, returnLine)
        this.setClickEvent(returnLine, route, line)
      })
    },

    drawLineFromPoints(points, route, isReturn) {
      var tosend = []

      if (points && points[0].lat != null) {
        tosend = points
      } else {
        var coords = points
        if (coords != null) {
          coords.forEach(coord => {
            tosend.push({ lat: coord[0], lng: coord[1] })
          })
        }
      }

      var routePath = new this.google.maps.Polyline({
        path: tosend,
        geodesic: false,
        strokeColor: route.colour ? route.colour : '#FFFFFF',
        strokeOpacity: this.standardRouteOpacity,
        strokeWeight: 5,
        icons: route ? this.generateIcons(route, isReturn) : null
      })

      this.polylines.push(routePath)
      routePath.setMap(this.mapLocal)
      routePath.id = route ? route._id : null
      return routePath
    },

    actionRequiresLogin() {
      if (this.$store.state.signedInUser == null) {
        this.showLogin = true;
        return false
      }
      else {
        return true
      }
    },

    placeNewMarker(loc, color) {
      var url = 'http://maps.google.com/mapfiles/ms/icons/'
      url += color + '-dot.png'

      var blueMarker = new this.google.maps.Marker({
        draggable: true,
        position: loc,
        map: this.mapLocal,
        title: 'Your location',
        icon: {
          url: url
        }
      })
      return blueMarker
    },

    generateIcons(route, isReturn) {
      var finPercents = []
      var pathy = !isReturn ? 'M -1,0 1,0 0,-1 z' : 'M -1,0 1,0 0,1 z'

      const symbolOne = {
        path: pathy,
        strokeColor: route.colour,
        fillColor: route.colour,
        fillOpacity: 1
      }

      var outArrowPercents = route.outArrowPercents
      var returnArrowPercents = route.returnArrowPercents

      if (!outArrowPercents || !returnArrowPercents) {
        return
      }

      var percent = -50
      var previousPercent = -50
      var sections = []
      var currentSection = []
      for (let i = 0; i < outArrowPercents.length; i++) {
        percent = outArrowPercents[i]
        if (percent - previousPercent <= route.points.length < 100 ? 100 / route.points.length : 1) {
          currentSection.push(percent)
        } else {
          sections.push(currentSection)
          currentSection = []
        }
      }
      sections.push(currentSection)
      if (outArrowPercents.length > 0) {
        for (let i = 0; i < sections.length; i++) {
          var midIndex = Math.floor(sections[i].length / 2)
          var midSection = sections[i][midIndex]
          finPercents.push(midSection)
        }
      }
      var icons = []

      for (var i = 0; i < finPercents.length; i++) {
        var str = finPercents[i] + '%'
        icons.push(
          {
            icon: symbolOne,
            offset: str
          }
        )
      }
      var symbol = {
        path: pathy,
        strokeColor: route.colour,
        fillColor: route.colour,
        fillOpacity: 1
      }
      icons.push({
        icon: symbol,
        offset: 100 + '%'
      })
      icons.push({
        icon: symbol,
        offset: 0 + '%'
      })

      return icons
    },

    drawLine(route) {
      // out
      var coords = route.points
      var tosend = []
      if (coords != null) {
        coords.forEach(coord => {
          tosend.push({ lat: coord[0], lng: coord[1] })
        })
      }
      var icons = this.generateIcons(route, false)

      var routePath = new this.google.maps.Polyline({
        path: tosend,
        geodesic: false,
        strokeColor: route.colour,
        strokeOpacity: this.standardRouteOpacity,
        strokeWeight: 5,
        icons: icons
      })

      this.polylines.push(routePath)
      //console.log(routePath)
      routePath.setMap(this.mapLocal)
      routePath.id = route._id
      return routePath
    },

    setClickEvent(routePath, route, returnRoutepath) {
      this.google.maps.event.addListener(routePath, 'click', (click) => {
        this.showRouteDetails = true
        var boxText = document.createElement('div')
        //var infoHtml = this.$refs.routeViewPanel
        var infoHtml = document.getElementById('infoPanel')

        if (this.currentHighlightedRoute != null) {
          // old path
          this.currentHighlightedRoute.setOptions({ zIndex: 0, strokeWeight: 5, strokeOpacity: this.standardRouteOpacity })
        }
        if (this.currentHighlightedReturn != null) {
          this.currentHighlightedReturn.setOptions({ zIndex: 0, strokeWeight: 5, strokeOpacity: this.standardRouteOpacity })
        }
        routePath.setOptions({ zIndex: 5, strokeWeight: 8, strokeOpacity: this.standardRouteOpacity })
        if (returnRoutepath != null) {
          returnRoutepath.setOptions({ zIndex: 4, strokeWeight: 8, strokeOpacity: this.standardRouteOpacity })
          this.currentHighlightedReturn = returnRoutepath
        }
        this.currentHighlightedRoute = routePath
        this.currentHighlightedRoute.route = route

        this.currentEditId = routePath.id
        if (this.mode === 0) {
          this.populateInfo(route)
          var myOptions = {
            content: this.$refs.routeViewPanel.$el,
            position: { lat: route.points[0][0], lng: route.points[0][1] }
          }
          // end example code for custom infobox
          var ib = new this.google.maps.InfoWindow(myOptions)
          this.markers.forEach(marker => {
            marker.setMap(null)
          })
          // infoPanelLocal = ImageBitmapRenderingContext
          ib.open(this.mapLocal, this.maps)
          this.markers.push(ib)
        } 
        //this.getOverlappingSegments(route)
      })
    },

    async pushMyLocation() {
      try {
        const position = await Geolocation.getCurrentPosition()
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        this.mapLocal.setCenter(pos)
        this.placeNewMarker(pos)
        this.trackingPoints.push(pos)
        this.debugIterator++
        if (this.currentRouteTrackLine != null) { this.currentRouteTrackLine.setMap(null) }
        this.drawLineFromPoints(this.trackingPoints)
      } catch (e) {
        console.log(e)
      }
    },

    async showMyLocation() {
      try {
        const position = await Geolocation.getCurrentPosition()
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        // alert(JSON.stringify(pos))
        // infoWindow.setPosition(pos);
        // infoWindow.setContent("Location found.");
        // infoWindow.open(map);
        this.mapLocal.setCenter(pos)
        this.placeNewMarker(pos)
      } catch (e) {
        console.log(JSON.stringify(e), 'error')
        console.log(this.maps)
        // this.handleLocationError(true, this.infoWindow, this.maps.getCenter())
      }
    },

    setEditInstructionText(newInt) {
      var spanish = document.getElementById('languageSelect').selectedIndex === 0
      var newText = ''
      if (newInt === 0) {
        newText = spanish ? 'edición de direcciones de ruta de regreso' : 'editing return route directions'
      } else if (newInt === 1) {
        newText = spanish ? 'edite la información de la ruta como desee y luego haga clic en confirmar cuando haya terminado' : 'edit the route information as you like then click confirm when you are done'
      }
      document.getElementById('editInstructionText').textContent = newText
    },
    // Sets the map on all markers in the array.
    setMapOnAll(map) {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(map)
      }
    },
    // Removes the markers from the map, but keeps them in the array.
    hideMarkers() {
      this.setMapOnAll(null)
    },

    // Shows any markers currently in the array.
    showMarkers() {
      this.setMapOnAll(this.map)
    },

    // Deletes all markers in the array by removing references to them.
    deleteMarkers() {
      this.hideMarkers()
      this.markers = []
    },

    initMap() {
      // const markerArray = []
      this.setMapOnAll(null)

      this.editingDirections = false
      // Instantiate a directions service.

      // Create a map and center it on Manhattan.
      this.maps = new this.google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: { lat: 16.745, lng: -92.63143780343951 },
        clickableIcons: false,
        streetViewControl: false
      })
      this.mapLocal = this.maps
      store.commit("setMapLocal", this.maps)

      this.drawRoutes()
      this.initialize()
      this.initialized = true
    },

    onDirectionsChange(newDirections) {
      console.log("directions")
      console.log(newDirections)
      console.log(newDirections.routes[0])
      let directions = newDirections.routes[0]
      this.directions = newDirections;
      this.$store.commit("setDirections", directions)
    },
    calculateAndDisplayRoute(
      directionsService
    ) {
      let googleWaypoints = [];
      this.$store.state.waypoints.forEach(element => {
        console.log(element)
        googleWaypoints.push({ location: toRaw(element).position})
      });
      directionsService
        .route({
          origin: this.startLocation.position,
          destination: this.endLocation.position,
          travelMode: google.maps.DirectionsTravelMode.DRIVING,
          waypoints: googleWaypoints
        })
        .then((result) => {
          //this.directionsRendererLocal.setMap(null)
          console.log("yo")
          console.log(result)
          this.directionsRendererLocal.setDirections(result);
          //this.mapLocal.setZoom(13)
          // points = result.routes[0].points
          
        })
        .then((x) => {
          
        })
        .catch((e) => {
          window.alert('Directions request failed due to ' + e)
        })
    },
    languageChange(element) {
      if (element == -1) {
        element = document.getElementById("languageSelect")
      }
      var newLang = element.value
      i18next.changeLanguage(newLang)
    },
  }
}
</script>


