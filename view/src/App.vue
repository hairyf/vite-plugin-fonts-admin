<!--
 * @Author: Mr.Mao
 * @Date: 2021-06-30 20:33:06
 * @LastEditTime: 2021-06-30 22:55:54
 * @Description: 
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
-->
<template>
  <n-config-provider class="h-full">
    <n-card
      class="w-1150 container mx-auto h-full rounded-3xl"
      title="fonts Administration"
      :bordered="false"
      content-style="padding-left: 0; padding-right: 24px"
    >
      <div class="flex h-full">
        <div class="w-176 h-full border-r flex items-center flex-col">
          <n-button class="mt-24 mb-24 w-128" type="primary">
            <template #icon>
              <n-icon>
                <AddCircle />
              </n-icon>
            </template>
            新增分组
          </n-button>
          <n-menu class="w-full" v-model:value="currentTab" :options="menuOptions" />
        </div>
        <div class="flex-1 ml-24 flex flex-col">
          <div class="h-40" />
          <div class="flex justify-between">
            <n-button class="w-128" type="primary">
              <n-icon>
                <Push />
              </n-icon>
              上传 Svg
            </n-button>
            <n-input
              class="w-160"
              size="small"
              placeholder="查询图标"
              v-model:value="searchForm.text"
              round
            >
              <template #suffix>
                <n-icon>
                  <Search />
                </n-icon>
              </template>
            </n-input>
          </div>
          <div
            class="mt-20 flex-1 grid gap-24"
            style="grid-template-columns: repeat(auto-fill, 112px)"
          >
            <n-element
              v-for="(item, index) in currentSvgs"
              :key="index"
              @click="item.select = !item.select"
              :class="[item.select ? 'bg-gray-50 border border-primary text-primary' : '']"
              tag="div"
              class="
                h-112 h-112
                rounded-lg
                flex
                justify-center
                items-center
                flex-col
                hover:bg-gray-50
                transition-all
                duration-200
                cursor-pointer
              "
            >
              <n-icon size="35" class="hover:text-primary transition-all duration-200">
                <GameController />
              </n-icon>
              <n-element tag="div" class="select-none">www</n-element>
            </n-element>
          </div>
          <div class="flex">
            <n-checkbox class="mr-10" v-model:checked="isSelectAll">全选</n-checkbox>
            <n-button text class="mr-20">删除</n-button>
            <n-button text class="mr-20">移动</n-button>
          </div>
          <div class="h-40" />
        </div>
      </div>
    </n-card>
  </n-config-provider>
</template>

<script lang="ts" setup>
  import { AddCircle, Search, GameController, Push } from '@vicons/ionicons5'
  import { ref } from '@vue/reactivity'
  import { useMultipleSelect } from '@tuimao/utils'
  interface SvgItem {
    select: boolean
  }
  const currentTab = ref('all')
  const menuOptions = ref([
    {
      label: '全部',
      key: 'all'
    },
    {
      label: '未分组',
      key: 'ungrouped'
    }
  ])
  const searchForm = ref({
    text: ''
  })
  const currentSvgs = ref<SvgItem[]>([
    { select: true },
    { select: false },
    { select: false },
    { select: true }
  ])
  const { selectItems, isSelectAll } = useMultipleSelect(currentSvgs)
</script>

<style></style>
