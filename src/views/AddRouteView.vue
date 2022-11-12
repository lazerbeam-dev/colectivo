<template>
  <div id="routeCreateDiv" class>
      <b>{{ $t('start_location') }}</b>
      <input id="start" v-model="startLocation" >
      <b>{{ $t('end_location') }}</b>
      <input id="end" v-model="endLocation"><br/>
      <span> {{ $t('colour')}}</span>
      <input id="colourPicker" type="color"><br/>
      <span>{{ $t('every')}}</span>
      <input id="frequencySelectorInput" name="frequency">m
      <button id="submitRoute" value="Submit route to app" type="button" @click="submitRoute()">
        submit route
      </button>
      <button id="drawKnownRoutes" type="button" value="Draw Known Routes" @click="drawRoutes()">
        draw known
        routes
      </button>
      <button id="findDirections" type="button" class="functionalButton" value="Go!" @click="findDirections()">
        find directions
      </button>
    </div>
</template>

<script>
import i18next from 'i18next'
export default {
    name: "InformationView",
    data: function () {
        return {
            startTime: null,
            endTime: null,
            startLocation: null,
            endLocation: null,
            waypoints: [],

        }
    },
}
</script>

<style>

</style>