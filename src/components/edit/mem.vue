<template>
	<div>
		<div class="text-left">
			<el-button @click="showAddBox" size="mini" type="primary" icon="el-icon-edit">添加</el-button>
			<el-button @click="showDeleteBox" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
		</div>
		<div class="tables pt10 text-left">
			<el-table
		    ref="multipleTable"
		    :data="tableData"
		    tooltip-effect="dark"
		    style="width: 100%"
		    @selection-change="SelectionChange">
		    <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
		    <el-table-column
		    	prop="username"
		      label="用户名"
		      width="150">
		    </el-table-column>
		    <el-table-column
		      prop="name"
		      label="昵称"
		      width="130">
		    </el-table-column>
		    <el-table-column
		      prop="email"
		      label="电子邮箱">
		    </el-table-column>
		    <el-table-column
		    	fixed="right"
		      label="操作"
		      width="85">
		      <template slot-scope="scope">
		      	<el-button class="btn-mini" size="mini" @click="jumpUrl(scope.row)" type="primary" plain icon="el-icon-edit-outline" circle></el-button>
		      	<el-button class="btn-mini" size="mini" @click="deleteOne(scope.row)" type="danger" plain icon="el-icon-delete" circle></el-button>
		      </template>
		    </el-table-column>
		  </el-table>
		  <div class="mt20 text-center">
		    <el-pagination
		    	background
		      @current-change="changePage"
		      :page-size="20"
		      :current-page.sync="curPage"
		      layout="total, prev, pager, next"
		      :total="total">
		    </el-pagination>
	    </div>
		</div>
		<div>
			<el-dialog
			  title="会员信息"
			  :visible.sync="boxModule"
			  width="40%">
				<ul class="tag-modal clearfix">
					<li>
						<span>用户名：</span>
						<div class="tag-input">
							<el-input size="mini" v-model="submit.username" placeholder="请输入内容"></el-input>
						</div>
					</li>
					<li class="mt10">
						<span>昵称：</span>
						<div class="tag-input">
							<el-input size="mini" v-model="submit.name" placeholder="请输入内容"></el-input>
						</div>
					</li>
					<li class="mt10">
						<span>密码：</span>
						<div class="tag-input">
							<el-input size="mini" v-model="submit.password1" placeholder="请输入内容"></el-input>
						</div>
					</li>
					<li class="mt10">
						<span>确认密码：</span>
						<div class="tag-input">
							<el-input size="mini" v-model="submit.password2" placeholder="请输入内容"></el-input>
						</div>
					</li>
					<li class="mt10">
						<span>电子邮箱：</span>
						<div class="tag-input">
							<el-input size="mini" v-model="submit.email" placeholder="请输入内容"></el-input>
						</div>
					</li>
					<li class="mt10">
						<span>备注说明：</span>
						<div class="tag-input text-left">
							<el-input
								size="mini"
							  type="textarea"
							  :rows="2"
							  placeholder="请输入内容"
							  v-model="submit.note">
							</el-input>
						</div>
					</li>
				</ul>
			  <span slot="footer" class="dialog-footer">
			    <el-button v-if="!isReset" size="mini" @click="addMember" type="primary">添 加</el-button>
			    <el-button v-else size="mini" @click="updateMem" type="primary">修 改</el-button>
			  </span>
			</el-dialog>
		</div>
	</div>
