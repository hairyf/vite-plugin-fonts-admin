<!--
 * @Author: Mr.Mao
 * @Date: 2021-06-30 20:33:06
 * @LastEditTime: 2021-07-01 14:11:56
 * @Description: 
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
-->
<template>
  <n-config-provider class="xl:container">
    <n-theme-editor>
      <n-message-provider>
        <FontsAdminstration />
      </n-message-provider>
    </n-theme-editor>
  </n-config-provider>
</template>

<script lang="ts" setup>
  import FontsAdminstration from './components/FontsAdminstration/index.vue'
</script>

<style>
  .n-checkbox__label {
    padding-right: 0 !important;
  }
</style>
