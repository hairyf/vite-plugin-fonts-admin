<!--
 * @Author: Mr.Mao
 * @Date: 2021-06-30 20:33:06
 * @LastEditTime: 2021-07-01 02:55:53
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
          <n-button class="mt-24 mb-24 w-128" type="primary" @click="showIncGroupModel = true">
            <template #icon>
              <n-icon>
                <AddCircle />
              </n-icon>
            </template>
            新增分组
          </n-button>
          <n-menu class="w-full" v-model:value="currentTab" :options="menuOptions" />
        </div>
        <div class="flex-1 ml-24 flex flex-col py-24">
          <div class="flex justify-between">
            <n-space class="items-center leading-none" size="large">
              <n-button class="w-128" type="primary" @click="showIncModal = true">
                <n-icon class="mr-2">
                  <Push />
                </n-icon>
                <span>上传 Svg</span>
              </n-button>
              <n-checkbox v-model:checked="isSelectAll">全选</n-checkbox>
              <n-button text @click="onDeleteItems">删除</n-button>
              <n-button text @click="showMoveModel = true">移动</n-button>
            </n-space>
            <n-input class="w-160" placeholder="查询图标" v-model:value="searchForm.text" round>
              <template #suffix>
                <n-icon class="cursor-pointer">
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
        </div>
      </div>
    </n-card>
    <n-modal
      v-model:show="showIncModal"
      preset="card"
      :style="{ width: '600px' }"
      title="新增 svg"
      size="huge"
      :bordered="false"
    >
      <n-form label-placement="left">
        <n-form-item label="名称" path="key">
          <n-input placeholder="请输入 svg 名称" v-model:value="svgForm.key" />
        </n-form-item>
        <n-form-item label="内容" path="key">
          <n-input
            class="h-112"
            v-model:value="svgForm.value"
            type="textarea"
            placeholder="请输入 svg 标签"
          />
        </n-form-item>
      </n-form>
      <div class="flex justify-end">
        <n-space>
          <n-button class="w-112" @click="showIncModal = false">取消</n-button>
          <n-button type="primary" class="w-112" @click="onIncreItem">确认</n-button>
        </n-space>
      </div>
    </n-modal>
    <n-modal
      v-model:show="showMoveModel"
      preset="card"
      :style="{ width: '600px' }"
      title="移动分组"
      size="huge"
      :bordered="false"
    >
      <n-form class="mb-24" label-placement="left">
        <n-form-item label="分组">
          <n-select
            placeholder="请选择分组"
            v-model:value="moveForm.group"
            :options="menuOptions"
          />
        </n-form-item>
      </n-form>
      <div class="flex justify-end">
        <n-space>
          <n-button class="w-112" @click="showMoveModel = false">取消</n-button>
          <n-button type="primary" class="w-112" @click="onMoveItems">确认</n-button>
        </n-space>
      </div>
    </n-modal>
    <n-modal
      v-model:show="showIncGroupModel"
      preset="card"
      :style="{ width: '600px' }"
      title="新增分组"
      size="huge"
      :bordered="false"
    >
      <n-form class="mb-24" label-placement="left">
        <n-form-item label="名称">
          <n-input placeholder="请输入分组名称" v-model:value="groupForm.name" />
        </n-form-item>
      </n-form>
      <div class="flex justify-end">
        <n-space>
          <n-button class="w-112" @click="showIncGroupModel = false">取消</n-button>
          <n-button type="primary" class="w-112" @click="onIncreGroupItem">确认</n-button>
        </n-space>
      </div>
    </n-modal>
  </n-config-provider>
</template>

<script lang="ts" setup>
  import { AddCircle, Search, GameController, Push } from '@vicons/ionicons5'
  import { ref, computed, watch } from 'vue'
  import { useMultipleSelect, useListPagination } from '@tuimao/utils'
  import { Modal } from './components/Modal'
  interface SvgItem {
    select: boolean
  }
  const currentTab = ref('all')
  const baseMenuOptions = ref([
    {
      label: '全部',
      key: 'all',
      value: 'all'
    },
    {
      label: '未分组',
      key: 'ungrouped',
      value: 'ungrouped'
    }
  ])
  const menuOptions = computed(() => {
    return baseMenuOptions.value
  })
  const searchForm = ref({
    text: ''
  })
  const svgForm = ref({
    key: '',
    value: '',
    group: ''
  })
  const moveForm = ref({
    group: undefined
  })
  const groupForm = ref({
    name: ''
  })
  const showIncModal = ref(false)
  const showMoveModel = ref(false)
  const showIncGroupModel = ref(false)
  const { list: currentSvgs } = useListPagination<SvgItem[]>({
    getList: () => {
      return [{ select: true }, { select: false }, { select: false }, { select: true }]
    },
    sources: [searchForm]
  })
  const { selectItems, isSelectAll } = useMultipleSelect(currentSvgs)
  const resetSvgs = () => {}
  const onDeleteItems = async () => {
    await Modal({
      preset: 'dialog',
      type: 'warning',
      title: '提示',
      content: `你确定要删除当前 ${selectItems.value.length} 項图标吗？`,
      positiveText: '确定',
      negativeText: '不确定'
    })
    console.log(selectItems.value)
  }
  const onIncreItem = () => {
    console.log(svgForm.value)
    showIncModal.value = false
  }
  const onMoveItems = () => {
    console.log(moveForm.value, selectItems.value)
    showMoveModel.value = false
  }
  const onIncreGroupItem = () => {
    console.log(groupForm.value)
    showIncGroupModel.value = false
  }
  watch(currentTab, resetSvgs)
</script>

<style>
  .n-checkbox__label {
    padding-right: 0 !important;
  }
</style>
