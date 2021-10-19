<template>
	<view>
		<view class="fixbg" :style="{backgroundImage:'url('+ songDetail.al.picUrl +')'}"></view>
		<musichead :title="songDetail.name" :icon="true" color="white"></musichead>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<view class="detail-play" @tap="handleToPlay">
					<image :src="songDetail.al.picUrl" :class="{'detail-play-run' :isPlayPotate }" mode=""></image>
					<text class="iconfont" :class="iconPlay"></text>
					<view></view>
				</view>
				<view class="detail-lyric">
					<view class="detail-lyric-wrap" :style="{transform:'translateY('+ -(lyricIndex-1)*82+'rpx)'}"  >
						<!-- <view class="detail-lyric-item">测试文字阿斯顿撒所</view> -->
						<view class="detail-lyric-item" v-for="(item,index) in songLyric" :key="index"
							:class="{active:lyricIndex==index}">{{item.lyric}}
						</view>
						<!-- <view class="detail-lyric-item">测试顿撒所洒水大所大按时</view> -->
					</view>
				</view>

				<!-- ////////////////////////////////// -->
				<view class="detail-like">
					<view class="detail-like-title">喜欢这首歌的人也听</view>
					<view class="detail-like-item" v-for="(item,index) in songSimi" :key="index" @tap="handleToSimi(item.id)">
						<view class="detail-like-img">
							<image :src="item.album.picUrl" mode=""></image>
						</view>
						<view class="detail-like-song">
							<view>{{item.name}}</view>
							<view>
								<image v-if="item.privilege.flag > 60 && item.privilege.flag < 70"
									src="../../static/dujia.png" mode=""></image>
								<image v-if="item.privilege.maxbr == 999000" src="../../static/sq.png" mode=""></image>
								{{item.album.artists[0].name}} - {{item.name}}
							</view>
						</view>
						<text class="iconfont icon-iconset0481"></text>
					</view>
				</view>

				<view class="detail-comment">
					<view class="detail-comment-head">精彩评论</view>

					<!-- 11111111 -->
					<view class="detail-comment-item" v-for="(item,index) in songComment" :key="index">
						<view class="detail-comment-img">
							<image :src="item.user.avatarUrl" mode=""></image>
						</view>
						<view class="detail-comment-content">
							<view class="detail-comment-title">
								<view class="detail-comment-name">
									<view>{{item.user.nickname}}</view>
									<view>{{item.time | formatTime}}</view>
								</view>
								<view class="detail-comment-like">{{item.likedCount | formatCount}} <text
										class="iconfont icon-zanpress-copy"></text></view>
							</view>
							<view class="detail-comment-text" style="word-break:break-all;">
								{{item.content}}
							</view>
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

	import {
		songDetail,
		songUrl,
		songLyric,
		songSimi,
		songComment
	} from '../../common/api.js';

	export default {
		data() {
			return {
				songDetail: {
					al: {
						picUrl: ''
					},
					ar: {
						name: ''
					}
				},
				songSimi: [],
				songComment: [],
				songLyric: [],
				lyricIndex: 0,
				iconPlay: "icon-tingzhi",
				
				isLoading:true
			}
		},
		components: {
			musichead
		},
		onLoad(options) {
			this.getMusic(options.songId);
		},
		onUnload() {
			this.cancelLyricIndex()
		},
		onHide() {
			this.cancelLyricIndex()
		},
		methods: {
			getMusic(songId) {
				
				uni.showLoading({
					title:'客观请稍等。。。'
				});
				this.isLoading=true
				
				Promise.all([songDetail(songId), songSimi(songId), songComment(songId), songLyric(songId), songUrl(
					songId)]).then(res => {
					// console.log(res)
					if (res[0][1].data.code == '200') {
						this.songDetail = res[0][1].data.songs[0]
					}
					if (res[1][1].data.code == '200') {
						this.songSimi = res[1][1].data.songs;
					}
					if (res[2][1].data.code == '200') {
						this.songComment = res[2][1].data.hotComments;
					}
					if (res[3][1].data.code == '200') {
						let lyric = res[3][1].data.lrc.lyric;
						let result = [];
						let re = /\[([^\]]+)\]([^[]+)/g;
						lyric.replace(re, ($0, $1, $2) => {
							result.push({
								time: this.formatTimeToSec($1),
								lyric: $2
							});
						});
						this.songLyric = result;
					}
					if (res[4][1].data.code == '200') {
						this.bgAudioManager = uni.getBackgroundAudioManager();
						this.bgAudioManager.title = this.songDetail.name;
						this.bgAudioManager.src = res[4][1].data.data[0].url;
						this.listenLyricIndex()
						this.bgAudioManager.onPlay(() => {
							this.iconPlay = 'icon-tingzhi';
							this.isPlayPotate = true
							this.listenLyricIndex()
						});
						this.bgAudioManager.onPause(() => {
							this.iconPlay = 'icon-bofang';
							this.isPlayPotate = false
							this.cancelLyricIndex()
						});
					
					}
					this.isLoading=false
					uni.hideLoading()
				})
			},
			formatTimeToSec(time) {
				var arr = time.split(':');
				return (parseFloat(arr[0]) * 60 + parseFloat(arr[1])).toFixed(1);
			},
			handleToPlay() {
				if (this.bgAudioManager.paused) {
					this.bgAudioManager.play()
				} else {
					this.bgAudioManager.pause()
				}
			},
			listenLyricIndex() {
				clearInterval(this.timer)
				this.timer = setInterval(() => {

					for (var i = 0; i < this.songLyric.length; i++) {
						if (this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length - 1].time) {
							this.lyricIndex = songLyric.length - 1;
							break;
						}
						if (this.bgAudioManager.currentTime > this.songLyric[i].time && this.bgAudioManager
							.currentTime < this.songLyric[i + 1].time) {
							this.lyricIndex = i
						}
					}
				}, 500)
			},
			cancelLyricIndex(){
				clearInterval(this.timer)
			},
			handleToSimi(songId){
				this.getMusic(songId)
			}
		}
	}
