<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <uni-icons type="left" size="24" class="back-icon" @click="navigateBack"></uni-icons>
      <text class="header-title">我的优惠券</text>
      <view class="header-right">
        <uni-icons type="ellipsis" size="20"></uni-icons>
        <uni-icons type="eye" size="20" class="ml-4"></uni-icons>
      </view>
    </view>

    <!-- 优惠券状态选项卡 -->
    <view class="tabs">
      <view class="tab-item" :class="{ active: currentTab === 'unused' }" @click="switchTab('unused')">
        <text>未使用</text>
      </view>
      <view class="tab-item" :class="{ active: currentTab === 'used' }" @click="switchTab('used')">
        <text>已使用</text>
      </view>
      <view class="tab-item" :class="{ active: currentTab === 'expired' }" @click="switchTab('expired')">
        <text>已过期</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <view class="empty-state">
        <text class="empty-text">暂无相关优惠券</text>
      </view>
    </view>

    <!-- 底部去领券按钮 -->
    <view class="bottom-button">
      <button class="go-receive-btn" @click="goToReceiveCoupons">去领券</button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MyCoupons',
  data() {
    return {
      currentTab: 'unused' // 默认选中"未使用"选项卡
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
      // 可以在这里添加加载不同状态优惠券的逻辑
    },
    // 去领券
    goToReceiveCoupons() {
      // 根据之前的代码，有一个goToCouponCenter方法
      // 这里可以跳转到领券中心页面
      uni.navigateTo({
        url: '/pages/user/user?goto=couponCenter'
      });
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
  display: flex;
  flex-direction: column;
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
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
}

.bottom-button {
  background-color: #FFFFFF;
  padding: 20rpx 30rpx;
  border-top: 1px solid #f0f0f0;
}

.go-receive-btn {
  background-color: #FF5000;
  color: #FFFFFF;
  border-radius: 50rpx;
  font-size: 32rpx;
  padding: 20rpx 0;
  line-height: 1.5;
}
</style>