<template>
    <div class="root">
        <div class="modal">
            <img src="../assets/x.svg" @click="$emit('close')" class="closeButton">
            <h3>{{ $t('information') }}</h3>
            <div class="info">
            <label>About Colectivos</label>
            <p>
                Colectivos are a popular, economical public transport system in Mexico.
                Most often they take the form of vans with stickers on them showing their destinations, but there are others.
                Colectivos have a friendly atmosphere and it is polite to say 'Buenos Dias/Tardes/Noches' when getting into the van.
            </p>
            </div>
            <div class="info">
            <label>About Rutas Colectivos</label>
            <p>
                We believe that San Cris needs a map of all of the colectivo routes, 
                so that people can plan their travels with the confidence that they 
                will end up where they expected! 
                Accurate information and great user experience are our highest values.
                We are making a GPS based route capture system which will allow anyone to add accurate routes easily; In the meantime, 
                We are currently adding the routes by asking the drivers. Stay tuned for more routes weekly!
            </p>
            </div>
            <div class="info">
            <label>Contact</label>
            <p>
                Good experience? Something you think we can improve? We would love to hear from you!
                Drop us a message any time at <a href="mailto:contact@rutascolectivos.info">contact@rutascolectivos.info</a> and we will get back to you 
                as soon as we can :)
            </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "InformationView"
}
</script>

<style>

</style>