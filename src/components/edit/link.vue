<template>
	<div>
		<div class="text-left">
			<el-button @click="showLinkBox" size="mini" type="primary" icon="el-icon-edit">添加</el-button>
			<el-button @click="removeLink" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
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
		      label="链接名称"
		      width="180">
		    </el-table-column>
		    <el-table-column
		      prop="link"
		      label="链接地址"
		      width="240">
		    </el-table-column>
		    <el-table-column
		      prop="note"
		      label="链接备注">
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
			  title="标签信息"
			  :visible.sync="boxModule"
			  width="40%">
				<ul class="tag-modal clearfix">
					<li>
						<span>链接名称：</span>
						<div class="tag-input">
							<el-input size="mini" v-model="submit.name" placeholder="请输入内容"></el-input>
						</div>
					</li>
					<li class="mt10">
						<span>链接地址：</span>
						<div class="tag-input">
							<el-input size="mini" v-model="submit.link" placeholder="请输入内容"></el-input>
						</div>
					</li>
					<li class="mt10">
						<span>链接备注：</span>
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
			  	<el-button v-if="!isReset" size="mini" type="primary" @click="addLink">添 加</el-button>
			  	<el-button v-else size="mini" type="primary" @click="resetLink">修 改</el-button>
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
					link: '',
					note: ''
				},
				select: [],
				total: 0,
				curPage: 1,
				isReset: false,  //判断是否是 新增标签 || 修改标签
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
			jumpUrl(row){
				let C = this.submit;
				C.name = row.name;
				C.link = row.link;
				C.note = row.note;
				C._id = row._id;
				// 修改
        this.boxModule = this.isReset = true;
      },
			SelectionChange(val){
				this.select = [];
				for(let arg of val){
					this.select.push(arg._id)
				}
			},
			showLinkBox(){
				let C = this.submit;
				C.name = C.link = C.note = C._id = '';
				this.boxModule = true;
				this.isReset = false;
			},
			removeLink(){
				let len = this.select.length;
				if(len){
					this.alertBox()
				}else{
					this.errorMsg('请选择内容！', 'warning')
				}
			},
			deleteOne(row){
				this.$confirm(
      		'此操作将永久删除该篇文档, 是否继续?',
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
			removeData(row){
				let data = row ? row._id : this.select.toString();
				this.$axios.get('/api/link/removeLink', {
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
			alertBox(){
				this.$confirm(
      		'此操作将永久删除选中的友链, 是否继续？',
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
			testVal(data){
				if(data.name && data.note && data.link){
					return {
						_id: data._id,
						name: data.name,
						note: data.note,
						link: data.link
					}
				}
				this.errorMsg('数据不符合要求！', 'warning')
			},
			addLink(){  //新增
				let data = this.submit;
				let bool = this.testVal(data);
				if(!bool){
					return
				}
				this.getNewData('addLink', bool)
			},
			resetLink(){  //修改
				let data = this.submit;
				let bool = this.testVal(data);
				if(!bool){
					return
				}
				this.getNewData('updateLink', bool)
			},
			getNewData(str, data){
				this.$axios.get('/api/link/'+str, {
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
				this.$axios.get('/api/link/dirLink', {
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
</style>