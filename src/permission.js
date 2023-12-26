import router from '@/router'
import store from '@/store'

// 设置白名单
const whiteList = ['/login', '/404']
// 设置路由导航守卫逻辑，确保用户在访问页面之前满足相应的登录条件
router.beforeEach((to, from, next) => {
  // to：当前跳转的路由对象
  // from：从哪里来
  // next：放行next() 重定向next(路径)
  const token = store.state.user.token
  if (token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
