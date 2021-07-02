# Vite Fonts Administration Plugin

[![img](https://img.shields.io/github/issues/TuiMao233/vite-plugin-fonts-admin.svg)](https://github.com/TuiMao233/vite-plugin-fonts-admin/issues)
[![img](https://img.shields.io/github/forks/TuiMao233/vite-plugin-fonts-admin.svg)](https://github.com/TuiMao233/vite-plugin-fonts-admin/network/members)
[![img](https://img.shields.io/github/stars/TuiMao233/vite-plugin-fonts-admin.svg)](https://github.com/TuiMao233/vite-plugin-fonts-admin/stargazers)
[![NPM version](https://img.shields.io/npm/v/vite-plugin-fonts-admin.svg)](https://www.npmjs.com/package/vite-plugin-fonts-admin)

用于管理项目中的字体图标.

![view](images/view.png)

### 该项目依赖于

[svgtofont](https://github.com/jaywcjlove/svgtofont#readme) Svg generate Fonts

[archiver](https://github.com/archiverjs/node-archiver) Files compress Zip

## Vite 插件使用

~~~typescript
import { defineConfig } from 'vite'
import ViteFontsAdmin from 'vite-plugin-fonts-admin'
export default defineConfig({
  plugins: [
    ViteFontsAdmin()
  ]
})
~~~

## Vue 使用

~~~html
<!-- src/VFonts/index.vue -->
<template>
  <div class="v-font" v-html="svgTag" />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import option from './index.json'
export default defineComponent({
  props: {
    type: {
      type: String as () => keyof typeof option,
      required: true
    },
  },
  setup: (props) => {
    const svgTag = option[props.type]
    return {svgTag}
  }
})
</script>
~~~

## 访问 Fonts 管理后台

~~~sh
# visit url: Local/fonts
vite v2.3.8 dev server running at:
 > Local: http://localhost:3000/
 > Network: use `--host` to expose
# http://localhost:3000/ >>> http://localhost:3000/fonts
~~~

## 生成的目录结构

~~~sh
# svg > index.json > fonts/...
src
- index.json # option
- fonts # css | ttf | woff | woff2 | svg
~~~

## 调用配置

~~~js
ViteFontsAdmin({
  // 生成 font 路径, 默认 'src/VFonts'
  dir: 'src/VFonts',
  // 生成 font 名称, 默认 'iconfont'
  fontName: 'iconfont',
  // 生成 css class 前缀, 默认 fontName
  classNamePrefix: 'iconfont',
  // 是否生成 css 入口
  css: true
})
~~~

## License

Licensed under the [MIT License](https://opensource.org/licenses/MIT).

