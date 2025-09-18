<template>
  <div id="app">
    <h1>贪吃蛇游戏</h1>
    <SnakeGame />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SnakeGame from './components/SnakeGame.vue'

export default defineComponent({
  name: 'App',
  components: {
    SnakeGame
  }
})
</script>

<style>
#app {
  text-align: center;
  margin-top: 20px;
}

h1 {
  color: #35495e;
  margin-bottom: 20px;
}
</style>