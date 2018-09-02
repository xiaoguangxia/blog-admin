<template>
	<div>
		<el-row :gutter="20">
		  <el-col :span="8">
		  	<div class="box-shadow bor1 p20">
		  		<div class="text-left">
						<el-row>
							<el-col :span="8">
								<div class="user-icon">
									<img src="../../assets/admin-user.png" alt="" />
								</div>
							</el-col>
							<el-col :span="16">
								<div class="user-name">
									<p class="sky-blue">{{dataList.user.name}}</p>
								</div>
							</el-col>
						</el-row>
					</div>
					<div class="information">
						<ul class="format">
							<li>
								<label>本次登录时间：</label>
								<span>{{dataList.user.prev}}</span>
							</li>
							<li>
								<label>本次登录IP：</label>
								<span>{{dataList.user.ip}}</span>
							</li>
							<li>
								<label>我的权限：</label>
								<el-button @click="boxModule = !boxModule" class="view-btn" size="mini" type="text">权限查看</el-button>
							</li>
						</ul>
					</div>
		  	</div>
		  </el-col>
		  <el-col :span="16">
				<div class="pd20">
					<el-row :gutter="20" >
						<el-col class="mb20" :span="12">
							<div class="box-shadow bor1 clearfix bg-green">
								<div class="color-pannel">
									<div class="middel">
										<i class="el-icon-service ico"></i>
									</div>
								</div>
								<div class="pull-left pl30">
									<div class="board">
										<h3>{{dataList.count.admin}}</h3>
										<p>管理员总数</p>
									</div>
								</div>
							</div>
						</el-col>
						<el-col class="mb20" :span="12">
							<div class="box-shadow bor1 clearfix bg-yellow">
								<div class="color-pannel">
									<div class="middel">
										<i class="el-icon-printer ico"></i>
									</div>
								</div>
								<div class="pull-left pl30">
									<div class="board">
										<h3>{{dataList.count.mem}}</h3>
										<p>注册用户总数</p>
									</div>
								</div>
							</div>
						</el-col>
						<el-col class="mb20" :span="12">
							<div class="box-shadow bor1 clearfix bg-blue">
								<div class="color-pannel">
									<div class="middel">
										<i class="el-icon-document ico"></i>
									</div>
								</div>
								<div class="pull-left pl30">
									<div class="board">
										<h3>{{dataList.count.atc}}</h3>
										<p>文档总数</p>
									</div>
								</div>
							</div>
						</el-col>
						<el-col class="mb20" :span="12">
							<div class="box-shadow bor1 clearfix bg-red">
								<div class="color-pannel">
									<div class="middel">
										<i class="el-icon-message ico"></i>
									</div>
								</div>
								<div class="pull-left pl30">
									<div class="board">
										<h3>{{dataList.count.msg}}</h3>
										<p>留言总数</p>
									</div>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>
		  </el-col>
		</el-row>
		<el-row class="mt20" :gutter="20">
			<el-col :span="12">
				<div class="box-shadow bor1 model">
					<h3>最新评价</h3>
					<div class="reply-list">
						<div v-if="dataList.msg.length">
							<ul>
								<li v-for="item in dataList.msg" :key="item._id">
									<div class="head pr text-left text-nowrap">
										<span class="sky-blue">{{item.user}}</span>
										<span v-if="item.reply"><span class="red"> @ </span><span class="sky-blue">{{item.reply}}</span></span>
										<span> 在 </span>
										<a href="#" :title="item.title" >{{item.title}}</a>
										<div class="date text-nowrap text-right">
											<i class="el-icon-time"></i>
											<span>{{dateStringify(item.date)}}</span>
										</div>
									</div>
									<div class="msg clearfix">
										<div class="user-logo">
											<img src="../../assets/admin-user.png" alt="" />
										</div>
										<div class="text-bg">
											<div class="text">
												<p class="word-wrap">{{item.text}}</p>
											</div>
										</div>
									</div>
								</li>
							</ul>
						</div>
						<div v-else>
							<div class="p20">暂无留言内容……</div>
						</div>
					</div>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="box-shadow bor1 model bor-b">
					<h3>最新注册用户</h3>
					<div class="new-user clearfix p20">
						<div v-if="dataList.mem.length">
							<ul>
								<li v-for="item in dataList.mem" :key="item._id">
									<img src="../../assets/admin-user.png" alt="" />
									<p class="text-nowrap">{{item.username}}</p>
								</li>
							</ul>
						</div>
						<div v-else>
							<div>暂无注册会员……</div>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-dialog
			  title="角色权限"
			  :visible.sync="boxModule"
			  @open="open_dialog"
			  width="40%">
			  <el-tree
				  :data="dataList.user.role.list"
				  :show-checkbox="true"
				  accordion
				  ref="tree"
				  node-key="_id"
  				:default-checked-keys="dataList.user.role.have">
				</el-tree>
			</el-dialog>
	</div>
