<template>
  <div
    class="tree-select"
    :class="size"
    :style="containerStyle"
  >
    <div
      class="tree-select-display"
      :class="displayClass"
      @click="toggle"
      @mouseenter.stop="showClearIcon = true"
      @mouseleave.stop="showClearIcon = false"
    >
      <slot
        name="display"
        :node="selectedNode"
        :focus="isFocus"
      >
        <input
          ref="input"
          v-model="displayValue"
          class="tree-select-display-input"
          :placeholder="selfplaceholder"
          :disabled="disabled"
          :readonly="!canSearch"
          @blur="inputFocus=false"
          @input="search"
        >
        <svg-icon
          v-if="displayValue && showClearIcon"
          class="tree-select-display-clearicon"
          :icon="clearIcon"
          color="#c0c4cc"
          @click="clear"
        />
        <svg-icon
          v-else
          class="tree-select-display-arrowicon"
          :icon="arrowUpIcon"
          color="#c0c4cc"
        />
      </slot>
    </div>
    <div
      class="tree-select-dropdown"
      :style="dropDownStyle"
      @click.stop
    >
      <div
        class="tree-select-dropdown-wrap"
        :style="dropWrapStyle"
      >
        <div class="tree-select-dropdown-header">
          <slot name="dropdownHeader" />
        </div>
        <div class="tree-select-dropdown-area">
          <div
            v-if="treeDataLength"
            class="dropdown-container"
            :class="dropconClass"
          >
            <node
              v-for="(node, index) in treeData"
              :key="node[id]+''+index"
              :node="node"
              v-bind="$attrs"
              :options="options"
              @select="select"
            >
              <template v-slot="scope">
                <slot
                  name="dropdownItem"
                  :node="scope.node"
                />
              </template>
            </node>
          </div>
          <div
            v-else
            class="dropdown-nonode"
          >
            暂无数据
          </div>
        </div>
        <div class="tree-select-dropdown-footer">
          <slot name="dropdownFooter" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { close, arrowUp } from '../dist/iconlist.js'
import deepCopy from '../dist/deepCopy.js'
import node from './node.vue'
import svgIcon from './svgIcon.vue'

