<template>
  <view class="container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部导航栏 -->
    <view class="header" :style="{ marginTop: statusBarHeight + 'px' }">
      <uni-icons type="left" size="24" class="back-icon" @click="navigateBack"></uni-icons>
      <text class="header-title">分销中心</text>
      <view class="header-right">
        <uni-icons type="ellipsis" size="20"></uni-icons>
        <uni-icons type="eye" size="20" class="ml-4"></uni-icons>
      </view>
    </view>

    <!-- 用户信息区域（微信昵称、头像与「我的」页一致） -->
    <view class="user-info-section">
      <view class="user-avatar">
        <image :src="userDisplay.avatar" mode="aspectFit" class="avatar"></image>
      </view>
      <view class="user-details">
        <view class="user-name">{{ userDisplay.name }}</view>
        <view class="user-referrer">推荐人：总店</view>
        <view class="user-level">分销等级：默认等级</view>
      </view>
      <view class="upgrade-btn">升级条件 &gt;</view>
    </view>

    <!-- 可提现佣金区域 -->
    <view class="commission-section">
      <view class="commission-title">可提现佣金</view>
      <view class="commission-amount">¥{{ distribution.availableCommission }}</view>
      <button class="withdraw-btn" @click="withdraw">提现</button>
    </view>

    <!-- 佣金对比区域 -->
    <view class="commission-comparison">
      <view class="comparison-item">
        <view class="comparison-title">已提现佣金</view>
        <view class="comparison-amount green">¥{{ distribution.withdrawnCommission }}</view>
      </view>
      <view class="comparison-divider"></view>
      <view class="comparison-item">
        <view class="comparison-title">未结算佣金</view>
        <view class="comparison-amount orange">¥{{ distribution.availableCommission }}</view>
      </view>
    </view>

    <!-- 功能入口区域 -->
    <view class="feature-section">
      <view class="feature-grid">
        <view class="feature-item" @click="viewDistributionCommission">
          <view class="feature-icon">
            <image src="/static/icons/money.png" mode="aspectFit"></image>
          </view>
          <view class="feature-text">分销佣金</view>
          <view class="feature-value">¥{{ distribution.totalCommission }}</view>
        </view>
        <view class="feature-item" @click="viewDistributionOrders">
          <view class="feature-icon">
            <image src="/static/icons/order.png" mode="aspectFit"></image>
          </view>
          <view class="feature-text">分销订单</view>
          <view class="feature-value">{{ distribution.totalOrderCount }}</view>
        </view>
        <view class="feature-item" @click="viewWithdrawDetails">
          <view class="feature-icon">
            <image src="/static/icons/money1.png" mode="aspectFit"></image>
          </view>
          <view class="feature-text">提现明细</view>
          <view class="feature-value">¥{{ distribution.withdrawnCommission }}</view>
        </view>
        <view class="feature-item" @click="viewMyTeam">
          <view class="feature-icon">
            <image src="/static/icons/member-center.png" mode="aspectFit"></image>
          </view>
          <view class="feature-text">我的团队</view>
          <view class="feature-value">{{ distribution.teamCount }}人</view>
        </view>
        <view class="feature-item" @click="viewPromotionQRCode">
          <view class="feature-icon">
            <image src="/static/icons/code.png" mode="aspectFit"></image>
          </view>
          <view class="feature-text">推广二维码</view>
        </view>
        <view class="feature-item" @click="viewDistributionRanking">
          <view class="feature-icon">
            <image src="/static/icons/rank.png" mode="aspectFit"></image>
          </view>
          <view class="feature-text">分销排行</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '@/utils/api.js';
import userManager from '@/utils/user-manager.js';

function formatMoney(v) {
  if (v == null || isNaN(v)) return '0.00';
  return Number(v).toFixed(2);
}

// 与「我的」页统一的展示名：微信昵称优先
function displayName(data) {
  if (!data) return '微信用户';
  const n = data.nickname || data.fullName || data.realName;
  if (n && String(n).trim()) return String(n).trim();
  const id = data.userId || data.id;
  return id ? `用户_${id}` : '微信用户';
}

// 与「我的」页统一的头像：微信头像优先
function displayAvatar(data, fallback) {
  const url = data?.avatar || data?.avatarUrl;
  if (url && String(url).trim()) return String(url).trim();
  return fallback || '/static/icons/user.png';
}

