<template>
    <div class="root">
        <div class="modal">
            <button @click="$emit('close')" class="closeButton">X</button>
            <br>
            <img src="https://i.ibb.co/XjwhkdC/3.png" class="modalLogo">
            <br>
            <h3>{{ $t('information') }}</h3>
            <h4>About Colectivos</h4>
            <div>
                Colectivos are a popular, economical public transport system in Mexico.
                Most often they take the form of vans with stickers on them showing their destinations, but there are others.
                Colectivos have a friendly atmosphere and it is polite to say 'Buenos Dias/Tardes/Noches' when getting into the van.
            </div>
            <h4>About Rutas Colectivos</h4>
            <div>
                We believe that San Cris needs a map of all of the colectivo routes, 
                so that people can plan their travels with the confidence that they 
                will end up where they expected! 
                Accurate information, intuitive display and user experience are our 
                three highest values. Because of that, we have made a GPS based route 
                capture system which allows anyone to add any route that they like; route
                feedback so that any bad information can be weeded out quickly, and all
                for free so that everyone in the community can benefit. 
            </div>
            <h4>Contact</h4>
            <div>
                Good experience? Something you think we can improve? We would love to hear from you!
                Drop us a message any time at <a href="mailto:contact@rutascolectivos.info">contact@rutascolectivos.info</a> and we will get back to you 
                as soon as we can :)
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