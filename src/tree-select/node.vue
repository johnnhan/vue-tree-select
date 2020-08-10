<template>
  <div class="dropdown-node">
    <div class="dropdown-node-item" :style="itemStyle">
      <slot :node="node">
        <span class="dropdown-node-item-label" :class="{ selected: node.selected }">{{node.label}}</span>
        <span v-if="!node.childs && selectedMode==='icon'" class="dropdown-node-item-seleicon">
          <svg v-if="node.selected" :viewBox="selectedIcon.viewBox">
            <path :d="selectedIcon.path"></path>
          </svg>
        </span>
      </slot>
    </div>
    <div v-if="node.childs && node.childs.length">
      <node v-for="(item, index) in node.childs" :key="item.label+index" :node="item" :paddingLeft="paddingLeft+15">
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
    node: {
      typeof: Object,
      default: () => ({ label: '', value: 0 })
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
  computed: {
    itemStyle () {
      return { 'padding-left': this.paddingLeft + 'px' }
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
