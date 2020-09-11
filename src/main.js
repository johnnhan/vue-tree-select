import TreeSelect from './tree-select/index.vue'
import SvgIcon from './tree-select/svgIcon.vue'

export default {
  install (Vue) {
    Vue.component('treeSelect', TreeSelect)
    Vue.component('treeSelectSvgIcon', SvgIcon)
    Vue.prototype.$symbolParent = Symbol.for('tree_select_parent')
    Vue.prototype.$symbolHidden = Symbol.for('tree_select_hidden')
  }
}