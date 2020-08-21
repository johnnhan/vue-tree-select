<template>
  <div class="tree-select" :class="size" :style="containerStyle">
    <div
      class="tree-select-display"
      :class="displayClass"
      @click.stop="toggle"
      @mouseenter.stop="showClearIcon = true"
      @mouseleave.stop="showClearIcon = false"
    >
      <slot name="display" :displayValue="displayValue">
        <input
          ref="input"
          v-if="displayMode==='input'"
          v-model="displayValue"
          class="tree-select-display-input"
          :placeholder="selfplaceholder"
          :disabled="disabled"
          :readonly="!canSearch"
          @input="dataFilter"
        >
        <span v-else class="tree-select-display-text">{{ displayValue || placeholder }}</span>
        <svg-icon
          class="tree-select-display-arrowicon"
          :icon="arrowUpIcon"
          :color="arrowFill"
        ></svg-icon>
        <svg-icon
          v-if="displayValue && showClearIcon"
          class="tree-select-display-clearicon"
          :icon="clearIcon"
          color="#c0c4cc"
          @click="clear"
        ></svg-icon>
      </slot>
    </div>
    <div class="tree-select-dropdown" :style="dropDownStyle" @click.stop>
      <div class="tree-select-dropdown-wrap" :style="dropWrapStyle">
        <div>
          <slot name="dropdownHeader"></slot>
        </div>
        <div class="tree-select-dropdown-area">
          <div v-if="filteredTreeData.length" class="dropdown-container" :class="dropconClass">
            <node
              v-for="(node, index) in filteredTreeData"
              :key="getLabel(node)+index"
              :node="node"
              @select="select"
            >
              <template v-slot="scope">
                <slot name="dropdownItem" :node="scope.node"></slot>
              </template>
            </node>
          </div>
          <div v-else class="dropdown-nonode">暂无数据</div>
        </div>
        <div>
          <slot name="dropdownFooter"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ICONLIST from '../dist/iconlist.js'
