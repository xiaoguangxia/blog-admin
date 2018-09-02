<template>
	<div>
		<div class="text-left">
			<el-button @click="deleteData" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
			<el-button @click="backupData" size="mini" type="primary" :icon="isBackupIng ? 'el-icon-loading' : 'el-icon-upload'">执行备份</el-button>
		</div>
		<div class="tables pt10 text-left">
			<el-table
		    ref="multipleTable"
		    :data="tableData"
		    tooltip-effect="dark"
		    style="width: 100%"
		    @selection-change="SelectionChange">
		    <el-table-column
		      type="selection">
		    </el-table-column>
		    <el-table-column
		    	prop="filename"
		      label="文件名">
		      <template slot-scope="scope">
		      	<i class="el-icon-upload"></i>
		      	<span>{{scope.row.name}}</span>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="type"
		      label="类型">
		    </el-table-column>
		    <el-table-column
		      prop="date"
		      label="时间">
		    </el-table-column>
		    <el-table-column
		    	fixed="right"
		      label="操作"
		      width="85">
		      <template slot-scope="scope">
		      	<el-button class="btn-mini" size="mini" @click="download(scope.row)" type="primary" plain icon="el-icon-download" circle></el-button>
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
	</div>
</template>
<script>
	import store from '@/vuex/store'
	import { mapState, mapMutations } from 'vuex'
	export default {
		data(){
			return {
				select_did: [],
				select_fid: [],
				total: 0,
				curPage: 1,
				isBackupIng: false,
				tableData: []
			}
		},
		store,
		computed: {
			...mapState(['loading'])
		},
		methods: {
			...mapMutations(['cloneLoading', 'openLoading']),
			SelectionChange(val){
				this.select_did = [];
      	this.select_fid = [];
      	for(let [index, arg] of val.entries()){
      		this.select_did[index] = arg._id;
      		this.select_fid[index] = arg.name;
      	}
			},
			download(row){
				let url = '/api/dump/downloadData?name='+row.name;
				window.location.assign(url)
			},
			deleteData(){
				let len = this.select_did.length;
				if(len){
					this.alertBox()
				}else{
					this.errorMsg('请选择内容！', 'warning')
				}
			},
			backupData(){
				if(this.isBackupIng){
					return
				}
				this.isBackupIng = true;
				this.$axios.get('/api/dump/execDataBackup')
				.then((result) => {
					let code = result.data.code;
					if(code === 200){
						this.errorMsg(result.data.text, 'success')
						this.changePage()
					}else{
						this.errorMsg(result.data.text, 'warning')
					}
					this.isBackupIng = false;
				})
				.catch(() => {
					this.isBackupIng = false;
        	this.errorMsg()
        })
			},
			deleteOne(row){
				this.$confirm(
      		'此操作将永久删除该备份数据, 是否继续?',
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
      		'此操作将永久删除选中的备份数据, 是否继续？',
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
				this.$axios.get('/api/dump/removeDataBackup', {
					params: {
						_id: row ? row._id : this.select_did.toString(),
						file: row ? row.name : this.select_fid.toString()
					}
				})
				.then((result) => {
					let code = result.data.code;
					if(code === 200){
						this.curPage = 1;
						this.select_did = [];
						this.select_fid = [];
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
				this.$axios.get('/api/dump/dirDataBackup', {
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
						this.errorMsg(result.data.text, 'success')
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
</style>