<template>
  <div class="tree-select" :style="containerStyle">
    <div class="tree-select-display" :class="displayClass" @click.stop="toggle">
      <slot name="display" :displayValue="displayValue">
        <input
          ref="input"
          v-if="displayMode==='input'"
          v-model="displayValue"
          class="tree-select-display-input"
          :placeholder="placeholder"
          :disabled="disabled"
        >
        <span v-else class="tree-select-display-text">{{ displayValue || placeholder }}</span>
        <svg-icon
          class="tree-select-display-arrowicon"
          :icon="arrowUpIcon"
          :color="arrowFill"
        ></svg-icon>
      </slot>
    </div>
    <div class="tree-select-dropdown" :style="dropDownStyle" @click.stop>
      <div class="tree-select-dropdown-wrap" :style="dropWrapStyle">
        <div>
          <slot name="dropdownHeader"></slot>
        </div>
        <div class="tree-select-dropdown-area">
          <div class="dropdown-container" :class="dropconClass">
            <node
              v-for="(node, index) in data"
              :key="getLabel(node)+index"
              :node="node"
              v-bind="$attrs"
            >
              <template v-slot="scope">
                <slot name="dropdownItem" :node="scope.node"></slot>
              </template>
            </node>
          </div>
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
      default: () => ICONLIST.selectedIcon
    },
    selectedHighlight: {
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
      displayValue: '',
      isFocus: false
    }
  },
  created () {
    this.propsInit()
    this.dataFormat(this.data)
    document.addEventListener('click', () => {
      this.isFocus && (this.isFocus = false)
    })
  },
  computed: {
    children () {
      return this.options.children || 'children'
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
      const transition = 'max-height 0.2s linear, opacity 0.2s linear'
      const width = this.getStyleValue(this.dropdownWidth)
      const opacity = this.isFocus ? 1 : 0
      const minWidth = this.displayMode === 'text' ? '220px' : '100%'
      const maxWidth = this.getStyleValue(this.dropdownMaxWidth)
      const maxHeight = this.isFocus ? this.getStyleValue(this.dropdownMaxHeight) : 0
      const style = { width, transition, opacity, 'max-width': maxWidth, 'max-height': maxHeight, 'min-width': minWidth }
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
    dataFormat (data, parent) {
      for (const item of data) {
        item.parent = parent || null
        if (item[this.children] && item[this.children].length) {
          this.dataFormat(item[this.children], data)
        }
      }
    },
    toggle () {
      if (this.disabled) return
      this.isFocus = !this.isFocus
      this.isFocus && this.$refs.input && this.$refs.input.focus()
    },
    getLabel (node) {
      return typeof this.options.label === 'function'
        ? this.options.label(node)
        : this.options.label ? node[this.options.label] : node.label
    },
    getStyleValue (v) {
      return typeof v === 'number' ? v + 'px' : v
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
    transform: translateY(100%);
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);

    &-wrap {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      padding: 15px;
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
  }
}
</style>
