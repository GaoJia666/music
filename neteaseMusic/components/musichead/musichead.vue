<template>
	<view class="music-head" :style="{color : color}">
		<view v-if="icon" class="music-head-icon"  :class="{'music-head-iconblack':iconblack}">
			<text class="iconfont icon-mjiantou-copy12" @tap="handleToBack"></text> | 
			<text class="iconfont icon-shouye1" @tap="handleToHome"></text>
		</view>
		{{ title }}
	</view>
</template>

<script>
	
	export default {
		name: "musichead",
		data() {
			return {

			};
		},
		props:['title','icon','color','iconblack'],
		methods:{
			handleToBack(){
				uni.navigateBack();
			},
			handleToHome(){
				uni.navigateTo({
					url:'../../pages/index/index'
				})
			}
		}
	}
</script>

<style scoped>
	.music-head{
		width: 100%;
		height: 90px;
		font-size: 16px;
		line-height: 110px;
		text-align: center;
		color: black;
		position:relative;
	}
	.music-head-icon{
		position: absolute;
		left: 8px;
		top: 40px;
		width: 90px;
		height: 31px;
		background-color: rgba(0,0,0,0.4);
		color: white;
		line-height: 31px;
		border-radius: 15px;
		display: flex;
		justify-content: space-evenly;
	}
	
	.music-head-iconblack{
		color: black;
		border: 1px black solid;
		background: white;
	}
</style>
