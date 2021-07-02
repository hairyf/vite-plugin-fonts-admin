# Vite Fonts Administration Plugin

[![img](https://camo.githubusercontent.com/db142803b957437c04073937d4b86d5178015ea2d361fde665b816d0d7887521/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6973737565732f7569776a732f66696c652d69636f6e732e737667)](https://github.com/TuiMao233/vite-plugin-fonts/issues) [![img](https://camo.githubusercontent.com/315da233bee98f089df489bceb78be0820f71972f91689ecbd5f13aa86df72e6/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f666f726b732f7569776a732f66696c652d69636f6e732e737667)](https://github.com/uiwjs/file-icons/network) [![img](https://camo.githubusercontent.com/72fcee2f208c0487ec2b0b9614db6e248dab749200d1ad2fdee1ea4363ca51d6/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f73746172732f7569776a732f66696c652d69636f6e732e737667)](https://github.com/TuiMao233/vite-plugin-fonts/stargazers) [![img](https://camo.githubusercontent.com/284011cbc153249237c388c0b573cc61634720f0e349b08d3aa81905265cb20a/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f72656c656173652f7569776a732f66696c652d69636f6e732e737667)](https://github.com/TuiMao233/vite-plugin-fonts/releases) [![Packagist](https://camo.githubusercontent.com/fa1864b36b4dcac8ad41229db578e7059c58d5cef4561418d2018d5959abcc59/68747470733a2f2f696d672e736869656c64732e696f2f6475622f6c2f766962652d642e737667)](https://github.com/TuiMao233/vite-plugin-fonts) [![Packagist](https://camo.githubusercontent.com/56978eb13d652fe39ad9535dcf486cd12f556edf9e3cc5af50b39337aae747be/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f407569772f66696c652d69636f6e732e737667)](https://www.npmjs.com/package/vite-plugin-fonts)

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

