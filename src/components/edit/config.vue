<template>
	<div>
		<el-form ref="form" :model="form" label-width="130px">
		  <el-form-item label="网站名称">
		    <el-input size="mini" v-model="form.name"></el-input>
		  </el-form-item>
		  <el-form-item label="绑定域名">
		    <el-input size="mini" v-model="form.domain"></el-input>
		  </el-form-item>
		  <el-form-item label="开启邮箱提醒">
		    <el-switch v-model="form.remind"></el-switch>
		  </el-form-item>
		  <el-form-item label="系统邮件类型">
				<el-select size="mini" v-model="form.mtype" placeholder="请选择">
			    <el-option
			      v-for="item in options"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
		  </el-form-item>
			<el-form-item label="系统邮件信息">
				<div class="clearfix">
					<div class="w50s pull-left">
						<el-input size="mini" v-model="form.email.username">
					    <template slot="prepend">用户名</template>
					  </el-input>
					</div>
					<div class="w3s pull-left"></div>
					<div class="w50s pull-left">
						<el-input size="mini" v-model="form.email.password">
					    <template slot="prepend">识别码</template>
					  </el-input>
					</div>
				</div>
		  </el-form-item>
		  <el-form-item label="网站底部信息">
		    <el-input type="textarea" v-model="form.footer"></el-input>
		  </el-form-item>
		  <el-form-item label="留言快捷审批">
		    <el-switch v-model="form.agree"></el-switch>
		  </el-form-item>
		  <el-form-item label="留言时间间隔">
		    <div class="clearfix">
		    	<div class="w100 pull-left">
			    	<el-input size="mini" v-model="form.interval"></el-input>
			    </div>
			    <div class="pull-left ml10">分钟</div>
		    </div>
		  </el-form-item>
		  <el-form-item label="允许注册会员">
		    <el-switch v-model="form.register"></el-switch>
		  </el-form-item>
		  <el-form-item>
		    <el-button size="mini" type="success" @click="onSubmit">保 存</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>
<script>
	import store from '@/vuex/store'
	import { mapState, mapMutations } from 'vuex'
	export default {
		data(){
			return {
				form: {
					name: '',
					domain: '',
					email: {
						username: '',
						password: ''
					},
					remind: true,
					mtype: 'gmail',
					agree: true,
					interval: 0,
					register: true,
					footer: ''
				},
				options: [
					{
						value: 'gmail',
						label: '谷歌Gmail邮箱'
					},{
						value: 'qq',
						label: '腾讯QQ邮箱'
					},{
						value: '163',
						label: '网易163邮箱'
					}
				]
			}
		},
		store,
		computed: {
			...mapState(['loading'])
		},
		methods: {
			...mapMutations(['cloneLoading', 'openLoading']),
			onSubmit(){
				this.$axios.get('/api/config/setConfigData', {
					params: this.form
				})
				.then((result) => {
					let code = result.data.code;
					if(code === 200){
						this.errorMsg(result.data.text, 'success')
		      	this.initData()
					}else{
						this.errorMsg(result.data.text, 'warning')
					}
				})
				.catch(() => {
        	this.errorMsg()
        })
			},
			errorMsg(msg, color = 'error'){
				this.$message({
          type: color,
          message: msg || "操作未能进行！"
      	});
			},
			initData(){
				// 遮罩
      	this.openLoading();
      	// 请求
				this.$axios.get('/api/config/getConfigData')
				.then((result) => {
					// 关闭loading
					this.cloneLoading();
					// 请求信息
					let code = result.data.code;
					if(code === 200){
						this.form = result.data.value;
					}else{
						this.errorMsg(result.data.text, 'warning')
					}
				})
				.catch(() => {
					// 关闭loading
					this.cloneLoading();
					// 错误处理
        	this.errorMsg()
        })
			}
		},
		created(){
			this.initData()
		}
	}
</script>
<style scoped>
	.ml10{
		margin-left: 10px;
	}
	.w100{
		width: 100px;
	}
	.w50s{
		width: 49%;
	}
	.w3s{
		width: 2%;
		height: 28px;
	}
</style>