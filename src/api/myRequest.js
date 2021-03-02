const res = uni.getSystemInfoSync();
/**
* 批量获取基金实时数据
* @param {Array} Fcodes 基金代码
* 
* @returns FCODE 基金代码
* @returns SHORTNAME 基金名称
* @returns PDATE 最新确认净值日期
* @returns NAV 最新确认净值
* @returns NAVCHGRT 最新确认净值涨跌比率
* @returns GSZ 实时估算净值
* @returns GSZZL 实时估算净值涨跌比率
* @returns GZTIME 时间估算时间
*/
export default function myRequest(Fcodes){
	return new Promise((res, rej)=>{
		uni.request({
			url:"https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo",
			method:"GET",
			data:{
				pageIndex:1,
				pageSize:100,
				plat:"Android",
				appType:"ttjj",
				product:"EFund",
				Version:1,
				deviceid:res.deviceId||"9e16077fca2fcr78ep0ltn98",
				Fcodes:Fcodes.join(",")
			},
			success(data) {
				res(data);
			},
			fail(uniRej) {
				rej(uniRej);
			}
		})
	});
}