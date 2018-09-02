<template>
	<div class="menu-bg text-center menu-view">
		<el-row class="tac">
	    <el-col>
		    <el-menu class="el-menu-vertical-demo">
		    	<div v-for="(item, index) in routers">
						<el-menu-item :index="String(index)" @click="go(item.link)">
			        <span slot="title">{{item.label}}</span>
			      </el-menu-item>
		    	</div>
		    </el-menu>
		  </el-col>
	  </el-row>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				routers: []
			}
		},
		methods: {
			go(url){
				this.$router.push(url)
			},
			errorMsg(msg, color = 'error'){
				this.$message({
          type: color,
          message: msg || "操作未能进行！"
      	});
			},
			initData(){
				this.$axios.get('/api/admin/getRoleRouter')
				.then((result) => {
					let code = result.data.code;
					if(code === 200){
						this.routers = result.data.value;
					}else{
						this.errorMsg(result.data.text, 'warning')
					}
				})
				.catch(() => {
					this.errorMsg()
				})
			}
		},
		beforeRouteEnter(to, from, next){
			next(async (vm) => {
				await vm.initData()
			})
		}
	}
</script>
<style scoped>
	.el-menu{
		border: 0;
	}
	.menu-bg{
		overflow-y: auto;
		overflow-x: hidden;
	}
</style>