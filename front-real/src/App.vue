<template>
  <MenuView></MenuView>
  <router-view>
  </router-view>
</template>
  
<script setup>
import MenuView from './components/MenuView.vue';
import StartList from './components/StartList.vue'
import { RouterView } from 'vue-router';
</script>