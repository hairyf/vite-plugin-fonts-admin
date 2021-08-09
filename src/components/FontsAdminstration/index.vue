<!--
 * @Author: Mr.Mao
 * @Date: 2021-06-30 20:33:06
 * @LastEditTime: 2021-08-06 11:33:29
 * @Description: 
 * @LastEditors: Zhilong
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
-->
<template>
  <n-card
    class="rounded-3xl"
    title="Fonts Administration"
    style="height: calc(100vh - 50px); min-height: 470px"
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
      <n-layout-content
        class="ml-24"
        content-style="display: flex; flex-direction: column;height:100%"
        :native-scrollbar="false"
      >
        <n-upload
          class="mb-12"
          :action="`/upload-svgs`"
          accept=".svg"
          name="files"
          :default-upload="true"
          :multiple="true"
          :data="{ group: String(currentTab || 10000), isRetainColor: String(isRetainColor) }"
          @finish="resetPage"
        >
          <n-upload-dragger>
            <div class="mb-12">
              <n-icon size="48" :depth="3">
                <CloudDownloadSharp />
              </n-icon>
            </div>
            <n-text class="text-sm">点击或者拖动文件到该区域来上传至当前分组</n-text>
            <div class="mt-12">
              <n-button class="w-128" type="primary" @click.stop="showIncModal = true">
                <n-icon class="mr-2">
                  <Push />
                </n-icon>
                <span>单独写入 Svg </span>
              </n-button>
            </div>
          </n-upload-dragger>
        </n-upload>
        <div class="flex justify-between">
          <n-space class="items-center leading-none" size="large">
            <n-button class="w-128" type="primary" @click="showOutGroupModel = true">
              <n-icon class="mr-2">
                <ArchiveOutline />
              </n-icon>
              <span>导出 Fonts</span>
            </n-button>
            <n-checkbox v-model:checked="isSelectAll">全选</n-checkbox>
            <n-button text @click="onDeleteItems()">删除</n-button>
            <n-button text @click="showMoveModel = true">移动</n-button>
            <n-checkbox v-model:checked="isRetainColor">导入 SVG 是否保留颜色</n-checkbox>
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
              @contextmenu="onOpenContextMenu($event), (currentItem = item)"
              :class="[item.select ? 'bg-gray-50 border border-primary text-primary' : '']"
              tag="div"
              class="cn-font__item"
            >
              <n-icon size="35" class="hover:text-primary transition-all duration-200">
                <div class="inline-block" v-html="item.value"></div>
              </n-icon>
              <n-element tag="div" class="select-none">
                <n-ellipsis class="max-w-80">{{ item.key }}</n-ellipsis>
              </n-element>
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
          placeholder="请选择分组(默认当前分组)"
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
        <n-input placeholder="请输入分组名称" v-model:value="groupForm.label" />
      </n-form-item>
    </n-form>
    <div class="flex justify-end">
      <n-space>
        <n-button class="w-112" @click="showIncGroupModel = false">取消</n-button>
        <n-button type="primary" class="w-112" @click="onIncreGroupItem">确认</n-button>
      </n-space>
    </div>
  </n-modal>
  <!-- 导出分组 -->
  <n-modal
    v-model:show="showOutGroupModel"
    preset="card"
    :style="{ width: '600px' }"
    title="导出 fonts"
    size="huge"
    :bordered="false"
  >
    <n-form class="mb-24">
      <n-form-item label="导出 css 前缀">
        <n-input
          placeholder="请输入前缀（ 默认 'iconfont' ）"
          v-model:value="outGroupForm.prefix"
        />
      </n-form-item>
      <n-form-item label="选择分组">
        <div class="grid gap-24 w-full" style="grid-template-columns: repeat(auto-fill, 112px)">
          <n-element
            v-for="(item, index) in groupSelectOptions"
            :key="index"
            @click="item.select = !item.select"
            :class="[item.select ? 'bg-gray-50 border border-primary text-primary' : '']"
            tag="div"
            class="cn-font__item"
          >
            <n-icon size="35" class="hover:text-primary transition-all duration-200">
              <CashOutline></CashOutline>
            </n-icon>
            <n-element tag="div" class="select-none mt-1">
              <n-ellipsis style="max-width: 80px">
                {{ item.label }}
              </n-ellipsis>
            </n-element>
          </n-element>
        </div>
      </n-form-item>
      <div class="flex justify-end">
        <n-space>
          <n-button class="w-112" @click="showOutGroupModel = false">取消</n-button>
          <n-button type="primary" class="w-112" @click="outGroupFonts">确认</n-button>
        </n-space>
      </div>
    </n-form>
  </n-modal>
  <!-- 右键菜单 -->
  <n-dropdown
    placement="bottom-start"
    @select="onSelectContextMenu"
    :x="dropdownOffset[0]"
    :y="dropdownOffset[1]"
    :options="dropdownOption"
    :show="showDropdown"
    :on-clickoutside="() => (showDropdown = false)"
  />
