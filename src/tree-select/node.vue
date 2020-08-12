<template>
  <div class="dropdown-node">
    <div class="dropdown-node-item" :style="itemStyle">
      <slot :node="node">
        <span
          class="dropdown-node-item-label"
          :class="{ selected: node.selected, disabled: getDisabled(node) }"
        >{{getLabel(node)}}</span>
        <span v-if="!node.childs && selectedMode==='icon'" class="dropdown-node-item-seleicon">
          <svg v-if="node.selected" :viewBox="selectedIcon.viewBox">
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
import ICONLIST from '../dist/iconlist.js'

export default {
  name: 'node',
  props: {
    props: {
      typeof: Object,
      default: () => ({})
    },
    node: {
      typeof: Object,
      default: () => ({})
    },
    paddingLeft: {
      typeof: Number,
      default: 10
    },
    selectedMode: {
      typeof: String,
      default: 'icon'
    },
    selectedIcon: {
      typeof: Object,
      default: () => ICONLIST.selectedIcon
    },
    selectedHighlight: {
      typeof: Boolean,
      default: true
    }
  },
  created () {
    console.log(111)
  },
  computed: {
    children () {
      return this.props.children || 'children'
    },
    itemStyle () {
      return { 'padding-left': this.paddingLeft + 'px' }
    }
  },
  methods: {
    getLabel (node) {
      return typeof this.props.label === 'function'
        ? this.props.label(node)
        : this.props.label ? node[this.props.label] : node.label
    },
    getDisabled (node) {
      return typeof this.props.disabled === 'function'
        ? this.props.disabled(node)
        : this.props.disabled ? node[this.props.disabled] : node.disabled
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

    &-label.selected {
      color: #409eff;
    }

    &-label.disabled {
      color: #ccc;
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
