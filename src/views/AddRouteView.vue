<template>
  <div ref="contents" class="normalCursor">
    <span>{{ $t(mode) }}</span>
  <button type="button" v-show="this.mode == 'editRoute'" class="functionalButton"
    @click="cancel()">
    {{ $t('cancel') }}
  </button>
  <div>
    <div ref="outboundDirections">
      <span>{{ $t('outbound_points') + ': ' + this.pointsOutbound?.length }}</span>
      <button class="functionalButton" @click="addOutboundPoints()" v-show="this.pointsOutbound == null">{{ $t('add')
      }}</button>
      <button class="functionalButton" @click="editOutboundPoints()" v-show="this.pointsOutbound != null">{{ $t('edit')
      }}</button><br>
    </div>
    <div ref="returnDirections">
      <span>{{ $t('return_points') + ': ' + this.pointsReturn?.length }} </span>
      <button @click="addReturnPoints()" v-show="this.pointsOutbound != null && this.pointsReturn == null"
        class="functionalButton">{{ $t('add') }}</button>
      <br>
      <button @click="editReturnPoints()" v-show="this.pointsReturn != null" class="functionalButton">{{ $t('edit')
      }}</button>
      <br>
    </div>


    <div id="directionsController" v-show="this.showDirectionsController" ref="directionsController">
      <span id="instructionText">{{ $t(instructionText) }}</span>
      <br>
      <button type="button" class="functionalButton" @click="addStart()">
        {{ $t('add_start') }}
      </button>
      <span @click="this.$emit('goToLocation', this.startDirections)">{{ startDirections }}</span>
      <br>
      <button type="button" class="functionalButton" @click="addWaypoint()">
        {{ $t('add_waypoint') }}
      </button>
      <br>
      <li v-for="(waypoint, i) in this.intermediatePoints" @click="this.$emit('goToLocation', waypoint)">{{ waypoint }}
        <button @click="this.$store.commit('removeWaypointAtIndex', i)">X</button>
      </li>
      <button type="button" class="functionalButton" @click="addEnd()">
        {{ $t('add_end') }}
      </button>
      <span @click="this.$emit('goToLocation', this.endDirections)">{{ endDirections }}</span>
      <br>
      <button type="button" class="functionalButton" @click="findDirections()">
        {{ $t('get_directions') }}
      </button>
      <span>{{ routePoints?.length }}</span>
    </div>
    <div id="returnDirections">
      <button type="button" class="functionalButton" v-show="this.showAddReturn">{{
          $t('add_return')
      }}</button>
    </div>

  </div>
  <div id="routeCreateInfo" v-show="this.showDetails">
    <b>{{ $t('start_location') }}</b>
    <input id="start" v-model="startLocation"><br />
    <b>{{ $t('end_location') }}</b>
    <input id="end" v-model="endLocation"><br />
    <b> {{ $t('colour') }}</b>
    <input id="colourPicker" type="color" v-model="color"><br />
    <b>{{ $t('every') }}</b>
    <input id="frequencySelectorInput" name="frequency" v-model="frequency"> m <br />
    <b>{{ $t('price') }}</b>
    <input v-model="price"> pesos <br />
    <b>{{ $t('start_time') }}<input type="time" v-model="startTime"></b> <br />
    <b>{{ $t('end_time') }} <input type="time" v-model="endTime"> </b><br />
  </div>
  <button @click="this.showDetails = !this.showDetails" class="functionalButton"> ^ </button>
  <button id="submitRoute" @click="submitRoute()" class="functionalButton"> {{ $t('save') }}</button>
  <div id="deleteyStuff" class="floatRight" v-show="this.mode == 'editRoute'">
    <button @click="this.showDeleteRoute = true" v-show="this.showDeleteRoute == false" class="functionalButton">{{ $t('delete_route') }}</button>
  <button @click="deleteRoute()" v-show="this.showDeleteRoute" class="functionalButton">{{ $t('confirm_delete_route') }}</button>
  <button @click="this.showDeleteRoute = false" v-show="this.showDeleteRoute" class="functionalButton">{{ $t('cancel') }}</button>

  </div>
  </div>
  
  
</template>

