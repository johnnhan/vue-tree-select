### Props

| 属性 | 类型 | 默认值 | 描述 |
| ---- | ---- | ---- | ---- |
| data | Array | [] | 下拉列表的数据 |
| props | Object | [附录一](#附录一（自定义节点属性的数据格式）) | 自定义节点属性 |
| disabled | Boolean | false | 是否禁用组件 |
| width | String \| Number | 220 | 组件的宽 |
| dropdownWidth | String \| Number | 'auto' | dropdwon（下拉框）的宽 |
| dropdownHeight | String \| Number | 220 | dropdwon（下拉框）的高 |
| displayMode | String | 'input' | 组件呈现模式，'input'（输入框模式），'text'（文本模式） |
| selectMode | String | 'single' | 选择模式，'single'（单选模式），'multiple'（多选模式）|
| coverMode | String | 'scroll' | 某一选项文本过长时 dropdown 的表现形式，'scroll'（显示滚动条），'rest'（显示省略号） |
| selectedMode | String | 'icon' | 选中项的表现方式，'icon'（选中项后打钩），'check'（选中项前 checkbox 打钩）|
| selectedIcon | Object | [附录二](#附录二（自定义图标数据传递格式）) | 选中项的表现方式为 'icon' 时，自定义图标 |
| selectedHighlight | Boolean | true | 选中项的文本是否高亮 |
| placeholder | String | '请选择' | 未选择时的替代文本 |
| arrowIcon | Object | [附录二](#附录二（自定义图标数据传递格式）) | 自定义下拉箭头图标 |

<br>

### 附录一（自定义节点属性的数据格式）

自定义节点属性的数据格式为 Object，包含以下几个属性：

| 属性 | 类型 | 描述 |
| ---- | ---- | ---- |
| label | String \| Function(node) | 指定下拉列表要展示的文本的字段 |
| children | String | 指定树的子节点的字段 |
| disabled | String \| Function(node) | 下拉列表禁用选项的参考字段 |

举例说明（默认值）：

```js
{
  label: 'label',
  children: 'children',
  disabled: 'disabled',
}
```

### 附录二（自定义图标数据传递格式）

自定义图标目前采取的传递方式为 Object，包含以下两个属性：

| 属性 | 类型 | 描述 |
| ---- | ---- | ---- |
| path | String \| Array | SVG 图标中 path 标签的 d 属性的值（即路径）|
| viewBox | String | SVG 图标中的 viewBox |

举例说明：

```js
{
  path: 'M832 340.992l-320 312-320-312q-8.992-8.992-20.992-8.992t-20.992 8.992-8.992 20.992 8 20l340.992 332q8.992 8.992 22.016 8.992t22.016-8.992l340.992-331.008q8-8.992 8-21.504t-8.992-20.992-20.992-8.512-20.992 8.992z',
  viewBox:'0 0 1024 1024'
}
```

采取这种传递方式的原因是，可以使用内联语法对图标颜色进行修改