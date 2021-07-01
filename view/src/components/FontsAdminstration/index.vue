<!--
 * @Author: Mr.Mao
 * @Date: 2021-06-30 20:33:06
 * @LastEditTime: 2021-07-01 18:52:54
 * @Description: 
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
-->
<template>
  <n-card
    class="rounded-3xl"
    title="fonts Administration"
    style="height: calc(100vh - 50px)"
    :bordered="false"
  >
    <n-layout has-sider class="h-full">
      <n-layout-sider :width="176" bordered>
        <div class="mr-24 flex flex-col items-center">
          <n-button class="my-24 w-128" type="primary" @click="showIncGroupModel = true">
            <template #icon>
              <n-icon>
                <AddCircle />
              </n-icon>
            </template>
            新增分组
          </n-button>
          <n-menu class="w-full" v-model:value="currentTab" :options="menuOptions" />
        </div>
      </n-layout-sider>
      <n-layout-content class="ml-24" content-style="display: flex; flex-direction: column;">
        <div class="flex justify-between">
          <n-space class="items-center leading-none" size="large">
            <n-button class="w-128" type="primary" @click="showIncModal = true">
              <n-icon class="mr-2">
                <Push />
              </n-icon>
              <span>上传 Svg</span>
            </n-button>
            <n-button class="w-128" type="primary" @click="showIncModal = true">
              <n-icon class="mr-2">
                <ArchiveOutline />
              </n-icon>
              <span>导出 Fonts</span>
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
        <div class="mt-20 flex-1">
          <div class="grid gap-24" style="grid-template-columns: repeat(auto-fill, 112px)">
            <n-element
              v-for="(item, index) in fonts"
              :key="index"
              @click="item.select = !item.select"
              :class="[item.select ? 'bg-gray-50 border border-primary text-primary' : '']"
              tag="div"
              class="cn-font__item"
            >
              <n-icon size="35" class="hover:text-primary transition-all duration-200">
                <div class="inline-block" v-html="item.value"></div>
              </n-icon>
              <n-element tag="div" class="select-none">www</n-element>
            </n-element>
          </div>
          <n-empty
            v-if="!fonts.length"
            class="h-full flex justify-center"
            description="你什么也找不到"
            size="huge"
          />
        </div>
      </n-layout-content>
    </n-layout>
  </n-card>
  <!-- 新增 SVG -->
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
        <n-input placeholder="请输入 svg 名称" v-model:value="fontForm.key" />
      </n-form-item>
      <n-form-item label="内容" path="key">
        <n-input
          class="h-112"
          v-model:value="fontForm.value"
          type="textarea"
          placeholder="请输入 svg 标签"
        />
      </n-form-item>
      <n-form-item label="分组">
        <n-select
          placeholder="请选择分组(可选)"
          v-model:value="fontForm.group"
          :options="groupSelectOptions"
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
  <!-- 移动分组 -->
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
          :options="groupSelectOptions"
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
  <!-- 新增分组 -->
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
</template>

<script lang="tsx" setup>
  import { AddCircle, Search, Push, ArchiveOutline } from '@vicons/ionicons5'
  import { ref, computed, onMounted } from 'vue'
  import { useMultipleSelect, useListPagination, axiosLoading } from '@tuimao/utils'
  import { Modal } from '../Modal'
  import axios from 'axios'
  import { forIn, cloneDeep } from 'lodash'
  import { useMessage } from 'naive-ui'
  import type { MenuOption } from 'naive-ui'
  axios.defaults['baseURL'] = '/proxy/json'
  const message = useMessage()
  interface fontOption {
    select: boolean
    label: string
    value: string
    key: string
  }
  interface GroupOption {
    label: any
    key: string
  }
  interface GroupSelectOption {
    label: string
    value: string
  }
  const currentTab = ref('')
  const baseMenuOptions = ref<MenuOption[]>([
    {
      label: '全部',
      key: ''
    },
    {
      label: '未分组',
      key: 'ungrouped'
    }
  ])
  const groupMenuOptions = ref<MenuOption[]>([])
  const groupSelectOptions = ref<GroupSelectOption[]>([])
  const menuOptions = computed(() => {
    return [...baseMenuOptions.value, ...groupMenuOptions.value]
  })
  const searchForm = ref({
    text: ''
  })
  const fontForm = ref({
    key: '',
    value: '',
    group: undefined as string | undefined
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
  const { list: fonts, resetList: resetFonts } = useListPagination<fontOption[]>({
    getList: async () => {
      const { data } = await axios.get<fontOption[]>('/fonts', {
        params: currentTab.value && { group: currentTab.value }
      })
      return data
    },
    sources: [() => searchForm.value, () => currentTab.value]
  })
  const { selectItems, isSelectAll } = useMultipleSelect(fonts)
  const seleteIds = computed(() => selectItems.value.map((v) => v.id as number))
  const resetGroup = async () => {
    const { data } = await axios.get<GroupOption[]>('/group')
    groupMenuOptions.value = data.map((v) => ({
      label: () => <div>{v.label}</div>,
      key: v.key
    }))
    groupSelectOptions.value = data.map((v) => ({
      label: v.label,
      value: v.key
    }))
  }
  const onDeleteItems = async () => {
    await Modal({
      preset: 'dialog',
      type: 'warning',
      title: '提示',
      content: `你确定要删除当前 ${selectItems.value.length} 項图标吗？`,
      positiveText: '确定',
      negativeText: '不确定'
    })
    await Promise.all(seleteIds.value.map((v) => axios.delete(`/fonts/${v}`)))
    await resetFonts()
    message.success('删除成功!')
  }
  const onIncreItem = async () => {
    if (!fontForm.value.key) {
      return message.error('名称不能为空')
    }
    // if (!/^<svg.*>.*<\/svg>/.test(fontForm.value.value)) {
    //   return message.error('内容不符合 svg 标签格式')
    // }
    const cloneForm = cloneDeep(fontForm.value)
    cloneForm.value = cloneForm.value
      .replace(/fill="(.*)"/g, `fill="${'currentColor'}"`)
      .replace(/\n/g, '')
      .trim()
    cloneForm.group = cloneForm.group || 'ungrouped'
    await axios.post('/fonts', cloneForm)
    forIn(fontForm.value, (v, k) => ((fontForm.value as any)[k] = ''))
    fontForm.value.group = undefined
    showIncModal.value = false
    await resetFonts()
    message.success('添加成功!')
  }
  const onMoveItems = async () => {
    await Promise.all(seleteIds.value.map((v) => axios.patch(`/fonts/${v}`, moveForm.value)))
    await resetFonts()
    message.success('移动成功!')
    showMoveModel.value = false
  }
  const onIncreGroupItem = () => {
    console.log(groupForm.value)
    showIncGroupModel.value = false
  }
  onMounted(() => {
    resetGroup()
  })
</script>

<style>
  .n-checkbox__label {
    padding-right: 0 !important;
  }
  .cn-font__item {
    @apply h-112
           rounded-lg
           flex
           justify-center
           items-center
           flex-col
           hover:bg-gray-50
           transition-all
           duration-200
           cursor-pointer;
  }
</style>
