<template>
    <div id="routeEditDiv">
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
</template>
<script>
export default {
    setup() {
        
    },
    name: "RouteEditView"
}
</script>
