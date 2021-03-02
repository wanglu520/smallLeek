<template>
	<view>
		<view style="text-align: center;" v-if="fundName">{{fundName}}</view>
		<view class="uni-item" v-for="item in items" :key="item.name">
			<view class="uni-flex">
				<view class="title">{{item.name}}</view>
				<input v-model="item.val" class="uni-input" :disabled="item.isDisabled" focus />
			</view>
		</view>
		<view style="text-align: center;">
			<button type="primary" size="mini" @click="sure" style="width: 200rpx;">确定</button>
		</view>
	</view>
</template>

<script>
	import 'styles/uni-public.css'
	export default{
		data(){
			return{
				cachKey:"fund_key",
				fundName:"",
				items:[
					{name:"代码", val:"", code:"code", isDisabled:false}, 
					{name:"份额", val:"", code:"num", isDisabled:false}, 
					{name:"成本价", val:"", code:"cost", isDisabled:false}
				]
			}
		},
		methods:{
			showToast(title){
				uni.showToast({
					title,
					position:"center",
					duration: 2000
				})
			},
			sure(){
				let data = {};
				for(let item of this.items){
					data[item.code] = (item.val||"").trim();
				}
				if(!data.code){
					this.showToast("代码不能为空");
				}
				let arr = uni.getStorageSync(this.cachKey)||[];
				arr = [data, ...arr];
				uni.setStorage({
					key:this.cachKey,
					data:arr,
					success: () => {
						this.showToast("设置成功");
						uni.switchTab ({
							"url":"../index",
						})
					},
					fail: () => {
						this.showToast("设置失败");
					}
				})
			},
		},
		onLoad(option) {
			var that = this;
			console.log(option.query)
			const eventChannel = this.getOpenerEventChannel()
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('fundInfo', function(data) {
				console.log(that.items);
				that.fundName=data.name;
				const temp={code:"fundcode", cost:"cost", num:"num"};
				for(let item of that.items){
					item.val = data[temp[item.code]];
					if(item.code === "code"){
						item.isDisabled = true;
					}
				}
				console.log("fundInfo",data)
			})
			eventChannel.emit('acceptDataFromOpenedPage', {data: 'test'});
		}
	}
</script>

<style>
	.title{
		width: 18%;
		height: 40rpx;
		margin: 20rpx;
		border-right: solid 1rpx #dae1e6;
	}
	.uni-input{
		margin: 20rpx;
	}
	.uni-item{
		margin: 25rpx;
		border:4rpx solid;
		border-color: #C8C7CC;
		border-radius: 20rpx;
		background-color: #ffffff;
	}
</style>
