import Vue from 'vue'
import VueX from 'vuex'

Vue.use(VueX);

export default new VueX.Store({
	state: {
		name: '',
		loading: false
	},
	mutations: {
		setUserName(state, name){
			state.name = name
		},
		cloneLoading(state){
			state.loading = false
		},
		openLoading(state){
			if(!state.loading){
				state.loading = true
			}
		}
	}
})