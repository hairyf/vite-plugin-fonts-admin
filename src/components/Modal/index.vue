<!--
 * @Author: Mr.Mao
 * @Date: 2021-07-01 01:20:50
 * @LastEditTime: 2021-07-01 02:05:00
 * @Description: 
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
-->
<template>
  <n-modal
    preset="dialog"
    v-bind="props"
    v-model:show="show"
    @positive-click="onConfirm"
    @negative-click="onClone"
  />
</template>
<script lang="ts">
  import { defineComponent, Ref, nextTick } from 'vue'
  import { props } from './props'
  export default defineComponent({
    props,
    setup: (props, { emit }) => {
      const show = props.show as any as Ref<boolean>
      if (show.value) {
        show.value = false
        nextTick(() => (show.value = true))
      }
      const onClone = () => {
        props.reject?.()
        show.value = false
        props.vanish?.()
      }
      const onConfirm = () => {
        props.resolve?.()
        show.value = false
        props.vanish?.()
      }
      return {
        props,
        onClone,
        onConfirm,
        show
      }
    }
  })
</script>
