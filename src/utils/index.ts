/*
 * @Author: Mr.Mao
 * @Date: 2021-07-02 10:21:51
 * @LastEditTime: 2021-07-02 10:23:19
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
/**
 * 下载文件
 * @param data 数据
 * @param name 名称
 */
export const download = (data: Blob, name: string) => {
  const blob = new Blob([data as Blob])
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', `${name}.zip`)
  document.body.appendChild(link)
  link.click()
}
