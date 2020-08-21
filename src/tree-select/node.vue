<template>
  <div class="dropdown-node">
    <div class="dropdown-node-item" :style="itemStyle" @click.stop="itemClick">
      <slot :node="node">
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
        >{{getLabel(node)}}</span>
        <span v-if="selectedMode==='icon'" class="dropdown-node-item-after">
          <svg-icon
            v-if="node[this.selected]"
            :icon="selectedIcon"
            color="#409eff"
            class="dropdown-node-item-seleicon"
          ></svg-icon>
        </span>
      </slot>
    </div>
    <div v-if="node[this.children] && node[this.children].length" class="dropdown-node-childs" ref="childsRef">
      <node v-for="(item, index) in node[this.children]" :key="getLabel(item)+index" :node="item" :paddingLeft="paddingLeft+14" v-on="$listeners">
        <template v-slot="scope">
          <slot :node="scope.node"></slot>
        </template>
      </node>
    </div>
  </div>
</template>

<script>
import store from '../dist/store.js'
import svgIcon from './svgIcon.vue'

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
    }
  },
  data () {
    return {
      selectedMode: store.getValue('selectedMode'),
      selectedIcon: store.getValue('selectedIcon'),
      selectedHighlight: store.getValue('selectedHighlight'),
      arrowRightIcon: store.getValue('arrowRightIcon')
    }
  },
  computed: {
    itemStyle () {
      return { 'padding-left': this.paddingLeft + 'px' }
    },
    selected () {
      const options = store.getValue('options')
      return options.selected || 'selected'
    },
    children () {
      const options = store.getValue('options')
      return options.children || 'children'
    },
    collapse () {
      const options = store.getValue('options')
      return options.collapse || 'collapse'
    }
  },
  methods: {
    getLabel (node) {
      const options = store.getValue('options')
      return typeof options.label === 'function'
        ? options.label(node)
        : options.label ? node[options.label] : node.label
    },
    getDisabled (node) {
      const options = store.getValue('options')
      return typeof options.disabled === 'function'
        ? options.disabled(node)
        : options.disabled ? node[options.disabled] : node.disabled
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
