<template>
  <svg :viewBox="icon.viewBox" class="svg-icon" @click.stop="$emit('click')">
    <template v-if="Array.isArray(icon.path)">
      <path v-for="(v, k) in icon.path" :key="'icon'+k" :d="v" :fill="color"></path>
    </template>
    <template v-else>
      <path :d="icon.path" :fill="color"></path>
    </template>
  </svg>
</template>

<script>
import ICONLIST from '../dist/iconlist.js'

export default {
  props: {
    icon: {
      type: Object,
      default: () => ICONLIST.defaultIcon
    },
    color: {
      type: String,
      default: '#c0c4cc'
    }
  }
}
</script>

<style lang="less" scoped>
.svg-icon {
  width: 100%;
  height: 100%;
  line-height: 1;
}
</style>
