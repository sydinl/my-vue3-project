<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <uni-icons type="left" size="24" class="back-icon" @click="navigateBack"></uni-icons>
      <text class="header-title">分销中心</text>
      <view class="header-right">
        <uni-icons type="ellipsis" size="20"></uni-icons>
        <uni-icons type="eye" size="20" class="ml-4"></uni-icons>
      </view>
    </view>

    <!-- 用户信息区域 -->
    <view class="user-info-section">
      <view class="user-avatar">
        <image src="/static/icons/user.svg" mode="aspectFit" class="avatar"></image>
      </view>
      <view class="user-details">
        <view class="user-name">用户_1283323</view>
        <view class="user-referrer">推荐人：总店</view>
        <view class="user-level">分销等级：默认等级</view>
      </view>
      <view class="upgrade-btn">升级条件 &gt;</view>
    </view>

    <!-- 可提现佣金区域 -->
    <view class="commission-section">
      <view class="commission-title">可提现佣金</view>
      <view class="commission-amount">¥0.00</view>
      <button class="withdraw-btn" @click="withdraw">提现</button>
    </view>

    <!-- 佣金对比区域 -->
    <view class="commission-comparison">
      <view class="comparison-item">
        <view class="comparison-title">已提现佣金</view>
        <view class="comparison-amount green">¥0.00</view>
      </view>
      <view class="comparison-divider"></view>
      <view class="comparison-item">
        <view class="comparison-title">未结算佣金</view>
        <view class="comparison-amount orange">¥0.00</view>
      </view>
    </view>

    <!-- 功能入口区域 -->
    <view class="feature-section">
      <view class="feature-grid">
        <view class="feature-item" @click="viewDistributionCommission">
          <view class="feature-icon">
            <image src="/static/icons/money.svg" mode="aspectFit"></image>
          </view>
          <view class="feature-text">分销佣金</view>
          <view class="feature-value">¥0.00</view>
        </view>
        <view class="feature-item" @click="viewDistributionOrders">
          <view class="feature-icon">
            <image src="/static/icons/order.svg" mode="aspectFit"></image>
          </view>
          <view class="feature-text">分销订单</view>
          <view class="feature-value">0</view>
        </view>
        <view class="feature-item" @click="viewWithdrawDetails">
          <view class="feature-icon">
            <image src="/static/icons/money1.svg" mode="aspectFit"></image>
          </view>
          <view class="feature-text">提现明细</view>
          <view class="feature-value">¥0.00</view>
        </view>
        <view class="feature-item" @click="viewMyTeam">
          <view class="feature-icon">
            <image src="/static/icons/member-center.svg" mode="aspectFit"></image>
          </view>
          <view class="feature-text">我的团队</view>
          <view class="feature-value">0人</view>
        </view>
        <view class="feature-item" @click="viewPromotionQRCode">
          <view class="feature-icon">
            <image src="/static/icons/code.svg" mode="aspectFit"></image>
          </view>
          <view class="feature-text">推广二维码</view>
        </view>
        <view class="feature-item" @click="viewDistributionRanking">
          <view class="feature-icon">
            <image src="/static/icons/rank.svg" mode="aspectFit"></image>
          </view>
          <view class="feature-text">分销排行</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'DistributionCenter',
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

    // 查看分销佣金
    const viewDistributionCommission = () => {
      uni.showToast({
        title: '查看分销佣金',
        icon: 'none',
        duration: 2000
      });
    };

    // 查看分销订单
    const viewDistributionOrders = () => {
      uni.showToast({
        title: '查看分销订单',
        icon: 'none',
        duration: 2000
      });
    };

    // 查看提现明细
    const viewWithdrawDetails = () => {
      uni.showToast({
        title: '查看提现明细',
        icon: 'none',
        duration: 2000
      });
    };

    // 查看我的团队
    const viewMyTeam = () => {
      uni.showToast({
        title: '查看我的团队',
        icon: 'none',
        duration: 2000
      });
    };

    // 查看推广二维码
    const viewPromotionQRCode = () => {
      uni.showToast({
        title: '查看推广二维码',
        icon: 'none',
        duration: 2000
      });
    };

    // 查看分销排行
    const viewDistributionRanking = () => {
      uni.showToast({
        title: '查看分销排行',
        icon: 'none',
        duration: 2000
      });
    };

    return {
      navigateBack,
      withdraw,
      viewDistributionCommission,
      viewDistributionOrders,
      viewWithdrawDetails,
      viewMyTeam,
      viewPromotionQRCode,
      viewDistributionRanking
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 750rpx;
  margin: 0 auto;
  background-color: #f5f5f5;
  padding-bottom: 100rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #FF5000;
  color: #FFFFFF;
  position: relative;
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

.user-info-section {
  background-color: #FF5000;
  color: #FFFFFF;
  padding: 30rpx;
  display: flex;
  align-items: center;
}

.user-avatar {
  margin-right: 20rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: #FFFFFF;
  padding: 10rpx;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.user-referrer,
.user-level {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8rpx;
}

.upgrade-btn {
  font-size: 28rpx;
  color: #FFFFFF;
}

.commission-section {
  background-color: #FFFFFF;
  padding: 30rpx;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.commission-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.commission-amount {
  font-size: 48rpx;
  font-weight: bold;
  color: #FF5000;
  margin-bottom: 20rpx;
}

.withdraw-btn {
  background-color: #FF5000;
  color: #FFFFFF;
  font-size: 28rpx;
  padding: 10rpx 60rpx;
  border-radius: 30rpx;
  border: none;
}

.commission-comparison {
  display: flex;
  background-color: #FFFFFF;
  margin-bottom: 20rpx;
  border-bottom: 1px solid #f0f0f0;
}

.comparison-item {
  flex: 1;
  padding: 30rpx 0;
  text-align: center;
}

.comparison-divider {
  width: 1px;
  background-color: #f0f0f0;
}

.comparison-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.comparison-amount {
  font-size: 36rpx;
  font-weight: bold;
}

.green {
  color: #07C160;
}

.orange {
  color: #FF9500;
}

.feature-section {
  background-color: #FFFFFF;
  padding: 20rpx;
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20rpx;
}

.feature-item {
  text-align: center;
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 16rpx;
}

.feature-icon {
  width: 80rpx;
  height: 80rpx;
  margin: 0 auto 10rpx;
}

.feature-icon image {
  width: 100%;
  height: 100%;
}

.feature-text {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 5rpx;
}

.feature-value {
  font-size: 24rpx;
  color: #FF5000;
}
</style>