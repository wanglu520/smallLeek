<template>
	<view class="content">
		<HM-dragSorts :list="list" :rowHeight="44" feedbackGeneratorState="false" @confirm="confirm">
			<template slot="rowContent" slot-scope="{ row }">
				<view class="row">
					<text class="text">{{row.name}}({{row.fundcode}})</text>
				</view>
			</template>
		</HM-dragSorts> 
	</view>
</template>

<script>
	export default{
		data(){
			return {
				list:[],
				cachArr:[]
			}
		},
		methods:{
			confirm(e){
				this.cachArr = [
					...this.cachArr.slice(0,e.moveTo), //第一部分移动到位之前的数据
					this.cachArr[e.index],//移动的目的地
					...this.cachArr.slice(e.moveTo, e.index),//第三部分移动起点和终点中间区域
					...this.cachArr.slice(e.index+1)//最后一部分数据
				]
				console.log("list",this.list);
				console.log("cachArr",this.cachArr);
			}
		},
		created(){
			this.cachArr = uni.getStorageSync("fund_key")||[];
		},
		onLoad(option) {
			var that = this;
			const eventChannel = this.getOpenerEventChannel()
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('fundInfo', function(data) {
				that.list=data;
			})
		},
		onUnload() {
			//保存原始数据
			uni.setStorageSync("fund_key",this.cachArr);
		}
	}
</script>

<style lang="scss" scoped>
    //scoped css只在当前页生效 不影响子组件
    page {background-color: #efeff4;}
    @media (prefers-color-scheme: dark){page {background-color: #000000;} }
    .content {.row{display: flex;flex-direction: row;align-items: center;.icon{width: 30px;border-radius: 6px;margin-right: 13px;}.text{font-size: 13px;}}}
</style>
