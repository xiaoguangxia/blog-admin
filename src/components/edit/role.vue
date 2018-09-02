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
		    	prop="name"
		      label="角色名"
		      width="150">
		    </el-table-column>
		    <el-table-column
		      prop="note"
		      label="角色描述">
		    </el-table-column>
		    <el-table-column
		    	fixed="right"
		      label="操作"
		      width="120">
		      <template slot-scope="scope">
		      	<el-button class="btn-mini" size="mini" @click="jumpUrl(scope.row)" type="primary" plain icon="el-icon-edit-outline" circle></el-button>
		      	<el-button class="btn-mini" size="mini" @click="jumpTree(scope.row)" type="warning" plain icon="el-icon-date" circle></el-button>
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
			  title="角色信息"
			  :visible.sync="boxModule"
			  width="40%">
				<ul class="tag-modal clearfix">
					<li>
						<span>角色名称：</span>
						<div class="tag-input">
							<el-input size="mini" v-model="submit.name" placeholder="请输入内容"></el-input>
						</div>
					</li>
					<li class="mt10">
						<span>角色描述：</span>
						<div class="tag-input">
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
			    <el-button v-if="!isReset" size="mini" @click="addRole" type="primary">添 加</el-button>
			    <el-button v-else size="mini" @click="updateRole" type="primary">修 改</el-button>
			  </span>
			</el-dialog>
		</div>
		<div>
			<el-dialog
			  title="角色权限"
			  :visible.sync="boxModule2"
			  @open="open_dialog"
			  width="40%">
			  <el-tree
				  :data="treeData"
				  :show-checkbox="true"
				  accordion
				  ref="tree"
				  node-key="_id"
  				:default-checked-keys="tree_checked">
				</el-tree>
			  <span slot="footer" class="dialog-footer">
			    <el-button size="mini" @click="resetRoleRight" type="primary">修 改</el-button>
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
				submit:{
					_id: '',
					name: '',
					note: ''
				},
				curPage: 0,
				total: 0,
				select: [],
				isReset: false,  //是否修改
				boxModule: false,
				boxModule2: false,
				tableData: [],
				tree_checked: [],
				treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
			}
		},
		store,
		computed: {
			...mapState(['loading'])
		},
		methods:{
			...mapMutations(['cloneLoading', 'openLoading']),
			jumpUrl(row){  //修改-查看
				let D = this.submit;
				D._id = row._id;
				D.name = row.name;
				D.note = row.note;
				this.isReset = true;
        this.boxModule = true;
      },
      open_dialog(){
      	setTimeout(() => {
      		this.$refs.tree.setCheckedKeys(this.tree_checked)
      	}, 0)
      },
      jumpTree(row){
      	this.submit._id = row._id;
      	this.tree_checked = row.role;
      	this.boxModule2 = true;
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
					this.alertBox();
				}else{
					this.errorMsg('请选择相关内容！', 'warning')
				}
			},
			showAddBox(){
				let D = this.submit;
				D.name = D.note = D._id = '';
				this.isReset = false;
				this.boxModule = true;
			},
			testVal(data){
				if(data.name && data.note){
					return {
						_id: this.submit._id,
						name: this.submit.name,
						note: this.submit.note
					}
				}
				this.errorMsg('数据不符合要求！', 'warning')
			},
			addRole(){
				let data = this.submit;
				let bool = this.testVal(data);
				if(!bool){
					return
				}
				this.getNewData('addRole', bool)
			},
			updateRole(){
				let data = this.submit;
				let bool = this.testVal(data);
				if(!bool){
					return
				}
				this.getNewData('updateRole', bool)
			},
			getNewData(str, data){
				this.$axios.get('/api/role/'+str, {
					params: data
				})
				.then((result) => {
					let code = result.data.code;
					if(code === 200){
						this.curPage = 1;
						this.boxModule = false;
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
			resetRoleRouter(selectRole, allRole){
				let json = {};
				let arr = []
				for(let arg of allRole){
					if(!arg.children){
						json[arg._id] = true;
						break
					}
					for(let arg2 of arg.children){
						for(let arg3 of selectRole){
							if(arg3 === arg2._id){
								json[arg._id] = true
							}
						}
					}
				}
				for(let arg of allRole){
					if(json[arg._id]){
						arr.push({
							_id: arg._id,
							link: arg.link,
							label: arg.label
						})
					}
				}
				let str = '';
				for(let arg of arr){
					str += `_id=${arg._id}&link=${arg.link}&label=${arg.label},`
				}
				return str.substring(0, str.length-1)
			},
			resetRoleRight(){  //修改权限0
				let selectRole = this.$refs.tree.getCheckedKeys();
				let data = {
					_id: this.submit._id,
					role: selectRole.toString(),
					route: this.resetRoleRouter(selectRole, this.treeData)
				}
				this.getNewData('updateRole', data);
				this.boxModule2 = false
			},
			deleteOne(row){
				this.$confirm(
      		'此操作将永久删除该角色, 是否继续?',
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
      		'此操作将永久删除选中的角色, 是否继续？',
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
				this.$axios.get('/api/role/removeRole', {
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
				this.$axios.get('/api/role/dirRoleList', {
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
			},
			getRoleList(){
				// 权限列表
				this.$axios.get('/api/role/getRoleList')
				.then((result) => {
					let data = result.data;
					if(data.code === 200){
						this.treeData = result.data.value
					}else{
						this.errorMsg(data.text, 'warning')
					}
				})
				.catch((e) => {
					this.errorMsg()
				})
			}
		},
		created(){
			// 数据列表
			this.changePage();
			// 权限列表
			this.getRoleList()
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
	.w100{
		width: 100%;
	}
</style>