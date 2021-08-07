/**
 * 扩展 VuePress 应用
 */
import Heaven from 'heaven-ui'
import 'heaven-ui/lib/heaven-ui.min.css'
 
export default ({
 Vue, // VuePress 正在使用的 Vue 构造函数
 options, // 附加到根实例的一些选项
 router, // 当前应用的路由实例
 siteData // 站点元数据
}) => {
 // ...做一些其他的应用级别的优化
 Vue.use(Heaven)
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
}