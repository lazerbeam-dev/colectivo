<template>
  <div id="routeCreateDiv" v-show="this.showDetails">
      <b>{{ $t('start_location') }}</b>
      <input id="start" v-model="startLocation" ><br/>
      <b>{{ $t('end_location') }}</b>
      <input id="end" v-model="endLocation"><br/>
      <b> {{ $t('colour')}}</b>
      <input id="colourPicker" type="color" v-model="color"><br/>
      <b>{{ $t('every')}}</b>
      <input id="frequencySelectorInput" name="frequency" v-model="frequency"> m <br/>
      <b>{{ $t('price')}}</b>
      <input v-model="price"> pesos <br/>
      <input type="time" v-model="startTime"> {{ $t('start_time') }} <br/>
      <input type="time" v-model="endTime">  {{ $t('end_time') }} <br/>
      <button id="submitRoute" @click="submitRoute()" class="functionalButton" >  {{ $t('save') }}</button>
      
  </div>
  <div>
    <button id="findDirections" type="button" value="Go!" class="functionalButton" @click="findDirections()">
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
            showDetails: true,
            startTime: null,
            endTime: null,
            startLocation: null,
            endLocation: null,
            waypoints: [],

        }
    },
    methods: {
      submitRoute(){
        console.log("submitting route")
      }
    }
}
</script>

<style>

</style>