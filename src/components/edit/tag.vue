<template>
	<div>
		<div class="clearfix">
			<div class="pull-left text-left">
				<el-button @click="showTagBox" size="mini" type="primary" icon="el-icon-edit">添加</el-button>
				<el-button @click="removeTagBox" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
			</div>
			<div class="pull-right text-right mr10">
				<el-input
			    size="mini"
			    placeholder="请输入内容"
			    suffix-icon="el-icon-search"
			    v-model.lazy="soVal"
			    @change="soVal">
			  </el-input>
			</div>
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
		      label="名称"
		      width="150">
		    </el-table-column>
		    <el-table-column
		      prop="note"
		      label="备注">
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
						<span>名称：</span>
						<div class="tag-input">
							<el-input size="mini" v-model="submit.name" placeholder="请输入内容"></el-input>
						</div>
					</li>
					<li class="mt10">
						<span>备注：</span>
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
			  	<el-button v-if="!isReset" size="mini" type="primary" @click="addTag">添 加</el-button>
			  	<el-button v-else size="mini" type="primary" @click="resetTag">修 改</el-button>
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
				},
				soVal: '',
				select: [],
				isReset: false,  //判断是否是 新增标签 || 修改标签
				boxModule: false,
				tableData: [],
				curPage: 1,
				total: 0
			}
		},
		store,
		computed: {
			...mapState(['loading'])
		},
		methods: {
			...mapMutations(['cloneLoading', 'openLoading']),
			jumpUrl(row){
				this.submit._id = row._id;
				this.submit.note = row.note;
				this.submit.name = row.name;
        this.boxModule = this.isReset = true;
      },
			SelectionChange(val){
				this.select = [];
				for(let arg of val){
					this.select.push(arg._id)
				}
			},
			showTagBox(){
				this.submit.name = this.submit.note = this.submit._id = '';
				this.boxModule = true;
				this.isReset = false;
			},
			removeTagBox(){
				let len = this.select.length;
				if(len){
					this.alertBox()
				}else{
					this.errorMsg('请选择相关内容！', 'warning')
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
			alertBox(){
				this.$confirm(
      		'此操作将永久删除选中的标签, 是否继续？',
      		'提示',
      		{
	          confirmButtonText: '确定',
	          type: 'warning',
        }).then(() => {
        	this.removeData()
        }).catch(() => {})
			},
			removeData(row){
				let data = row ? row._id : this.select.toString();
				this.$axios.get('/api/tag/removeTag', {
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
			testVal(data){
				if(data.name && data.note){
					return {
						_id: data._id,
						name: data.name,
						note: data.note,
					}
				}
				this.errorMsg('数据不符合要求！', 'warning')
			},
			addTag(){  //新增
				let data = this.submit;
				let bool = this.testVal(data);
				if(!bool){
					return
				}
				this.getNewData('addTag', bool)
			},
			resetTag(){  //修改
				let data = this.submit;
				let bool = this.testVal(data);
				if(!bool){
					return
				}
				this.getNewData('updateTag', bool)
			},
			getNewData(str, data){
				this.$axios.get('/api/tag/'+str, {
					params: data
				})
				.then((result) => {
					let data = result.data;
					this.boxModule = false;
					if(data.code === 200){
						this.curPage = 1;
						this.changePage();
						this.errorMsg(data.text, 'success')
					}else{
						this.errorMsg(data.text, 'warning')
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
				this.$axios.get('/api/tag/dirTag', {
					params: {
						page: index || 1,
						value: this.soVal
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