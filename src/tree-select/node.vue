<template>
  <div class="dropdown-node">
    <div class="dropdown-node-item" :style="itemStyle" @click.stop="itemClick">
      <span class="dropdown-node-item-pre">
        <svg-icon
          v-if="node[this.children] && node[this.children].length"
          :icon="arrowRightIcon"
          class="dropdown-node-item-arrowicon"
          :class="{ collapse: node[this.collapse] }"
          @click="toggleCollapse"
        ></svg-icon>
      </span>
      <span
        class="dropdown-node-item-label"
        :class="{ selected: node[this.selected], 'selected-highlight': selectedHighlight, disabled: getDisabled(node) }"
      >
        <slot :node="node">
          {{getLabel(node)}}
        </slot>
      </span>
      <span v-if="selectedMode==='icon'" class="dropdown-node-item-after">
        <svg-icon
          v-if="node[this.selected]"
          :icon="selectedIcon"
          color="#409eff"
          class="dropdown-node-item-seleicon"
        ></svg-icon>
      </span>
    </div>
    <div v-if="node[this.children] && node[this.children].length" class="dropdown-node-childs" ref="childsRef">
      <node
        v-for="(item, index) in node[this.children]"
        :key="getLabel(item)+index"
        :node="item"
        :paddingLeft="paddingLeft+14"
        :options="options"
        :selectedMode="selectedMode"
        :selectedIcon="selectedIcon"
        :selectedHighlight="selectedHighlight"
        :arrowRightIcon="arrowRightIcon"
        v-on="$listeners"
      >
        <template v-slot="scope">
          <slot :node="scope.node"></slot>
        </template>
      </node>
    </div>
  </div>
</template>

<script>
import svgIcon from './svgIcon.vue'
import { selected, arrowRight } from '../dist/iconlist.js'

export default {
  name: 'node',
  components: { svgIcon },
  props: {
    node: {
      typeof: Object,
      default: () => ({})
    },
    paddingLeft: {
      typeof: Number,
      default: 10
    },
    options: {
      typeof: Object,
      default: () => ({})
    },
    selectedMode: {
      typeof: String,
      default: 'icon'
    },
    selectedIcon: {
      typeof: Object,
      default: () => selected
    },
    selectedHighlight: {
      typeof: Boolean,
      default: true
    },
    arrowRightIcon: {
      typeof: Object,
      default: () => arrowRight
    }
  },
  computed: {
    itemStyle () {
      return { 'padding-left': this.paddingLeft + 'px' }
    },
    selected () {
      return this.options.selected || 'selected'
    },
    children () {
      return this.options.children || 'children'
    },
    collapse () {
      return this.options.collapse || 'collapse'
    }
  },
  methods: {
    getLabel (node) {
      return typeof this.options.label === 'function'
        ? this.options.label(node)
        : this.options.label ? node[this.options.label] : node.label
    },
    getDisabled (node) {
      return typeof this.options.disabled === 'function'
        ? this.options.disabled(node)
        : this.options.disabled ? node[this.options.disabled] : node.disabled
    },
    itemClick () {
      this.$emit('select', this.node)
    },
    toggleCollapse () {
      this.$set(this.node, this.collapse, !this.node[this.collapse])
      this.$refs.childsRef.style.display = this.node[this.collapse] ? 'none' : 'block'
    }
  }
}
</script>
