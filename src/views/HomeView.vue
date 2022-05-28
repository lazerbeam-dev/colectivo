<template>
  <div>
    <div id="floating-panel" style="min-height: 6%;" class="center">
      <img src="https://i.ibb.co/XjwhkdC/3.png"
        style="max-height: 40px; max-width: 40px; float: left; padding-right: 10px;">
      <select id="modeSelect" ref="modeSelectElem" @change="modeChange($refs.modeSelectElem)" class="center"
        style="display:none">
        <option value="0">
          View
        </option>
        <option value="1">
          Add route
        </option>
        <option value="2">
          Edit route
        </option>
      </select>
      <input id="goToLocationInput" @keyup.enter="goToLocation" class="center">
      <button id="goToLocationButton" class="submitButton center" @click="goToLocation()">
        <img id="goToLocationButtonImage" src="https://i.ibb.co/BPSDW54/search.png"
          style="max-width: 8px; max-height: 8px;" alt="search">
      </button>
      <!-- <button class="functionalButton pad" id="showHideRoutes" @click="showHideRoutes()">show/hide routes</button> -->
      <button id="startFollowing" class="functionalButton pad center" v-if="!following" @click="startFollowing()">
        follow me
      </button>
      <button id="stopFollowing" class="functionalButton pad center" v-if="following" @click="stopFollowing()">
        stop following
      </button>
      <!-- <button class="functionalButton pad center" style="display: block" @click="startBackgroundTask()">
        start tracker
      </button>
      <button class="functionalButton pad center" style="display: block" @click="stopBackgroundTask()">
        stop tracker
      </button> -->
      <div v-if="taskId">Task is running</div>
      <span class="pad center" style="float: right;">
        <img src="https://icon-library.com/images/language-icon/language-icon-14.jpg"
          style="max-width: 14px; max-height: 14px;">
        <select id="languageSelect" ref="languageSelectElem" @change="languageChange($refs.languageSelectElem)">
          <option value="0">Español</option>
          <option value="1">English</option>
        </select>
      </span>
      <div id="routeViewDiv" style="display: none;"></div>
      <div id="routeCreateDiv" style="display: none;">
        <input id="routeInputPhase" value="0" style="display: none;">
        <span id="userInstructionText">Click the map to select start location</span>
        <button id="confirmButtonTop" class="submitButton" type="button" @click="confirmButtonPress()">
          confirm
        </button>
        <span style="display: none;" class="pad"> or follow my location! (beta) <button id="followMeButton"
            class="functionalButton pad" @click="startFollowing()">follow</button></span>
        <button id="stopFollowingButton" class="redButton pad" style="display: none;" @click="stopFollowing()">
          stop following
        </button>
        <button id="goBackButton" type="button" value="back" style="display: none;" @click="goBackButtonPress()">
          back
        </button>
        <button id="recalculateButton" class="functionalButton" type="button" value="recalculate route"
          style="display: none;" @click="recalculateRoute()">
          recalculate route
        </button>
        <button id="addAnotherRoute" class="submitButton" type="button" value="Add another route" style="display: none;"
          @click="addAnotherRoute(this)">
          Add Another Route
        </button>
      </div>
      <div id="routeEditDiv" style="display:none;">
        <input id="routeEditPhase" value="0" style="display: none;">
        <span id="editInstructionText">Click on a route to edit</span>
        <div id="routeInformationDiv" style="display: none;">
          <div style="display:flex" class="pad">
            <div id="leftColumn" style="display: flex; flex-flow:row wrap;" class="pad">
              <span id="fromLocationLabel" class="pad">From:</span>
              <span id="fromLocationInfoTop" /><input id="fromLocationInputTop" type="text">

              <span id="toLocationLabel" class="pad">To:</span> <span id="toLocationInfoTop" /><input
                id="toLocationInputTop" type="text">
              <span id="frequencySelectorLabel" class="pad">Frequency - every~</span><span
                id="frequencyInfoTop" /><select id="frequencySelectorInfoInputTop" name="frequency"
                style="display: none;">
                <option value="?">
                  ?
                </option>
                <option value="5m">
                  5m
                </option>
                <option value="10m">
                  10m
                </option>
                <option value="15m">
                  15m
                </option>
                <option value="20m">
                  20m
                </option>
                <option value="30m">
                  30m
                </option>
                <option value="1hr">
                  1hr
                </option>
                <option value="2hr">
                  2hr
                </option>
              </select>
              <span id="startTimeLabelTop" class="pad">From:</span> <span id="startTimeTop" /><input
                id="startTimeInputTop" type="time" style="display: none;">
              <span id="endTimeLabelTop" class="pad"> To:</span>
              <span id="endTimeTop" /><input id="endTimeInputTop" class="input" type="time" style="display: none;">

              <div class="pad">
                <input id="colourPickerTop" type="color" style="text-align: end; height: 100%;">
              </div>
              <button id="enableRouteEditsButtonTop" class="pad, functionalButton" @click="editRoutePoints(true)">
                Edit
                route directions
              </button>
              <button id="addReturnButtonTop" class="pad, functionalButton" @click="enableAddReturnRoute()">
                Add return
                route
              </button>
            </div>
          </div>
          <div id="returnrouteEditDiv" style="display:none;">
            <div id="returnrouteInformationDiv" style="display: block;">
              Return information
              <div style="display:flex" class="pad">
                <div id="returnleftColumn" style="display: flex; flex-flow:row wrap;" class="pad">
                  <span id="returnInfoTop" />
                  <span id="startTimeEditLabel" class="pad">From: </span><input id="startTimeReturnTop" type="time"
                    style="display: block;">
                  <span id="endTimeEditLabel" class="pad"> To:</span>
                  <input id="endTimeReturnTop" class="input" type="time" style="display: block;">
                </div>
              </div>
            </div>
          </div>
          <button id="submitEditsButtonTop" class="pad, submitButton" @click="submitEditsTop(true)">
            Confirm
            edits
          </button>
          <button id="deleteRouteButtonTop" class="pad, redButton" @click="deleteHighlightedRoute(false)">
            Delete route
          </button>
          <button id="reallyDeleteRouteButtonTop" class="pad, redButton" style="display: none;"
            @click="deleteHighlightedRoute(true)">
            Confirm delete route
          </button>
          <button id="cancelDeleteButton" class="pad, functionalButton" style="display: none;" @click="cancelDelete()">
            Cancel delete
          </button>
        </div>
      </div>
    </div>
    <div id="routeCreateDivTop" style="display: none;">
      <b>Start: </b>
      <input id="start" value="San Cristobal De Las Casas">
      <!-- <input
        type="button"
        @click="recenterOnStart"
      > -->
      <input id="fromLat" style="width: 15px;" value="0"><input id="fromLng" value="0"
        style="width: 15px; display: none;">
      <input id="toLat" style="width: 15px;" value="0"><input id="toLng" value="0" style="width: 15px; display: none;">
      <b>End: </b>
      <input id="end" value="Tuxla">
      <button id="findDirections" type="button" value="Go!" @click="findDirections()">
        find directions
      </button>
      <input id="colourPicker" type="color">
      <span> Frequency - goes every</span>
      <select id="frequencySelectorInput" name="frequency">
        <option value="5m">
          5m
        </option>
        <option value="10m">
          10m
        </option>
        <option value="15m">
          15m
        </option>
        <option value="20m">
          20m
        </option>
        <option value="30m">
          30m
        </option>
        <option value="1hr">
          1hr
        </option>
        <option value="2hr">
          2hr
        </option>
      </select>
      <button id="submitRoute" value="Submit route to app" type="button" @click="submitRoute()">
        submit route
      </button>
      <button id="drawKnownRoutes" type="button" value="Draw Known Routes" @click="drawRoutes()">
        draw known
        routes
      </button>
    </div>

    <div id="map" style="height: 94%; position: inherit !important" />
    <div id="warnings-panel" />
    <div id="infoPanel" style="display:none">
      <div id="rowDiv" style="display: flex;">
        <div id="outboundInfo" style="flex:50%; border-right: solid; padding-right:5px;">
          <p style="font-weight: bold;">
            <span id="fromLocationInfo" />
          </p>
          <p style="font-weight: bold;">
            -> <span id="toLocationInfo" />
          </p>
          <p><span id="everyLabel">Every ~</span><span id="frequencyInfo" /></p>
          <p><span id="startTimeLabel">First:</span> <span id="startTime" /> <span id="endTimeLabel">Last: </span> <span
              id="endTime" /> </p>
        </div>
        <div id="returnInfo" style="flex:50%; border-left: solid; padding-left: 5px;">
          <p style="font-weight: bold;">
            <span id="fromLocationInfoReturn" />
          </p>
          <p style="font-weight: bold;">
            -><span id="toLocationInfoReturn" />
          </p>
          <p><span id="everyLabelReturn">Every ~</span><span id="frequencyInfoReturn" /></p>
          <p>
            <span id="startTimeLabelReturn">First:</span><span id="startTimeReturn" />
            <span id="endTimeLabelRet">Last: </span><span id="endTimeReturn" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { Loader } from 'google-maps'
