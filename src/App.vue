<template>
  <div id="app">
    <tree-select
      :data="data"
      :props="props"
      dropdownHeight="320px"
      dropdownWidth="100%"
      coverMode="rest"
    >
    </tree-select>
  </div>
</template>

<script>
import TreeSelect from './tree-select/index.vue'

export default {
  name: 'App',
  components: {
    TreeSelect
  },
  data () {
    return {
      data: [
        { label: '测试选项3', value: 1003 },
        {
          label: '测试选项4',
          value: 1004,
          childs: [
            { label: '测试子选项4-1测试子选项4-1测试子选项4-1', value: 10041 },
            { label: '测试子选项4-2', value: 10042, disable: true },
            { label: '测试子选项4-3', value: 10043, selected: true },
            { label: '测试子选项4-4', value: 10044 }
          ]
        },
        { label: '测试选项7', value: 1007 },
        {
          label: '测试选项8',
          value: 1008,
          childs: [
            { label: '测试子选项8-1', value: 10081 },
            {
              label: '测试子选项8-2',
              value: 10082,
              childs: [
                { label: '测试子选项8-2-1', value: 100821 },
                { label: '测试子选项8-2-2', value: 100822 }
              ]
            }
          ]
        },
        { label: '测试选项9', value: 1009 }
      ],
      props: {
        disabled: 'disable'
      }
    }
  }
}
</script>

<style>
html, body, #app {
  width: 100%;
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  padding: 20px;
}
</style>
