<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
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
        <image src="/static/icons/empty-order.svg" mode="aspectFit" class="empty-icon"></image>
        <text class="empty-text">暂无订单</text>
      </view>

      <!-- 订单项示例（有订单时显示） -->
      <view v-for="order in orders" :key="order.id" class="order-item" v-show="orders.length > 0">
        <view class="order-header">
          <text class="order-number">订单号: {{ order.orderNumber }}</text>
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
import { ref } from 'vue';

export default {
  name: 'DistributionOrders',
  setup() {
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

    return {
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
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
  color: #333333;
  position: sticky;
  top: 0;
  z-index: 999;
  border-bottom: 1px solid #f0f0f0;
}

.back-icon {
  color: #333333;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
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
  color: #FF5000;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 6rpx;
  background-color: #FF5000;
  border-radius: 3rpx;
}

.order-list {
  padding: 20rpx;
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