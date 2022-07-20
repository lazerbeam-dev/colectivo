<template>
  <div id="infoPanel" v-show="show">
    <div id="rowDiv" style="display: flex;">
      <div ref="outboundInfoBox" id="outboundInfo" style="flex:50%; border-right: solid; padding-right:5px;">
        <p style="font-weight: bold;">
          <span id="fromLocationInfo"> {{ startLocation }}</span>
        </p>
        <p style="font-weight: bold;">
          -> <span id="toLocationInfo"> {{ endLocation }}</span>
        </p>
        <p><span id="everyLabel">Every: </span><span style="font-weight: bold;"> {{ frequency }} </span></p>
        <p><span id="startTimeLabel">First: </span> <span id="startTime" style="font-weight: bold;"> {{ startTime
        }}</span> <span id="endTimeLabel">Last: </span> <span id="endTime" style="font-weight: bold;"> {{ endTime
}}</span> </p>
      </div>
      <div ref="returnInfoBox" id="returnInfo" style="flex:50%; border-left: solid; padding-left: 5px;"
        v-show="hasReturn">
        <p style="font-weight: bold;">
          <span id="fromLocationInfoReturn"> {{ endLocation }}</span>
        </p>
        <p style="font-weight: bold;">
          -><span id="toLocationInfoReturn"> {{ startLocation }}</span>
        </p>
        <p><span id="everyLabelReturn">Every: </span><span id="frequencyInfoReturn" style="font-weight: bold;">{{
            frequency
        }} </span></p>
        <p>
          <span id="startTimeLabelReturn">First:</span><span id="startTimeReturn" style="font-weight: bold;"> {{
              returnStartTime
          }}</span>
          <span id="endTimeLabelRet"> Last: </span><span id="endTimeReturn" style="font-weight: bold;"> {{ returnEndTime
          }}</span>
        </p>
      </div>
    </div>
    <div class="reviewInfo">
      <button id="likeButton" class="likeButton" @click="likeButtonClicked('active')">
        <img class="likeImg"
          src="https://cdn-icons-png.flaticon.com/512/2087/2087973.png"
          alt="like" />
      </button>
      <button id="dislikeButton" class="likeButton dislikeButton" @click="likeButtonClicked('activeDislike')">
        <img class="likeImg"
          src="https://cdn-icons-png.flaticon.com/512/2107/2107616.png"
          alt="dislike" />
      </button>
    </div>

  </div>

</template>

<script>
import { TypedChainedSet } from 'webpack-chain';

export default {
  name: "RouteView",
  data() {
    return {
      endLocation: "",
      startLocation: "",
      frequency: "",
      startTime: "",
      endTime: "",
      returnStartTime: "",
      returnEndTime: "",
      hasReturn: false,
      colour: "#FFFFFF",
      show: false
    }
  },
  //props: ['startLocation', 'endLocation', 'frequency', 'startTime', 'endTime', 'returnStartTime', 'returnEndTime'],
  methods: {
    likeButtonClicked(which){
      var likeButton = document.getElementById('likeButton')
      var dislikeButton = document.getElementById('dislikeButton')
      if(which == 'activeDislike'){
        likeButton.classList.remove('active')
        dislikeButton.classList.toggle('activeDislike')
      }
      else{
        likeButton.classList.toggle('active')
        dislikeButton.classList.remove('activeDislike')
      }
    },
    populateInfo(route) {
      this.endLocation = route.destination;
      this.startLocation = route.origin;
      this.frequency = route.frequency,
        this.startTime = route.startTime,
        this.endTime = route.endTime,
        this.returnStartTime = route.returnStartTime,
        this.returnEndTime = route.returnEndTime,
        this.hasReturn = route.returnPoints != null,
        this.colour = route.colour
      this.$refs.outboundInfoBox.style.borderRightColor = route.colour
      this.$refs.returnInfoBox.style.borderLeftColor = route.colour
      this.show = true
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
<style scoped>
.likeImg {
  height: 10px;
  width: 10px;
}

.likeButton{
  border: none;
  background-color: white;
  border-radius: 4px;
}

.likeButton:hover{
  background-color: #83EA9F;
}

.dislikeButton:hover{
  background-color: #EC7272;
}

.active{
  background-color: #83EA9F;
}

.activeDislike{
  background-color: #EC7272;
}

.reviewInfo {
  float: left;
}
</style>