<script>
import i18next from 'i18next'
import axios from 'axios'
import { toRaw } from 'vue';
export default {
  name: "InformationView",
  emits: ["clickmode", "directions", "saveDirections", "goToLocation", "removeWaypointAtIndex", "initDirections"],
  data() {
    return {
      // route info
      startTime: null,
      endTime: null,
      startLocation: null,
      endLocation: null,
      price: null,
      color: "#FFFFFF",
      frequency: null,
      pointsOutbound: null,
      pointsReturn: null,
      guid: null,
      id: null,
      // display info
      showDetails: false,
      clickmode: "normal", // options : normal, addStart, addEnd, addWaypoint,
      instructionText: null,
      showAddReturn: false,
      mode: "addRoute", // addRoute editRoute
      showDirectionsController: false,
      showSaveSuccess: true,
      showDeleteRoute: false
    }
  },
  methods: {
    submitRoute() {
      console.log("submitting route")
      let routePointsToSave = this.routePoints?.map(x => [x.lat(), x.lng()]) ?? this.pointsOutbound
      let waypointsToSave = this.$store.state.waypoints?.map(x => toRaw(x).position)
      let serverUrl = this.$store.state.serverUrl;

        if (this.guid == null) {
          this.guid = this.$store.getters.createGuid
        }
        let routeForSave = {
          colour: this.color,
          startTime: this.startTime,
          endTime: this.endTime,
          origin: this.startLocation,
          destination: this.endLocation,
          points: routePointsToSave,
          polyline: this.overview_polyline,
          frequency: this.frequency,
          returnPoints: this.pointsReturn,
          returnPolyline: this.return_overview_polyline,
          returnstartTime: this.returnstartTime,
          returnEndTime: this.returnendTime,
          newId: this.guid,
          id: this.id
        }
        axios.post(serverUrl + "/saveRoute", routeForSave).then(x => {
          if (x.status == 200) {
            console.log(x)
            this.setInstructionText("save_successful")
            window.location.reload()
          }
          else{
            this.setInstructionText("error")
          }
        }
        )
      },
    removeMarkers() {
      this.$emit("clear")
    },
    findDirections() {
      this.clickMode = "normal"
      this.setInstructionText(null)
      this.$emit("clickmode", "normal")
      this.$emit("directions")

    },
    addStart() {
      this.clickMode = "addStart"
      this.setInstructionText('add_start')
      this.$emit("clickmode", "addStart")
    },
    addEnd() {
      this.clickmode = "addEnd"
      this.setInstructionText('add_end')
      this.$emit("clickmode", "addEnd")

    },
    addWaypoint() {
      this.clickmode = "addWaypoint"
      this.setInstructionText('add_waypoint')
      this.$emit("clickmode", "addWaypoint")
    },
    setInstructionText(newText) {
      // put the translation label like add_start_instructions
      this.instructionText = newText;
    },
    cancel() {
      this.mode = "addRoute",
        this.startTime = null
      this.endTime = null
      this.startLocation = null
      this.endLocation = null
      this.price = null
      this.color = null
      this.frequency = null
      this.pointsOutbound = null
      this.pointsReturn = null
      this.id = null
      this.guid = null
    },
    populateInfo(info) {
      console.log(toRaw(info))
      let r = toRaw(info)

      this.startTime = r.startTime
      this.endTime = r.endTime
      this.startLocation = r.origin
      this.endLocation = r.destination
      this.price = r.price
      this.color = r.colour
      this.frequency = r.frequency
      this.pointsOutbound = r.points
      this.pointsReturn = r.returnPoints
      this.mode = "editRoute"
      this.showDetails = true
      this.id = r._id
      this.showDirectionsController = false;
      console.log(this.id)
    },
    addOutboundPoints() {
      this.showDirectionsController = true
      this.$refs.outboundDirections.appendChild(this.$refs.directionsController)
      this.$emit("initDirections")
    },
    editOutboundPoints() {
      this.showDirectionsController = true
      this.$refs.outboundDirections.appendChild(this.$refs.directionsController)
      this.$emit("initDirections", { start: this.pointsOutbound[0], end: this.pointsOutbound[this.pointsOutbound.length - 1]})
    },
    addReturnPoints(){
      this.showDirectionsController = true
      this.$refs.returnDirections.appendChild(this.$refs.directionsController)
      this.$emit("initDirections", { start: this.pointsOutbound[this.pointsOutbound.length - 1], end: this.pointsOutbound[0]})
    },
    deleteRoute(){
      console.log(this.id)
      axios.post(this.$store.state.serverUrl + "/deleteRoute", { id: this.id}).then(x => {
        console.log(x)
          if (x.status == 200) {
             console.log("hello")
            this.setInstructionText("delete_successful")
            window.location.reload()
          }
          else{
            this.setInstructionText("error")
          }
        }
        )
    }
  },
  computed: {
    startDirections() {
      console.log("yo", this.$store.state.startLocation)
      return this.$store.state.startLocation;
    },
    endDirections() {
      return this.$store.state.endLocation;
    },
    intermediatePoints() {
      return this.$store.state.waypointLocations;
    },
    routePoints() {
      return this.$store.state.directions?.overview_path;
    },
    routePolyline() {
      return this.$store.state.directions?.overview_polyline;
    }
}
}
</script>

<style>

</style>