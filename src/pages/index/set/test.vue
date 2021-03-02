<template>
    <scroll-view :scroll-y="isScroll" :style="{ height: windowHeight + 'px' }">
        
            <view :key="index" v-for="(item, index) in dataList" :data-index="index" class="order-item" @touchstart="drawStart" @touchmove="drawMove" @touchend="drawEnd" :style="{ right: item.right + 'rpx' }">
                <view class="content">{{ item.content }}</view>
                <view class="remove" @click="delItem">删除</view>
            </view>
       
    </scroll-view>
</template>

<script>
export default {
    data() {
        return {
            delBtnWidth: 160,
            dataList: [
                { content: '1', right: 0 },
                { content: '2', right: 0 },
                { content: '3', right: 0 },
                { content: '4', right: 0 },
                { content: '5', right: 0 },
                { content: '6', right: 0 },
                { content: '7', right: 0 },
                { content: '8', right: 0 },
                { content: '9', right: 0 },
                { content: '10', right: 0 }
            ],
            isScroll: true,
            windowHeight: 0
        };
    },
    onLoad: function(options) {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.windowHeight = res.windowHeight;
            }
        });
    },
    methods: {
        drawStart: function(e) {
            // console.log("drawStart");
            var touch = e.touches[0];
            for (var index in this.dataList) {
                this.dataList[index].right = 0;
            }
            this.startX = touch.clientX;
        },
        drawMove: function(e) {
            var touch = e.touches[0];
            var item = this.dataList[e.currentTarget.dataset.index];
            var disX = this.startX - touch.clientX;

            if (disX >= 20) {
                if (disX > this.delBtnWidth) {
                    disX = this.delBtnWidth;
                }
                this.isScroll = false;
                this.dataList[e.currentTarget.dataset.index].right = disX;
            } else {
                this.isScroll = true;
                this.dataList[e.currentTarget.dataset.index].right = 0;
            }
        },
        drawEnd: function(e) {
            var item = this.dataList[e.currentTarget.dataset.index];
            if (item.right >= this.delBtnWidth / 2) {
                this.isScroll = true;
                this.dataList[e.currentTarget.dataset.index].right = this.delBtnWidth;
            } else {
                this.isScroll = true;
                this.dataList[e.currentTarget.dataset.index].right = 0;
            }
        },
        delItem() {
            console.log('删除');
        }
    }
};
</script>

<style scoped>
.order-item {
    height: 240rpx;
    width: 100%;
    display: flex;
    position: relative;
}

.remove {
    width: 160rpx;
    height: 100%;
    background-color: red;
    color: white;
    position: absolute;
    top: 0;
    right: -160rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
