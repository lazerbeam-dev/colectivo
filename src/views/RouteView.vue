<template>
  <div id="infoPanel" v-show="show">
    <div id="rowDiv">
      <div ref="outboundInfoBox" id="outboundInfo">
        <label> {{ $t('start_location') }}  </label>

        <div id="fromLocationInfo"> 
          <h2>
            {{ startLocation }}
          </h2>
        </div>

        <label>{{ $t('end_location') }}</label>
        <div id="toLocationInfo"> 
            <h2>
              {{ endLocation }}
            </h2>
          </div>
        
        <div class="popUpInfo">
          <div class="timeDisplay">
            <div id="everyLabel" > <p class="miniLabel"> {{ $t('every') }} </p></div><div class="timetableItem"> {{ frequency }} </div>
          </div>

          <div class="timeDisplay">
            <div class="miniLabel" id="startTimeLabel"> <p class="miniLabel">{{ $t('from_time') }} </p></div> <div class="timetableItem" id="startTime"> {{
                startTime
            }}</div> 
          </div>
          <div class="timeDisplay">

            <div  class="miniLabel" id="endTimeLabel"> <p class="miniLabel">{{ $t('until_time') }} </p> </div> <div class="timetableItem" id="endTime"
              > {{ endTime
                }}</div> 
          </div>
        </div>
        
          
      </div>

      <div ref="returnInfoBox" id="returnInfo"
        v-show="hasReturn">
        <label>{{ $t('start_location') }}</label>
        <div id="fromLocationInfoReturn"> 
          <h2>
            {{ endLocation }}
          </h2>
        </div>

        <label>{{ $t('end_location') }}</label>
        <div id="toLocationInfoReturn"> 
          <h2>
            {{ startLocation }}
          </h2>
        </div>
        
        <div class="popUpInfo">
          <div class="timeDisplay">
            <div id="everyLabelReturn"> <p class="miniLabel">{{ $t('every') }}</p></div>
            <div class="timetableItem" id="frequencyInfoReturn">{{
                frequency
            }} </div>
          </div>

          <div class="timeDisplay">
            <div id="startTimeLabelReturn"> <p class="miniLabel">{{ $t('from_time') }} </p></div><div class="timetableItem" id="startTimeReturn"> {{
                returnStartTime
            }}</div>
          </div>

          <div>

          <div class="timeDisplay" id="endTimeLabelRet"> <p class="miniLabel">{{ $t('until_time') }}</p></div>
            <div class="timetableItem" id="endTimeReturn"> {{ returnEndTime
            }}</div>
          </div>

        </div>

      </div>
    </div>
    <div class="reviewInfo">
      <button id="likeButton" class="likeButton" ref="likeButton" @click="likeButtonClicked('active')" :title="$t('like')">
        <img class="likeImg" src="https://cdn-icons-png.flaticon.com/512/2087/2087973.png" alt="like" />
      </button>
      <button id="dislikeButton" class="likeButton dislikeButton" ref="dislikeButton" @click="likeButtonClicked('activeDislike')"
        :title="$t('dislike')">
        <img class="likeImg" src="https://cdn-icons-png.flaticon.com/512/2107/2107616.png" alt="dislike" />
      </button>
      <!-- <button class="editButton" @click="editRouteDetails()" :title="$t('suggest_edit')">
        <img class="likeImg" src="https://cdn-icons-png.flaticon.com/512/61/61456.png" alt="edit" />
      </button> -->
    </div>

  </div>

</template>

<script>
import { TypedChainedSet } from 'webpack-chain';
import axios from 'axios'
const emit = ['goLogin', 'updateRoute']

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
      likes: [],
      dislikes: [],
      id: null,
      hasReturn: false,
      colour: "#FFFFFF",
      show: false
    }
  },
  //props: ['startLocation', 'endLocation', 'frequency', 'startTime', 'endTime', 'returnStartTime', 'returnEndTime'],
  methods: {
    likeButtonClicked(which) {
      if (this.$store.state.signedInUser == null) {
        this.$emit('goLogin')
        return
      }
      
      if (which == 'activeDislike') {
        this.$refs.likeButton.classList.remove('active')
        this.$refs.dislikeButton.classList.toggle('activeDislike')
      }
      else {
        this.$refs.likeButton.classList.toggle('active')
        this.$refs.dislikeButton.classList.remove('activeDislike')
      }
      var serverUrl = this.$store.state.serverUrl;
      this.$emit("updateRoute", {userId: this.$store.state.signedInUser.id, like: this.$refs.likeButton.classList.contains("active"), dislike: this.$refs.dislikeButton.classList.contains("activeDislike"), routeId: this.id})
      axios.post(serverUrl + "/likeRoute", {
        routeId: this.id,
        userId: this.$store.state.signedInUser.id,
        like: this.$refs.likeButton.classList.contains("active"),
        dislike: this.$refs.dislikeButton.classList.contains("activeDislike")
      })
        .then(x => {
          console.log(x)
        }).catch(err => {
          console.log(err)
        })
    },
    editRouteDetails() {
      if (this.$store.state.signedInUser == null) {
        this.$emit('goLogin')
        return
      }
      this.$emit('editRoute')
    },
    populateInfo(route) {
      this.id = route._id
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
      this.likes = route.likes ?? []
      this.dislikes = route.dislikes ?? []
      let signedInUser = this.$store.state.signedInUser;
      if (signedInUser!= null && this.likes.includes(signedInUser.id)) {
        this.$refs.likeButton.classList.add("active")
      }
      else{
        this.$refs.likeButton.classList.remove("active")
      }
      if (signedInUser!= null && this.dislikes.includes(signedInUser.id)) {
        this.$refs.dislikeButton.classList.add("activeDislike")
      }
      else{
        this.$refs.dislikeButton.classList.remove("activeDislike")
      }



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