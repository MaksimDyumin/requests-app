<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';


export default {
  computed: {
    ...mapGetters({
      requests: 'requests/requests'
    })
  },
  mounted() {
    console.log(this.requests)
  }
}
</script>

<style scoped>
@media (min-width: 1024px) {}
</style>
