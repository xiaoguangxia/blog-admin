<template>
	<div v-if="loading" class="loading-bg">
		<div class="ytp-spinner">
			<div class="ytp-spinner-container">
				<div class="ytp-spinner-rotator">
					<div class="ytp-spinner-left">
						<div class="ytp-spinner-circle"></div>
					</div>
					<div class="ytp-spinner-right">
						<div class="ytp-spinner-circle"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import store from '@/vuex/store'
	import { mapState } from 'vuex'
	export default {
		data(){
			return {

			}
		},
		store,
		computed: {
			...mapState(['loading'])
		}
	}
</script>
<style>
</style>