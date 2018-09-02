<template>
	<div>
		<div class="text-left">
			<el-button @click="removeNews" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
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
		    	prop="title"
		      label="标题">
		    </el-table-column>
		    <el-table-column
		      prop="text"
		      label="内容">
		    </el-table-column>
		    <el-table-column
		      prop="date"
		      label="时间">
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
				select: [],
				curPage: 1,
				total: 0,
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
				this.select = [];
				for(let arg of val){
					this.select.push(arg._id)
				}
			},
			removeNews(){
				let len = this.select.length;
				if(len){
					this.alertBox()
				}else{
					this.errorMsg('请选择内容！', 'warning')
				}
			},
			alertBox(){
				this.$confirm(
      		'此操作将永久删除选中的消息, 是否继续？',
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
			removeData(){
				this.$axios.get('/api/news/removeNews', {
					params: {
						_id: this.select.toString()
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
				this.$axios.get('/api/news/dirNews', {
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