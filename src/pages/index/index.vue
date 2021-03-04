<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt">
			<view>
				<scroll-view :scroll-y="isScroll" class="scroll-Y" style="display:block;">
					<!-- 汇总信息 -->
					<view class="scroll-view-item" style="height: 200rpx;">
						<view class="uni-flex" >
							<view class="font-bold flex-item flex-item-total">
								总金额
								<uni-icons :type="iconsType" size="20" @tap="isHide" style="margin-left: 20rpx;position: relative;z-index: 9999;"></uni-icons>
							</view>
							<view class="font-bold flex-item">持有收益</view>
							<view class="font-bold flex-item">日收益</view>
						</view>
						<view class="uni-content">
							<view class="uni-flex">
								<view class="flex-item"></view>
								<view class="flex-item font-bold" :class="totalHoldYield >= 0 ? 'uni-pink': 'uni-blue'">{{totalHoldYield}}%</view>
								<view class="flex-item font-bold" :class="dayAmountYield >= 0 ? 'uni-pink': 'uni-blue'">{{dayAmountYield}}%</view>
							</view>
							<view class="uni-flex uni-amount" v-if="isHideFlag">
								<view class="flex-item font-bold" style="font-size: 40rpx;" :class="totalAmount >= 0 ? 'uni-pink': 'uni-blue'">{{totalAmount}}</view>
								<view class="flex-item font-bold" :class="totalHold >= 0 ? 'uni-pink': 'uni-blue'">{{totalHold}}</view>
								<view class="flex-item font-bold" :class="dayAmount >= 0 ? 'uni-pink': 'uni-blue'">{{dayAmount}}</view>
							</view>
							<view class="uni-flex uni-amount" v-else>
								<view class="flex-item font-bold uni-pink">****</view>
								<view class="flex-item font-bold uni-pink">****</view>
								<view class="flex-item font-bold uni-pink">****</view>
							</view>
						</view>
					</view>
					<!-- 具体基金收益信息 -->
					<view class="scroll-view-item scroll-view-item-content" v-for="(myFund, index) in funds" :key="myFund.fundcode"
						:data-index="index"
						@touchstart="drawStart" 
						@touchmove="drawMove" 
						@touchend="drawEnd" 
						@click.stop="fundEdit(myFund)"
						:style="{ right: myFund.right + 'rpx' }">
						<view class="uni-flex">
							<view class="fund-name">{{myFund.name}}({{myFund.fundcode}})</view>
							<view class="fund-time">{{myFund.gztime}}</view>
						</view>
						<view class="uni-flex fund-des">
							<view class="fund-total fund-color fund-font">份额/金额</view>
							<view class="fund-hold-profit fund-color fund-font">持有收益</view>
							<view class="fund-Valuation-profit fund-color fund-font">估值收益</view>
						</view>
						<view class="uni-flex fund-val">
							<view class="fund-total fund-font" v-if="isHideFlag">{{myFund.num}}</view>
							<view class="fund-total fund-font uni-pink" v-else>****</view>
							<view class="fund-hold-profit fund-font" :class="myFund.holdYield >= 0 ? 'uni-pink': 'uni-blue'">{{myFund.holdYield}}%</view>
							<view class="fund-Valuation-profit fund-font" :class="myFund.valuationYield >= 0 ? 'uni-pink': 'uni-blue'">{{myFund.valuationYield}}%</view>
						</view>
						<view class="uni-flex fund-profit" v-if="isHideFlag">
							<view class="fund-total fund-font">{{myFund.amount}}</view>
							<view class="fund-hold-profit fund-font" :class="myFund.holdAmount >= 0 ? 'uni-pink': 'uni-blue'">{{myFund.holdAmount}}</view>
							<view class="fund-Valuation-profit fund-font" :class="myFund.valuationAmount >= 0 ? 'uni-pink': 'uni-blue'">{{myFund.valuationAmount}}</view>
						</view>
						<view class="uni-flex fund-profit" v-else>
							<view class="fund-total fund-font uni-pink">****</view>
							<view class="fund-hold-profit fund-font uni-pink">****</view>
							<view class="fund-Valuation-profit fund-font uni-pink">****</view>
						</view>
						<view class="remove" @click.stop="delItem">删除</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 悬浮 -->
		<view :class="uniClass">
			<uni-fab
				ref="fab"
				:pattern="pattern"
				:content="content"
				horizontal="right"
				vertical="bottom"
				direction="horizontal"
				popMenu="true"
				@trigger="trigger"
				@fabClick.stop="fabClick"
			></uni-fab>
		</view>
	</view>
