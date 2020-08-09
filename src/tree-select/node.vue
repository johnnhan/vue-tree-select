<template>
  <div class="dropdown-node">
    <div class="dropdown-node-item" :style="itemStyle">
      <slot :node="node">
        <div>{{node.label}}</div>
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
    padding-top: 5px;
    padding-bottom: 5px;
    padding-right: 10px;
    color: #606266;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
      background-color: #f5f7fa;
    }
  }
}
</style>
