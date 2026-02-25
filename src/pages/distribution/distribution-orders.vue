<template>
  <view class="container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部导航栏 -->
    <view class="header" :style="{ marginTop: statusBarHeight + 'px' }">
      <uni-icons type="left" size="24" class="back-icon" @click="navigateBack"></uni-icons>
      <text class="header-title">分销订单</text>
      <view class="header-right">
        <uni-icons type="ellipsis" size="20"></uni-icons>
        <uni-icons type="eye" size="20" class="ml-4"></uni-icons>
      </view>
    </view>

    <!-- 订单状态选项卡 -->
    <view class="tabs">
      <view class="tab-item active" @click="switchTab('all')">全部</view>
      <view class="tab-item" @click="switchTab('pending')">待付款</view>
      <view class="tab-item" @click="switchTab('paid')">已付款</view>
      <view class="tab-item" @click="switchTab('completed')">已完成</view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view v-if="orders.length === 0" class="empty-state">
        <image src="/static/icons/empty-order.png" mode="aspectFit" class="empty-icon"></image>
        <text class="empty-text">暂无订单</text>
      </view>

      <!-- 订单项示例（有订单时显示） -->
      <view v-for="order in orders" :key="order.id" class="order-item" v-show="orders.length > 0">
        <view class="order-header">
          <text class="order-number">订单号: {{ order.orderNo }}</text>
          <text class="order-status" :class="getStatusClass(order.status)">{{ getStatusText(order.status) }}</text>
        </view>
        <view class="order-body">
          <image :src="order.productImage" mode="aspectFit" class="product-image"></image>
          <view class="product-info">
            <text class="product-name">{{ order.productName }}</text>
            <text class="product-price">¥{{ order.productPrice }}</text>
            <text class="product-quantity">x{{ order.quantity }}</text>
          </view>
        </view>
        <view class="order-footer">
          <text class="commission-info">获得佣金: ¥{{ order.commission }}</text>
          <text class="order-time">{{ order.createTime }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'DistributionOrders',
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
    
    // 订单数据（实际项目中可能从API获取）
    const orders = ref([]); // 初始为空订单
    const currentTab = ref('all');

    // 导航返回
    const navigateBack = () => {
      uni.navigateBack();
    };

    // 切换选项卡
    const switchTab = (tab) => {
      currentTab.value = tab;
      // 根据选项卡加载不同状态的订单
      // 这里可以添加API调用逻辑
    };

    // 获取订单状态文本
    const getStatusText = (status) => {
      switch(status) {
        case 'pending':
          return '待付款';
        case 'paid':
          return '已付款';
        case 'completed':
          return '已完成';
        default:
          return '未知状态';
      }
    };

    // 获取订单状态样式
    const getStatusClass = (status) => {
      switch(status) {
        case 'pending':
          return 'pending';
        case 'paid':
          return 'paid';
        case 'completed':
          return 'completed';
        default:
          return '';
      }
    };

    // 页面加载时获取系统信息
    onMounted(() => {
      getSystemInfo();
    });
    
    return {
      statusBarHeight,
      orders,
      currentTab,
      navigateBack,
      switchTab,
      getStatusText,
      getStatusClass
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

.tabs {
  display: flex;
  background-color: #FFFFFF;
  padding: 10rpx 0;
  border-bottom: 1px solid #f0f0f0;
  margin: 0 20rpx;
  border-radius: 16rpx 16rpx 0 0;
  box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.1);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #999999;
  position: relative;
}

.tab-item.active {
  color: #4CAF50;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 6rpx;
  background-color: #4CAF50;
  border-radius: 3rpx;
}

.order-list {
  padding: 20rpx;
  margin: 0 20rpx;
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

.order-item {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.order-number {
  font-size: 26rpx;
  color: #666666;
}

.order-status {
  font-size: 26rpx;
  padding: 4rpx 16rpx;
  border-radius: 16rpx;
}

.order-status.pending {
  color: #FF9500;
  background-color: rgba(255, 149, 0, 0.1);
}

.order-status.paid {
  color: #07C160;
  background-color: rgba(7, 193, 96, 0.1);
}

.order-status.completed {
  color: #1989FA;
  background-color: rgba(25, 137, 250, 0.1);
}

.order-body {
  display: flex;
  margin-bottom: 20rpx;
}

.product-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 28rpx;
  color: #333333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 30rpx;
  color: #FF5000;
  font-weight: bold;
}

.product-quantity {
  font-size: 26rpx;
  color: #999999;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  color: #666666;
}
</style>