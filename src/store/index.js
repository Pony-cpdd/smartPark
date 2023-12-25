import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
Vue.use(Vuex)

const store = new Vuex.Store({
  // 存放数据
  // state:{},
  // 调用异步方法 异步接口
  // actions:{},
  // 修改state的数据（唯一入口）
  // mutations:{},
  // 类似计算属性，依赖state中的数据，进行计算新的数据
  // getters:{},
  // 组合模块的配置项
  modules: {
    user
  }
})

export default store