</template>

<script lang="tsx" setup>
  import {
    AddCircle,
    Search,
    Push,
    ArchiveOutline,
    CashOutline,
    Trash,
    CloudDownloadSharp
  } from '@vicons/ionicons5'
  import { ref, computed, onMounted, nextTick } from 'vue'
  import { useMultipleSelect, useListPagination, axiosLoading } from '@tuimao/utils'
  import { download } from '../../utils'
  import { Modal } from '../Modal'
  import axios from 'axios'
  import { forIn, cloneDeep } from 'lodash'
  import { useMessage, NEllipsis, NIcon } from 'naive-ui'
  import type { MenuOption, MessageReactive } from 'naive-ui'
  import { useClipboard } from '@vueuse/core'
  import { setHtmlStrTagAttr } from '@tuimao/core'
  axios.defaults['loading'] = true
  const message = useMessage()
  let loadingReactive: MessageReactive | undefined
  axiosLoading(
    axios,
    () => {
      if (!loadingReactive) loadingReactive = message.loading('加载中....', { duration: 0 })
    },
    () => {
      if (loadingReactive) {
        loadingReactive.destroy()
        loadingReactive = undefined
      }
    }
  )
  interface fontOption {
    id: number
    select: boolean
    label: string
    value: string
    key: string
    group: number
  }
  interface GroupOption {
    id: number
    label: any
  }
  interface GroupSelectOption {
    select: boolean
    label: string
    value: number
  }

  const currentTab = ref(0)
  const baseMenuOptions = ref<MenuOption[]>([
    {
      label: '全部',
      key: 0
    },
    {
      label: '未分组',
      key: 10000
    }
  ])
  const groupMenuOptions = ref<MenuOption[]>([])
  const groupSelectOptions = ref<GroupSelectOption[]>([])
  const menuOptions = computed(() => {
    return [...baseMenuOptions.value, ...groupMenuOptions.value]
  })
  const resetPage = () => {
    resetFonts()
    return undefined
  }
  const searchForm = ref({
    text: ''
  })
  const fontForm = ref({
    key: '',
    value: '',
    group: undefined as number | undefined
  })
  const moveForm = ref({
    group: undefined
  })
  const groupForm = ref({
    label: ''
  })
  const outGroupForm = ref({
    prefix: ''
  })
  const isRetainColor = ref(true)
  const showIncModal = ref(false)
  const showMoveModel = ref(false)
  const showIncGroupModel = ref(false)
  const showOutGroupModel = ref(false)
  const { list: fonts, resetList: resetFonts } = useListPagination<fontOption[]>({
    getList: async () => {
      const { data } = await axios.get<fontOption[]>('/json/fonts', {
        params: currentTab.value && { group: currentTab.value }
      })
      return data
    },
    sources: [() => searchForm.value, () => currentTab.value]
  })
  const { selectItems: fontSeleteItems, isSelectAll } = useMultipleSelect(fonts)
  const { selectItems: groupSelectItems } = useMultipleSelect(groupSelectOptions)
  const seleteIds = computed(() => fontSeleteItems.value.map((v) => v.id as number))
  /** 导出分组 */
  const outGroupFonts = async () => {
    if (!groupSelectItems.value.length) {
      message.warning('请选择分组!')
    }
    const { data } = await axios.get('/out-fonts', {
      params: {
        prefix: outGroupForm.value.prefix,
        ids: groupSelectItems.value.map((v) => v.value)
      },
      responseType: 'arraybuffer'
    })
    download(data, 'iconfont')
  }
  /** 重置分组 */
  const resetGroup = async () => {
    const { data } = await axios.get<GroupOption[]>('/json/group')
    groupMenuOptions.value = data.map((v) => ({
      label: () => (
        <div class="flex items-center justify-between">
          <NEllipsis style="max-width: 90px;">
            <span>{v.label}</span>
          </NEllipsis>
          <NIcon
            class="-mt-4"
            size="15px"
            onClick={(e: Event) => {
              onDeleteGroup(v)
              e.stopPropagation()
            }}
          >
            <Trash />
          </NIcon>
        </div>
      ),
      key: v.id
    }))
    groupSelectOptions.value = [
      { label: '未分组', value: 10000, select: true },
      ...data.map((v) => ({
        select: true,
        label: v.label,
        value: v.id
      }))
    ]
  }
  /** 删除分组 */
  const onDeleteGroup = async (item: GroupOption) => {
    await Modal({
      preset: 'dialog',
      type: 'warning',
      title: '提示',
      content: '你确定要删除该分组吗？',
      positiveText: '确定',
      negativeText: '不确定'
    })
    await axios.delete(`/json/group/${item.id}`)
    const { data: allFonts } = await axios.get<fontOption[]>('/json/fonts')
    await Promise.all(
      allFonts.filter((v) => v.group === item.id).map((v) => axios.delete(`/json/fonts/${v.id}`))
    )
    await resetGroup()
    message.success('删除成功!')
  }
  /** 删除多个 svg 項 */
  const onDeleteItems = async (ids?: number[]) => {
    const fontIds = ids || seleteIds.value
    await Modal({
      preset: 'dialog',
      type: 'warning',
      title: '提示',
      content: `你确定要删除当前 ${fontIds.length} 項图标吗？`,
      positiveText: '确定',
      negativeText: '不确定'
    })
    await Promise.all(fontIds.map((v) => axios.delete(`/json/fonts/${v}`)))
    await resetFonts()
    message.success('删除成功!')
  }
  /** 添加 svg 項 */
  const onIncreItem = async () => {
    const cloneForm = cloneDeep(fontForm.value)
    cloneForm.value = cloneForm.value
      .replace(/\n/g, '')
      // .replace(/width="(\w*%?)"/g, '')
      // .replace(/height="(\w*%?)"/g, '')
      .trim()
    console.log(cloneForm.value)
    cloneForm.value = setHtmlStrTagAttr(cloneForm.value, {
      tag: ['svg'],
      attr: ['width', 'height'],
      value: ''
    })
    console.log(cloneForm.value)
    if (!isRetainColor.value) {
      cloneForm.value = setHtmlStrTagAttr(cloneForm.value, {
        tag: ['path', 'svg'],
        attr: 'fill',
        value: 'currentColor'
      })
    }
    if (!cloneForm.key) {
      return message.error('名称不能为空')
    }
    if (!/^<svg.*>.*<\/svg>/.test(cloneForm.value)) {
      return message.error('内容不符合 svg 标签格式')
    }
    cloneForm.group = cloneForm.group || currentTab.value || 10000
    await axios.post('/json/fonts', cloneForm)
    forIn(fontForm.value, (v, k) => ((fontForm.value as any)[k] = ''))
    fontForm.value.group = undefined
    showIncModal.value = false
    await resetFonts()
    message.success('添加成功!')
  }
  /** 移动 font 分组 */
  const onMoveItems = async () => {
    await Promise.all(seleteIds.value.map((v) => axios.patch(`/json/fonts/${v}`, moveForm.value)))
    await resetFonts()
    message.success('移动成功!')
    showMoveModel.value = false
  }
  /** 添加分组 */
  const onIncreGroupItem = async () => {
    await axios.post('/json/group', groupForm.value)
    await resetGroup()
    message.success('添加成功!')
    showIncGroupModel.value = false
  }
  onMounted(() => resetGroup())

  const currentItem = ref<fontOption>()
  const dropdownOption = ref([
    { label: '复制', key: 'copy' },
    { label: '删除', key: 'delete' }
  ])
  const showDropdown = ref(false)
  const dropdownOffset = ref([0, 0])
  /** 打开右键菜单 */
  const onOpenContextMenu = async (event: MouseEvent) => {
    event.preventDefault()
    await nextTick()
    showDropdown.value = true
    dropdownOffset.value[0] = event.clientX
    dropdownOffset.value[1] = event.clientY
  }
  /** 处理点击菜单 */
  const onSelectContextMenu = async (key: 'copy' | 'delete') => {
    if (key === 'copy') {
      const { copy } = useClipboard()
      await copy(currentItem.value?.key || '')
      message.success(`复制 ${currentItem.value?.key} 成功`)
    }
    if (key === 'delete') {
      onDeleteItems([currentItem.value!.id])
    }
    showDropdown.value = false
  }
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
