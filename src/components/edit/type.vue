<template>
	<div>
		<div class="text-left">
			<el-button @click="showTypeModule" size="mini" type="success" icon="el-icon-edit">添加分类</el-button>
		</div>
		<div class="tables pt10 text-left">
			<el-tree
				:data="treeData"
				:props="defaultProps"
				@node-click="handleNodeClick">
					<div class="custom-tree-node lin28" slot-scope="{node, data}">
		        <div class="clearfix lin28">
			        <span class="">{{ node.label }}</span>
			        <span class="pull-right btns-pos">
			        	<el-button
			        		v-if="data.display"
			            type="text"
			            size="mini"
			            icon="el-icon-check green">
			          </el-button>
			          <el-button
			        		v-else
			            type="text"
			            size="mini"
			            icon="el-icon-close red">
			          </el-button>
			          <el-button
			            type="text"
			            size="mini"
			            icon="el-icon-edit-outline"
			            @click.stop="editType(data)">
			          </el-button>
			          <el-button
			            type="text"
			            size="mini"
			            icon="el-icon-delete"
			            @click.stop="alertBox(data)">
			          </el-button>
			        </span>
		        </div>
		      </div>
			</el-tree>
		</div>
		<div>
			<el-dialog
			  title="分类信息"
			  :visible.sync="addTypeModule"
			  width="40%">
				<ul class="tag-modal clearfix">
					<li v-if="isEditPid">
						<span>选择父级：</span>
						<div class="tag-input">
							<el-select size="mini" v-model="typeData.pid" placeholder="请选择" class="w100">
						    <el-option
						      v-for="item in options"
						      :key="item._id"
						      :label="item.name"
						      :value="item._id">
						    </el-option>
						  </el-select>
						</div>
					</li>
					<li class="mt10">
						<span>分类名称：</span>
						<div class="tag-input">
							<el-input size="mini" v-model="typeData.name" placeholder="请输入内容"></el-input>
						</div>
					</li>
					<li class="mt10">
						<span>分类别名：</span>
						<div class="tag-input">
							<el-input size="mini" v-model="typeData.alias" placeholder="请输入内容"></el-input>
						</div>
					</li>
					<li class="mt10">
						<span>排序序号：</span>
						<div class="tag-input">
							<el-input size="mini" v-model="typeData.sort"></el-input>
						</div>
					</li>
					<li class="mt10">
						<span>是否显示：</span>
						<div class="tag-input">
							<div class="pl130">
							  <el-switch class="p5" v-model="typeData.display"></el-switch>
					  	</div>
						</div>
					</li>
					<li class="mt10">
						<span>分类备注：</span>
						<div class="tag-input">
							<el-input
								size="mini"
							  type="textarea"
							  :rows="2"
							  placeholder="请输入内容"
							  v-model="typeData.note">
							</el-input>
						</div>
					</li>
				</ul>
			  <span slot="footer" class="dialog-footer">
			  	<el-button v-if="!isResetType" size="mini" type="primary" @click="addTypeFn">添 加</el-button>
			  	<el-button v-else size="mini" type="primary" @click="setTypeFn">修 改</el-button>
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
				typeData: {
					_id: '',
					pid: '',
					name: '',
					note: '',
					sort: '',
					alias: '',
					display: true
				},
				isEditPid: true,
				options: [],
				treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        isResetType: false,
				addTypeModule: false
			}
		},
		store,
		computed: {
			...mapState(['loading'])
		},
		methods: {
			...mapMutations(['cloneLoading', 'openLoading']),
			showTypeModule(){
				let C = this.typeData;
				C.name = C.pid = C.note = C.sort = C.alias = C._id = '';
				C.display = true;
				this.isResetType = false;
				this.addTypeModule = true;
				this.isEditPid = true;
				this.isHideSelectType = false;
			},
			editType(data){
				let D = this.typeData;
				D.pid = (!data.pid) ? '' : data.pid;
				D._id = data._id;
				D.name = data.name;
				D.sort = data.sort;
				D.note = data.note;
				D.alias = data.alias;
				D.display = data.display;
				this.isResetType = true;
				this.addTypeModule = true;
				this.isEditPid = (data.pid) ? true : false;
			},
			removeType(row){
				this.$axios.get('/api/type/removeType', {
					params: {
						_id: row._id
					}
				})
				.then((result) => {
					let code = result.data.code;
					if(code === 200){
						this.addTypeModule = false;
						this.initData();
						this.errorMsg(result.data.text, 'success')
					}else{
						this.errorMsg(result.data.text, 'warning')
					}
				})
				.catch(() => {
        	this.errorMsg()
        })
			},
			alertBox(row){
				this.$confirm(
      		'此操作将永久删除选中的分类, 是否继续？',
      		'提示',
      		{
	          confirmButtonText: '确定',
	          type: 'warning',
        })
        .then(() => {
        	this.removeType(row)
        })
        .catch(() => {})
			},
			testData(data){
				if(data.name && data.note && data.alias){
					return data
				}
				this.errorMsg('数据不符合要求！', 'warning')
			},
			addTypeFn(){   //添加分类
				let data = this.typeData;
				let bool = this.testData(data);
				if(!bool){
					return
				}
				this.getNewData('addType', bool)
			},
			setTypeFn(){   //设置分类
				let data = this.typeData;
				let bool = this.testData(data);
				if(!bool){
					return
				}
				this.getNewData('updateType', bool)
			},
			getNewData(str, data){
				this.$axios.get('/api/type/'+str, {
					params: data
				})
				.then((result) => {
					let code = result.data.code;
					this.addTypeModule = false;
					if(code === 200){
						this.initData();
						this.errorMsg(result.data.text, 'success')
					}else{
						this.errorMsg(result.data.text, 'warning')
					}
				})
				.catch(() => {
        	this.errorMsg()
        })
			},
			handleNodeClick(){

			},
			errorMsg(msg, color = 'error'){
				this.$message({
          type: color,
          message: msg || "操作未能进行！"
      	})
			},
			copyData(data){
				let arr = []
				for(let arg of data){
					arr.push({
						name: arg.name,
						_id: arg._id
					})
				}
				arr.push({
					name: '无父级',
					_id: ''
				})
				return arr
			},
			initData(){
				// 遮罩
      	this.openLoading();
      	// 请求
				this.$axios.get('/api/type/dirTypes')
				.then((result) => {
					// 关闭loading
					this.cloneLoading();
					// 请求信息
					let code = result.data.code;
					if(code === 200){
						this.treeData = result.data.value;
						this.options = this.copyData(this.treeData)
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
<style>
	.lin28{
		height: 26px;
		line-height: 26px;
		font-size: 14px;
		display: block;
		width: 100%;
		position: relative;
	}
	.btns-pos{
		height: 26px;
		line-height: 26px;
		overflow: hidden;
		position: absolute;
		right: 10px;
		top: 0;
	}
</style>