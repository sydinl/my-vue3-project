<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <uni-icons type="left" size="24" class="back-icon" @click="navigateBack"></uni-icons>
      <text class="header-title">积分明细</text>
      <view class="header-right">
        <uni-icons type="ellipsis" size="20"></uni-icons>
        <uni-icons type="eye" size="20" class="ml-4"></uni-icons>
      </view>
    </view>

    <!-- 分类选项卡 -->
    <view class="tabs">
      <view class="tab-item" :class="{ active: currentTab === 'income' }" @click="switchTab('income')">
        <text>收入</text>
      </view>
      <view class="tab-item" :class="{ active: currentTab === 'expense' }" @click="switchTab('expense')">
        <text>支出</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 可以根据currentTab的值渲染不同的内容 -->
      <!-- 目前显示空白状态 -->
    </view>
  </view>
</template>

<script>
export default {
  name: 'PointsDetail',
  data() {
    return {
      currentTab: 'income' // 默认选中"收入"选项卡
    };
  },
  methods: {
    // 导航返回
    navigateBack() {
      uni.navigateBack();
    },
    // 切换选项卡
    switchTab(tab) {
      this.currentTab = tab;
      // 可以在这里添加加载不同类型积分明细的逻辑
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 750rpx;
  margin: 0 auto;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

.back-icon {
  color: #333333;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
}

.header-right {
  display: flex;
  align-items: center;
}

.ml-4 {
  margin-left: 32rpx;
}

.tabs {
  display: flex;
  background-color: #FFFFFF;
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
  position: relative;
}

.tab-item.active text {
  color: #FF5000;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50rpx;
  height: 6rpx;
  background-color: #FF5000;
  border-radius: 3rpx;
}

.content {
  min-height: calc(100vh - 192rpx);
  background-color: #f5f5f5;
}
</style>