<template>
	<div>
		<div class="edit">
			<div class="ptb10 clearfix">
				<label>文档类型：</label>
				<div class="extrude">
					<div class="pl130">
					  <el-cascader
					  	class="w100"
					  	size="mini"
					    :options="options"
					    :props="deleteProp"
					    v-model="submit.type_id">
					  </el-cascader>
					</div>
				</div>
			</div>
			<div class="ptb10 clearfix">
				<label>文章标题：</label>
				<div class="extrude">
					<div class="pl130">
					  <el-input
					  	size="mini"
					  	v-model="submit.title"
					  	placeholder="请输入内容">
				  	</el-input>
			  	</div>
				</div>
			</div>
			<div class="ptb10 clearfix">
				<label>标签选择：</label>
				<div class="extrude">
					<div class="pl130">
					 	<el-select class="w100" size="mini" v-model="submit.tag_id" multiple placeholder="请选择">
					    <el-option
					      v-for="item in tagArr"
					      :key="item._id"
					      :label="item.name"
					      :value="item._id">
					    </el-option>
					  </el-select>
			  	</div>
				</div>
			</div>
			<div class="ptb10 clearfix">
				<label>简短描述：</label>
				<div class="extrude">
					<div class="pl130">
					 	<el-input
						  type="textarea"
						  :rows="3"
						  placeholder="请输入内容"
						  v-model="submit.synopsis">
						</el-input>
			  	</div>
				</div>
			</div>
			<div class="ptb10 clearfix">
				<label>置顶推荐：</label>
				<div class="extrude">
					<div class="pl130">
					  <el-switch class="p5" v-model="submit.is_zeal"></el-switch>
			  	</div>
				</div>
			</div>
			<div class="ptb10 clearfix">
				<label>允许留言：</label>
				<div class="extrude">
					<div class="pl130">
					  <el-switch class="p5" v-model="submit.is_reply"></el-switch>
			  	</div>
				</div>
			</div>
			<div class="ptb10 clearfix">
				<label>缩略图：</label>
				<div class="extrude">
					<div class="pl130 clearfix">
						<div class="pull-left">
							<div class="w255">
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
								<el-button @click="dirImgList" size="mini" type="primary">
									<i class="el-icon-picture-outline"></i>
									<span>图片库中选择</span>
								</el-button>
							</div>
						</div>
						<div class="pull-left rdc255">
							<div class="img-src">
								<el-input
									size="mini"
								  placeholder="请输入内容"
								  v-model="submit.image"
								  :disabled="true">
								</el-input>
							</div>
						</div>
			  	</div>
				</div>
			</div>
			<div class="ptb10 clearfix">
				<label>文章正文：</label>
				<div class="extrude">
					<div class="pl130">
						<VueUEditor class="ue-auto" :ueditorConfig="ueditorConfig" ueditorPath="/static/ueditor/" @ready="editorReady"></VueUEditor>
			  	</div>
				</div>
			</div>
			<div class="ptb10 clearfix">
				<label></label>
				<div class="extrude">
					<div class="pl130">
						<el-button size="mini" @click="updateArticle" v-if="isEditor" type="success">更 新</el-button>
  					<el-button size="mini" @click="addArticle" v-else type="primary">添 加</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class="dirImgBox">
			<el-dialog class="z999"
			  title="图片信息"
			  :visible.sync="dirImgBox"
			  width="60%">
			  <el-row class="upImgList" :gutter="20">         <!--thumbnail-->
			  	<el-col v-for="todo in imgList" :key="todo" class="pr pImg" :xs="12" :sm="6" :md="6" :lg="4" :xl="4">
						<img @click.stop="selectImg($event)" :src="'/thumbnail/'+todo" alt="" />
						<i :name="todo" @click.stop="deleteImg($event)" class="deleteImg el-icon-close"></i>
			  	</el-col>
			  </el-row>
			  <span slot="footer" class="dialog-footer">
			    <el-button size="mini" type="primary">确 定</el-button>
			  </span>
			</el-dialog>
		</div>
	</div>
