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
        <svg class="tree-select-display-arrow" :viewBox="arrowIcon.viewBox">
          <template v-if="Array.isArray(arrowIcon.path)">
            <path v-for="(v, k) in path" :key="k" :d="v" :fill="arrowFill"></path>
          </template>
          <template v-else>
            <path :d="arrowIcon.path" :fill="arrowFill"></path>
          </template>
        </svg>
      </slot>
    </div>
    <div class="tree-select-dropdown" :style="dropdownStyle" @click.stop>
      <div>
        <slot name="dropdownHeader"></slot>
      </div>
      <div class="tree-select-dropdown-area">
        <div class="dropdown-container">
          <node v-for="(node, index) in data" :key="node.label+index" :node="node">
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
</template>

<script>
import ICONLIST from '../dist/iconlist.js'
import node from './node.vue'

export default {
  components: {
    node
  },
  props: {
    width: {
      typeof: [String, Number],
      default: 220
    },
    dropdownWidth: {
      typeof: [String, Number],
      default: '100%'
    },
    dropdownHeight: {
      typeof: [String, Number],
      default: 220
    },
    displayMode: {
      typeof: String,
      default: 'input'
    },
    placeholder: {
      typeof: String,
      default: '请选择'
    },
    selectMode: {
      typeof: String,
      default: 'single'
    },
    disabled: {
      typeof: Boolean,
      default: false
    },
    arrowIcon: {
      typeof: Object,
      default: () => ICONLIST.arrow
    },
    data: {
      typeof: Array,
      default: () => []
    }
  },
  data () {
    return {
      displayValue: '',
      isFocus: false
    }
  },
  created () {
    document.addEventListener('click', () => {
      this.isFocus && (this.isFocus = false)
    })
  },
  computed: {
    containerStyle () {
      const width = typeof this.width === 'number' ? this.width + 'px' : this.width
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
    dropdownStyle () {
      const width = typeof this.dropdownWidth === 'number' ? this.dropdownWidth + 'px' : this.dropdownWidth
      const height = this.isFocus ? this.dropdownHeight + 'px' : 0
      const opacity = this.isFocus ? 1 : 0
      const borderWidth = this.isFocus ? '1px' : 0
      const style = { width, height, opacity, 'border-width': borderWidth }
      this.displayMode === 'text' && (style['min-width'] = '220px')
      return style
    }
  },
  methods: {
    toggle () {
      if (this.disabled) return
      this.isFocus = !this.isFocus
      this.isFocus && this.$refs.input && this.$refs.input.focus()
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

    &-arrow {
      flex-shrink: 0;
      width: 14px;
      height: 14px;
      margin-left: 10px;
      transition: transform 0.3s;
    }

    &.focus {
      .tree-select-display-arrow {
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
    display: flex;
    flex-direction: column;
    padding: 10px;
    bottom: -10px;
    border-style: solid;
    border-color: #e4e7ed;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    transition: height 0.3s, opacity 0.3s, border-width 0.3s;
    transform: translateY(100%);

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
      float: left;
      min-width: 100%;
    }
  }
}
</style>
