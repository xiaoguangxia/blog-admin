<template>
	<div class="header-view clearfix box-shadow">
		<div class="logo">
			<img src="../../assets/admin-logo.png" alt="" />
		</div>
		<div class="user">
			<el-dropdown @command="SignOut">
			  <span class="el-dropdown-link u-data">
			  	<span>{{name}}</span>
					<img src="../../assets/admin-user.png" alt="" />
			    <i class="el-icon-arrow-down el-icon--right"></i>
			  </span>
			  <el-dropdown-menu slot="dropdown">
			    <el-dropdown-item>退出登录</el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>
<script>
	import store from '@/vuex/store'
	import { mapState, mapMutations } from 'vuex'
	export default {
		data(){
			return {

			}
		},
		store,
		computed: {
			...mapState(['name']),
		},
		methods: {
			...mapMutations(['setUserName']),
			errorMsg(msg, color = 'error'){
				this.$message({
          type: color,
          message: msg || "操作未能进行！"
      	});
			},
			SignOut(){
				this.$axios.get('/api/admin/signOut')
				.then((result) => {
					let code = result.data.code;
					if(code === 200){
						window.localStorage.adminUM = '';
		      	this.errorMsg(`${result.data.text} 1 秒后返回登录系统！`, 'success')
		      	window.setTimeout(() => {
		      		window.location.href = '/admin_login.html'
		      	}, 1000)
					}else{
						this.errorMsg(result.data.text, 'warning')
					}
				})
				.catch(() => {
					this.errorMsg()
				})
			}
		},
		created(){
			let username = window.localStorage.adminUM;
			if(username){
				this.setUserName(username)
			}
		}
	}
</script>
<style scoped>
	.logo{
		float: left;
		height: 60px;
	}
	.header-view img{
		max-height: 60px;
	}
	.user{
		float: right;
		padding: 15px 20px;
		max-height: 60px;
		cursor: pointer;
	}
	.u-data *{
		display: inline-block;
		vertical-align: middle;
	}
	.user img{
		height: 30px;
	}
</style>