</template>
<script>
	import store from '@/vuex/store'
	import { mapState, mapMutations } from 'vuex'
	export default {
		data(){
			return {
				dataList: {
					user: {
						prev: '',
						name: '',
						ip: '',
						role: {
							have: [],
							list: []
						}
					},
					count: {
						admin: 0,
						mem: 0,
						atc: 0,
						msg: 0
					},
					msg: [],
					mem: []
				},
				defaultProps: {
          children: 'children',
          label: 'label'
        },
				boxModule: false
			}
		},
		store,
		computed: {
			...mapState(['name', 'loading'])
		},
		methods: {
			...mapMutations(['setUserName', 'cloneLoading']),
			open_dialog(){
				setTimeout(() => {
      		this.$refs.tree.setCheckedKeys(this.dataList.user.role.have)
      	}, 0)
			},
			dateStringify(o){
				let n = new Date().getTime();
		    let f = n - o;
		    let bs = (f >= 0 ? '前' : '后');//判断时间点是在当前时间的 之前 还是 之后
		    f = Math.abs(f);
		    if( f < 6e4 ){ return '刚刚' }//小于60秒,刚刚
		    if( f < 36e5 ){ return parseInt(f/6e4)+' 分钟'+bs }//小于1小时,按分钟
		    if( f < 864e5 ){ return parseInt(f/36e5)+' 小时'+bs }//小于1天按小时
		    if( f < 2592e6 ){ return parseInt(f/864e5)+' 天'+bs }//小于1个月(30天),按天数
		    if( f < 31536e6 ){ return parseInt(f/2592e6)+' 个月'+bs }//小于1年(365天),按月数
		    return parseInt( f / 31536e6 ) + ' 年' + bs;//大于365天,按年算
			},
			errorMsg(msg, color = 'error'){
				this.$message({
          type: color,
          message: msg || "操作未能进行！"
      	});
			},
			andNoChecked(data){
				for(let arg of data){
					arg['disabled'] = true;
					if(arg.children){
						this.andNoChecked(arg.children)
					}
				}
			},
			initData(){
				this.$axios.get('/api/admin/getAdminData')
				.then((result) => {
					// 关闭loading
					this.cloneLoading()
					// 请求信息
					let data = result.data;
					if(data.code === 200){
						let d = data.value;
						this.andNoChecked(d.user.role.list);
						this.dataList = d;
						let name = this.dataList.user.name;
						window.localStorage.adminUM = name;
						this.setUserName(name)
					}else{
						// 关闭loading
						this.cloneLoading();
						// 处理错误
	        	this.errorMsg()
					}

				})
				.catch((err) => {
					// 关闭loading
					this.cloneLoading();
					// 处理错误
					this.errorMsg('数据获取失败！', 'warning')
				})
			}
		},
		created(){
			this.initData()
		}
	}
</script>
<style scoped>
	.mb20{
		margin-bottom: 20px;
	}
	.user-icon img{
		max-height: 30px;
	}
	.user-name{
		height: 30px;
		line-height: 30px;
		font-weight: bold;
	}
	.information{
		border-top: 1px solid #ddd;
		font-size: 12px;
		line-height: 24px;
		text-align: left;
		padding-top: 10px;
		margin-top: 10px;
	}
	.format label,
	.format span{
		padding: 0;
		display: inline-block;
		vertical-align: top;
	}
	.format label{
		width: 40%;
	}
	.view-btn{
		max-height: 24px;
		padding: 0;
		line-height: 20px;
	}
	.color-pannel{
		padding: 20px 0;
		text-align: center;
		float: left;
		width: 30%;
	}
	.ico{
		font-size: 200%;
		font-weight: bold;
		color: #fff;
	}
	.bg-green{
		background: rgb(103, 194, 58);
	}
	.bg-blue{
		background: rgb(64, 158, 255);
	}
	.bg-yellow{
		background: rgb(235, 158, 5);
	}
	.bg-red{
		background: rgb(250, 85, 85);
	}
	.bg-green h3{
		color: rgb(103, 194, 58);
	}
	.bg-blue h3{
		color: rgb(64, 158, 255);
	}
	.bg-yellow h3{
		color: rgb(235, 158, 5);
	}
	.pl30{
		width: 70%;
		padding-left: 30%;
		margin-left: -30%;
	}
	.board{
		background: #fff;
		text-align: center;
		height: 72px;
	}
	.bg-red h3{
		color: rgb(250, 85, 85);
	}
	.board h3{
		padding: 15px 0 5px;
		font-size: 22px;
	}
	.board p{
		font-size: 12px;
		color: #999;
		padding: 0 0 10px;
	}
	.model h3{
		text-align: left;
		font-weight: normal;
		font-size: 14px;
		padding: 10px 0 10px 10px;
		border-bottom: 1px solid #ddd;
	}
	.head{
		font-size: 12px;
		line-height: 24px;
		height: 24px;
		padding: 5px;
		padding-right: 70px;
		overflow: hidden;
	}
	.head a{
		font-size: 12px;
	}
	.date{
		position: absolute;
		right: 5px;
		top: 5px;
		bottom: 0;
		width: 70px;
		line-height: 24px;
		height: 24px;
	}
	.msg .text-bg{
		padding-top: 6px;
	}
	.msg .user-logo{
		float: left;
		width: 40px;
	}
	.msg img{
		width: 30px;
		margin: 5px;
	}
	.msg .text{
		border-radius: 5px;
		position: relative;
		padding: 5px 10px;
		margin: 0 5px 0 50px;
		color: #5a5e66;
		background-color: #edf2fc;
		font-size: 12px;
	}
	.text::before{
		margin-top: -6px;
		position: absolute;
		right: 100%;
		top: 15px;
		border: 5px solid transparent;
		border-right-color: #edf2fc;
		content: " ";
		height: 0;
		width: 0;
		pointer-events: none;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
	.reply-list li{
		padding: 10px 10px;
		border-bottom: 1px solid #ddd;
	}
	.reply-list li:hover{
		background: #fafafa;
	}
	.new-user li{
		width: 120px;
		float: left;
		text-align: center;
		font-size: 13px;
		position: relative;
		line-height: 26px;
		display: block;
	  text-overflow:ellipsis;
	  overflow: hidden;
	  white-space: nowrap;
	  margin-bottom: 10px;
	}
	.new-user img{
		position: absolute;
		max-height: 26px;
		left: 0;
		top: 0;
		bottom: 0;
	}
	.new-user p{
		padding-left: 30px;
		padding-right: 10px;
		text-align: left;
	}
</style>