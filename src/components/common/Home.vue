<template>
  <div class="wrapper">
    <v-header></v-header>
    <nav-menu></nav-menu>
    <div class="content">
      <transition name="move" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
  import vHeader from './Header.vue'
  import NavMenu from './NavMenu.vue'

  export default {
    components: {
      vHeader, NavMenu
    }
  }
</script>

<style scoped>
  .wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .content {
    width: auto;
    overflow-y: scroll;
    padding: 40px;
    position: absolute;
    top: 60px;
    left: 250px;
    right: 0;
    bottom: 0;
    background-color: #edf1f5;
  }
</style>