import { Loader } from '@googlemaps/js-api-loader';
import { Geolocation } from '@capacitor/geolocation'
import { BackgroundTask } from '@robingenz/capacitor-background-task';
import { App } from '@capacitor/app';


export default {
  name: 'Home',
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
      directionsRendererLocal: '',
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
      standardRouteOpacity: 0.5,
      trackingPoints: [],
      debugIterator: 0,
      // editingReturn: false,
      myIp: 'https://www.rutascolectivos.info',
      windowHtml: null,
      google: null,
      maps: null,
      pollingForLocation: null,
      following: false
    }
  },
  async mounted() {
    if (process.env.NODE_ENV === 'development') {
      this.myIp = 'http://localhost:8000'
    }
    const options = {}
    // const loader = new Loader('AIzaSyBexCyJAH6Wnlu35vWiN3d1DtB9_RNBlC0', {
    // })
    const loader = new Loader({
      apiKey: "AIzaSyBexCyJAH6Wnlu35vWiN3d1DtB9_RNBlC0",
      version: "weekly",
      libraries: ["places"]
    });

    App.addListener('appStateChange', async ({ isActive }) => {
      if (isActive) {
        return
      }
      // now app is not active
      if (this.following) {
        console.log(this.following)
        this.startBackgroundTask()
      }
    });

    this.windowHtml = document.getElementById('infoPanel').cloneNode(true)
    this.google = await loader.load()
    this.initMap()
  },
  methods: {
    async startBackgroundTask() {
      console.log('start background task ->')
      console.log(this.following)
      this.taskId = await BackgroundTask.beforeExit(async () => {
        // BackgroundTask.finish({ taskId });
        var toplus = 0
        this.pollingForLocation = setTimeout(async () => {
          const position = await Geolocation.getCurrentPosition()
          const pos = {
            lat: position.coords.latitude + toplus,
            lng: position.coords.longitude + toplus
          }
          placeNewMarker(pos)
          toplus++
          console.log(pos)
        }, 5000)

      });
      console.log(taskId)
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
      console.log(this.mapLocal)
      this.google.maps.event.addListener(this.mapLocal, 'click', (event) => {
        this.placeNewMarker(event.latLng)
      })


      // this.trackingPoints = []
      // this.pushMyLocation()
      // this.locationInterval = setInterval(() => {
      //   this.pushMyLocation()
      // }, 5000)
    },
    stopFollowing(save) {
      this.following = false;


      // clearInterval(this.locationInterval)
    },
    saveGPSFollow(){
      // fetch(this.myIp + '/saveGPS', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(routeJson) // here this is how you send your datas
      // })
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

    setLocationName(locName, isEnd) {
      var phaseint = document.getElementById('routeInputPhase').value
      console.log(phaseint)

      if (!isEnd) {
        // startlocation
        console.log(locName)
        document.getElementById('fromLocationInputTop').value = locName
      } else {
        // endlocation
        document.getElementById('toLocationInputTop').value = locName
      }
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

    setInstructionText(number) {
      var spanish = document.getElementById('languageSelect').selectedIndex === 0

      var instructionText = document.getElementById('userInstructionText')
      var goBackButton = document.getElementById('goBackButton')
      var recalculateButton = document.getElementById('recalculateButton')
      var confirmButton = document.getElementById('confirmButtonTop')

      recalculateButton.style.display = 'none'
      if (number === 0) {
        instructionText.textContent = spanish ? 'Haga clic en el mapa para establecer la ubicación de inicio y luego presione confirmar' : 'Click the map to select start location and then press confirm'
        goBackButton.style.display = 'none'
      }
      if (number === 1) {
        instructionText.textContent = spanish ? 'Haga clic para establecer la ubicación final y luego presione confirmar' : 'Click to set end location and then press confirm'
        goBackButton.style.display = 'block'
      }
      if (number === 2) {
        instructionText.textContent = spanish ? 'Calculando ruta...' : 'Calculating route...'
        goBackButton.style.display = 'none'
        confirmButton.style.display = 'none'
        this.findDirections()
      }
      if (number === 3) {
        instructionText.textContent = spanish ? 'Arrastra los marcadores de inicio/fin o la línea azul para que coincida con la ruta... luego haga clic en confirmar.' : 'Drag the start/end markers or the blue line to match it to the route... then click confirm.'
        confirmButton.style.display = 'block'
        recalculateButton.style.display = 'block'
        goBackButton.style.display = 'none'
      }
      if (number === 4) {
        instructionText.textContent = spanish ? 'Por favor complete la siguiente información para el servicio' : 'Please fill out the following information for the service'
        document.getElementById('routeEditDiv').style.display = 'block'
        document.getElementById('editInstructionText').style.display = 'none'
        this.enableEditTop()
      }
      if (number === 5) {
        // sub
        var newId = this.uuidv4()
        var curr = this.submitEditsTop(false, newId, false)

        var line = this.drawLine(curr)
        line.id = curr._id
        line.route = curr
        line.route.findMeId = newId
        this.currentHighlightedRoute = line
        instructionText.textContent = spanish ? 'Complete la información de la ruta de regreso y edite la ruta de regreso en el mapa' : 'Please fill out the return information, and edit the return route on the map'
        document.getElementById('returnInfoTop').style.display = 'block'
        this.enableAddReturnRoute()
      }
      if (number === 6) {
        var current = this.submitEditsTop(false, this.currentHighlightedRoute.route.findMeId, true)

        instructionText.textContent = 'Thank you!'

        this.drawLineFromPoints(current.returnPoints, current, true)
        document.getElementById('routeEditDiv').style.display = 'none'
        document.getElementById('confirmButtonTop').style.display = 'none'

        document.getElementById('addAnotherRoute').style.display = 'block'
        this.directionsRendererLocal.setMap(null)
        number++
        // line.route = current
        // currentHighlightedRoute = line;
      }
    },

    enableAddReturnRoute() {
      this.editingDirections = 'return'
      this.editRoutePoints(false)
      this.greenMarker.setMap(this.mapLocal)
      this.redMarker.setMap(this.mapLocal)
      var rml = this.redMarker.getPosition()
      var gml = this.greenMarker.getPosition()
      this.redMarker.setPosition(gml)
      this.greenMarker.setPosition(rml)
      // setInstructionText(6)
      if (this.currentHighlightedRoute) {
        this.currentHighlightedRoute.setOptions({ zIndex: 0, strokeWeight: 5, strokeOpacity: this.standardRouteOpacity })
      }
      if (this.currentHighlightedReturn) {
        this.currentHighlightedReturn.setOptions({ zIndex: 0, strokeWeight: 5, strokeOpacity: 0.3 })
      }
      // findDirections(true)
      document.getElementById('returnrouteEditDiv').style.display = 'block'

      this.setEditInstructionText(0)
    },

    setSelectedIndex(selector, valueToSet) {
      for (var i = 0; i < selector.options.length; i++) {
        if (selector.options[i].value === valueToSet) {
          selector.options[i].selected = true
          return
        }
      }
      return false
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

    showEditbuttons(show) {
      var elemns = []
      var ids =
        ['enableRouteEditsButtonTop',
          'addReturnButtonTop',
          'submitEditsButtonTop',
          'deleteRouteButtonTop']
      ids.forEach(id => {
        elemns.push(document.getElementById(id))
      })

      if (show === true) {
        for (let item of elemns) {
          item.style.display = 'block'
        }
      } else {
        for (let item of elemns) {
          item.style.display = 'none'
        }
      }
    },

    modeChange(div) {
      this.setMapOnAll(null)
      this.clearAllLines()
      document.getElementById('reallyDeleteRouteButtonTop').style.display = 'none'
      document.getElementById('cancelDeleteButton').style.display = 'none'

      if (document.getElementById('editRoutePointsButton') == null) {
        this.createInfoIfNotExist()
      }
      // clearAllLines();

      var editButton, editPointsButton

      // view
      if (div.selectedIndex === 0) {
        this.drawRoutes()

        editButton = document.getElementById('editButton')
        if (editButton != null) {
          editButton.style.display = 'none'
        }

        editPointsButton = document.getElementById('editRoutePointsButton')
        if (editPointsButton != null) {
          editPointsButton.style.display = 'none'
        }
        document.getElementById('routeCreateDiv').style.display = 'none'
        document.getElementById('routeEditDiv').style.display = 'none'
        document.getElementById('routeViewDiv').style.display = 'block'
        this.mode = 0
        this.currentEditId = null
        this.showEditbuttons(false)
      } else if (div.selectedIndex === 1) {
        this.drawRoutes()
        document.getElementById('routeViewDiv').style.display = 'none'

        document.getElementById('routeCreateDiv').style.display = 'block'
        document.getElementById('routeEditDiv').style.display = 'none'
        this.clearAllLines()
        this.mode = 1
        this.currentEditId = null
        this.showEditbuttons(false)
      } else if (div.selectedIndex === 2) {
        this.drawRoutes()

        editButton = document.getElementById('editButton')
        if (editButton != null) {
          editButton.style.display = 'block'
        }

        editPointsButton = document.getElementById('editRoutePointsButton')
        if (editPointsButton != null) {
          editPointsButton.style.display = 'block'
        }
        document.getElementById('routeEditDiv').style.display = 'block'
        document.getElementById('routeViewDiv').style.display = 'none'
        document.getElementById('routeCreateDiv').style.display = 'none'

        this.mode = 2
        this.showEditbuttons(true)
      }
    },

    clearAllLines() {
      if (this.polylines) {
        // console.log(this.polylines)
        this.polylines.forEach(x => x.setMap(null))
      }
    },

    enableEditTop() {
      var startLocationInput = document.getElementById('fromLocationInputTop')
      var toLocationInput = document.getElementById('toLocationInputTop')
      var frequencySelectorInput = document.getElementById('frequencySelectorInfoInputTop')

      if (this.mode === 2) {
        startLocationInput.value = document.getElementById('fromLocationInfoTop').textContent
        toLocationInput.value = document.getElementById('toLocationInfoTop').textContent
      }
      startLocationInput.style.display = 'block'
      toLocationInput.style.display = 'block'
      frequencySelectorInput.style.display = 'block'

      if (this.setSelectedIndex(frequencySelectorInput, document.getElementById('frequencyInfoTop').textContent) === false) {
        // frequencySelectorInput.selectedIndex = 0
      }
      var startTimeInput = document.getElementById('startTimeInputTop')
      if (document.getElementById('startTimeTop').textContent != null) {
        startTimeInput.value = document.getElementById('startTimeTop').textContent
      } else {
        startTimeInput.value = null
      }
      startTimeInput.style.display = 'block'

      var endTimeInput = document.getElementById('endTimeInputTop')
      if (document.getElementById('endTimeTop').textContent != null) {
        endTimeInput.value = document.getElementById('endTimeTop').textContent
      } else {
        endTimeInput.value = null
      }
      endTimeInput.style.display = 'block'
      console.log(this.currentHighlightedRoute)
      if (this.currentHighlightedRoute && this.currentHighlightedRoute.route && this.currentHighlightedRoute.route.returnPoints) {
        document.getElementById('returnrouteEditDiv').style.display = 'block'
      } else {
        document.getElementById('returnrouteEditDiv').style.display = 'none'
      }
      document.getElementById('fromLocationInfoTop').style.display = 'none'
      document.getElementById('toLocationInfoTop').style.display = 'none'
      document.getElementById('frequencyInfoTop').style.display = 'none'
      document.getElementById('startTimeTop').style.display = 'none'
      document.getElementById('endTimeTop').style.display = 'none'
      document.getElementById('routeInformationDiv').style.display = 'block'
    },

    findDirections(isReturnRoute) {
      console.log('findDirections', this.currentHighlightedRoute)
      console.log('currentHightlightedReturn', this.currentHighlightedReturn)

      const directionsRenderer = new this.google.maps.DirectionsRenderer({ map: this.mapLocal, draggable: true, suppressMarkers: true, polylineOptions: { zIndex: 10, strokeColor: '#0000FF', strokeWeight: 10, strokeOpacity: 0.7 } })

      const directionsService = new this.google.maps.DirectionsService()
      this.directionsRendererLocal = directionsRenderer
      // directionsRenderer.setMap()

      if (isReturnRoute) {
        this.editingDirections = 'return'
      } else {
        this.editingDirections = 'out'
      }

      this.google.maps.event.addListener(directionsRenderer,
        'directions_changed',
        () => {
          // directionsRendererLocal.setMap(null)
          // directionsRendererLocal.setMap(mapLocal)
          var directions = directionsRenderer.getDirections()
          if (this.mode === 1) {
            // adding route
            if (document.getElementById('routeInputPhase').value < 4) {
              document.getElementById('routeInputPhase').value = '3'
              this.setInstructionText(document.getElementById('routeInputPhase').value)
            }
          } else if (this.mode === 2) {
            // editing route
            // confirmedStartLocation directions.getPath()
            // const newLat = (this.greenMarker.position.lat + this.redMarker.position.lat) / 2
            // var newLng = (this.greenMarker.position.lng + this.redMarker.position.lng) / 2
          }
          this.onDirectionsChange(directions, this.editingDirections === 'return')
        }
      )

      const stepDisplay = new this.google.maps.InfoWindow()
      this.calculateAndDisplayRoute(
        directionsRenderer,
        directionsService,
        this.markers,
        stepDisplay,
        this.mapLocal
      )
    },

    drawRoutes() {
      console.log(this.myIp)
      fetch(this.myIp + '/getRoutes', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'encoding': 'utf-8', 'Access-Control-Allow-Origin': '*' }
      }).then(response => response.json()).then(x => {
        this.drawPolylines(x)
      })
    },

    submitEditsTop(refresh, followOnId, submittingReturn) {
      var startName = document.getElementById('fromLocationInputTop').value
      var endName = document.getElementById('toLocationInputTop').value
      var freq = document.getElementById('frequencySelectorInfoInputTop').value
      var startTime = document.getElementById('startTimeInputTop').value
      var endTime = document.getElementById('endTimeInputTop').value
      var returnstartTime = document.getElementById('startTimeReturnTop').value
      var returnendTime = document.getElementById('endTimeReturnTop').value

      var pointsEdited = this.points.length > 0
      var returnPointsEdited = this.returnPoints.length > 0

      var routeJson = {
        colour: document.getElementById('colourPickerTop').value,
        startTime: startTime,
        endTime: endTime,
        origin: startName,
        destination: endName,
        points: pointsEdited ? this.points : this.currentHighlightedRoute.route.points,
        polyline: pointsEdited ? this.overview_polyline : this.currentHighlightedRoute.route.polyline,
        frequency: freq,
        returnPoints: returnPointsEdited ? this.returnPoints : this.currentHighlightedRoute ? this.currentHighlightedRoute.route.returnPoints : null,
        returnPolyline: returnPointsEdited ? this.return_overview_polyline : this.currentHighlightedRoute ? this.currentHighlightedRoute.route.returnPolyline : null,
        returnStartTime: returnstartTime,
        returnEndTime: returnendTime,
        id: this.currentHighlightedRoute ? this.currentHighlightedRoute.route._id : null,
        newId: followOnId || null,
        findId: submittingReturn === true ? followOnId : null
      }

      var overlaps = this.getOverlappingSegments(routeJson)
      if (overlaps) {
        routeJson.outArrowPercents = overlaps.out
        routeJson.returnArrowPercents = overlaps.return
      }
      console.log(routeJson.findId)

      console.log('submitting edits top')

      fetch(this.myIp + '/saveRoute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(routeJson) // here this is how you send your datas
      })
        .then(response => console.log(response.text)).then(x => {
          if (refresh) {
            this.initMap()
          }
          // else{
          //   // since we don't want to refresh, we just want to populate the id with the one we got from back end
          //   currentEditId = response.text
          //   console.log("yoyoy", response.text)
          // }
        })

      return routeJson
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

    submitRoute() {
      this.routes.push(this.points)
      var originName = document.getElementById('start').value
      var destinationName = document.getElementById('end').value
      var routeJson = {
        colour: document.getElementById('colourPicker').value,
        startTime: this.startTime,
        endTime: this.endTime,
        origin: originName,
        destination: destinationName,
        points: this.points,
        polyline: this.overview_polyline,
        frequency: document.getElementById('frequencySelector').value,
        returnPoints: this.returnPoints,
        returnPolyline: this.return_overview_polyline,
        returnstartTime: this.returnstartTime,
        returnEndTime: this.returnendTime
      }

      console.log('submitting route', routeJson)
      fetch(this.myIp + '/saveRoute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(routeJson) // here this is how you send your datas
      })
        .then(response => console.log(response.text))
    },

    populateInfoTop(route) {
      var from = document.getElementById('fromLocationInfoTop')
      var spanish = document.getElementById('languageSelect').selectedIndex === 0

      if (from) { from.textContent = route.origin }

      document.getElementById('toLocationInfoTop').textContent = route.destination
      document.getElementById('frequencyInfoTop').textContent = route.frequency
      document.getElementById('startTimeTop').textContent = route.startTime
      document.getElementById('endTimeTop').textContent = route.endTime
      document.getElementById('colourPickerTop').value = route.colour
      if (route.returnPoints) {
        document.getElementById('returnInfoTop').style.display = 'block'
        document.getElementById('startTimeReturnTop').value = route.returnStartTime
        document.getElementById('endTimeReturnTop').value = route.returnEndTime
        document.getElementById('addReturnButtonTop').textContent = spanish ? 'Editar ruta de regreso' : 'Edit return route'
      } else {
        document.getElementById('startTimeReturnTop').value = null
        document.getElementById('endTimeReturnTop').value = null
        document.getElementById('addReturnButtonTop').textContent = spanish ? 'Crear ruta de regreso' : 'Add return route'
      }
    },

    populateInfo(route) {
      var from = document.getElementById('fromLocationInfo')
      if (from) { from.textContent = route.origin }
      document.getElementById('toLocationInfo').textContent = route.destination
      document.getElementById('frequencyInfo').textContent = route.frequency
      document.getElementById('startTime').textContent = route.startTime
      document.getElementById('endTime').textContent = route.endTime
      document.getElementById('infoPanel').style.display = 'block'
      if (route.returnPoints) {
        document.getElementById('toLocationInfoReturn').textContent = route.origin
        document.getElementById('fromLocationInfoReturn').textContent = route.destination
        document.getElementById('startTimeReturn').textContent = route.returnStartTime
        document.getElementById('endTimeReturn').textContent = route.returnEndTime
        document.getElementById('frequencyInfoReturn').textContent = route.frequency
        document.getElementById('returnInfo').style.display = 'block'
      } else {
        document.getElementById('returnInfo').style.display = 'none'
      }
    },

    SetEndLocation(loc) {
      document.getElementById('toLat').value = loc.lat()
      document.getElementById('toLng').value = loc.lng()
      this.redMarker.setMap(this.mapLocal)
      this.redMarker.setPosition(loc)
      this.findNameOfLocation(loc, true)
    },

    SetStartLocation(loc) {
      document.getElementById('fromLat').value = loc.lat()
      document.getElementById('fromLng').value = loc.lng()
      this.greenMarker.setMap(this.mapLocal)
      this.greenMarker.setPosition(loc)
      var startLocation = document.getElementById('fromLocationInputTop')

      startLocation.value = this.findNameOfLocation(loc, false)
    },

    initialize() {
      var userLang = navigator.language || navigator.userLanguage
      console.log('The language is: ' + userLang)
      if (userLang.includes('en-')) {
        document.getElementById('languageSelect').selectedIndex = 1
        this.languageChange({ selectedIndex: 1 })
      } else {
        document.getElementById('languageSelect').selectedIndex = 0
        this.languageChange({ selectedIndex: 0 })
      }
      console.log(this.maps)
      console.log(this.google)
      console.log("hello yes we got initialised")
      var myLatlng = new this.google.maps.LatLng(16.733911888003078, -92.64308697053372)

      let color = 'green'
      let url = 'https://maps.google.com/mapfiles/ms/icons/'
      url += color + '-dot.png'

      this.greenMarker = new this.google.maps.Marker({
        draggable: true,
        position: myLatlng,
        map: null,
        title: 'Your location',
        icon: {
          url: url
        },
        label: 'start'
      })

      color = 'red'
      url = 'https://maps.google.com/mapfiles/ms/icons/'
      url += color + '-dot.png'

      this.redMarker = new this.google.maps.Marker({
        draggable: true,
        position: myLatlng,
        map: null,
        title: 'Your location',
        icon: {
          url: url
        },
        label: 'destination'
      })

      this.google.maps.event.addListener(this.greenMarker, 'dragend', (event) => {
        this.SetStartLocation(event.latLng)
        if (document.getElementById('routeInputPhase').value >= 2 || this.mode === 2) {
          this.recalculateRoute()
        }
      })

      this.google.maps.event.addListener(this.redMarker, 'dragend', (event) => {
        this.SetEndLocation(event.latLng)
        this.recalculateRoute()
      })
      console.log(this.mapLocal)
      this.google.maps.event.addListener(this.mapLocal, 'click', (event) => {
        if (this.mode === 1) {
          var phase = document.getElementById('routeInputPhase').value

          if (phase === 0) {
            this.SetStartLocation(event.latLng)
          } else if (phase === 1) {
            this.SetEndLocation(event.latLng)
          }
        }
      })

      this.logUserVisit()
    },

    logUserVisit() {

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
      console.log(routes.length, 'routes')
      routes.forEach(route => {
        var line = this.drawLine(route)
        var returnLine = this.drawLineFromPoints(route.returnPoints, route, true)

        this.setClickEvent(line, route, returnLine)
        this.setClickEvent(returnLine, route, line)
      })
    },

    createInfoIfNotExist() {
      var infoHtml = document.getElementById('infoPanel')
      if (infoHtml == null) {
        infoHtml = this.windowHtml.cloneNode(true)
        infoHtml.style.display = 'none'
        this.infoPanelLocal = document.body.appendChild(infoHtml)
      }
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

    placeNewMarker(loc) {
      var url = 'http://maps.google.com/mapfiles/ms/icons/'
      url += 'blue' + '-dot.png'

      var blueMarker = new this.google.maps.Marker({
        draggable: true,
        position: loc,
        map: this.mapLocal,
        title: 'Your location',
        icon: {
          url: url
        }
      })
      console.log(blueMarker)
    },

    generateIcons(route, isReturn) {
      var finPercents = []

      // var numWanted = 20

      // var spacing = Math.floor(100 / numWanted)

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
          // endsection
          sections.push(currentSection)
          // console.log("ends", currentSection)
          currentSection = []
        }
      }
      sections.push(currentSection)
      if (outArrowPercents.length > 0) {
        console.log(sections)
        for (let i = 0; i < sections.length; i++) {
          var midIndex = Math.floor(sections[i].length / 2)
          var midSection = sections[i][midIndex]
          finPercents.push(midSection)
        }
      }
      // console.log("generateIcons")

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

      // for (var i = 0; i < numWanted; i++) {
      //   var actuallyDoIt = false;
      //   if (!isReturn) {
      //     if (route.outArrowPercents && route.outArrowPercents.includes(spacing * i)) {
      //       actuallyDoIt = true;
      //     }
      //   }
      //   else {
      //     if (route.returnArrowPercents && route.returnArrowPercents.includes(spacing * i)) {
      //       actuallyDoIt = true;
      //     }
      //   }

      //   if (actuallyDoIt) {
      //     var str = (isReturn ? 100 - spacing * i : spacing * i) + "%"
      //     icons.push(
      //       {
      //         icon: symbolOne,
      //         offset: str
      //       }
      //     )
      //   }
      // }

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
      // console.log(this.google)
      // console.log(this.maps)

      this.polylines.push(routePath)
      console.log(routePath)
      routePath.setMap(this.mapLocal)
      routePath.id = route._id
      return routePath
    },

    setClickEvent(routePath, route, returnRoutepath) {
      this.google.maps.event.addListener(routePath, 'click', (click) => {
        var boxText = document.createElement('div')
        this.createInfoIfNotExist()
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
        document.getElementById('returnInfo').style.borderLeftColor = route.colour
        document.getElementById('outboundInfo').style.borderRightColor = route.colour

        this.currentEditId = routePath.id
        if (this.mode === 0) {
          this.populateInfo(route)
          boxText.appendChild(infoHtml)
          var myOptions = {
            content: boxText,
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
        } else if (this.mode === 2) {
          this.setEditInstructionText(1)
          this.populateInfoTop(route)
          this.enableEditTop()
          // editRoutePoints()
        }
        this.populateInfoTop(route)

        this.getOverlappingSegments(route)
      })
    },

    async pushMyLocation() {
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
      // modeChange()
      // Instantiate a directions service.

      // Create a map and center it on Manhattan.
      this.maps = new this.google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: { lat: 16.715, lng: -92.63143780343951 },
        clickableIcons: false,
        streetViewControl: false
      })
      this.mapLocal = this.maps

      this.drawRoutes()
      this.initialize()

      this.modeChange(document.getElementById('modeSelect'))
      this.initialized = true
    },

    onDirectionsChange(newDirections, isReturnRoute) {
      var newPoints = []
      newDirections.routes[0].overview_path.forEach(point => {
        newPoints.push([point.lat(), point.lng()])
      })

      if (isReturnRoute === true) {
        this.returnPoints = newPoints
        this.return_overview_polyline = newDirections.routes[0].overview_polyline
      } else {
        this.points = newPoints
        this.overview_polyline = newDirections.routes[0].overview_polyline
      }
      // this.polylines.push(newDirections.routes[0].overview_polyline)
    },

    calculateAndDisplayRoute(
      directionsRenderer,
      directionsService,
      markerArray,
      stepDisplay,
      map
    ) {
      // First, remove any existing markers from the map.
      for (let i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null)
      }
      // directionsRenderer.set('directions', null);
      // Retrieve the start and end locations and create a DirectionsRequest using
      // WALKING directions.
      // var shouldWeUseMarkers = document.getElementById('routeInputPhase').value == 2

      directionsService
        .route({
          origin: this.greenMarker.position,
          destination: this.redMarker.position,
          travelMode: this.maps.TravelMode.DRIVING
        })
        .then((result) => {
          // Route the directions and pass the response to a to create
          // markers for each step.
          document.getElementById('warnings-panel').innerHTML =
            '<b>' + result.routes[0].warnings + '</b>'

          directionsRenderer.setMap(null)
          directionsRenderer.setMap(this.mapLocal)
          if (this.directionsRendered != null) {
            this.directionsRendered.setMap(null)
          }
          directionsRenderer.setDirections(result)
          this.directionsRendered = directionsRenderer
          // points = result.routes[0].points
          this.onDirectionsChange(result, this.editingDirections === 'return')
          this.showSteps(result, markerArray, stepDisplay, map)
        })
        .catch((e) => {
          window.alert('Directions request failed due to ' + e)
        })
    },

    languageChange(element) {
      // var languageIndex = element.selectedIndex
      // var spanish = languageIndex === 0
      // var phaseInt = document.getElementById('routeInputPhase').value
      // this.setInstructionText(phaseInt)
      // if (this.greenMarker) {
      //   this.greenMarker.setLabel(spanish ? 'Inicio de Ruta' : 'Route Start')
      // }
      // if (this.redMarker) {
      //   this.redMarker.setLabel(spanish ? 'Fin de Ruta' : 'Route End')
      // }

      // if (languageIndex === 0) {
      //   // spanish
      //   document.getElementById('editInstructionText').textContent = 'Haga clic en una ruta para editarla'
      //   document.getElementById('frequencySelectorLabel').textContent = 'Frequencia - Cada ~'
      //   document.getElementById('goToLocationButtonImage').alt = 'Buscar'
      //   document.getElementById('showMyLocation').textContent = 'Mostrar Mi Ubicación'
      //   document.getElementById('followMeButton').textContent = 'Sígueme'
      //   document.getElementById('stopFollowingButton').textContent = 'Deja de seguirme'
      //   document.getElementById('goBackButton').textContent = 'Regresa'
      //   document.getElementById('recalculateButton').textContent = 'Recalcular Ruta'
      //   document.getElementById('fromLocationLabel').textContent = 'Inicio: '
      //   document.getElementById('toLocationLabel').textContent = 'Fin: '
      //   document.getElementById('startTimeLabelTop').textContent = 'Comienza: '
      //   document.getElementById('endTimeLabelTop').textContent = 'Termina: '
      //   document.getElementById('enableRouteEditsButtonTop').textContent = 'Editar Ruta'
      //   document.getElementById('addReturnButtonTop').textContent = 'Crear ruta de regreso'
      //   document.getElementById('startTimeEditLabel').textContent = 'Comienza: '
      //   document.getElementById('endTimeEditLabel').textContent = 'Termina: '
      //   document.getElementById('submitEditsButtonTop').textContent = 'Confirmar Cambios'
      //   document.getElementById('deleteRouteButtonTop').textContent = 'Borrar Ruta'
      //   document.getElementById('reallyDeleteRouteButtonTop').textContent = 'Realmente Borrar Ruta'
      //   document.getElementById('cancelDeleteButton').textContent = 'Cancelar Borrar'
      //   document.getElementById('everyLabel').textContent = 'Cada: '
      //   document.getElementById('everyLabelReturn').textContent = 'Cada: '
      //   document.getElementById('startTimeLabel').textContent = 'Comienza: '
      //   document.getElementById('startTimeLabelReturn').textContent = 'Comienza: '
      //   document.getElementById('endTimeLabel').textContent = 'Termina: '
      //   document.getElementById('endTimeLabelRet').textContent = 'Termina: '
      //   document.getElementById('confirmButtonTop').textContent = 'Confirmar'

      //   const options = Array.from(document.getElementById('modeSelect').options)
      //   options.forEach(element => {
      //     if (element.value == 0) {
      //       element.textContent = 'Ver'
      //     } else if (element.value == 1) {
      //       element.textContent = 'Crear'
      //     } else if (element.value == 2) {
      //       element.textContent = 'Editar'
      //     }
      //   })
      // } else if (languageIndex === 1) {
      //   // english
      //   document.getElementById('editInstructionText').textContent = 'Click on a route to edit'

      //   document.getElementById('frequencySelectorLabel').textContent = 'Frequency - Every ~'
      //   document.getElementById('goToLocationButtonImage').alt = 'Search'
      //   document.getElementById('showMyLocation').textContent = 'Show My Location'
      //   document.getElementById('followMeButton').textContent = 'Follow Me'
      //   document.getElementById('stopFollowingButton').textContent = 'Stop Following'
      //   document.getElementById('goBackButton').textContent = 'Go Back'
      //   document.getElementById('recalculateButton').textContent = 'Recalculate Route'
      //   document.getElementById('fromLocationLabel').textContent = 'From: '
      //   document.getElementById('toLocationLabel').textContent = 'To: '
      //   document.getElementById('startTimeLabelTop').textContent = 'First: '
      //   document.getElementById('endTimeLabelTop').textContent = 'Last: '
      //   document.getElementById('enableRouteEditsButtonTop').textContent = 'Edit Route'
      //   document.getElementById('addReturnButtonTop').textContent = 'Add Return Route'
      //   document.getElementById('startTimeEditLabel').textContent = 'First: '
      //   document.getElementById('endTimeEditLabel').textContent = 'Last: '
      //   document.getElementById('submitEditsButtonTop').textContent = 'Submit Edits'
      //   document.getElementById('deleteRouteButtonTop').textContent = 'Delete Route'
      //   document.getElementById('reallyDeleteRouteButtonTop').textContent = 'Really Delete Route'
      //   document.getElementById('cancelDeleteButton').textContent = 'Cancel Delete'
      //   document.getElementById('everyLabel').textContent = 'Every: '
      //   document.getElementById('everyLabelReturn').textContent = 'Every: '
      //   document.getElementById('startTimeLabel').textContent = 'First: '
      //   document.getElementById('startTimeLabelReturn').textContent = 'First: '
      //   document.getElementById('endTimeLabel').textContent = 'Last: '
      //   document.getElementById('endTimeLabelRet').textContent = 'Last: '
      //   // confirmButtonTop
      //   document.getElementById('confirmButtonTop').textContent = 'Confirm'

      //   let options = Array.from(document.getElementById('modeSelect').options)
      //   options.forEach(element => {
      //     if (element.value == 0) {
      //       element.textContent = 'View'
      //     } else if (element.value == 1) {
      //       element.textContent = 'Create'
      //     } else if (element.value == 2) {
      //       element.textContent = 'Edit'
      //     }
      //   })
      // } else {
      //   console.log('something went wrong')
      // }
    },

    showSteps(directionResult, markerArray, stepDisplay, map) {
      // For each step, place a marker, and add the text to the marker's infowindow.
      // Also attach the marker to an array so we can keep track of it and remove it
      // when calculating new routes.
      // const myRoute = directionResult.routes[0].legs[0];

      // for (let i = 0; i < myRoute.steps.length; i++) {
      //   const marker = (markerArray[i] =
      //     markerArray[i] || this.maps.Marker());

      //   //marker.setMap(map);
      //   //marker.setPosition(myRoute.steps[i].start_location);
      // }
    }
  }
}
</script>

<style>
#map {
  height: 100px;
  position: inherit !important;
}
</style>