</template>
<script>
	import store from '@/vuex/store'
	import { mapState, mapMutations } from 'vuex'
	export default {
		data(){
			return {
				submit: {
					_id: '',
					name: '',
					note: '',
					email: '',
					username: '',
					password1: '',
					password2: ''
				},
				select: [],
				total: 0,
				curPage: 1,
				isReset: false,  //是否修改
				boxModule: false,
				tableData: []
			}
		},
		store,
		computed: {
			...mapState(['loading'])
		},
		methods: {
			...mapMutations(['cloneLoading', 'openLoading']),
			jumpUrl(row){  //修改-查看
				let C = this.submit;
				C.name = row.name;
				C.note = row.note;
				C.email = row.email;
				C.username = row.username;
				C._id = row._id;
				C.password1 = C.password2 = '';
				this.isReset = true;
        this.boxModule = true;
      },
			SelectionChange(val){
				this.select = [];
				for(let arg of val){
					this.select.push(arg._id)
				}
			},
			showDeleteBox(){
				let len = this.select.length;
				if(len){
					this.alertBox()
				}else{
					this.errorMsg('请选择内容！', 'warning')
				}
			},
			showAddBox(){
				let u = this.submit;
				u._id =
				u.name =
				u.email =
				u.username =
				u.password1 =
				u.password2 =
				u.note = '';
				this.isReset = false;
				this.boxModule = true;
			},
			testVal(data){
				if(data.name && data.note && data.email && data.username && data.password1 === data.password2){
					return {
						_id: data._id,
						name: data.name,
						note: data.note,
						email: data.email,
						username: data.username,
						password: data.password1
					}
				}
				this.errorMsg('数据不符合要求！', 'warning')
			},
			addMember(){
				let data = this.submit;
				let bool = this.testVal(data);
				if(!bool){
					return
				}
				this.getNewData('addMember', bool)
			},
			updateMem(){
				let data = this.submit;
				let bool = this.testVal(data);
				if(!bool){
					return
				}
				this.getNewData('updateMem', bool)
			},
			getNewData(str, data){
				this.$axios.get('/api/mem/'+str, {
					params: data
				})
				.then((result) => {
					let code = result.data.code;
					this.boxModule = false;
					if(code === 200){
						this.curPage = 1;
						this.changePage();
						this.errorMsg(result.data.text, 'success')
					}else{
						this.errorMsg(result.data.text, 'warning')
					}
				})
				.catch(() => {
        	this.errorMsg()
        })
			},
			deleteOne(row){
				this.$confirm(
      		'此操作将永久删除该会员, 是否继续?',
      		'提示',
      		{
	          confirmButtonText: '确定',
          	cancelButtonText: '取消',
	          type: 'warning'
        })
        .then(() => {
        	this.removeData(row)
        })
        .catch(() => {})
			},
			alertBox(){
				this.$confirm(
      		'此操作将永久删除选中的会员, 是否继续？',
      		'提示',
      		{
	          confirmButtonText: '确定',
	          type: 'warning',
        })
        .then(() => {
        	this.removeData()
        })
        .catch(() => {})
			},
			removeData(row){
				let data = row ? row._id : this.select.toString();
				this.$axios.get('/api/mem/removeMem', {
					params: {
						_id: data
					}
				})
				.then((result) => {
					let code = result.data.code;
					if(code === 200){
						this.curPage = 1;
						this.select = [];
						this.changePage();
						this.errorMsg(result.data.text, 'success')
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
			changePage(index){
				// 遮罩
      	this.openLoading();
      	// 请求
				this.$axios.get('/api/mem/dirMember', {
					params: {
						page: index || 1
					}
				})
				.then((result) => {
					// 关闭loading
					this.cloneLoading();
					// 请求信息
					let code = result.data.code;
					if(code === 200){
						this.tableData = result.data.value.result;
						this.total = result.data.value.total;
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
			this.changePage()
		}
	}
</script>
<style scoped>
	.el-button.btn-mini{
		padding: 5px;
	}
	.mark{
		border-radius: 4px;
		padding: 0 5px;
		font-size: 12px;
	}
	.bg-sky{
		background: rgba(64,158,255,.1);
		border: 1px solid rgba(64,158,255,.2);
		color: #409EFF;
	}
	.bg-red{
		background-color: rgba(245,108,108,.1);
		border: 1px solid rgba(245,108,108,.2);
		color: #f56c6c;
	}
	.box-log-msg{
		font-size: 18px;
		color: red;
		font-weight: bold;
	}
</style>