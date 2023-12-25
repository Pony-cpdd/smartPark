// 导入Vue构造函数
import Vue from 'vue'
// 类似reset.css清除浏览器默认样式
import 'normalize.css/normalize.css'
// 引入element-ui组件
import ElementUI from 'element-ui'
// 引入element-ui的样式
import 'element-ui/lib/theme-chalk/index.css'
// 引入样式文件
import '@/styles/index.scss' // global css
// 引入App根组件
import App from './App'
// 引入VueX
import store from './store'
// 引入VueRoute
import router from './router'

// 注册svg
import '@/icons'
// 把element-ui中导出的所有组件注册成全局组件
Vue.use(ElementUI)
// 上线后如果有警告要不要展示
Vue.config.productionTip = false

// vue实例化
// 注入router和store实例，方便项目直接使用this.$router 和 this.$store
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