</script>

<style scoped>
	.detail-play {
		width: 580rpx;
		height: 580rpx;
		background: url(~@/static/disc.png);
		background-size: cover;
		margin: 120rpx auto 44rpx auto;
		position: relative;
	}

	.detail-play image {
		width: 380rpx;
		height: 380rpx;
		border-radius: 50%;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		animation: 10s linear infinite move;
		animation-play-state: paused;
	}

	.detail-play .detail-play-run {
		animation-play-state: running;
	}

	@keyframes move {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.detail-play text {
		width: 130rpx;
		height: 130rpx;
		font-size: 100rpx;
		position: absolute;
		left: 0rpx;
		top: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		color: white;

	}

	.detail-play view {
		position: absolute;
		width: 170rpx;
		height: 266rpx;
		position: absolute;
		left: 90rpx;
		right: 0;
		margin: auto;
		top: -130rpx;
		background: url(~@/static/needle.png);
		background-size: cover;
	}

	.detail-lyric {
		height: 230rpx;
		line-height: 30rpx;
		font-size: 32rpx;
		text-align: center;
		color: #949495;
		overflow: hidden;
	}

	.active {
		color: white;
	}

	.detail-lyric-wrap {
		transition: .5s;
	}

	.detail-lyric-item {
		height: 82rpx;
	}

	.detail-like {
		margin: 0 32rpx;
	}

	.detail-like-title {
		font-size: 36rpx;
		color: white;
		margin: 50rpx 0;
	}

	.detail-like-list {}

	.detail-like-item {
		display: flex;
		margin-bottom: 38rpx;
		align-items: center;
	}

	.detail-like-img {
		width: 82rpx;
		height: 82rpx;
		border-radius: 15rpx;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.detail-like-img image {
		width: 100%;
		height: 100%;
	}

	.detail-like-song {
		flex: 1;
	}

	.detail-like-song view:nth-child(1) {
		color: white;
		font-size: 30rpx;
		width: 70vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 10rpx;
	}

	.detail-like-song view:nth-child(2) {
		font-size: 22rpx;
		color: #a2a2a2;
		width: 70vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.detail-like-song image {
		width: 34rpx;
		height: 22rpx;
		margin-right: 10rpx;
	}

	.detail-like-item text {
		font-size: 50rpx;
		color: #877764;
	}

	.detail-comment {
		margin: 0 32rpx;
	}

	.detail-comment-head {
		font-size: 36rpx;
		color: white;
		margin: 50rpx 0;
	}

	.detail-comment-item {
		margin-bottom: 28rpx;
		display: flex;
	}

	.detail-comment-img {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 18rpx;
	}

	.detail-comment-img image {
		width: 100%;
		height: 100%;
	}

	.detail-comment-content {
		flex: 1;
		color: #cbcacg;
	}

	.detail-comment-title {
		display: flex;
		justify-content: space-between;
	}

	.detail-comment-name view:nth-child(1) {
		font-size: 26rpx;
	}

	.detail-comment-name view:nth-child(2) {
		font-size: 20rpx;
	}

	.detail-comment-like {
		font-size: 28rpx;
	}

	.detail-comment-text {
		line-height: 40rpx;
		color: white;
		margin-top: 20rpx;
		border-bottom: 1px #59595b solid;
		padding-bottom: 40rpx;
		padding-right: 50rpx;
		font-size: 14px;
	}
</style>
