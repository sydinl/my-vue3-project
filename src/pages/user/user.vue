<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <text class="header-title">用户中心</text>
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
        <view class="user-stats">
          <view class="stat-item">
            <view class="stat-number">0</view>
            <view class="stat-label">我的收藏</view>
          </view>
        </view>
      </view>
      <view class="user-actions">
        <uni-icons type="map" size="24" class="action-icon"></uni-icons>
        <uni-icons type="setting" size="24" class="action-icon"></uni-icons>
      </view>
    </view>

    <!-- 我的订单区域 -->
    <view class="orders-section">
      <view class="section-header">
        <text class="section-title">我的订单</text>
        <text class="more-link" @click="viewAllOrders">查看更多 &gt;</text>
      </view>
      
      <view class="order-status-items">
        <view class="order-status-item" @click="viewOrders('pending')">
          <view class="order-icon">
            <image src="/static/icons/wallet.svg" mode="aspectFit" class="cart-icon-button"></image>
          </view>
          <text>待付款</text>
        </view>
        <view class="order-status-item" @click="viewOrders('shipping')">
          <view class="order-icon">
            <image src="/static/icons/wait-service.svg" mode="aspectFit" class="cart-icon-button"></image>
          </view>
          <text>待服务</text>
        </view>
        <view class="order-status-item" @click="viewOrders('completed')">
          <view class="order-icon">
            <image src="/static/icons/completed.svg" mode="aspectFit" class="cart-icon-button"></image>
          </view>
          <text>已完成</text>
        </view>
        <view class="order-status-item" @click="viewOrders('aftersale')">
          <view class="order-icon">
            <image src="/static/icons/post-sales.svg" mode="aspectFit" class="cart-icon-button"></image>
          </view>
          <text>售后</text>
        </view>
      </view>
    </view>

    <!-- 账户资产区域 -->
    <view class="assets-section">
      <view class="asset-grid">
        <view class="asset-item" @click="viewPoints">
          <view class="order-icon">
             <image src="/static/icons/ticket.svg" mode="aspectFit" class="cart-icon-button"></image>
          </view>
          <view class="asset-info">
            <view class="asset-value">0</view>
            <view class="asset-label">积分</view>
          </view>
        </view>
        <view class="asset-item" @click="viewBalance">
          <view class="order-icon">
            <image src="/static/icons/money.svg" mode="aspectFit" class="cart-icon-button"></image>
          </view>
          <view class="asset-info">
            <view class="asset-value">0</view>
            <view class="asset-label">余额</view>
          </view>
        </view>
        <view class="asset-item" @click="viewCoupons">
          <view class="order-icon">
            <image src="/static/icons/coupon1.svg" mode="aspectFit" class="cart-icon-button"></image>
          </view>
          <view class="asset-info">
            <view class="asset-value">0</view>
            <view class="asset-label">优惠券</view>
          </view>
        </view>
        <view class="asset-item" @click="viewCards">
          <view class="order-icon">
            <image src="/static/icons/gift.svg" mode="aspectFit" class="cart-icon-button"></image>
          </view>
          <view class="asset-info">
            <view class="asset-value">0</view>
            <view class="asset-label">卡券</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 菜单栏 -->
    <view class="menu-section">
      <view class="section-header">
        <text class="section-title">菜单栏</text>
      </view>
      
      <view class="menu-grid">
        <view class="menu-item" @click="clearCache">
          <view class="menu-icon">
            <image src="/static/icons/clear-cache.svg" mode="aspectFit" class="cart-icon-button"></image>
          </view>
          <text>清除缓存</text>
        </view>
        <view class="menu-item" @click="goToMemberCenter">
          <view class="menu-icon">
            <image src="/static/icons/member.svg" mode="aspectFit" class="cart-icon-button"></image>
          </view>
          <text>会员中心</text>
        </view>
        <view class="menu-item" @click="contactService">
          <view class="menu-icon">
            <image src="/static/icons/customer-service.svg" mode="aspectFit" class="cart-icon-button"></image>
          </view>
          <text>客服</text>
        </view>
        <view class="menu-item" @click="viewPersonalInfo">
          <view class="menu-icon">
            <image src="/static/icons/personal-info.svg" mode="aspectFit" class="cart-icon-button"></image>
          </view>
          <text>个人资料</text>
        </view>
        <view class="menu-item" @click="goToDistributionCenter">
          <view class="menu-icon">
            <image src="/static/icons/distribution-center1.svg" mode="aspectFit" class="cart-icon-button"></image>
          </view>
          <text>分销中心</text>
        </view>
        <view class="menu-item" @click="goToRechargeCenter">
          <view class="menu-icon">
            <image src="/static/icons/topup.svg" mode="aspectFit" class="cart-icon-button"></image>
          </view>
          <text>充值中心</text>
        </view>
        <view class="menu-item" @click="goToCouponCenter">
          <view class="menu-icon">
            <image src="/static/icons/coupon.svg" mode="aspectFit" class="cart-icon-button"></image>
          </view>
          <text>领券中心</text>
        </view>
        <view class="menu-item" @click="viewStoreLocations">
          <view class="menu-icon">
            <image src="/static/icons/address.svg" mode="aspectFit" class="cart-icon-button"></image>
          </view>
          <text>门店地址</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'UserCenter',
  setup() {
    // 查看所有订单
    const viewAllOrders = () => {
      uni.navigateTo({
        url: '/pages/orders/my-orders?status=all'
      });
    };

    // 查看指定状态订单
    const viewOrders = (status) => {
      // 根据用户需求，将待服务状态映射为待发货状态
      if (status === 'shipping') {
        uni.navigateTo({
          url: '/pages/orders/my-orders?status=shipping'
        });
      } else if (status === 'aftersale') {
        // 跳转到售后页面
        uni.navigateTo({
          url: '/pages/orders/after-sale'
        });
      } else {
        uni.navigateTo({
          url: `/pages/orders/my-orders?status=${status}`
        });
      }
    };

    // 查看积分
    const viewPoints = () => {
      uni.navigateTo({
        url: '/pages/assets/points-detail'
      });
    };

    // 查看余额
    const viewBalance = () => {
      uni.navigateTo({
        url: '/pages/assets/balance-record'
      });
    };

    // 查看优惠券
    const viewCoupons = () => {
      uni.navigateTo({
        url: '/pages/assets/my-coupons'
      });
    };

    // 查看卡券
    const viewCards = () => {
      uni.navigateTo({
        url: '/pages/assets/my-cards'
      });
    };

    // 清除缓存
    const clearCache = () => {
      uni.showToast({
        title: '清除缓存',
        icon: 'none',
        duration: 2000
      });
    };

    // 前往会员中心
    const goToMemberCenter = () => {
      uni.navigateTo({
        url: '/pages/member/member'
      });
    };

    // 联系客服
    const contactService = () => {
      uni.showToast({
        title: '联系客服',
        icon: 'none',
        duration: 2000
      });
    };

    // 查看个人资料
    const viewPersonalInfo = () => {
      uni.navigateTo({
        url: '/pages/user/personal-info'
      });
    };

    // 前往分销中心
    const goToDistributionCenter = () => {
      uni.navigateTo({
        url: '/pages/distribution/distribution'
      });
    };

    // 前往充值中心
    const goToRechargeCenter = () => {
      uni.showToast({
        title: '前往充值中心',
        icon: 'none',
        duration: 2000
      });
    };

    // 签到
    const signIn = () => {
      uni.showToast({
        title: '签到',
        icon: 'none',
        duration: 2000
      });
    };

    // 限时抢购
    const flashSale = () => {
      uni.showToast({
        title: '限时抢购',
        icon: 'none',
        duration: 2000
      });
    };

    // 邀请有礼
    const inviteFriends = () => {
      uni.showToast({
        title: '邀请有礼',
        icon: 'none',
        duration: 2000
      });
    };

    // 前往领券中心
    const goToCouponCenter = () => {
      uni.showToast({
        title: '前往领券中心',
        icon: 'none',
        duration: 2000
      });
    };

    // 查看门店地址
    const viewStoreLocations = () => {
      uni.showToast({
        title: '查看门店地址',
        icon: 'none',
        duration: 2000
      });
    };

    // 社区团购
    const communityGroupBuy = () => {
      uni.showToast({
        title: '社区团购',
        icon: 'none',
        duration: 2000
      });
    };

    // 招募令
    const recruitment = () => {
      uni.showToast({
        title: '招募令',
        icon: 'none',
        duration: 2000
      });
    };

    return {
      viewAllOrders,
      viewOrders,
      viewPoints,
      viewBalance,
      viewCoupons,
      viewCards,
      clearCache,
      goToMemberCenter,
      contactService,
      viewPersonalInfo,
      goToDistributionCenter,
      goToRechargeCenter,
      signIn,
      flashSale,
      inviteFriends,
      goToCouponCenter,
      viewStoreLocations,
      communityGroupBuy,
      recruitment
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 750rpx;
  margin: 0 auto;
  background-color: #FFFFFF;
  min-height: 100vh;
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
  background: linear-gradient(135deg, #FF5000, #FF8C00);
  color: #FFFFFF;
  padding: 40rpx 30rpx;
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
  background-color: #FFFFFF;
  border-radius: 100% 100% 0 0;
}

.user-avatar {
  margin-right: 30rpx;
}

.avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background-color: #FFFFFF;
  padding: 10rpx;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #FFFFFF;
}

.user-stats {
  display: flex;
  align-items: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 32rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 5rpx;
}

.divider {
  width: 2rpx;
  height: 40rpx;
  background-color: rgba(255, 255, 255, 0.3);
  margin: 0 40rpx;
}

.user-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  color: #FFFFFF;
  margin-bottom: 15rpx;
}

.orders-section {
  margin-top: 60rpx;
  padding: 0 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.more-link {
  font-size: 28rpx;
  color: #999999;
}

.order-status-items {
  display: flex;
  justify-content: space-between;
  background-color: #FFFFFF;
  padding: 30rpx 0;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.order-status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.order-icon {
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(255, 80, 0, 0.1);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15rpx;
}

.order-status-item text {
  font-size: 28rpx;
  color: #333333;
}

.assets-section {
  margin-top: 30rpx;
  padding: 0 30rpx;
}

.asset-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20rpx;
  background-color: #FFFFFF;
  padding: 30rpx 0;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.asset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
}

.asset-icon {
  margin-bottom: 15rpx;
}

.asset-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.asset-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 5rpx;
}

.asset-label {
  font-size: 24rpx;
  color: #999999;
}

.menu-section {
  margin-top: 30rpx;
  padding: 0 30rpx;
  margin-bottom: 100rpx;
}

.menu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20rpx;
  background-color: #FFFFFF;
  padding: 30rpx 0;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
}

.menu-icon {
  width: 80rpx;
  height: 80rpx;
  background-color: #F5F5F5;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15rpx;
}

.menu-item text {
  font-size: 26rpx;
  color: #333333;
  text-align: center;
}
</style>