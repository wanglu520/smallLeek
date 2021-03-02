<template>
	<view>
		<navigator v-for="tab in tabs" :url="tab.url" :key="tab.url" hover-class="none" class="nav-bagcolor">
			<view class="uni-flex">
				<view class="flex-name">{{tab.name}}</view>
				<view class="flex-icon" style="line-height: 80rpx;"><uni-icons :type="tab.iconsType" size="20"></uni-icons></view>
			</view>
		</navigator>
		<view class="uni-flex nav-bagcolor">
			<view class="flex-name" @click="clearData">清除所有数据</view>
			<view class="flex-icon" style="line-height: 80rpx;"><uni-icons type="arrowright" size="20"></uni-icons></view>
		</view>
	</view>
</template>

<script>
	import {uniIcons} from '@dcloudio/uni-ui'
	import 'styles/uni-public.css'
	export default {
		data() {
			return {
				iconsType:"arrowright",
				tabs:[
					{"name":"添加","iconsType":"arrowright","url":"./addFund"},
					{"name":"导入导出数据","iconsType":"arrowright","url":"./batchAddFund"}
				]
			}
		},
		components:{
			uniIcons
		},
		methods: {
			showToast(title){
				uni.showToast({
					title:title,
					position:"center",
					duration: 2000
				})
			},
			clearData(){
				const that = this;
				uni.showModal({
				    title: '提示',
				    content: '是否要清空数据',
				    success: function (res) {
				        if (res.confirm) {
				            try{
				            	uni.clearStorage();
				            	that.showToast("清除成功");
				            }catch(e){
				            	that.showToast("清除失败");
				            }	
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			}
		}
	}
</script>

<style>
	.flex-name{
		width: 90%;
		margin-left: 30rpx;
		line-height: 83rpx;
		padding-left: 20rpx;
		border-bottom: solid 1rpx #C0C0C0;
	}
	.flex-icon{
		text-align: right;
		padding-right: 4rpx;
		border-bottom: solid 2rpx #C0C0C0;
	}
	.nav-bagcolor{
		background-color: #ffffff;
	}
</style>
