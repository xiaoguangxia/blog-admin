<template>
	<div>
		<div class="clearfix">
			<div class="pull-left text-left">
				<el-button @click="showMsgBox" size="mini" type="danger" icon="el-icon-delete">批量删除</el-button>
				<el-button @click="agreePipe(true)" size="mini" type="primary" icon="el-icon-star-on">批量审批</el-button>
				<el-button @click="agreePipe(false)" size="mini" type="warning" icon="el-icon-star-off">撤销审批</el-button>
			</div>
			<div class="pull-right text-right mr10">
				<el-input
			    size="mini"
			    placeholder="请输入内容"
			    suffix-icon="el-icon-search"
			    v-model.lazy="soVal"
			    @change="changePage">
			  </el-input>
			</div>
			<div class="pull-right text-right mr10">
			  <el-select @change="changeData" size="mini" v-model="msgState" placeholder="请选择">
			    <el-option
			      v-for="item in options"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
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
		    	prop="title"
		      label="是否审批"
		      width="80">
		      <template slot-scope="scope">
		      	<div class="text-center">
			      	<i
			      		:class="scope.row.agree ?
			      		'el-icon-check green' :
			      		'el-icon-close red'">
			      	</i>
		      	</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		    	prop="title"
		      label="文章标题"
		      width="300">
		    </el-table-column>
		    <el-table-column
		      prop="text"
		      label="留言内容"
		      width="600">
		    </el-table-column>
		    <el-table-column
		      prop="user"
		      label="留言用户"
		      width="100">
		    </el-table-column>
		    <el-table-column
		    	prop="date"
		      label="留言时间">
		    </el-table-column>
		    <el-table-column
		    	fixed="right"
		      label="操作"
		      width="85">
		      <template slot-scope="scope">
		      	<el-button class="btn-mini" size="mini" @click.stop="jumpUrl(scope.row)" type="primary" plain icon="el-icon-edit-outline" circle></el-button>
		      	<el-button class="btn-mini" size="mini" @click.stop="deleteOne(scope.row)" type="danger" plain icon="el-icon-delete" circle></el-button>
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
			<el-dialog class="z999"
			  title="留言信息"
			  :visible.sync="boxModule"
			  width="40%">
				<ul class="tag-modal clearfix">
					<li>
						<span>内容：</span>
						<div class="tag-input text-left">
							<p class="clothes word-wrap" v-text="submit.msg"></p>
						</div>
					</li>
					<li class="mt10">
						<span>回复：</span>
						<div class="tag-input">
							<el-input
							  type="textarea"
							  :rows="2"
							  placeholder="请输入内容"
							  v-model="submit.text">
							</el-input>
						</div>
					</li>
				</ul>
			  <span slot="footer" class="dialog-footer">
			    <el-button size="mini" type="primary" @click="replyMsg">确 定</el-button>
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
				soVal: '',
				submit: {
					_id: '',
					uid: '',
					aid: '',
					pid: '',
					wid: '',
					msg: '',
					text: ''
				},
				options: [{
          value: 'true',
          label: '已审核'
        },{
          value: 'false',
          label: '未审核'
        },{
          value: '',
          label: '全部'
        }],
        msgState: '',
				select: [],
				select2: [],
				total: 0,
				curPage: 1,
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
				let D = this.submit;
				D._id = row._id;
				D.uid = row.uid;
				D.aid = row.aid;
				D.pid = row.pid;
				D.wid = row.wid;
				D.msg = row.text;
				D.text = '';
        this.boxModule = true;
      },
			SelectionChange(val){
				this.select = [];
				this.select2 = [];
				for(let arg of val){
					this.select.push(arg._id)
					this.select2.push(arg.pid)
				}
			},
			showMsgBox(){
				let len = this.select.length;
				if(len){
					this.alertBox();
				}else{
					this.errorMsg('请选择内容！', 'warning')
				}
			},
			agreePipe(bool){
				let len = this.select.length;
				if(!len){
					this.errorMsg('请选择内容！', 'warning')
					return
				}

				let data =  this.select.toString();

				this.$axios.get('/api/msg/updateMessage', {
					params: {
						_id: data,
						agree: bool
					}
				})
				.then((result) => {
					let code = result.data.code;
					if(code === 200){
						this.errorMsg(result.data.text, 'success');
						this.changePage();
					}else{
						this.errorMsg(result.data.text, 'warning')
					}
				})
				.catch((e) => {
					this.errorMsg()
				})
			},
			changeData(){
				this.changePage();
			},
			agreeData(){
				let len = this.select.length;
				if(!len){
					this.errorMsg('请选择内容！', 'warning')
					return
				}
				changePage()
			},
			deleteOne(row){
				this.$confirm(
      		'此操作将永久删除该留言, 是否继续？',
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
      		'此操作将永久删除选中的留言, 是否继续？',
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
			replyMsg(){
				let D = this.submit;
				if(!D.text){
					return
				}
				let data = {
					_id: D._id,
					wid: D.wid,
					aid: D.aid,
					uid: D.uid,
					pid: D.pid,
					text: D.text
				}
				this.$axios.get('/api/msg/answerMessage', {
					params: data
				})
				.then((result) => {
					let code = result.data.code;
					this.boxModule = false;
					if(code === 200){
						this.curPage = 1;
						this.select = [];
						this.select2 = [];
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
			removeData(row){
				let data = row ? row._id : this.select.toString();
				let pData = row ? row.pid : this.select2.toString();
				this.$axios.get('/api/msg/removeMessage', {
					params: {
						_id: data,
						pid: pData
					}
				})
				.then((result) => {
					let code = result.data.code;
					if(code === 200){
						this.curPage = 1;
						this.select = [];
						this.select2 = [];
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
			dateStringify(o){
				let n = new Date().getTime();
		    let f = n - o;
		    let bs = (f >= 0 ? '前' : '后');//判断时间点是在当前时间的 之前 还是 之后
		    f = Math.abs(f);
		    if( f < 6e4 ){ return '刚刚' }//小于60秒,刚刚
		    if( f < 36e5 ){ return parseInt(f/6e4)+' 分钟'+bs }//小于1小时,按分钟
		    if( f < 864e5 ){ return parseInt(f/36e5)+' 小时'+bs }//小于1天按小时
		    if( f < 2592e6 ){ return parseInt(f/864e5)+' 天'+bs }//小于1个月(30天),按天数
		    if( f < 31536e6 ){ return parseInt(f/2592e6)+' 个月'+bs }//小于1年(365天),按月数
		    return parseInt( f / 31536e6 ) + ' 年' + bs;//大于365天,按年算
			},
			formatDate(D){
				for(let arg of D){
					arg.date = this.dateStringify(arg.date)
				}
			},
			changePage(index){
				// 遮罩
      	this.openLoading();
      	// 请求
				this.$axios.get('/api/msg/dirMessage', {
					params: {
						page: index || 1,
						agree: this.msgState,
						value: this.soVal
					}
				})
				.then((result) => {
					// 关闭loading
					this.cloneLoading();
					// 请求信息
					let code = result.data.code;
					if(code === 200){
						let data = result.data.value.result;
						this.formatDate(data)
						this.tableData = data;
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
	.clothes{
		border-radius: 5px;
		position: relative;
		padding: 5px 10px;
		color: #5a5e66;
		background-color: #edf2fc;
	}
	.clothes::before{
		margin-top: -6px;
		position: absolute;
		right: 100%;
		top: 15px;
		border: 5px solid transparent;
		border-right-color: #edf2fc;
		content: " ";
		height: 0;
		width: 0;
		pointer-events: none;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
</style>