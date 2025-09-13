<template>
  <view class="container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部导航栏 -->
    <view class="header" :style="{ marginTop: statusBarHeight + 'px' }">
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
import { ref, onMounted } from 'vue';

export default {
  name: 'DistributionCommission',
  setup() {
    // 状态栏高度
    const statusBarHeight = ref(0);
    const safeAreaInsets = ref({ top: 0, bottom: 0, left: 0, right: 0 });
    
    // 获取系统信息
    const getSystemInfo = () => {
      uni.getSystemInfo({
        success: (res) => {
          statusBarHeight.value = res.statusBarHeight || 0;
          if (res.safeAreaInsets) {
            safeAreaInsets.value = res.safeAreaInsets;
            if (res.safeAreaInsets.top > res.statusBarHeight) {
              statusBarHeight.value = res.safeAreaInsets.top;
            }
          }
          // 针对iPhone X系列设备
          if (res.model && (res.model.includes('iPhone X') || res.model.includes('iPhone 11') || res.model.includes('iPhone 12') || res.model.includes('iPhone 13') || res.model.includes('iPhone 14') || res.model.includes('iPhone 15'))) {
            statusBarHeight.value = Math.max(statusBarHeight.value, 44);
          }
          // 确保最小高度
          statusBarHeight.value = Math.max(statusBarHeight.value, 20);
        }
      });
    };
    
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

    // 页面加载时获取系统信息
    onMounted(() => {
      getSystemInfo();
    });
    
    return {
      statusBarHeight,
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
  background: linear-gradient(180deg, #F0F8F0 0%, #E8F5E8 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.status-bar {
  background-color: #4CAF50;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: #FFFFFF;
  position: relative;
  z-index: 9998;
  box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
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
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: #FFFFFF;
  padding: 40rpx 30rpx;
  position: relative;
  box-shadow: 0 6rpx 20rpx rgba(76, 175, 80, 0.3);
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
  margin: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.1);
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
  margin: 0 20rpx 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: #FFFFFF;
  font-size: 32rpx;
  padding: 20rpx 0;
  border-radius: 16rpx;
  border: none;
  width: 100%;
  box-shadow: 0 6rpx 20rpx rgba(76, 175, 80, 0.3);
}
</style>