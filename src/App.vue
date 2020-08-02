<template>
  <div id="app">
    <tree-select>
    </tree-select>
  </div>
</template>

<script>
import TreeSelect from './tree-select/index.vue'

export default {
  name: 'App',
  components: {
    TreeSelect
  }
}
</script>

<style>
html, body, #app {
  width: 100%;
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  padding: 20px;
}
</style>
