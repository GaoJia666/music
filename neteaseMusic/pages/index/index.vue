<template>
	<view class="index">
		<musichead title="佳佳音乐" :icon="false"></musichead>
		
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="index-search" @tap="handleToSearch()">
					<text class="iconfont icon-fangdajing"></text>
					<input type="text" placeholder="搜索歌曲" />
				</view>
				
				<view class="skeleton" v-if="isLoading">
									<m-for-skeleton
									:avatarSize="200"
									:row="3"
									:title="false"
									:loading="isLoading"
									isarc="square"
									:titleStyle="{}"
									v-for="(item,key) in 4"
									:key="key">
									</m-for-skeleton>
								</view>
				
				<view class="index-list" v-else>
					<!-- <view class="indexi-list-item">
						<view class="index-list-img">
							<image src="../../static/wangyiyunyinyue.png" mode=""></image>
							<text>每天更新</text>
						</view>
						<view class="index-list-text">
							<view>1.与我无关 -  阿冗</view>
							<view>1.与我无关 -  阿冗</view>
							<view>1.与我无关 -  阿冗</view>
						</view>
					</view> -->
					
					<view class="indexi-list-item" v-for="(item,index) in topList" :key="index" @tap="handleToList(item.listId)">
						<view class="index-list-img">
							<image :src="item.coverImgUrl" mode=""></image>
							<text>{{item.updateFrequency}}</text>
						</view>
						<view class="index-list-text">
							<view  v-for="(item,index) in item.tracks" :key="index">{{index+1}}.{{item.first}} - {{item.second}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import musichead from '../../components/musichead/musichead.vue'
	import { topList } from '../../common/api.js'
	import mForSkeleton from "@/components/m-for-skeleton/m-for-skeleton";
	
	export default {
		data() {
			return {
				topList:[],
				isLoading:true
			}
		},
		components: {
			musichead,
			mForSkeleton
		},
		onLoad() {
			topList().then(res=>{
				// console.log(res)
				if(res.length){
					setTimeout(()=>{
						this.topList=res
						this.isLoading= false;
					})
				}
			})
		},
		methods: {
			handleToList(listId){
				uni.navigateTo({
					url:'/pages/list/list?id='+listId
				})
			},
			handleToSearch(){
				uni.navigateTo({
					url:'/pages/search/search',
					})
			}
		}
	}
</script>

<style scoped>
	.index{}
	.index-search{
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background-color: #F7F7F7;
		border-radius: 50rpx;
	}
	.index-search text{
		font-size: 26rpx;
		margin-right: 26rpx;
		margin-left: 28rpx;
	}
	.index-search input{
		font-size: 28rpx;
		flex: 1;
	}
	
	.index-list{margin: 0 30rpx;}
	.indexi-list-item{display: flex;margin-bottom: 34rpx;}
	.index-list-img{width: 212rpx; height: 212rpx; position: relative;border-radius: 30rpx;
	 overflow: hidden;margin-right: 22rpx; min-width: 212rpx;}
	.index-list-img image{width: 100%; height: 100%;}
	.index-list-img text{ position: absolute;left: 12rpx; bottom: 13rpx;color: white; font-size: 20rpx;}
	.index-list-text{font-size: 24rpx;line-height: 66rpx; overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
</style>
