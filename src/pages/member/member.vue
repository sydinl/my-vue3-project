<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <uni-icons type="left" size="24" class="back-icon" @click="navigateBack"></uni-icons>
      <text class="header-title">会员中心</text>
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
        <view class="user-level">
          <text>普通用户</text>
        </view>
      </view>
    </view>

    <!-- 账户余额区域 -->
    <view class="balance-section">
      <view class="balance-card">
        <view class="balance-amount">¥0.00</view>
        <view class="balance-label">账户余额</view>
        <button class="recharge-btn" @click="recharge">去充值</button>
      </view>
    </view>

    <!-- 会员特权区域 -->
    <!-- <view class="privileges-section">
      <view class="section-header">
        <text class="section-title">会员特权</text>
        <text class="more-link" @click="viewAllPrivileges">全部特权 &gt;</text>
      </view>
      
      <view class="privileges-list">
        <view class="privilege-item" @click="viewPrivilege('discount')">
          <view class="privilege-icon">
            <image src="/static/icons/member-center.svg" mode="aspectFit"></image>
          </view>
          <view class="privilege-text">折扣优惠</view>
        </view>
        
        <view class="privilege-item" @click="viewPrivilege('points')">
          <view class="privilege-icon">
            <image src="/static/icons/member-center.svg" mode="aspectFit"></image>
          </view>
          <view class="privilege-text">积分兑换</view>
        </view>
        
        <view class="privilege-item" @click="viewPrivilege('coupons')">
          <view class="privilege-icon">
            <image src="/static/icons/member-center.svg" mode="aspectFit"></image>
          </view>
          <view class="privilege-text">优惠券</view>
        </view>
        
        <view class="privilege-item" @click="viewPrivilege('birthday')">
          <view class="privilege-icon">
            <image src="/static/icons/member-center.svg" mode="aspectFit"></image>
          </view>
          <view class="privilege-text">生日礼遇</view>
        </view>
      </view>
    </view>

    <!-- 我的服务区域 -->
    <!-- <view class="services-section">
      <view class="section-header">
        <text class="section-title">我的服务</text>
      </view>
      
      <view class="services-grid">
        <view class="service-item" @click="viewService('orders')">
          <view class="service-icon">
            <image src="/static/icons/order.svg" mode="aspectFit"></image>
          </view>
          <view class="service-text">我的订单</view>
        </view>
        
        <view class="service-item" @click="viewService('favorites')">
          <view class="service-icon">
            <image src="/static/icons/member-center.svg" mode="aspectFit"></image>
          </view>
          <view class="service-text">我的收藏</view>
        </view>
        
        <view class="service-item" @click="viewService('appointments')">
          <view class="service-icon">
            <image src="/static/icons/member-center.svg" mode="aspectFit"></image>
          </view>
          <view class="service-text">预约记录</view>
        </view>
        
        <view class="service-item" @click="viewService('reviews')">
          <view class="service-icon">
            <image src="/static/icons/member-center.svg" mode="aspectFit"></image>
          </view>
          <view class="service-text">我的评价</view>
        </view>
        
        <view class="service-item" @click="viewService('cards')">
          <view class="service-icon">
            <image src="/static/icons/member-center.svg" mode="aspectFit"></image>
          </view>
          <view class="service-text">会员卡</view>
        </view>
        
        <view class="service-item" @click="viewService('settings')">
          <view class="service-icon">
            <image src="/static/icons/member-center.svg" mode="aspectFit"></image>
          </view>
          <view class="service-text">设置</view>
        </view>
      </view>
    </view> --> 
  </view>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'MemberCenter',
  setup() {
    // 导航返回
    const navigateBack = () => {
      uni.navigateBack();
    };

    // 去充值
    const recharge = () => {
      uni.showToast({
        title: '前往充值页面',
        icon: 'none',
        duration: 2000
      });
    };

    // 查看全部特权
    const viewAllPrivileges = () => {
      uni.showToast({
        title: '查看全部特权',
        icon: 'none',
        duration: 2000
      });
    };

    // 查看具体特权
    const viewPrivilege = (type) => {
      let title = '';
      switch (type) {
        case 'discount':
          title = '折扣优惠';
          break;
        case 'points':
          title = '积分兑换';
          break;
        case 'coupons':
          title = '优惠券';
          break;
        case 'birthday':
          title = '生日礼遇';
          break;
        default:
          title = '会员特权';
      }
      uni.showToast({
        title: `查看${title}`,
        icon: 'none',
        duration: 2000
      });
    };

    // 查看服务
    const viewService = (type) => {
      let title = '';
      switch (type) {
        case 'orders':
          title = '我的订单';
          break;
        case 'favorites':
          title = '我的收藏';
          break;
        case 'appointments':
          title = '预约记录';
          break;
        case 'reviews':
          title = '我的评价';
          break;
        case 'cards':
          title = '会员卡';
          break;
        case 'settings':
          title = '设置';
          break;
        default:
          title = '服务';
      }
      uni.showToast({
        title: `查看${title}`,
        icon: 'none',
        duration: 2000
      });
    };

    return {
      navigateBack,
      recharge,
      viewAllPrivileges,
      viewPrivilege,
      viewService
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 750rpx;
  margin: 0 auto;
  background-color: #1A1A1A;
  color: #FFFFFF;
  padding-bottom: 100rpx;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #1A1A1A;
  color: #FFFFFF;
  position: relative;
  border-bottom: 1px solid #333;
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
  background-color: #1A1A1A;
  color: #FFFFFF;
  padding: 30rpx;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #333;
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
  color: #FFFFFF;
}

.user-level {
  display: inline-block;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  padding: 4rpx 16rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
  color: #FFFFFF;
}

.balance-section {
  background-color: #1A1A1A;
  padding: 30rpx;
  border-bottom: 1px solid #333;
}

.balance-card {
  background: linear-gradient(135deg, #333, #555);
  padding: 30rpx;
  border-radius: 16rpx;
  border: 2px solid #444;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.balance-amount {
  font-size: 60rpx;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 10rpx;
}

.balance-label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20rpx;
}

.recharge-btn {
  background: linear-gradient(90deg, #FFD700, #FFA500);
  color: #FFFFFF;
  font-size: 28rpx;
  padding: 10rpx 60rpx;
  border-radius: 30rpx;
  border: none;
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
}

.privileges-section,
.services-section {
  background-color: #1A1A1A;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
  border-bottom: 1px solid #333;
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
  color: #FFFFFF;
}

.more-link {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.6);
}

.privileges-list {
  display: flex;
  justify-content: space-between;
}

.privilege-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.privilege-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 10rpx;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.privilege-icon image {
  width: 50rpx;
  height: 50rpx;
}

.privilege-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.services-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20rpx;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.service-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 10rpx;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.service-icon image {
  width: 50rpx;
  height: 50rpx;
}

.service-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}
</style>