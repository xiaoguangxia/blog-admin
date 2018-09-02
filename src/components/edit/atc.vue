<template>
	<div>
		<div class="head clearfix">
			<div class="pull-left text-left">
				<el-button @click="removeAtc" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
			</div>
			<div class="pull-right text-right mr10">
				<el-input
			    size="mini"
			    placeholder="请输入内容"
			    suffix-icon="el-icon-search"
			    v-model.lazy="soVal"
			    @change="changePage()">
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
		    	prop="is_zeal"
		      label="推荐"
		      width="50">
		      <template slot-scope="scope">
		      	<el-button
		      	class="state-btn"
		      	@click="changeState(scope.row)"
		      	:icon="scope.row.is_zeal ? 'el-icon-success green' : 'el-icon-error red'" type="text"></el-button>
		      </template>
		    </el-table-column>
		    <el-table-column
		    	prop="date"
		      label="日期"
		      width="120">
		      <template slot-scope="scope">
		      	{{getDate(scope.row.date)}}
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="title"
		      label="标题"
		      width="500">
		    </el-table-column>
		    <el-table-column
		      prop="type"
		      label="类别"
		      width="120">
		    </el-table-column>
		    <el-table-column
		      prop="author"
		      label="作者"
		      width="160">
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
		      :current-page.sync="curPage"
		      :page-size="20"
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
				soVal: '',
				select_aid: [],
				total: 0,
				curPage: 1,
        tableData: []
			}
		},
		store,
		computed: {
			...mapState(['loading'])
		},
		methods: {
			...mapMutations(['cloneLoading', 'openLoading']),
			getDate(time){
				let fill = (d) => {
					return d < 10 ?  '0' + d : d
				}
				let d = new Date(time);
				return `${d.getFullYear()}-${fill(d.getMonth()+1)}-${fill(d.getDate())}`
			},
			jumpUrl(row){
				// 先验证session权限
				this.$router.push({path: 'write', query: {_id: row._id}})
      },
      SelectionChange(val){
      	this.select_aid = [];
      	for(let [index, arg] of val.entries()){
      		this.select_aid[index] = arg._id;
      	}
      },
      changeState(row){  //切换状态--是否推荐
      	let state = !row.is_zeal;
      	this.$axios.get('/api/atc/changeTop', {
      		params: {
      			_id: row._id,
      			is_zeal: state
      		}
      	})
      	.then((result) => {
      		let code = result.data.code;
      		if(code === 200){
      			row.is_zeal = state;
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
			removeAtc(){
				let len = this.select_aid.length;
				if(len){
					this.alertBox()
				}else{
					this.errorMsg('请选择内容！', 'warning')
				}
			},
      alertBox(){
      	this.$confirm(
      		'此操作将永久删除选中的文章, 是否继续？',
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
      	this.$axios.get('/api/atc/removeArticle', {
					params: {
						_id: row ? row._id : this.select_aid.toString()
					}
				})
				.then((result) => {
					let code = result.data.code;
					if(code === 200){
						this.curPage = 1;
						this.select_aid = [];
						this.changePage(false);
						this.errorMsg(result.data.text, 'success')
					}else{
						this.errorMsg(result.data.text, 'warning')
					}
				})
				.catch(() => {
        	this.errorMsg()
        })
      },
      changePage(index){
      	// 遮罩
      	this.openLoading();
      	// 请求
				this.$axios.get('/api/atc/dirArticle', {
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
					// 处理错误
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
	.state-btn{
		padding: 0;
	}
	.checkout-ico,
	.zeal-btn{
		font-size: 15px;
	}
</style>