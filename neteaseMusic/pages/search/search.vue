<template>
	<view class="search">
		<musichead title="搜索" :icon="true" :iconblack="true"></musichead>

		<view class="container">
			<scroll-view scroll-y="true">

				<view class="search-search">
					<text class="iconfont icon-fangdajing"></text>
					<input type="text" placeholder="搜索歌曲" v-model="searchWord" @confirm="handleToSearch(searchWord)"
						@input="handleToSuggest" />

					<text v-show="searchType !=1" class="iconfont icon-icon-2" @tap="handleToclose"></text>
				</view>

				<block v-if="searchType==1">

					<view class="search-history">
						<view class="search-history-hand">
							<text>历史记录</text>
							<text class="iconfont icon-lajitong" @tap="handleToClear"></text>
						</view>
						<view class="search-history-list">
							<view v-for="(item,index) in searchHistory" :kry="index" @tap="handleToWord(item)">{{item}}
							</view>
						</view>
					</view>

					<view class="search-hot">
						<view class="search-hot-hand">热搜榜</view>
						<view class="search-hot-item" v-for="(item,index) in searchHot" :key='index'
							@tap="handleToWord(item.searchWord)">
							<view class="search-hot-top">{{index+1}}</view>
							<view class="search-hot-word">
								<view>
									{{item.searchWord}}
									<image :src="item.iconUrl" mode="aspectFit"></image>
								</view>
								<view>{{item.content}}</view>
							</view>
							<view class="search-hot-count">{{item.score}}</view>
						</view>

					</view>

				</block>

				<block v-else-if="searchType==2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item,index) in searchList" :key="index"
							@tap="handleToDetail(item.id)">
							<view class="search-result-word">
								<view>{{item.name}}</view>
								<view>{{item.artists[0].name}} - {{item.album.name}}</view>
							</view>
							<text class="iconfont icon-iconset0481"></text>
						</view>
					</view>
				</block>

				<block v-else-if="searchType == 3">
					<view class="search-suggest">
						<view class="search-suggest-title">搜索 “{{searchWord}}”</view>
						<view class="search-suggest-item" v-for="(item,index) in searchSuggest" :key="index" @tap="handleToWord(item.keyword)">
							<text class="iconfont icon-fangdajing"></text>
							{{item.keyword}}
						</view>
					</view>
				</block>

			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import musichead from '../../components/musichead/musichead.vue'
	import {
		searchHot,
		searchWord,
		searchSuggest
	} from '../../common/api.js'

	export default {
		data() {
			return {
				searchHot: [],
				searchWord: '',
				searchHistory: [],
				searchType: 1,
				searchList: [],
				searchSuggest: []
			}
		},
		onLoad() {
			searchHot().then(res => {
				if (res[1].data.code == '200') {
					this.searchHot = res[1].data.data
				}
			});
			uni.getStorage({
				key: 'searchHistory',
				success: (res) => {
					this.searchHistory = res.data
				}
			})
		},
		components: {
			musichead
		},
		methods: {
			handleToWord(word) {
				this.searchWord = word;
				this.handleToSearch(word);
			},
			handleToSearch(word) {
				this.searchHistory.unshift(word);
				this.searchHistory = [...new Set(this.searchHistory)]
				if (this.searchHistory.length > 10) {
					this.searchHistory.length = 10
				}
				uni.setStorage({
					key: 'searchHistory',
					data: this.searchHistory
				});
				this.getSearchList(word);
			},
			handleToClear() {
				uni.removeStorage({
					key: 'searchHistory',
					success: (res) => {
						this.searchHistory = [];
					}
				});
			},
			getSearchList(word) {
				searchWord(word).then((res) => {
					if (res[1].data.code == '200') {
						this.searchList = res[1].data.result.songs;
						this.searchType = 2;
					}
				});
			},
			handleToclose() {
				this.searchWord = '';
				this.searchType = 1
			},
			handleToDetail(songId) {
				uni.navigateTo({
					url: '/pages/detail/detail?songId=' + songId
				})
			},
			handleToSuggest(ev) {
				let value = ev.detail.value
				// console.log(value)
				if (!value) {
					this.searchType = 1;
					return;
				}
				searchSuggest(value).then((res)=>{
					// 判断res接口的状态
					if(res[1].data.code == '200'){
						this.searchSuggest = res[1].data.result.allMatch;
						this.searchType = 3;
					}
				});
			}
		}
	}
</script>

<style scoped>
	.search-search {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background-color: #F7F7F7;
		border-radius: 50rpx;
	}

	.search-search text {
		margin: 0 26rpx;
	}

	.search-search input {
		flex: 1;
		font-size: 26rpx;
	}

	.search-history {
		margin: 0 30rpx;
		font-size: 26rpx;
	}

	.search-history-head {
		display: flex;
		justify-content: space-between;
	}

	.search-history-hand text:nth-child(2) {
		position: absolute;
		right: 30rpx;
	}

	.search-history-list {
		display: flex;
		margin-top: 36rpx;
		flex-wrap: wrap;
	}

	.search-history-list view {
		padding: 20rpx 40rpx;
		background: #f7f7f7;
		border-radius: 50rpx;
		margin-right: 30rpx;
		margin-bottom: 20rpx;
	}

	.search-hot {
		margin: 30rpx 30rpx;
		font-size: 26rpx;
		color: #bebebe;
	}

	.search-hot-title {}

	.search-hot-item {
		display: flex;
		align-items: center;
		margin-top: 40rpx;
	}

	.search-hot-top {
		width: 60rpx;
		color: #fb2221;
		font-size: 34rpx;
	}

	.search-hot-word {
		flex: 1;
	}

	.search-hot-word view:nth-child(1) {
		font-size: 36rpx;
		color: black;
	}

	.search-hot-word image {
		width: 48rpx;
		height: 22rpx;
	}

	.search-hot-count {}


	.search-result {
		border-top: 2rpx #e5e5e5 solid;
		padding: 30rpx;
	}

	.search-result-item {
		display: flex;
		align-items: center;
		border-bottom: 2rpx #e5e5e5 solid;
		padding-bottom: 30rpx;
		margin-bottom: 30rpx;
	}

	.search-result-item text {
		font-size: 50rpx;
	}

	.search-result-word {
		flex: 1;
	}

	.search-result-word view:nth-child(1) {
		font-size: 33rpx;
		color: #3e6694;
	}

	.search-result-word view:nth-child(2) {
		font-size: 26rpx;
		margin-top: 15rpx;
	}

	.search-suggest {
		border-top: 2rpx #e5e5e5 solid;
		padding: 30rpx;
		font-size: 26rpx;
	}

	.search-suggest-title {
		color: #537caa;
		margin-bottom: 40rpx;
	}

	.search-suggest-item {
		color: #666666;
		margin-bottom: 70rpx;
		font-size: 33rpx;
	}

	.search-suggest-item text {
		color: #c2c2c2;
		font-size: 33rpx;
		margin-right: 26rpx;
	}
</style>
