<template>
  <div id="app">
    <!-- 内容 -->
    <transition name="getInto">
    <div v-show="!loading">
      <div class="header-view box-shadow">
        <router-view name="header"/>
      </div>
      <div class="body-view">
        <div class="menu-view box-shadow">
          <router-view name="menu"/>
        </div>
        <div class="content-view">
          <router-view name="content"/>
        </div>
      </div>
      <div class="login-view">
        <router-view name="login"/>
      </div>
    </div>
    </transition>
    <!-- loading -->
    <loading></loading>
  </div>
</template>
<script>
  import store from '@/vuex/store'
  import { mapState } from 'vuex'
  import Loading from '@/components/public/loading'
  export default {
    data(){
      return {

      }
    },
    store,
    computed: {
      ...mapState(['loading'])
    },
    components: {
      Loading
    }
  }
</script>
<style>
  @import './style/public.css';
  @import './style/loading.css';
  body {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  #app{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
  .body-view{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    position: absolute;
    top:60px;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .header-view{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    border: 0;
    border-bottom: 1px solid #ddd;
    z-index: 2;
    overflow: hidden;
  }
  .menu-view{
    width: 200px;
    height: 100%;
  }
  .content-view{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow-y: scroll;
    padding: 20px;
    overflow: auto;
    border-left: 1px solid #ddd
  }
  .tag-modal li>span{
    display: block;
    line-height: 28px;
    text-align: right;
    width: 30%;
    float: left;
  }
  .tag-input{
    margin-left: 30%;
    line-height: 24px;
    width: 70%;
  }
  .w100{
    width: 100%;
  }
</style>
