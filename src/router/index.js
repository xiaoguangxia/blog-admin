import Vue from 'vue'
import store from '../vuex/store'
import Router from 'vue-router'

Vue.use(Router)

import Header from '@/components/public/header'
import Menu from '@/components/public/menu'

let Atc = () => import(/* webpackChunkName: "group-atc" */ '@/components/edit/atc');
let Tag = () => import(/* webpackChunkName: "group-tag" */ '@/components/edit/tag');
let Msg = () => import(/* webpackChunkName: "group-msg" */ '@/components/edit/msg');
let Log = () => import(/* webpackChunkName: "group-log" */ '@/components/edit/log');
let New = () => import(/* webpackChunkName: "group-new" */ '@/components/edit/new');
let Mem = () => import(/* webpackChunkName: "group-mem" */ '@/components/edit/mem');
let Main = () => import(/* webpackChunkName: "group-main" */ '@/components/edit/main');
let User = () => import(/* webpackChunkName: "group-user" */ '@/components/edit/user');
let Role = () => import(/* webpackChunkName: "group-role" */ '@/components/edit/role');
let Dump = () => import(/* webpackChunkName: "group-dump" */ '@/components/edit/dump');
let Link = () => import(/* webpackChunkName: "group-link" */ '@/components/edit/link');
let Type = () => import(/* webpackChunkName: "group-type" */ '@/components/edit/type');
let Write = () => import(/* webpackChunkName: "group-write" */ '@/components/edit/write');
let Slide = () => import(/* webpackChunkName: "group-slide" */ '@/components/edit/slide');
let Config = () => import(/* webpackChunkName: "group-config" */ '@/components/edit/config');

let router = new Router({
	mode: 'hash',
  base: '/manage.html',
  routes: [
    {
      path: '/',
      components: {
      	menu: Menu,
      	header: Header,
      	content: Main
      },
      meta: {
        title: '后台管理'
      }
    },{
    	path: '/atc',
    	components: {
      	menu: Menu,
      	header: Header,
      	content: Atc
      },
      meta: {
        title: '文章管理'
      }
    },{
      path: '/slide',
      components: {
        menu: Menu,
        header: Header,
        content: Slide
      },
      meta: {
        title: '轮播管理'
      }
    },{
    	path: '/tag',
    	components: {
      	menu: Menu,
      	header: Header,
      	content: Tag
      },
      meta: {
        title: '标签管理'
      }
    },{
    	path: '/msg',
    	components: {
      	menu: Menu,
      	header: Header,
      	content: Msg
      },
      meta: {
        title: '留言管理'
      }
    },{
    	path: '/log',
    	components: {
      	menu: Menu,
      	header: Header,
      	content: Log
      },
      meta: {
        title: '日志管理'
      }
    },{
    	path: '/new',
    	components: {
      	menu: Menu,
      	header: Header,
      	content: New
      },
      meta: {
        title: '消息管理'
      }
    },{
    	path: '/user',
    	components: {
      	menu: Menu,
      	header: Header,
      	content: User
      },
      meta: {
        title: '用户管理'
      }
    },{
    	path: '/role',
    	components: {
      	menu: Menu,
      	header: Header,
      	content: Role
      },
      meta: {
        title: '角色管理'
      }
    },{
    	path: '/dump',
    	components: {
      	menu: Menu,
      	header: Header,
      	content: Dump
      },
      meta: {
        title: '数据备份管理'
      }
    },{
    	path: '/link',
    	components: {
      	menu: Menu,
      	header: Header,
      	content: Link
      },
      meta: {
        title: '友链管理'
      }
    },{
    	path: '/type',
    	components: {
      	menu: Menu,
      	header: Header,
      	content: Type
      },
      meta: {
        title: '分类管理'
      }
    },{
    	path: '/mem',
    	components: {
      	menu: Menu,
      	header: Header,
      	content: Mem
      },
      meta: {
        title: '会员管理'
      }
    },{
    	path: '/write',
    	components: {
      	menu: Menu,
      	header: Header,
      	content: Write
      },
      meta: {
        title: '新增文章'
      }
    },{
      path: '/config',
      components: {
        menu: Menu,
        header: Header,
        content: Config
      },
      meta: {
        title: '网站配置'
      }
    },
    {
      path: '*',
      components: {
        menu: Menu,
        header: Header,
        content: Main
      },
      meta: {
        title: '后台管理'
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  store.state.loading = true
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
// router.afterEach((to, from) => {
//   store.state.loading = true
// })
export default router