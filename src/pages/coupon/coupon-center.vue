<template>
  <view class="container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部导航栏 -->
    <view class="header" :style="{ marginTop: statusBarHeight + 'px' }">
      <uni-icons type="left" size="24" class="back-icon" @click="navigateBack"></uni-icons>
      <text class="header-title">我的优惠券</text>
      <view class="header-right">
        <uni-icons type="ellipsis" size="20"></uni-icons>
        <uni-icons type="eye" size="20" class="ml-4"></uni-icons>
      </view>
    </view>

    <!-- 优惠券列表 -->
    <view class="coupon-list">
      <view v-if="loading" class="loading-state">
        <uni-icons type="spinner-cycle" size="40" class="loading-icon"></uni-icons>
        <text class="loading-text">加载中...</text>
      </view>
      
      <view v-else-if="coupons.length === 0" class="empty-state">
        <image src="/static/icons/no-result.png" mode="aspectFit" class="empty-icon"></image>
        <text class="empty-text">暂无优惠券</text>
      </view>
      
      <view v-else>
        <view v-for="coupon in coupons" :key="coupon.id" class="coupon-item">
          <view class="coupon-content">
            <view class="coupon-left">
              <view class="discount-info">
                <text class="discount-value">
                  {{ coupon.couponType === 'PERCENTAGE' ? coupon.discountValue + '%' : '¥' + coupon.discountValue }}
                </text>
                <text class="discount-label">{{ coupon.couponType === 'PERCENTAGE' ? '折扣' : '减免' }}</text>
              </view>
            </view>
            <view class="coupon-right">
              <view class="coupon-info">
                <text class="coupon-name">{{ coupon.couponName }}</text>
                <text class="coupon-desc">{{ coupon.description }}</text>
                <text class="coupon-condition">满¥{{ coupon.minOrderAmount }}可用</text>
                <text class="coupon-expire">有效期至：{{ formatDate(coupon.validUntil) }}</text>
              </view>
              <view class="coupon-actions">
                <button 
                  class="use-btn" 
                  :class="{ disabled: !isCouponAvailable(coupon) }"
                  @click="useCoupon(coupon)"
                  :disabled="!isCouponAvailable(coupon)"
                >
                  {{ getButtonText(coupon) }}
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../../utils/api';
import userManager from '../../utils/user-manager.js';

export default {
  name: 'CouponCenter',
  setup() {
    // 状态栏高度
    const statusBarHeight = ref(0);
    
    // 获取系统信息
    const getSystemInfo = () => {
      uni.getSystemInfo({
        success: (res) => {
          statusBarHeight.value = res.statusBarHeight || 0;
          if (res.safeAreaInsets) {
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
    
    // 优惠券数据
    const coupons = ref([]);
    const loading = ref(false);

    // 导航返回
    const navigateBack = () => {
      uni.navigateBack();
    };

    // 获取优惠券列表
    const getCouponsList = async () => {
      loading.value = true;
      try {
        // 使用公开接口获取用户已领取的未使用优惠券列表
        const res = await api.coupons.publicGetUserCoupons({
          userId: userManager.getUserId(),
          status: 'UNUSED', // 获取未使用的优惠券
          page: 1,
          size: 20
        });
        
        if (res.code === 200) {
          coupons.value = res.data.list || [];
        } else {
          uni.showToast({
            title: res.message || '获取优惠券失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取优惠券失败:', error);
        uni.showToast({
          title: '获取优惠券失败',
          icon: 'none'
        });
      } finally {
        loading.value = false;
      }
    };

    // 使用优惠券
    const useCoupon = (coupon) => {
      // 跳转到订单页面使用优惠券
      uni.navigateTo({
        url: '/pages/orders/my-orders?action=create&couponId=' + coupon.id
      });
    };

    // 获取按钮文本
    const getButtonText = (coupon) => {
      // 检查优惠券是否过期
      const now = new Date();
      const validUntil = new Date(coupon.validUntil);
      if (now > validUntil) {
        return '已过期';
      }
      return '立即使用';
    };

    // 检查优惠券是否可用
    const isCouponAvailable = (coupon) => {
      const now = new Date();
      const validUntil = new Date(coupon.validUntil);
      return now <= validUntil;
    };

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    };

    // 页面加载时获取数据
    onMounted(() => {
      getSystemInfo();
      getCouponsList();
    });

    return {
      statusBarHeight,
      coupons,
      loading,
      navigateBack,
      useCoupon,
      getButtonText,
      isCouponAvailable,
      formatDate
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

.coupon-list {
  padding: 20rpx;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.loading-icon {
  color: #4CAF50;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #666666;
  margin-top: 20rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
}

.coupon-item {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.1);
  overflow: hidden;
}

.coupon-content {
  display: flex;
  align-items: center;
  padding: 30rpx;
}

.coupon-left {
  width: 200rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  border-radius: 12rpx;
  padding: 20rpx;
  margin-right: 30rpx;
}

.discount-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #FFFFFF;
}

.discount-value {
  font-size: 48rpx;
  font-weight: bold;
  line-height: 1;
}

.discount-label {
  font-size: 24rpx;
  margin-top: 10rpx;
  opacity: 0.9;
}

.coupon-right {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.coupon-info {
  flex: 1;
}

.coupon-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 10rpx;
}

.coupon-desc {
  font-size: 26rpx;
  color: #666666;
  display: block;
  margin-bottom: 8rpx;
}

.coupon-condition {
  font-size: 24rpx;
  color: #999999;
  display: block;
  margin-bottom: 8rpx;
}

.coupon-expire {
  font-size: 22rpx;
  color: #FF9800;
  display: block;
}

.coupon-actions {
  margin-left: 20rpx;
}

.use-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 25rpx;
  padding: 16rpx 32rpx;
  font-size: 26rpx;
  font-weight: bold;
  min-width: 120rpx;
}

.use-btn.disabled {
  background: #CCCCCC;
  color: #999999;
}

.use-btn:not(.disabled):active {
  background: linear-gradient(135deg, #388E3C 0%, #4CAF50 100%);
}
</style>
