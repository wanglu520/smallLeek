<template>
    <view>
        <view class="uni-textarea">
            <textarea v-model="value" :placeholder="placeholder" style="height: 400rpx;" maxlength="-1" />
        </view>
		<view style="color: #ff55b0;">
			格式：{"fundListM":[{"code":"基金代码","num":"份额","cost":"成本"}]}
		</view>
		<view style="text-align: center; margin-top: 20rpx;">
			<button type="primary" size="mini" @click="sure" style="width: 200rpx;">确定</button>
		</view>
    </view>
</template>

<script>
	import 'styles/uni-public.css'
    export default {
        data() {
            return {
				cachKey:"fund_key",
				placeholder:'请输入JSON格式',
				value:"",
				cachArr:[]
			}
        },
        methods: {
			showToast(title){
				uni.showToast({
					title,
					position:"center",
					duration: 2000
				})
			},
            sure(){
				const tempMap = this.parse(this.value);
				if(!tempMap){return}
				const fundListM = tempMap["fundListM"]||[];
				if(fundListM.length > 0){
					this.cachArr = uni.getStorageSync(this.cachKey)||[];
					this.cachArr = fundListM.concat(this.cachArr);
					uni.setStorage({
						key:this.cachKey,
						data:this.cachArr,
						success: () => {
							this.showToast("添加成功");
							uni.switchTab ({
								"url":"../index",
							})
						},
						fail: () => {
							this.showToast("添加失败");
						}
					})
				}
			},
			parse(val){
				try{
					return JSON.parse(this.value);
				}catch(e){
					uni.showToast({
						title:"导入失败json格式错误",
						position:"center",
						duration: 2000
					})
					return false;
				}
			}
        }
    }
</script>

<style>
    .uni-textarea{
		width: 100%;
		height: 500rpx;
		padding: 20rpx;
		background-color: #ffffff;
	}
</style>