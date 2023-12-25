export default {
  // 命名空间
  namespaced:true,
  // 函数写法
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters:{

  }
}


// 语法：使用与子模块的各个数据和方法
// 1.使用state：
// 使用一次：
// this.$store.state.user.xxx
/**
 * 重复使用情况：辅助函数
 * import { mapstate } from 'vuex'
 * computed:{
 * ...mapstate('model',['属性名1','属性名2',.....])
 * }
 */

// 2.使用getters:
// 使用一次： this.$store.getters['user/getters方法名']
/**
 * 重复使用：
 * import {mapGetters} from 'vuex'
 * computer:{
 *  ...mapGetters('model',['getters方法名1',........])
 * }
 */

// 3.使用mutations：
// 一次使用：this.$store.commit('model/方法名',参数)  参数只能传一个  要传多个可以封装对象
/**
 * import {mapMutations} from 'vuex'
 * methods:{
 * ...mapMutations('model',['方法名1',.......])
 * }
 */

// 4.使用actions的方法
// 一次使用：this.$store.dispatch('model/方法名',参数) 同mutations
/**
 * import {mapActions} from 'vuex'
 * methods:{
 * ...mapActions('model',['方法名',...])
 * }
 */