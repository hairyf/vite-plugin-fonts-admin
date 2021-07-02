# Vite Fonts Administration Plugin

[![img](https://camo.githubusercontent.com/db142803b957437c04073937d4b86d5178015ea2d361fde665b816d0d7887521/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6973737565732f7569776a732f66696c652d69636f6e732e737667)](https://github.com/TuiMao233/vite-plugin-fonts/issues) [![img](https://camo.githubusercontent.com/315da233bee98f089df489bceb78be0820f71972f91689ecbd5f13aa86df72e6/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f666f726b732f7569776a732f66696c652d69636f6e732e737667)](https://github.com/uiwjs/file-icons/network) [![img](https://camo.githubusercontent.com/72fcee2f208c0487ec2b0b9614db6e248dab749200d1ad2fdee1ea4363ca51d6/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f73746172732f7569776a732f66696c652d69636f6e732e737667)](https://github.com/TuiMao233/vite-plugin-fonts/stargazers) [![img](https://camo.githubusercontent.com/284011cbc153249237c388c0b573cc61634720f0e349b08d3aa81905265cb20a/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f72656c656173652f7569776a732f66696c652d69636f6e732e737667)](https://github.com/TuiMao233/vite-plugin-fonts/releases) [![Packagist](https://camo.githubusercontent.com/fa1864b36b4dcac8ad41229db578e7059c58d5cef4561418d2018d5959abcc59/68747470733a2f2f696d672e736869656c64732e696f2f6475622f6c2f766962652d642e737667)](https://github.com/TuiMao233/vite-plugin-fonts) [![Packagist](https://camo.githubusercontent.com/56978eb13d652fe39ad9535dcf486cd12f556edf9e3cc5af50b39337aae747be/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f407569772f66696c652d69636f6e732e737667)](https://www.npmjs.com/package/vite-plugin-fonts)

Manage fonts in Vite projects.

![view](images/view.png)

### Icon Font Created By svgtofont

[svgtofont](https://github.com/jaywcjlove/svgtofont#readme) Svg generate Fonts

[archiver](https://github.com/archiverjs/node-archiver) Files compress Zip

## Vite Plugin Use

~~~typescript
import { defineConfig } from 'vite'
import ViteFonts from 'vite-plugin-fonts'
export default defineConfig({
  plugins: [
    ViteFonts()
  ]
})
~~~

## Vue Use

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

## Visit Fonts Administration

~~~sh
# visit url: Local/fonts
vite v2.3.8 dev server running at:
 > Local: http://localhost:3000/
 > Network: use `--host` to expose
# http://localhost:3000/ >>> http://localhost:3000/fonts
~~~

## generate dir

~~~sh
# svg > index.json > fonts/...
src
- index.json # option
- fonts # css | ttf | woff | woff2 | svg
~~~

## Option

~~~json
ViteFonts({
  // Generate font path, default 'src/VFonts'
  dir: 'src/VFonts',
  // Generate font name, default 'iconfont'
  fontName: 'iconfont',
  // Generate css class prefix, default fontName
  classNamePrefix: 'iconfont',
  // Whether to generate css entrance
  css: true
})
~~~

## License

Licensed under the [MIT License](https://opensource.org/licenses/MIT).