</template>

<script>
	import {uniIcons} from '@dcloudio/uni-ui'
	import 'styles/uni-public.css'
	export default {
	    data() {
	        return {
				uniClass:"uni-transparent",
				pattern: {
						color: 'gray',
						backgroundColor: '#FFFFFF',
						selectedColor: 'rgba(0, 122, 255, 0.3)',
						buttonColor:'rgba(0, 122, 255, 0.3)'
					},

				content: [
							{
								iconPath: '/static/icon_jia.png',
								selectedIconPath: '/static/icon_jia.png',
								text: '添加',
								active: false
							},
							{
								iconPath: '/static/icon_paixu.png',
								selectedIconPath: '/static/icon_paixu.png',
								text: '排序',
								active: false
							}
						],
				iconsType:"eye-filled",
				totalAmount:0,
				totalCost:0,
				totalHold:0,
				totalHoldYield:0.00,
				dayAmount:0,
				dayAmountYield:0,
	            scrollTop: 0,
	            old: {
	                scrollTop: 0
	            },
				iconsTypeMap:{"eye-filled":"eye-slash","eye-slash":"eye-filled"},
				funds:[],
				cachDatas:[],
				isScroll: true,
				delBtnWidth: 160,
				index:0,
				isHideFlag:true
	        }
	    },
		components:{
			uniIcons
		},
	    methods: {
			trigger(e){
				this.$refs.fab.close();
				this.uniClass = "uni-transparent";
				let that = this;
				if(e.item.text === "添加"){
					this.navigateTo("./set/addFund");
				}else if(e.item.text === "排序"){
					this.navigateTo("./set/fundSort",function(res){
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('fundInfo', that.funds)
					})
				}
			},
			fabClick(){
				this.covTransparent();
				console.log("fabClick");
			},
			covTransparent(){
				this.uniClass = this.uniClass === "uni-opaque" ? "uni-transparent" : "uni-opaque"
			},
			navigateTo(url, success=function(){}){
				uni.navigateTo({
				    url: url,
					animationType:"pop-in",
					animationDuration:200,
					success
				});
			},
			delItem(){
				let that = this;
				let cachTemp = uni.getStorageSync("fund_key");
				const selFund = this.funds[this.index];
				this.funds.splice(this.index,1);
				cachTemp.splice(this.index,1);
				this.totalAmount = this.toFixed(this.totalAmount - selFund.amount);
				this.totalHold = this.toFixed(this.totalHold - selFund.holdAmount);
				this.totalHoldYield = this.toFixed(this.totalCost && (this.totalHold / this.totalCost * 100));
				this.dayAmount = this.toFixed(this.dayAmount - selFund.valuationAmount);
				this.dayAmountYield = this.toFixed(this.totalAmount&&(this.dayAmount / this.totalAmount * 100));
				uni.setStorage({
					key:"fund_key",
					data:cachTemp
				})
			},
			toFixed(val){
				return (val || 0).toFixed(2);
			},
			drawStart: function(e) {
			    // console.log("drawStart");
			    let touch = e.touches[0];
			    for (let index in this.funds) {
			        this.funds[index].right = 0;
			    }
			    this.startX = touch.clientX;
			},
			drawMove: function(e) {
			    let touch = e.touches[0];
				this.index = e.currentTarget.dataset.index;
			    let item = this.funds[this.index];
			    let disX = this.startX - touch.clientX;
			
			    if (disX >= 35) {
			        if (disX > this.delBtnWidth) {
			            disX = this.delBtnWidth;
			        }
			        this.isScroll = false;
			        this.funds[e.currentTarget.dataset.index].right = disX;
			    } else {
			        this.isScroll = true;
			        this.funds[e.currentTarget.dataset.index].right = 0;
			    }
			},
			drawEnd: function(e) {
			    let item = this.funds[e.currentTarget.dataset.index];
			    if (item.right >= this.delBtnWidth / 2) {
			        this.isScroll = true;
			        this.funds[e.currentTarget.dataset.index].right = this.delBtnWidth;
			    } else {
			        this.isScroll = true;
			        this.funds[e.currentTarget.dataset.index].right = 0;
			    }
			},
	        upper(e) {
	            console.log(e)
	        },
			isHide(){
				this.iconsType = this.iconsTypeMap[this.iconsType];
				this.isHideFlag = !this.isHideFlag;
				uni.setStorage({
					key:"iconsKey",
					data:this.iconsType
				})
			},
			initTotalInfo(){
				this.totalAmount = 0;
				this.totalHold = 0;
				this.totalHoldYield = 0;
				this.dayAmount = 0;
				this.dayAmountYield = 0;
			},
			fundEdit(item){//编辑
				this.$refs.fab.close();
				this.uniClass = "uni-transparent";
				uni.navigateTo({
					url:"./set/addFund",
					events:{
						acceptDataFromOpenedPage: function(data) {
							console.log("acceptDataFromOpenedPage",data)
						}
					},
					success(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('fundInfo', item)
					}
				})
			},
			refreshFunds(){
				this.funds.length=0;
				this.cachDatas = uni.getStorageSync("fund_key")||[];
				let newArr = [];
				if(this.cachDatas && this.cachDatas.length === 0){
					this.initTotalInfo();
					uni.stopPullDownRefresh();
					return;
				}
				let fundCodeMap = {};
				let Fcodes=[];
				//过滤重复的数据
				for(let item of this.cachDatas){
					if(!fundCodeMap[item.code]){
						Fcodes.push(item.code);
						fundCodeMap[item.code] = item;
						newArr.push(item);
					}
				}
				if(this.cachDatas.length > newArr.length){
					this.cachDatas = newArr;
					uni.setStorage({
						key:"fund_key",
						data:newArr
					})
				}
				this.$myRequest(Fcodes)
					.then(res=>{
						let datas = res.data.Datas||[];
						let amount, holdAmount, holdYield, valuationAmount;
						let totalAmount=0;
						let totalHold = 0;
						let totalHoldYield=0;
						let totalCost=0;
						let dayAmount=0;
						let mycostTotal=0;//单个基金总成本
						let valuatRates={};
						for(let data of datas){
							const myFundInfo = fundCodeMap[data.FCODE]||[];
							valuatRates = this.getValuatRate(data);
							myFundInfo.cost = myFundInfo.cost||0;//成本单价
							myFundInfo.num = myFundInfo.num||0;//份额
							amount = (myFundInfo.num * data.NAV).toFixed(2);//份额*最新确认净值=金额
							mycostTotal = myFundInfo.cost&&(myFundInfo.cost * myFundInfo.num);//单个基金总成本
							holdAmount = (mycostTotal&&(amount - mycostTotal)).toFixed(2);
							holdYield = (mycostTotal&&(holdAmount / mycostTotal * 100)).toFixed(2);
							valuationAmount = (myFundInfo.num * valuatRates.val).toFixed(2);
							totalAmount += (amount - 0);
							totalHold += (holdAmount - 0);
							totalCost += (mycostTotal - 0);
							dayAmount += (valuationAmount - 0);
							this.funds.push({
								name:data.SHORTNAME, //基金名称
								fundcode:data.FCODE, //基金代码
								gztime:this.getTime(data.GZTIME), //实时更新时间
								gszzl:data.GSZZL, //实时估算净值涨跌比率
								holdAmount:holdAmount, //持有收益
								holdYield:holdYield, //持有收益率
								num:myFundInfo.num, //持有份额
								amount:amount, //金额
								valuationAmount:valuationAmount, //估值收益
								valuationYield:valuatRates.rate, //估值收益率
								right: 0,
								cost:myFundInfo.cost //成本
							})
						}
						this.totalCost = totalCost;
						this.totalAmount = totalAmount.toFixed(2);
						this.totalHold = totalHold.toFixed(2);
						this.totalHoldYield = (totalCost && (totalHold / totalCost * 100)).toFixed(2);
						this.dayAmount = dayAmount.toFixed(2);
						this.dayAmountYield = (totalAmount&&(this.dayAmount / this.totalAmount * 100)).toFixed(2);
						//过滤不存在的code
						if(this.cachDatas.length > datas.length){
							this.checkData(fundCodeMap, datas);
						}
					}).catch(error =>{
						uni.showToast({
							title:"数据拉取失败",
							position:"center",
							duration: 2000
						})
					}).finally(()=>{
						setTimeout(function () {
							uni.stopPullDownRefresh();
						}, 500);
					})
			},
			getValuatRate(data){
				let pDate = data.PDATE||"";
				let gzTime = (data.GZTIME||"").split(" ")[0]||"";
				let res={}
				if(pDate && pDate === gzTime){
					res.val=data.NAVCHGRT / 100;
					res.rate = data.NAVCHGRT;
				}else{
					res.val=data.GSZ - data.NAV;
					res.rate = data.GSZZL;
				}
				return res;
			},
			getTime(time){
				return time.split(" ")[1]||"";
			},
			checkData(fundCodeMap, datas){
				let tempDatas=[];
				for(let data of datas){
					if(fundCodeMap[data.FCODE]){
						tempDatas.push(fundCodeMap[data])
					}
				}
				this.cachDatas = tempDatas;
				uni.setStorage({
					key:"fund_key",
					data:tempDatas
				})
			}
	    },
		onShow() {
			this.refreshFunds();
		},
		onLoad(){
			let that = this;
			uni.getStorage({
				key:"iconsKey",
				success(res) {
					that.iconsType = res.data;
					that.isHideFlag = that.iconsType === "eye-filled";
				}
			})
		},
		onPullDownRefresh() {//下拉刷新
			this.refreshFunds();
		}
	}
