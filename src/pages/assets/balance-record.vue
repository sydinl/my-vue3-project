<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <uni-icons type="left" size="24" class="back-icon" @click="navigateBack"></uni-icons>
      <text class="header-title">余额记录</text>
      <view class="header-right">
        <uni-icons type="ellipsis" size="20"></uni-icons>
        <uni-icons type="eye" size="20" class="ml-4"></uni-icons>
      </view>
    </view>

    <!-- 余额信息区域 -->
    <view class="balance-section">
      <view class="balance-header">账户余额(元)</view>
      <view class="balance-amount">0.00</view>
      <button class="recharge-btn" @click="goToRecharge">充值</button>
    </view>

    <!-- 充值广告区域 -->
    <view class="recharge-ad">
      <image src="/static/icons/money-bag.png" mode="aspectFit" class="ad-icon"></image>
      <view class="ad-text">
        <view class="ad-title">在线充值秒到账</view>
        <view class="ad-subtitle">余额充值中心</view>
      </view>
      <button class="ad-recharge-btn" @click="goToRecharge">立即充值</button>
    </view>

    <!-- 月份选择区域 -->
    <view class="month-selector">
      <uni-icons type="left" size="20" @click="previousMonth"></uni-icons>
      <text class="current-month">2025年08月</text>
      <uni-icons type="right" size="20" @click="nextMonth"></uni-icons>
    </view>

    <!-- 记录列表区域 -->
    <view class="record-list">
      <!-- 暂时显示空白状态 -->
    </view>
  </view>
</template>

<script>
export default {
  name: 'BalanceRecord',
  data() {
    return {
      currentMonth: '2025年08月',
      balance: '0.00'
    };
  },
  methods: {
    // 导航返回
    navigateBack() {
      uni.navigateBack();
    },
    // 前往充值页面
    goToRecharge() {
      // 目前没有专门的充值页面，显示提示信息
      uni.showToast({
        title: '前往充值页面',
        icon: 'none',
        duration: 2000
      });
    },
    // 切换到上个月
    previousMonth() {
      // 简单实现，实际项目中应该有日期处理逻辑
      this.currentMonth = '2025年07月';
    },
    // 切换到下个月
    nextMonth() {
      // 简单实现，实际项目中应该有日期处理逻辑
      this.currentMonth = '2025年09月';
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

.balance-section {
  background-color: #1E88E5;
  padding: 40rpx 30rpx;
  text-align: center;
  color: #FFFFFF;
}

.balance-header {
  font-size: 28rpx;
  margin-bottom: 20rpx;
  opacity: 0.9;
}

.balance-amount {
  font-size: 60rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
}

.recharge-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50rpx;
  font-size: 28rpx;
  padding: 12rpx 40rpx;
  line-height: 1.5;
}

.recharge-ad {
  background-color: #FFFFFF;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.recharge-ad::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 214, 0, 0.1), rgba(255, 87, 34, 0.1));
  z-index: 0;
}

.ad-icon {
  width: 120rpx;
  height: 120rpx;
  margin-right: 20rpx;
  z-index: 1;
}

.ad-text {
  flex: 1;
  z-index: 1;
}

.ad-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10rpx;
}

.ad-subtitle {
  font-size: 26rpx;
  color: #666666;
}

.ad-recharge-btn {
  background-color: #FF5722;
  color: #FFFFFF;
  border-radius: 50rpx;
  font-size: 28rpx;
  padding: 12rpx 30rpx;
  line-height: 1.5;
  z-index: 1;
}

.month-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FFFFFF;
  padding: 20rpx 30rpx;
  margin: 0 20rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.current-month {
  font-size: 30rpx;
  color: #333333;
}

.record-list {
  margin: 20rpx;
  min-height: 400rpx;
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}
</style>