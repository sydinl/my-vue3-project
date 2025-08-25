<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <uni-icons type="left" size="24" class="back-icon" @click="navigateBack"></uni-icons>
      <text class="header-title">分销佣金</text>
      <view class="header-right">
        <uni-icons type="ellipsis" size="20"></uni-icons>
        <uni-icons type="eye" size="20" class="ml-4"></uni-icons>
      </view>
    </view>

    <!-- 佣金总览区域 -->
    <view class="commission-overview">
      <text class="overview-title">分销佣金</text>
      <text class="overview-amount">¥0.00</text>
      <button class="detail-btn" @click="viewWithdrawDetails">提现明细</button>
    </view>

    <!-- 佣金明细区域 -->
    <view class="commission-details">
      <view class="detail-item">
        <text class="detail-label">可提现佣金</text>
        <text class="detail-value">¥0.00</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">已提现佣金</text>
        <text class="detail-value">¥0.00</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">待打款佣金</text>
        <text class="detail-value">¥0.00</text>
      </view>
    </view>

    <!-- 用户须知区域 -->
    <view class="user-notice" @click="viewUserNotice">
      <text class="notice-text">用户须知</text>
      <uni-icons type="right" size="16" class="notice-icon"></uni-icons>
    </view>

    <!-- 提现按钮 -->
    <view class="withdraw-section">
      <button class="withdraw-btn" @click="withdraw">提现</button>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'DistributionCommission',
  setup() {
    // 导航返回
    const navigateBack = () => {
      uni.navigateBack();
    };

    // 提现功能
    const withdraw = () => {
      if (true) { // 这里可以添加提现条件判断
        uni.showToast({
          title: '余额不足，无法提现',
          icon: 'none',
          duration: 2000
        });
      } else {
        // 实现提现逻辑
      }
    };

    // 查看提现明细
    const viewWithdrawDetails = () => {
      uni.showToast({
        title: '查看提现明细',
        icon: 'none',
        duration: 2000
      });
    };

    // 查看用户须知
    const viewUserNotice = () => {
      uni.showToast({
        title: '查看用户须知',
        icon: 'none',
        duration: 2000
      });
    };

    return {
      navigateBack,
      withdraw,
      viewWithdrawDetails,
      viewUserNotice
    };
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
  background-color: #FF5000;
  color: #FFFFFF;
  position: sticky;
  top: 0;
  z-index: 999;
}

.back-icon {
  color: #FFFFFF;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.header-right {
  display: flex;
  align-items: center;
}

.ml-4 {
  margin-left: 32rpx;
}

.commission-overview {
  background-color: #FF5000;
  color: #FFFFFF;
  padding: 40rpx 30rpx;
  position: relative;
}

.overview-title {
  font-size: 32rpx;
  margin-bottom: 10rpx;
  display: block;
}

.overview-amount {
  font-size: 64rpx;
  font-weight: bold;
  display: block;
}

.detail-btn {
  position: absolute;
  right: 30rpx;
  top: 40rpx;
  background-color: rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  border: none;
}

.commission-details {
  background-color: #FFFFFF;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 28rpx;
  color: #666;
}

.detail-value {
  font-size: 28rpx;
  color: #333;
}

.user-notice {
  background-color: #FFFFFF;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.notice-text {
  font-size: 28rpx;
  color: #333;
}

.notice-icon {
  color: #999;
}

.withdraw-section {
  padding: 30rpx;
  margin-top: auto;
  margin-bottom: 30rpx;
}

.withdraw-btn {
  background-color: #FF5000;
  color: #FFFFFF;
  font-size: 32rpx;
  padding: 20rpx 0;
  border-radius: 10rpx;
  border: none;
  width: 100%;
}
</style>