</script>

<style>
	.scroll-view-item{
		border:4rpx solid;
		border-color: #C8C7CC;
		border-radius: 20rpx;
		margin: 10rpx;
		background-color: #ffffff;
		position: relative;
	}
	.scroll-view-item-content{
		padding: 15rpx;
	}
	.font-bold{
		font-weight:bold
	}
	.flex-item {
		width: 33.3%;
		text-align: center;
		line-height: 100rpx;
	}
	.flex-item-val {
		width: 33.3%;
		text-align: right;
	}
	.flex-item-total{
		line-height: 150rpx;
	}
	.uni-pink{
		color:#ff7373!important;
	}
	.uni-blue{
		color:#09bb07!important
	}
	.uni-content{
		position: relative;
		top:-90rpx;
	}
	.uni-content > .uni-flex > .flex-item{
		font-size: 30rpx;
	}
	.uni-amount {
		position: relative;
		top:-60rpx;
	}
	.fund-name{
		width: 90%;
		line-height: 60rpx;
		font-size: medium;
	}
	.fund-time{
		line-height: 60rpx;
		font-size: small;
		color: #C0C0C0;
	}
	.fund-total{
		width: 50%;
	}
	.fund-hold-profit{
		width: 25%;
	}
	.fund-Valuation-profit{
		width: 25%;
		text-align: end;
	}
	.fund-des > .fund-color{
		color: #C0C0C0;
	}
	.fund-des > .fund-font{
		font-size: small;
	}
	.fund-val > .fund-font{
		font-size: smaller;
	}
	.fund-profit > .fund-font{
		font-size: medium;
	}
	
	
	.remove {
	    width: 160rpx;
	    height: 100%;
	    background-color: red;
	    color: white;
	    position: absolute;
	    top: 0;
	    right: -185rpx;
	    display: flex;
	    justify-content: center;
	    align-items: center;
		border:4rpx solid;
		border-color: red;
		border-radius: 20rpx;
	}
	.uni-transparent .uni-fab view{
		opacity: 0.3;
	}
	.uni-transparent .uni-fab__circle view{
		opacity: 0.3;
	}
	.uni-opaque .uni-fab view{
		opacity: 1;
	}
	.uni-opaque .uni-fab__circle view{
		opacity: 1;
	}
</style>
