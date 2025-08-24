<template>
  <view class="container">
    <!-- 用户信息区域 -->
    <view class="user-info-section">
      <image src="../../static/items/wxpic_202508220008267.jpg" mode="aspectFill" class="user-avatar"></image>
      <view class="user-details">
        <text class="user-name">游客</text>
        <text class="user-id">ID: 12345678</text>
      </view>
      <button class="login-btn" @click="login">登录/注册</button>
    </view>

    <!-- 订单状态 -->
    <view class="order-status-section">
      <view class="order-status-items">
        <view class="order-status-item" @click="viewOrders('all')">
          <uni-icons type="list" size="36" color="#FF5000"></uni-icons>
          <text>全部订单</text>
        </view>
        <view class="order-status-item" @click="viewOrders('pending')">
          <uni-icons type="clock" size="36" color="#FF5000"></uni-icons>
          <text>待付款</text>
        </view>
        <view class="order-status-item" @click="viewOrders('processing')">
          <uni-icons type="refresh" size="36" color="#FF5000"></uni-icons>
          <text>进行中</text>
        </view>
        <view class="order-status-item" @click="viewOrders('completed')">
          <uni-icons type="checkmark" size="36" color="#FF5000"></uni-icons>
          <text>已完成</text>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="feature-section">
      <view class="feature-item" @click="viewCoupons">
        <uni-icons type="ticket" size="28" color="#FF5000"></uni-icons>
        <text>优惠券</text>
        <uni-icons type="right" size="24" color="#CCCCCC"></uni-icons>
      </view>
      <view class="feature-item" @click="viewFavorites">
        <uni-icons type="star" size="28" color="#FF5000"></uni-icons>
        <text>我的收藏</text>
        <uni-icons type="right" size="24" color="#CCCCCC"></uni-icons>
      </view>
      <view class="feature-item" @click="viewAddress">
        <uni-icons type="location" size="28" color="#FF5000"></uni-icons>
        <text>收货地址</text>
        <uni-icons type="right" size="24" color="#CCCCCC"></uni-icons>
      </view>
      <view class="feature-item" @click="viewMemberCard">
        <uni-icons type="credit-card" size="28" color="#FF5000"></uni-icons>
        <text>会员卡</text>
        <uni-icons type="right" size="24" color="#CCCCCC"></uni-icons>
      </view>
    </view>

    <!-- 设置区域 -->
    <view class="setting-section">
      <view class="feature-item" @click="viewAbout">
        <uni-icons type="info" size="28" color="#FF5000"></uni-icons>
        <text>关于我们</text>
        <uni-icons type="right" size="24" color="#CCCCCC"></uni-icons>
      </view>
      <view class="feature-item" @click="viewHelp">
        <uni-icons type="help" size="28" color="#FF5000"></uni-icons>
        <text>帮助中心</text>
        <uni-icons type="right" size="24" color="#CCCCCC"></uni-icons>
      </view>
      <view class="feature-item" @click="contactUs">
        <uni-icons type="phone" size="28" color="#FF5000"></uni-icons>
        <text>联系客服</text>
        <uni-icons type="right" size="24" color="#CCCCCC"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'UserPage',
  setup() {
    // 登录
    const login = () => {
      uni.showToast({ title: '前往登录页面', icon: 'none' });
    };

    // 查看订单
    const viewOrders = (status) => {
      uni.showToast({ title: `查看${status === 'all' ? '全部' : status === 'pending' ? '待付款' : status === 'processing' ? '进行中' : '已完成'}订单`, icon: 'none' });
    };

    // 查看优惠券
    const viewCoupons = () => {
      uni.showToast({ title: '查看优惠券', icon: 'none' });
    };

    // 查看收藏
    const viewFavorites = () => {
      uni.showToast({ title: '查看收藏', icon: 'none' });
    };

    // 查看地址
    const viewAddress = () => {
      uni.showToast({ title: '查看地址', icon: 'none' });
    };

    // 查看会员卡
    const viewMemberCard = () => {
      uni.showToast({ title: '查看会员卡', icon: 'none' });
    };

    // 查看关于我们
    const viewAbout = () => {
      uni.showToast({ title: '查看关于我们', icon: 'none' });
    };

    // 查看帮助中心
    const viewHelp = () => {
      uni.showToast({ title: '查看帮助中心', icon: 'none' });
    };

    // 联系客服
    const contactUs = () => {
      uni.showToast({ title: '联系客服', icon: 'none' });
    };

    return {
      login,
      viewOrders,
      viewCoupons,
      viewFavorites,
      viewAddress,
      viewMemberCard,
      viewAbout,
      viewHelp,
      contactUs
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
}

.user-info-section {
  background-color: #FF5000;
  padding: 60rpx 30rpx;
  display: flex;
  align-items: center;
  position: relative;
}

.user-info-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40rpx;
  background-color: #f5f5f5;
  border-radius: 100% 100% 0 0;
}

.user-avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.8);
}

.user-details {
  margin-left: 30rpx;
}

.user-name {
  font-size: 36rpx;
  color: #fff;
  font-weight: bold;
}

.user-id {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10rpx;
  display: block;
}

.login-btn {
  margin-left: auto;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 2rpx solid rgba(255, 255, 255, 0.8);
  padding: 0 40rpx;
  height: 70rpx;
  border-radius: 35rpx;
  font-size: 28rpx;
}

.order-status-section {
  margin-top: 60rpx;
  padding: 0 30rpx;
}

.order-status-items {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  padding: 40rpx 0;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.order-status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.order-status-item text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #333;
}

.feature-section,
.setting-section {
  margin-top: 20rpx;
  padding: 0 30rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 30rpx;
  border-bottom: 2rpx solid #f5f5f5;
}

.feature-item:last-child {
  border-bottom: none;
  border-radius: 0 0 20rpx 20rpx;
}

.feature-section .feature-item:first-child {
  border-radius: 20rpx 20rpx 0 0;
}

.setting-section .feature-item:first-child {
  border-radius: 20rpx 20rpx 0 0;
}

.feature-item text {
  margin-left: 30rpx;
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.feature-item .uni-icon-right {
  color: #CCCCCC;
}
</style>