</template>
<script>
	import VueUEditor from 'vue-ueditor'
	import store from '@/vuex/store'
	import { mapState, mapMutations } from 'vuex'
	export default {
		data(){
			return {
				dirImgBox: false,
				imgList: [],
				isEditor: false,
				actionUrl: '/api/write/upThumBnail',
				options: [],
        tagArr: [],
        deleteProp: {
        	label: 'name',
        	value: '_id'
        },
        submit: {
        	_id: '',
        	content_id: '',
        	type_id: [],
        	title: '',
        	image: '',
        	is_reply: true,
        	is_zeal: false,
        	tag_id: [],
        	content: '',
        	synopsis: ''
        },
        readyFn: false,
        initFn: false,
        ueditorConfig: {
        	initialFrameHeight: 400,
        	scaleEnabled: true
        }
			}
		},
		store,
		computed: {
			...mapState(['loading'])
		},
		components: {
			VueUEditor
		},
		methods: {
			...mapMutations(['cloneLoading', 'openLoading']),
			editorReady(UE, This = this){
				window.UEX = UE;
				let queyry = This.$route.query._id;

				let fn = (This) => {
					// 关闭loading
					This.cloneLoading();
					window.UEX.setContent(This.submit.content);
				}
				if(this.initFn){
					fn(This)
				}else{
					This.readyFn = fn
				}
				UE.addListener('contentChange', function(){
					This.submit.content = UE.getContent();
				})
			},
			dirImgList(){
				var This = this;
				this.$axios.get('/api/write/dirImgList')
				.then((result) => {
					let data = result.data;
					if(data.code === 200){
						This.imgList = result.data.value
					}else{
						This.$message.warning(data.text);
					}
				})
				.catch((err) => {
					This.$message.error('操作未能进行！');
				})
				this.dirImgBox = !this.dirImgBox;
			},
			deleteImg(ev){
				var This = this;
				var path = ev.target.attributes.name.nodeValue;
				this.$axios.get('/api/write/delteThumBnail?name='+path)
				.then((result) => {
					let data = result.data;
					if(data.code === 200){
						This.$message.success(data.text);
						This.dirImgList();
					}else{
						This.$message.warning(data.text);
					}
				})
				.catch((err) => {
					This.$message.error('操作未能进行！');
				})
			},
			selectImg(ev){
				this.submit.image = ev.target.attributes.src.nodeValue;
				this.dirImgBox = false
			},
			authData(data){
				if(!data.type_id.length){
					this.$message.error('类型必填字段！');
					return
				}
				if(!data.title){
					this.$message.error('标题必填字段！');
					return
				}
				if(!data.synopsis){
					this.$message.error('简介必填字段！');
					return
				}
				if(!data.image){
					this.$message.error('必须有缩略图！');
					return
				}
				if(!data.content){
					this.$message.error('正文必填字段！');
					return
				}
				return true
			},
      getSubmitData(){
      	var data = this.submit;
      	return {
    			'title': data.title,
    			'image': data.image,
    			'content': data.content,
    			'synopsis': data.synopsis,
    			'tag_id': data.tag_id.toString(),
    			'is_zeal': data.is_zeal,
    			'is_reply': data.is_reply,
    			'type_id': data.type_id.toString()
    		}
      },
      addArticle(){
      	var data = this.submit;
      	var result = this.authData(data);
      	if(!result){
      		return
      	}

      	var sub = this.getSubmitData();
      	this.sendData({
      		url: '/api/write/addArticle',
      		submit: sub
      	})
      },
      updateArticle(){
      	var data = this.submit;
      	var result = this.authData(data);
      	if(!result){
      		return
      	}

      	var sub = this.getSubmitData();
      	sub._id = data._id;
      	sub.content_id = data.content_id;

      	this.sendData({
      		url: '/api/write/updateArticle',
      		submit: sub
      	})
      },
      sendData(obj){
      	// 遮罩
      	this.openLoading();
      	// 请求
      	var vue = this;
				this.$axios.get(obj.url,{
	    		params: obj.submit
	    	})
	    	.then((result) => {
	    		// 关闭loading
					this.cloneLoading();
					// 请求信息
	    		if(result.data.code === 200){
	    			vue.$message.success(result.data.text);
	    			vue.$router.push('/atc')
	    		}else{
	    			vue.$message.warning(result.data.text);
	    		}
	    	})
	    	.catch(() => {
					// 关闭loading
					this.cloneLoading();
					// 处理错误
        	vue.$message.error(result.data.text);
        })
			},
			initData(){
				let query = this.$route.query._id;
				let isEdit = query && query.length === 24;
				this.$axios.all([
					this.$axios.get('/api/write/dirImgList'),
					this.$axios.get('/api/write/dirTypeList'),
					this.$axios.get('/api/write/dirTagList')
				])
				.then((result) => {
					// 关闭loading
					if(!isEdit){
						this.cloneLoading()
					}
					// 请求信息
					this.imgList = result[0].data.value;
					this.options = result[1].data.value;
					this.tagArr = result[2].data.value;
				})
				.catch(() => {
					if(!isEdit){
						this.cloneLoading()
					}
				})
			},
			scrollTop(){
				let body = document.getElementsByClassName('content-view')[0];
				body.scrollTop = '0px';
			},
			getAtcData(){
				let _id = this.$route.query._id;
				if(_id && _id.length === 24){
					this.$axios.get('/api/write/findOneArticle', {params: {_id: this.$route.query._id}})
					.then((result) => {
						// 关闭loading
						this.cloneLoading()
						// 请求信息
						let atc = result.data;
						let code = atc.code;
						if(code === 200){
							this.submit = atc.value;
							this.isEditor = true;
							if(this.readyFn){
								this.readyFn(this)
							}else{
								this.initFn = true
							}
						}else{
							// 关闭loading
							this.cloneLoading()

							this.isEditor = false;
						}
					})
					.catch(() => {})
				}else{
					// 关闭loading
					setTimeout(() => {
						this.cloneLoading()
					}, 0)
				}
			}
		},
		created(){
			// 开启loading
			this.openLoading();
			// 文章内容
			this.getAtcData();
			// 初始信息
			this.initData();
		},
		watch: {
			"$route"(to, from){
				// 返回顶部
				this.scrollTop();
				// 是否修改
				this.isEditor = false;
				// 重置状态
				let data = this.submit;
				data.title = data.content = data.image = data.synopsis = '';
				data.type_id = data.tag_id = [];
				data.is_reply = true;
				data.is_zeal = false;
				// 是否修改--更改文本内容
				if(!to.query._id){
					window.UEX.setContent('')
				}
				// 关闭loading
				this.cloneLoading()
			}
		}
	}
</script>
<style>
	/*编辑器修正*/
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
	.inline{
		display: inline-block;
		margin-right: 10px;
	}
	.rdc255{
		margin-left: -255px;
		width: 100%;
	}
	.img-src{
		margin-left: 255px;
	}
	.w255{
		width: 255px;
		position: relative;
		z-index: 1;
	}
	/*编辑器*/
	.ue-auto .edui-editor,
	.ue-auto .edui-editor-iframeholder{
		max-width: 100%!important;
	}
	/*表单修正*/
	.ptb10{
		padding: 10px 0;
	}
	.edit label{
		width: 120px;
		height: 30px;
		line-height: 30px;
		float: left;
		text-align: right;
		padding-right: 10px;
		margin-right: -130px;
		position: relative;
		z-index: 1;
	}
	.edit .extrude{
		float: left;
		width: 100%;
		min-height: 30px;
		position: static;
	}
	.edit .pl130{
		padding-left: 130px;
	}
	/*upimg*/
	.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>