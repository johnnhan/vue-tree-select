<template>
  <div class="dropdown-node">
    <div class="dropdown-node-item" :style="itemStyle" @click.stop="itemClick(node)">
      <slot :node="node">
        <span
          class="dropdown-node-item-label"
          :class="{ selected: node[selected], highlight: selectedHighlight, disabled: getDisabled(node) }"
        >{{getLabel(node)}}</span>
        <span v-if="!node.childs && selectedMode==='icon'" class="dropdown-node-item-seleicon">
          <svg v-if="node[selected]" :viewBox="selectedIcon.viewBox">
            <path :d="selectedIcon.path"></path>
          </svg>
        </span>
      </slot>
    </div>
    <div v-if="node.childs && node.childs.length">
      <node v-for="(item, index) in node.childs" :key="getLabel(item)+index" :node="item" :paddingLeft="paddingLeft+15" >
        <template v-slot="scope">
          <slot :node="scope.node"></slot>
        </template>
      </node>
    </div>
  </div>
</template>

<script>
import store from '../dist/store.js'

export default {
  name: 'node',
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
      selectedHighlight: store.getValue('selectedHighlight')
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
    itemClick (node) {
      const preNode = store.getValue('preSelectedNode')
      if (this.getDisabled(node) || node[this.selected]) {
        return false
      }
      if (this.selectMode === 'multiple') {
        // todo
      } else {
        preNode && (preNode[this.selected] = false)
        this.$set(node, this.selected, true)
        store.setValue('preSelectedNode', node)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dropdown-node {
  &-item {
    display: flex;
    align-items: center;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-right: 10px;
    color: #606266;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
      background-color: #f5f7fa;
    }

    &-label {
      flex-grow: 1;
    }

    &-label.selected.highlight {
      color: #409eff;
    }

    &-label.disabled {
      color: #ccc;
      cursor: default;
    }

    &-seleicon {
      width: 14px;
      height: 14px;
      margin-left: 5px;

      svg path {
        fill: #409eff;
      }
    }
  }
}
</style>
