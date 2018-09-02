<template>
	<div>
		<div class="head clearfix">
			<el-button @click="removeSlide" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
			<el-upload
			  class="upload-demo inline"
			  :action="actionUrl"
			  multiple
			  :show-file-list="false">
			  <el-button size="mini" type="primary">
			  	<i class="el-icon-upload"></i>
			  	<span>图片上传</span>
			  </el-button>
			</el-upload>
			<el-button @click="addSlide" size="mini" type="success" icon="el-icon-edit-outline">创建</el-button>
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
		      width="70"
		      label="序列号">
	      	<template slot-scope="scope">
						<el-input
						  type="text"
						  size="mini"
						  v-model="scope.row.sort">
						</el-input>
	      	</template>
		    </el-table-column>
		    <el-table-column
		      prop="image"
		      label="图片">
		    </el-table-column>
		    <el-table-column
		      prop="aid"
		      label="文章ID">
		    </el-table-column>
		    <el-table-column
		      fixed="right"
		      label="操作"
		      width="128">
		      <template slot-scope="scope">
		      	<el-button class="btn-mini" size="mini" @click="showImgBox(scope.row)" type="primary" plain icon="el-icon-picture-outline" circle></el-button>
		      	<el-button class="btn-mini" size="mini" @click="showAtcBox(scope.row)" type="success" plain icon="el-icon-edit-outline" circle></el-button>
		      	<el-button class="btn-mini" size="mini" @click="updateSlide(scope.row)" type="success" plain icon="el-icon-check" circle></el-button>
		      </template>
		    </el-table-column>
		  </el-table>
		</div>
		<div class="dirImgBox">
			<el-dialog class="z999"
			  title="图片信息"
			  :visible.sync="imageBox"
			  width="60%">
			  <el-row class="upImgList" :gutter="20">         <!--slide-->
			  	<el-col v-for="todo in imgList" :key="todo" class="pr pImg" :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
						<img @click.stop="selectImg($event)" :src="'/slide/'+todo" alt="" />
						<i :name="todo" @click.stop="deleteImg($event)" class="deleteImg el-icon-close"></i>
			  	</el-col>
			  </el-row>
			</el-dialog>
		</div>
		<div class="dirAtcBox">
			<el-dialog class="z999"
			  :visible.sync="articleBox"
			  width="70%">
			  <div>
			  	<el-table
			    ref="multipleTable"
			    :data="atcTableData"
			    tooltip-effect="dark"
			    style="width: 100%">
						<el-table-column
				      prop="title"
				      label="文章标题">
				    </el-table-column>
				    <el-table-column
			      fixed="right"
			      label="操作"
			      width="60">
			      	<template slot-scope="scope">
				      	<el-button class="btn-mini" size="mini" @click="selectAtcID(scope.row)" type="primary" plain>选择</el-button>
				      </template>
			      </el-table-column>
			    </el-table>
			  </div>
			  <div class="pages text-center mt10">
			  	<el-pagination
			    	background
			      @current-change="dirArticle"
			      :current-page.sync="curPage"
			      :page-size="20"
			      layout="total, prev, pager, next"
			      :total="total">
			    </el-pagination>
			  </div>
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
				total: 0,
				curPage: 1,
				imgList: [],
				actionUrl: '/api/slide/upSlideImg',
        tableData: [],
				select_sid: [],
        atcTableData: [],
        imageBox: false,
        articleBox: false,
        targetRow: false
			}
		},
		store,
		computed: {
			...mapState(['loading'])
		},
		methods: {
			...mapMutations(['cloneLoading', 'openLoading']),
			dirArticle(page){
				// 遮罩
      	this.openLoading();
      	// 请求
				this.$axios.get('/api/atc/dirArticle', {
					params: {
						page: page || this.curPage
					}
				})
				.then((result) => {
					// 关闭loading
					this.cloneLoading();
					// 请求信息
					let data = result.data;
					if(data.code === 200){
						this.total = data.value.total;
						this.atcTableData = data.value.result;
					}else{
						this.errorMsg(data.text, 'warning')
					}
				})
				.catch(() => {
					// 关闭loading
					this.cloneLoading();
					// 处理错误
        	this.errorMsg()
        })
			},
			selectArticle(row){
				this.articleBox = true;
				this.curPage = 1;
				this.dirArticle()
			},
      SelectionChange(val){
      	this.select_sid = [];
      	for(let [index, arg] of val.entries()){
      		this.select_sid[index] = arg._id;
      	}
      },
			removeSlide(){
				let len = this.select_sid.length;
				if(len){
					this.alertBox()
				}else{
					this.errorMsg('请选择内容！', 'warning')
				}
			},
			updateSlide(row){
				this.$axios.get('/api/slide/updateSlide', {
					params: {
						_id: row._id,
						aid: row.aid,
						sort: row.sort || 0,
						image: row.image
					}
				})
				.then((result) => {
					let data = result.data;
					if(data.code === 200){
						// 提醒
						this.errorMsg(data.text, 'success')
						// 刷新数据
						this.initData()
					}else{
						this.errorMsg(data.text, 'warning')
					}
				})
				.catch((e) => {
					this.errorMsg()
				})
			},
			deleteImg(ev){
				let path = ev.target.attributes.name.nodeValue;
				this.$axios.get('/api/slide/deleteSlideImg?name='+path)
				.then((result) => {
					let data = result.data;
					if(data.code === 200){
						this.errorMsg(data.text, 'success');
						this.dirImgList();
					}else{
						this.errorMsg(data.text, 'warning')
					}
				})
				.catch((err) => {
					this.errorMsg()
				})
			},
			dirImgList(fn){
				this.$axios.get('/api/slide/dirSlideImg')
				.then((result) => {
					let data = result.data;
					if(data.code === 200){
						this.imgList = data.value;
						if(fn){
							fn()
						}
					}else{
						this.errorMsg(data.text, 'warning')
					}
				})
				.catch((err) => {
					this.errorMsg()
				})
			},
			selectImg(ev){
				this.targetRow.image = ev.target.attributes.src.nodeValue;
				this.imageBox = false;
			},
			selectAtcID(row){
				this.targetRow.aid = row._id;
				this.articleBox = false;
			},
			showImgBox(row){
				this.dirImgList(() => {
					this.imageBox = true;
					this.targetRow = row;
				})
			},
			showAtcBox(row){
				this.articleBox = true;
				this.targetRow = row;
			},
      alertBox(){
      	this.$confirm(
      		'此操作将永久删除选中的数据, 是否继续？',
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
      	this.$axios.get('/api/slide/deleteSlide', {
					params: {
						_id: this.select_sid.toString()
					}
				})
				.then((result) => {
					let data = result.data;
					if(data.code === 200){
						// 重置选择
						this.select_sid = [];
						// 刷新数据
						this.initData();
						// 提示信息
						this.errorMsg(data.text, 'success')
					}else{
						this.errorMsg(data.text, 'warning')
					}
				})
				.catch(() => {
        	this.errorMsg()
        })
      },
			addSlide(){
				this.$axios.get('/api/slide/addSlide')
				.then((result) => {
					let data = result.data;
					if(data.code === 200){
						// 提示
						this.errorMsg(data.text, 'success')
						// 刷新数据
						this.initData()
					}else{
						this.errorMsg(data.text, 'warning')
					}
				})
				.catch(() => {
        	this.errorMsg()
        })
			},
      initData(){
      	// 遮罩
      	this.openLoading();
      	// 请求
				this.$axios.get('/api/slide/dirAllSlide')
				.then((result) => {
					// 关闭loading
					this.cloneLoading();
					// 请求信息
					let data = result.data;
					if(data.code === 200){
						this.tableData = data.value;
					}else{
						this.errorMsg(data.text, 'warning')
					}
				})
				.catch(() => {
					// 关闭loading
					this.cloneLoading();
					// 处理错误
        	this.errorMsg()
        })
			},
      errorMsg(msg, color = 'error'){
				this.$message({
          type: color,
          message: msg || "操作未能进行！"
      	});
			}
		},
		created(){
			// 初始化列表数据
			this.initData();
			// 获取全部图片
			this.dirImgList();
			// 获取全部文章
			this.dirArticle();
		}
	}
</script>
<style scoped>
	.el-button.btn-mini{
		padding: 5px;
	}
	.inline{
		margin: 0 10px;
		display: inline-block;
	}
	.upImgList img{
		padding: 2px;
		border-radius: 4px;
		border: 1px solid #ddd;
		margin-left: -3px;
		max-width: 100%;
		transition: all .2s;
		cursor: pointer;
		min-width: 100%;
	}
	.pImg:hover img{
		border-color: green;
		box-shadow: 0px 2px 10px 0px green
	}
	.deleteImg{
		position: absolute;
		cursor: pointer;
		right: 12px;
		top: 5px;
		font-size: 15px;
		font-weight: bolder;
		color: white;
	}
	.deleteImg:hover{
		color: red;
	}
</style>