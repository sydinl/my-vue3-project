<template>
  <view class="container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部导航栏 -->
    <view class="header" :style="{ marginTop: statusBarHeight + 'px' }">
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
        <image src="/static/icons/user.png" mode="aspectFit" class="avatar"></image>
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
        <view class="more-link" @click="viewAllPrivileges">
          <text>全部特权</text>
          <image src="/static/icons/icon-right.png" mode="aspectFit" class="more-icon"></image>
        </view>
      </view>
      
      <view class="privileges-list">
        <view class="privilege-item" @click="viewPrivilege('discount')">
          <view class="privilege-icon">
            <image src="/static/icons/member-center.png" mode="aspectFit"></image>
          </view>
          <view class="privilege-text">折扣优惠</view>
        </view>
        
        <view class="privilege-item" @click="viewPrivilege('points')">
          <view class="privilege-icon">
            <image src="/static/icons/member-center.png" mode="aspectFit"></image>
          </view>
          <view class="privilege-text">积分兑换</view>
        </view>
        
        <view class="privilege-item" @click="viewPrivilege('coupons')">
          <view class="privilege-icon">
            <image src="/static/icons/member-center.png" mode="aspectFit"></image>
          </view>
          <view class="privilege-text">优惠券</view>
        </view>
        
        <view class="privilege-item" @click="viewPrivilege('birthday')">
          <view class="privilege-icon">
            <image src="/static/icons/member-center.png" mode="aspectFit"></image>
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
            <image src="/static/icons/order.png" mode="aspectFit"></image>
          </view>
          <view class="service-text">我的订单</view>
        </view>
        
        <view class="service-item" @click="viewService('favorites')">
          <view class="service-icon">
            <image src="/static/icons/member-center.png" mode="aspectFit"></image>
          </view>
          <view class="service-text">我的收藏</view>
        </view>
        
        <view class="service-item" @click="viewService('appointments')">
          <view class="service-icon">
            <image src="/static/icons/member-center.png" mode="aspectFit"></image>
          </view>
          <view class="service-text">预约记录</view>
        </view>
        
        <view class="service-item" @click="viewService('reviews')">
          <view class="service-icon">
            <image src="/static/icons/member-center.png" mode="aspectFit"></image>
          </view>
          <view class="service-text">我的评价</view>
        </view>
        
        <view class="service-item" @click="viewService('cards')">
          <view class="service-icon">
            <image src="/static/icons/member-center.png" mode="aspectFit"></image>
          </view>
          <view class="service-text">会员卡</view>
        </view>
        
        <view class="service-item" @click="viewService('settings')">
          <view class="service-icon">
            <image src="/static/icons/member-center.png" mode="aspectFit"></image>
          </view>
          <view class="service-text">设置</view>
        </view>
      </view>
    </view> --> 
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'MemberCenter',
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

    // 页面加载时获取系统信息
    onMounted(() => {
      getSystemInfo();
    });
    
    return {
      statusBarHeight,
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
  background: linear-gradient(180deg, #F0F8F0 0%, #E8F5E8 100%);
  color: #333;
  padding-bottom: 100rpx;
  min-height: 100vh;
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

.user-info-section {
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: #FFFFFF;
  padding: 30rpx;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.user-info-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: linear-gradient(90deg, #66BB6A 0%, #4CAF50 50%, #66BB6A 100%);
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
  background: linear-gradient(90deg, #66BB6A, #4CAF50);
  padding: 4rpx 16rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
  color: #FFFFFF;
  box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.3);
}

.balance-section {
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FFF8 100%);
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.1);
}

.balance-card {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  padding: 30rpx;
  border-radius: 20rpx;
  border: 2px solid #66BB6A;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 6rpx 20rpx rgba(76, 175, 80, 0.3);
  overflow: hidden;
}

.balance-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: linear-gradient(90deg, #66BB6A 0%, #4CAF50 50%, #66BB6A 100%);
}

.balance-amount {
  font-size: 60rpx;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 10rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.balance-label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 20rpx;
}

.recharge-btn {
  background: linear-gradient(90deg, #66BB6A, #4CAF50);
  color: #FFFFFF;
  font-size: 28rpx;
  padding: 12rpx 60rpx;
  border-radius: 30rpx;
  border: none;
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.4);
  transition: all 0.3s ease;
}

.recharge-btn:hover {
  transform: translateY(-52%) scale(1.05);
  box-shadow: 0 6rpx 16rpx rgba(76, 175, 80, 0.5);
}

.privileges-section,
.services-section {
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FFF8 100%);
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.1);
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
  color: #2E7D32;
}

.more-link {
  font-size: 28rpx;
  color: #4CAF50;
  font-weight: 500;
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
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  border-radius: 16rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
}

.privilege-icon image {
  width: 50rpx;
  height: 50rpx;
}

.privilege-text {
  font-size: 28rpx;
  color: #2E7D32;
  font-weight: 500;
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
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  border-radius: 16rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
}

.service-icon image {
  width: 50rpx;
  height: 50rpx;
}

.service-text {
  font-size: 28rpx;
  color: #2E7D32;
  font-weight: 500;
}
</style>