export default {
  components: {
    node,
    svgIcon
  },
  props: {
    data: {
      typeof: Array,
      default: () => []
    },
    options: {
      typeof: Object,
      default: () => ({})
    },
    size: {
      typeof: String,
      default: 'medium'
    },
    disabled: {
      typeof: Boolean,
      default: false
    },
    width: {
      typeof: [String, Number],
      default: 220
    },
    dropdownWidth: {
      typeof: [String, Number],
      default: 'auto'
    },
    dropdownMaxWidth: {
      typeof: [String, Number],
      default: 440
    },
    dropdownMaxHeight: {
      typeof: [String, Number],
      default: 220
    },
    alignMode: {
      typeof: String,
      default: 'left'
    },
    selectMode: {
      typeof: String,
      default: 'single'
    },
    preSelectFun: {
      typeof: Function,
      default: () => () => {}
    },
    canSearch: {
      typeof: Boolean,
      default: true
    },
    coverMode: {
      typeof: String,
      default: 'scroll'
    },
    placeholder: {
      typeof: String,
      default: '请选择'
    },
    clearIcon: {
      typeof: Object,
      default: () => close
    },
    arrowUpIcon: {
      typeof: Object,
      default: () => arrowUp
    }
  },
  data () {
    return {
      treeData: [],
      // filteredTreeData: [],
      selectedNode: null,
      preNode: null,
      displayValue: '',
      isSearch: false,
      isFocus: false,
      inputFocus: false,
      showClearIcon: false,
      selfplaceholder: this.placeholder,
      symbolParent: Symbol.for('tree_select_parent'),
      symbolHidden: Symbol.for('tree_select_hidden')
    }
  },
  computed: {
    id () {
      return this.options.id || 'id'
    },
    children () {
      return this.options.children || 'children'
    },
    collapse () {
      return this.options.collapse || 'collapse'
    },
    selected () {
      return this.options.selected || 'selected'
    },
    containerStyle () {
      let width = this.getStyleValue(this.width)
      return { width }
    },
    displayClass () {
      return {
        disabled: this.disabled !== false,
        focus: this.isFocus
      }
    },
    arrowFill () {
      return this.disabled ? '#c0c4cc' : this.displayMode === 'input' ? '#c0c4cc' : '#409eff'
    },
    dropDownStyle () {
      let width = this.getStyleValue(this.dropdownWidth)
      let opacity = this.isFocus ? 1 : 0
      let minWidth = this.displayMode === 'text' ? '220px' : '100%'
      let maxWidth = this.getStyleValue(this.dropdownMaxWidth)
      let maxHeight = this.getStyleValue(this.dropdownMaxHeight)
      let transform = this.isFocus ? 'translateY(100%) scaleY(1)' : 'translateY(100%) scaleY(0)'
      let style = { width, opacity, transform, 'max-width': maxWidth, 'max-height': maxHeight, 'min-width': minWidth }
      if (this.alignMode === 'right') {
        style.right = '0'
      } else if (this.alignMode === 'center') {
        style.left = '50%'
        style.transform += ' translateX(-50%)'
      } else {
        style.left = '0'
      }
      return style
    },
    dropWrapStyle () {
      let maxHeight = this.getStyleValue(this.dropdownMaxHeight)
      let style = { 'max-height': maxHeight }
      return style
    },
    dropconClass () {
      return {
        rest: this.coverMode === 'rest',
        scroll: this.coverMode === 'scroll'
      }
    },
    treeDataLength () {
      return this.treeData.filter(item => !item[this.symbolHidden]).length
    }
  },
  watch: {
    data (n) {
      n.length && (this.treeData = this.dataFormat(deepCopy(n)))
    }
  },
  created () {
    // 如果 data 一开始传进来时就是非空数组的情况
    if (this.data.length) {
      this.treeData = this.dataFormat(deepCopy(this.data))
      // this.filteredTreeData = this.dataFormat(this.treeData)
    }

    document.addEventListener('click', (e) => {
      if (this.isFocus && !e.path.includes(this.$el)) {
        this.isSearch = false
        this.isFocus = false
        this.displayValue = this.selfplaceholder
        this.selfplaceholder = this.placeholder
        this.$emit('focus-change', this.isFocus)
      }
    })
  },
  methods: {
    dataFormat (data, parent) {
      for (let item of data) {
        item[this.symbolParent] = parent ? parent : null
        item[this.children] && item[this.children].length && this.dataFormat(item[this.children], item)
      }
      return data
    },
    dataFilter (data, filter, flag) {
      let temp = flag
      for (let item of data) {
        let label = this.getLabel(item)
        let filterChilds = []
        if (filter && label.toLowerCase().includes(filter.toLowerCase())) {
          temp = true
        } else {
          temp = false
        }
        if (item[this.children] && item[this.children].length) {
          filterChilds = this.dataFilter(item[this.children], filter, temp).filter(childItem => !childItem[this.symbolHidden])
        }
        if (!filter || temp || filterChilds.length) {
          item[this.symbolHidden] = false
        } else {
          item[this.symbolHidden] = true
        }
        temp = flag
      }
      return data
    },
    search () {
      this.isSearch = true
      this.treeData = this.dataFilter(this.treeData, this.displayValue)
    },
    toggle () {
      if (this.disabled) return
      if (this.isFocus) {
        if (!this.inputFocus) {
          this.inputFocus = true
          return
        }
        this.isSearch = false
        this.isFocus = false
        this.$refs.input && this.$refs.input.blur()
        this.displayValue = this.selfplaceholder
        this.selfplaceholder = this.placeholder
      } else {
        this.treeData = this.dataFilter(this.treeData)
        this.isFocus = true
        this.inputFocus = true
        this.selfplaceholder = this.displayValue
        this.displayValue = ''
      }
      this.$emit('focus-change', this.isFocus)
    },
    clear () {
      if (this.disabled) return
      if (this.isSearch) {
        this.displayValue = this.selectedNode ? this.getLabel(this.selectedNode) : ''
        this.treeData = this.dataFilter(this.treeData)
      } else {
        this.$set(this.selectedNode, this.selected, false)
        this.selectedNode = null
        this.displayValue = ''
        this.selfplaceholder = this.placeholder
        this.$emit('select-change', this.selectedNode)
      }
    },
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
    getStyleValue (v) {
      return typeof v === 'number' ? v + 'px' : v
    },
    select (node) {
      if (this.getDisabled(node) || node[this.selected] || (node[this.children] && node[this.children].length)) {
        return
      }
      if (this.preSelectFun && typeof this.preSelectFun === 'function') {
        let res = this.preSelectFun()
        if (res && res.then) {
          res.then(() => {
            this.handleSelect(node)
          }).catch(() => {})
        } else {
          this.handleSelect(node)
        }
      } else {
        this.handleSelect(node)
      }
    },
    handleSelect (node) {
      if (this.selectMode === 'multiple') {
        // todo
      } else {
        this.preNode && this.$set(this.preNode, this.selected, false)
        this.$set(node, this.selected, true)
        this.selectedNode = node
        this.isSearch = false
        this.displayValue = this.getLabel(node)
        this.isFocus = false
        this.preNode = node
        this.$emit('select-change', node)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tree-select {
  position: relative;
  display: inline-block;
  font-size: 14px;
  overflow: visible;

  &-display {
    position: relative;
    width: 100%;

    &-arrowicon {
      position: absolute;
      width: 14px;
      height: 14px;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      transition: transform 0.2s linear;
      cursor: pointer;
    }

    &-clearicon {
      position: absolute;
      width: 14px;
      height: 14px;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }

    &-input {
      color: #606266;
      width: 100%;
      height: 40px;
      line-height: 100%;
      outline: none;
      background-color: #fff;
      padding: 0 15px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      cursor: pointer;

      &::placeholder {
        color: #c0c4cc;
      }
    }

    &:hover {
      .tree-select-display-input {
        border-color: #409eff;
      }
    }

    &.focus {
      .tree-select-display-input {
        border-color: #409eff;
      }
      .tree-select-display-arrowicon {
        transform: translateY(-50%) rotate(-180deg);
      }
    }

    &.disabled {
      .tree-select-display-input {
        color: #c0c4cc;
        background-color: #f5f7fa;
        cursor: not-allowed;
      }

      .tree-select-display-arrowicon {
        cursor: not-allowed;
      }
    }
  }

  &-dropdown {
    position: absolute;
    bottom: -10px;
    transform-origin: 0 0;
    transition: transform 0.2s linear, opacity 0.2s linear;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    z-index: 1000;

    &-wrap {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      padding: 10px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
    }

    &-area {
      overflow: auto;
      flex-grow: 1;

      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: #F5F5F5;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background-color: rgba(144,147,153,.3);
      }
    }

    .dropdown-container {
      min-width: 100%;

      &.rest {
        width: 100%;

        .dropdown-node /deep/ .dropdown-node-item .dropdown-node-item-label {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      &.scroll {
        float: left;
      }
    }

    .dropdown-nonode {
      padding: 5px 10px;
      text-align: center;
      color: #c0c4cc;
    }
  }

  & /deep/ .dropdown-node {
    &-item {
      display: flex;
      align-items: center;
      align-items: center;
      padding-top: 5px;
      padding-bottom: 5px;
      padding-right: 10px;
      color: #606266;
      white-space: nowrap;
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: #f5f7fa;
      }

      &-label {
        height: 18px;
        line-height: 18px;
        flex-grow: 1;
      }

      &-label.selected.selected-highlight {
        color: #409eff;
      }

      &-label.disabled {
        color: #ccc;
        cursor: default;
      }

      &-pre, &-after {
        display: inline-block;
        flex-shrink: 0;
        width: 14px;
        height: 14px;
        font-size: 0;
      }

      &-pre {
        margin-right: 5px;
      }

      &-after {
        margin-left: 5px;
      }

      &-arrowicon {
        transform: rotate(90deg);
        transition: transform 0.2s;
      }

      &-arrowicon.collapse {
        transform: rotate(0);
      }
    }

    &-childs {
      transition: height 0.2s linear;
      overflow: hidden;
    }
  }
}
.tree-select.small {
  font-size: 12px;

  .tree-select-display {
    &-input {
      height: 32px;
    }

    &-arrowicon, &-clearicon {
      width: 12px;
      height: 12px;
    }
  }

  & /deep/ .dropdown-node {
    &-item {

      &-pre, &-after {
        width: 12px;
        height: 12px;
      }
    }
  }
}
</style>