import store from '../dist/store.js'
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
    displayMode: {
      typeof: String,
      default: 'input'
    },
    alignMode: {
      typeof: String,
      default: 'left'
    },
    selectMode: {
      typeof: String,
      default: 'single'
    },
    selectedMode: {
      typeof: String,
      default: 'icon'
    },
    selectedIcon: {
      typeof: Object,
      default: () => ICONLIST.selected
    },
    selectedHighlight: {
      typeof: Boolean,
      default: true
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
      default: () => ICONLIST.close
    },
    arrowUpIcon: {
      typeof: Object,
      default: () => ICONLIST.arrow_up
    },
    arrowRightIcon: {
      typeof: Object,
      default: () => ICONLIST.arrow_right
    }
  },
  data () {
    return {
      treeData: [],
      filteredTreeData: [],
      selectedNode: null,
      displayValue: '',
      isSearch: false,
      isFocus: false,
      showClearIcon: false,
      selfplaceholder: this.placeholder
    }
  },
  created () {
    this.propsInit()
    document.addEventListener('click', () => {
      if (this.isFocus) {
        this.isSearch = false
        this.isFocus = false
        this.displayValue = this.selfplaceholder
        this.selfplaceholder = this.placeholder
      }
    })
  },
  computed: {
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
      const width = this.getStyleValue(this.width)
      return this.displayMode === 'input' ? { width } : {}
    },
    displayClass () {
      return {
        'mode-text': this.displayMode === 'text',
        'mode-input': this.displayMode === 'input',
        disabled: this.disabled !== false,
        focus: this.isFocus
      }
    },
    arrowFill () {
      return this.disabled ? '#c0c4cc' : this.displayMode === 'input' ? '#c0c4cc' : '#409eff'
    },
    dropDownStyle () {
      const width = this.getStyleValue(this.dropdownWidth)
      const opacity = this.isFocus ? 1 : 0
      const minWidth = this.displayMode === 'text' ? '220px' : '100%'
      const maxWidth = this.getStyleValue(this.dropdownMaxWidth)
      const maxHeight = this.getStyleValue(this.dropdownMaxHeight)
      const transform = this.isFocus ? 'translateY(100%) scaleY(1)' : 'translateY(100%) scaleY(0)'
      const style = { width, opacity, transform, 'max-width': maxWidth, 'max-height': maxHeight, 'min-width': minWidth }
      this.alignMode === 'right' && (style.right = '0')
      this.alignMode === 'center' && (style.transform += ' translateX(-50%)')
      return style
    },
    dropWrapStyle () {
      const maxHeight = this.getStyleValue(this.dropdownMaxHeight)
      const style = { 'max-height': maxHeight }
      return style
    },
    dropconClass () {
      return {
        rest: this.coverMode === 'rest',
        scroll: this.coverMode === 'scroll'
      }
    }
  },
  methods: {
    propsInit () {
      store.setValue('options', this.options)
      store.setValue('selectedMode', this.selectedMode)
      store.setValue('selectedIcon', this.selectedIcon)
      store.setValue('selectedHighlight', this.selectedHighlight)
      store.setValue('arrowRightIcon', this.arrowRightIcon)
    },
    dataFormat (data, parent, filter, flag) {
      const res = []
      let temp = flag
      for (const item of data) {
        const obj = { ...item }
        const label = this.getLabel(obj)
        obj._parent = parent || null
        if (item[this.selected]) {
          this.selectedNode = obj
          this.displayValue = label
          item[this.selected] = false
        }
        if (this.selectedNode && label === this.getLabel(this.selectedNode)) {
          obj[this.selected] = true
        }
        if (filter && label.toLowerCase().includes(filter.toLowerCase())) {
          temp = true
        }
        if (obj[this.children] && obj[this.children].length) {
          obj[this.children] = this.dataFormat(obj[this.children], obj, filter, temp)
        }
        if (!filter || temp || (obj[this.children] && obj[this.children].length)) {
          res.push(obj)
        }
        temp = flag
      }
      return res
    },
    dataFilter () {
      this.isSearch = true
      this.filteredTreeData = this.dataFormat(this.treeData, null, this.displayValue)
    },
    toggle () {
      if (this.disabled) return
      if (this.isFocus && this.$refs.input) {
        this.isSearch = false
        this.isFocus = !this.isFocus
        this.$refs.input.blur()
        this.displayValue = this.selfplaceholder
        this.selfplaceholder = this.placeholder
      } else if (!this.isFocus && this.$refs.input) {
        this.filteredTreeData = this.dataFormat(this.treeData)
        this.isFocus = !this.isFocus
        this.$refs.input.focus()
        this.selfplaceholder = this.displayValue
        this.displayValue = ''
      }
    },
    clear () {
      if (this.isSearch) {
        this.displayValue = this.selectedNode ? this.getLabel(this.selectedNode) : ''
        this.filteredTreeData = this.dataFormat(this.treeData)
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
        const res = this.preSelectFun()
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
        console.log(node, 'index-handleSelect')
        const preNode = store.getValue('preSelectedNode')
        preNode && this.$set(preNode, this.selected, false)
        this.$set(node, this.selected, true)
        this.selectedNode = node
        this.isSearch = false
        this.displayValue = this.getLabel(node)
        this.isFocus = false
        store.setValue('preSelectedNode', node)
        this.$emit('select-change', node)
      }
    }
  },
  watch: {
    data (n) {
      this.treeData = deepCopy(n)
      this.filteredTreeData = this.dataFormat(this.treeData)
    }
  }
}
</script>

<style lang="less" scoped>
.tree-select {
  position: relative;
  display: inline-block;
  background-color: #fff;
  font-size: 14px;
  overflow: visible;

  &-display {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    cursor: pointer;

    &-arrowicon {
      flex-shrink: 0;
      width: 14px;
      height: 14px;
      margin-left: 10px;
      transition: transform 0.2s linear;
    }

    &-clearicon {
      width: 14px;
      height: 14px;
      position: absolute;
      right: 15px;
      background-color: #fff;
    }

    &.focus {
      .tree-select-display-arrowicon {
        transform: rotate(-180deg);
      }
    }
  }

  &-display.mode-input {
    width: 100%;
    justify-content: space-between;
    padding: 0 15px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;

    .tree-select-display-input {
      flex-grow: 1;
      color: #606266;
      height: 100%;
      line-height: 1;
      border: none;
      outline: none;
      background-color: #fff;
      cursor: pointer;
    }

    .tree-select-display-input::placeholder {
      color: #c0c4cc;
    }

    &:hover {
      border-color: #c0c4cc;
    }

    &.focus {
      border-color: #409eff;
    }
  }

  &-display.mode-input.disabled {
    border-color: #e4e7ed;
    background-color: #f5f7fa;
    cursor: not-allowed;

    &:hover {
      border-color: #e4e7ed;
    }

    .tree-select-display-input {
      color: #c0c4cc;
      background-color: #f5f7fa;
      cursor: not-allowed;
    }
  }

  &-display.mode-text {
    justify-content: flex-start;
    background-color: #fff;
    border: none;

    .tree-select-display-text {
      color: #409eff;
    }
  }

  &-display.mode-text.disabled {
    cursor: not-allowed;

    .tree-select-display-text {
      color: #c0c4cc;
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
    height: 32px;

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
