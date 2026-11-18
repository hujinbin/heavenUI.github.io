/**
 * 扩展 VuePress 应用
 */
import Heaven from 'heaven-ui'
import 'heaven-ui/lib/heaven-ui.min.css'
import VueI18n from 'vue-i18n'

 
export default ({
 Vue, // VuePress 正在使用的 Vue 构造函数
 options, // 附加到根实例的一些选项
 router, // 当前应用的路由实例
 siteData // 站点元数据
}) => {
 // ...做一些其他的应用级别的优化
 Vue.use(Heaven)
 // 在创建文档应用前注册运行时，避免页内异步注册影响路由组件
 Vue.use(VueI18n)
//  谷歌联盟
 if (typeof window !== 'undefined') {
    import('vue-google-adsense')
      .then(module => {
        const Ads = module.default
        Vue.use(require('vue-script2'))
        Vue.use(Ads.Adsense)
        Vue.use(Ads.InArticleAdsense)
        Vue.use(Ads.InFeedAdsense)
      })
      .catch(e => {
        console.log(e)
      })
  }
  // 监控包依赖浏览器全局对象，静态渲染时不加载
  if (typeof window !== 'undefined') {
    import('monitoring-tool').then(module => {
      const monitoringTool = module.default
      new monitoringTool({
        secret: "41UVKE6R2847PKAH",
        host: "https://monitor.leheavengame.com",
      });
    }).catch(e => {
      console.error('监控工具初始化失败', e)
    })
  }
}