export default {
  name: 'DistributionCenter',
  setup() {
    // 状态栏高度
    const statusBarHeight = ref(0);
    const safeAreaInsets = ref({ top: 0, bottom: 0, left: 0, right: 0 });
    // 用户展示信息（微信昵称、头像，与「我的」页一致）
    const userDisplay = ref({
      name: '微信用户',
      avatar: '/static/icons/user.png'
    });
    // 分销中心数据（接口返回后填充）
    const distribution = ref({
      totalCommission: '0.00',
      availableCommission: '0.00',
      withdrawnCommission: '0.00',
      teamCount: 0,
      todayOrderCount: 0,
      totalOrderCount: 0
    });

    // 加载用户展示信息（昵称、头像）
    const loadUserDisplay = async () => {
      const currentUser = userManager.getCurrentUser();
      try {
        const res = await api.user.getInfo();
        if (res.code === 200 && res.data) {
          const d = res.data;
          userDisplay.value = {
            name: displayName(d) || displayName(currentUser),
            avatar: displayAvatar(d, currentUser?.avatarUrl ? currentUser.avatarUrl : '/static/icons/user.png')
          };
          return;
        }
      } catch (_) {}
      if (currentUser) {
        userDisplay.value = {
          name: displayName(currentUser),
          avatar: displayAvatar(currentUser)
        };
      }
    };
    
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

    // 加载分销中心数据
    const loadDistributionData = async () => {
      try {
        const res = await api.distribution.getData();
        if (res && res.code === 200 && res.data) {
          const d = res.data;
          distribution.value = {
            totalCommission: formatMoney(d.totalCommission),
            availableCommission: formatMoney(d.availableCommission),
            withdrawnCommission: formatMoney(d.withdrawnCommission != null ? d.withdrawnCommission : 0),
            teamCount: d.teamCount != null ? d.teamCount : 0,
            todayOrderCount: d.todayOrderCount != null ? d.todayOrderCount : 0,
            totalOrderCount: d.totalOrderCount != null ? d.totalOrderCount : 0
          };
        }
      } catch (e) {
        console.warn('加载分销数据失败', e);
      }
    };

    // 提现功能
    const withdraw = async () => {
      const avail = distribution.value.availableCommission;
      const num = parseFloat(avail);
      if (isNaN(num) || num <= 0) {
        uni.showToast({ title: '可提现佣金不足', icon: 'none', duration: 2000 });
        return;
      }
      try {
        const confirmRes = await new Promise((resolve) => {
          uni.showModal({
            title: '申请提现',
            content: '可提现 ¥' + avail + '，确定全部提现？',
            success: (r) => resolve(r)
          });
        });
        if (!confirmRes.confirm) return;
        const apiRes = await api.distribution.applyWithdrawal({ amount: num });
        if (apiRes && apiRes.code === 200) {
          uni.showToast({ title: '提交成功，请等待审核', icon: 'success' });
          loadDistributionData();
        } else {
          uni.showToast({ title: apiRes?.message || '提交失败', icon: 'none' });
        }
      } catch (e) {
        uni.showToast({ title: '提交失败', icon: 'none' });
      }
    };

    // 查看分销佣金
    const viewDistributionCommission = () => {
      uni.navigateTo({
        url: '/pages/distribution/distribution-commission'
      });
    };

    // 查看分销订单
    const viewDistributionOrders = () => {
      uni.navigateTo({
        url: '/pages/distribution/distribution-orders'
      });
    };

    // 查看提现明细
    const viewWithdrawDetails = () => {
      uni.navigateTo({
        url: '/pages/distribution/withdraw-details'
      });
    };

    // 查看我的团队
    const viewMyTeam = () => {
      uni.navigateTo({
        url: '/pages/distribution/my-team'
      });
    };

    // 查看推广二维码
    const viewPromotionQRCode = () => {
      uni.navigateTo({
        url: '/pages/distribution/promotion-qrcode'
      });
    };

    // 查看分销排行
    const viewDistributionRanking = () => {
      uni.navigateTo({
        url: '/pages/distribution/distribution-ranking'
      });
    };

    onMounted(() => {
      getSystemInfo();
      loadUserDisplay();
      loadDistributionData();
    });

    return {
      statusBarHeight,
      userDisplay,
      distribution,
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
  background: linear-gradient(180deg, #F0F8F0 0%, #E8F5E8 100%);
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
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FFF8 100%);
  padding: 30rpx;
  text-align: center;
  border-bottom: 1px solid #E8F5E8;
  box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.1);
}

.commission-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.commission-amount {
  font-size: 48rpx;
  font-weight: bold;
  color: #2E7D32;
  margin-bottom: 20rpx;
  text-shadow: 0 2rpx 4rpx rgba(46, 125, 50, 0.2);
}

.withdraw-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: #FFFFFF;
  font-size: 28rpx;
  padding: 12rpx 60rpx;
  border-radius: 30rpx;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.withdraw-btn:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 6rpx 16rpx rgba(76, 175, 80, 0.4);
}

.commission-comparison {
  display: flex;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FFF8 100%);
  margin-bottom: 20rpx;
  border-bottom: 1px solid #E8F5E8;
  box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.1);
}

.comparison-item {
  flex: 1;
  padding: 30rpx 0;
  text-align: center;
}

.comparison-divider {
  width: 1px;
  background: linear-gradient(180deg, transparent 0%, #4CAF50 50%, transparent 100%);
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
  color: #2E7D32;
  font-weight: bold;
}

.orange {
  color: #4CAF50;
  font-weight: bold;
}

.feature-section {
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FFF8 100%);
  padding: 20rpx;
  border-radius: 20rpx 20rpx 0 0;
  box-shadow: 0 -2rpx 8rpx rgba(76, 175, 80, 0.1);
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20rpx;
}

.feature-item {
  text-align: center;
  padding: 20rpx;
  background: linear-gradient(135deg, #F0F8F0 0%, #E8F5E8 100%);
  border-radius: 16rpx;
  border: 1px solid #E8F5E8;
  transition: all 0.3s ease;
  box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.1);
}

.feature-item:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 6rpx 16rpx rgba(76, 175, 80, 0.2);
  background: linear-gradient(135deg, #E8F5E8 0%, #F0F8F0 100%);
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
  color: #2E7D32;
  font-weight: bold;
}
</style>