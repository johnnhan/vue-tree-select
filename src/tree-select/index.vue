<template>
  <div class="tree-select">
    <div class="tree-select-display" :class="{'disabled': disabled!==false, 'display-mode-input': displayMode==='input'}">
      <slot name="display" :displayValue="displayValue">
        <input v-if="displayMode==='input'" v-model="displayValue" class="tree-select-display-input" :disabled="disabled">
        <span v-else class="tree-select-display-text">{{displayValue}}</span>
        <svg class="tree-select-display-arrow" :viewBox="arrowIcon.viewBox">
          <path :d="arrowIcon.path" :fill="disabled ? '#c0c4cc' : displayMode==='input' ? '#c0c4cc' : '#409eff'"></path>
        </svg>
      </slot>
    </div>
    <div class="tree-select-dropdown"></div>
  </div>
</template>

<script>
import ICONLIST from '../dist/iconlist.js'

export default {
  props: {
    displayMode: {
      typeof: String,
      default: 'input'
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
      default: () => {
        return {
          path: ICONLIST.arrow,
          viewBox: '0 0 1024 1024'
        }
      }
    }
  },
  data () {
    return {
      displayValue: 'Hello World',
      showDropdown: false
    }
  }
}
</script>

<style lang="less" scoped>
.tree-select {
  font-size: 14px;

  &-display {
    cursor: pointer;

    &-input {
      outline: none;
      background-color: #fff;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      color: #606266;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
    }

    &-input:hover {
      border-color: #c0c4cc;
    }

    &-input:focus {
      border-color: #409eff;
    }

    &-text {
      color: #409eff;
    }

    &-arrow {
      width: 14px;
      height: 14px;
    }
  }

  &-display.disabled {
    .tree-select-display-input {
      background-color: #eee;
      border-color: #e4e7ed;
      color: #c0c4cc;
      user-select: none;
      cursor: not-allowed;
    }

    .tree-select-display-input:hover {
      border-color: #e4e7ed;
    }
  }
}
</style>
