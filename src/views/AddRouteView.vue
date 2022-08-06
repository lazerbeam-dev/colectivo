<template>
  <div id="routeCreateDiv" class>
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
</template>

<script>
export default {

}
</script>

<style>

</style>