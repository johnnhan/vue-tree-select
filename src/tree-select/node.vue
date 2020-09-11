<template>
  <div
    v-show="!node[$symbolHidden]"
    class="dropdown-node"
  >
    <div
      class="dropdown-node-item"
      :style="itemStyle"
      @click.stop="itemClick"
    >
      <span class="dropdown-node-item-pre">
        <tree-select-svg-icon
          v-if="node[children] && node[children].length"
          :icon="arrowRightIcon"
          class="dropdown-node-item-arrowicon"
          :class="{ collapse: node[collapse] }"
          @click="toggleCollapse"
        />
      </span>
      <span
        class="dropdown-node-item-label"
        :class="{ selected: node[selected], 'selected-highlight': selectedHighlight, disabled: getDisabled(node) }"
      >
        <slot :node="node">
          {{ getLabel(node) }}
        </slot>
      </span>
      <span
        v-if="selectedMode==='icon'"
        class="dropdown-node-item-after"
      >
        <tree-select-svg-icon
          v-if="node[selected]"
          :icon="selectedIcon"
          color="#409eff"
          class="dropdown-node-item-seleicon"
        />
      </span>
    </div>
    <div
      v-if="node[children] && node[children].length"
      v-show="!node[collapse]"
      ref="childsRef"
      class="dropdown-node-childs"
    >
      <node
        v-for="(item, index) in node[children]"
        :key="item[id]+''+index"
        :node="item"
        :padding-left="paddingLeft+14"
        :options="options"
        :selected-mode="selectedMode"
        :selected-icon="selectedIcon"
        :selected-highlight="selectedHighlight"
        :arrow-right-icon="arrowRightIcon"
        v-on="$listeners"
      >
        <template v-slot="scope">
          <slot :node="scope.node" />
        </template>
      </node>
    </div>
  </div>
</template>

<script>
import { selected, arrowRight } from '../dist/iconlist.js'

export default {
  name: 'Node',
  props: {
    node: {
      type: Object,
      default: () => ({})
    },
    paddingLeft: {
      type: Number,
      default: 10
    },
    options: {
      type: Object,
      default: () => ({})
    },
    selectedMode: {
      type: String,
      default: 'icon'
    },
    selectedIcon: {
      type: Object,
      default: () => selected
    },
    selectedHighlight: {
      type: Boolean,
      default: true
    },
    arrowRightIcon: {
      type: Object,
      default: () => arrowRight
    }
  },
  computed: {
    itemStyle () {
      return { 'padding-left': this.paddingLeft + 'px' }
    },
    id () {
      return this.options.id || 'id'
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
    }
  }
}
</script>
