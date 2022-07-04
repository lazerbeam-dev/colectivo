<template>
  <div id="infoPanel" style="display:block">
    <div id="rowDiv" style="display: flex;">
      <div ref="outboundInfoBox" id="outboundInfo" style="flex:50%; border-right: solid; padding-right:5px;">
        <p style="font-weight: bold;">
          <span id="fromLocationInfo"> {{ startLocation }}</span>
        </p>
        <p style="font-weight: bold;">
          -> <span id="toLocationInfo"> {{ endLocation }}</span>
        </p>
        <p><span id="everyLabel">Every: </span><span style="font-weight: bold;"> {{ frequency }} </span></p>
        <p><span id="startTimeLabel">First: </span> <span id="startTime" style="font-weight: bold;"> {{ startTime }}</span> <span id="endTimeLabel">Last: </span> <span
            id="endTime" style="font-weight: bold;"> {{ endTime }}</span> </p>
      </div>
      <div ref ="returnInfoBox" id="returnInfo" style="flex:50%; border-left: solid; padding-left: 5px;" v-show="hasReturn">
        <p style="font-weight: bold;">
          <span id="fromLocationInfoReturn"> {{ endLocation }}</span>
        </p>
        <p style="font-weight: bold;">
          -><span id="toLocationInfoReturn"> {{ startLocation }}</span>
        </p>
        <p><span id="everyLabelReturn">Every: </span><span id="frequencyInfoReturn" style="font-weight: bold;">{{ frequency}} </span></p>
        <p>
          <span id="startTimeLabelReturn">First:</span><span id="startTimeReturn" style="font-weight: bold;"> {{ returnStartTime }}</span>
          <span id="endTimeLabelRet"> Last: </span><span id="endTimeReturn" style="font-weight: bold;"> {{returnEndTime }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { TypedChainedSet } from 'webpack-chain';

export default {
  name: "RouteView",
  data(){
    return{
      endLocation: "",
      startLocation: "",
      frequency: "",
      startTime: "",
      endTime: "",
      returnStartTime: "",
      returnEndTime: "",
      hasReturn: false,
      colour: "#FFFFFF"
    }
  },
  //props: ['startLocation', 'endLocation', 'frequency', 'startTime', 'endTime', 'returnStartTime', 'returnEndTime'],
  methods: {
    populateInfo(route) {
      this.endLocation = route.destination;
      this.startLocation = route.origin;
      this.frequency= route.frequency,
      this.startTime= route.startTime,
      this.endTime= route.endTime,
      this.returnStartTime= route.returnStartTime,
      this.returnEndTime = route.returnEndTime,
      this.hasReturn = route.returnPoints != null,
      this.colour = route.colour
      this.$refs.outboundInfoBox.style.borderRightColor = route.colour
      this.$refs.returnInfoBox.style.borderLeftColor = route.colour

      // //document.getElementById('toLocationInfo').textContent = route.destination
      // document.getElementById('frequencyInfo').textContent = route.frequency
      // document.getElementById('startTime').textContent = route.startTime
      // document.getElementById('endTime').textContent = route.endTime
      // document.getElementById('infoPanel').style.display = 'block'
      // if (route.returnPoints) {
      //   document.getElementById('toLocationInfoReturn').textContent = route.origin
      //   document.getElementById('fromLocationInfoReturn').textContent = route.destination
      //   document.getElementById('startTimeReturn').textContent = route.returnStartTime
      //   document.getElementById('endTimeReturn').textContent = route.returnEndTime
      //   document.getElementById('frequencyInfoReturn').textContent = route.frequency
      //   document.getElementById('returnInfo').style.display = 'block'
      // } else {
      //   document.getElementById('returnInfo').style.display = 'none'
      // }
    }
  }
}
</script>