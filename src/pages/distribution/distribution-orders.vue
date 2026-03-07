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
      <view class="tab-item" :class="{ active: currentTab === 'all' }" @click="switchTab('all')">全部</view>
      <view class="tab-item" :class="{ active: currentTab === 'pending' }" @click="switchTab('pending')">待结算</view>
      <view class="tab-item" :class="{ active: currentTab === 'settled' }" @click="switchTab('settled')">已结算</view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view v-if="loading" class="empty-state">
        <text class="empty-text">加载中...</text>
      </view>
      <view v-else-if="orders.length === 0" class="empty-state">
        <image src="/static/icons/empty-order.png" mode="aspectFit" class="empty-icon"></image>
        <text class="empty-text">暂无分销订单</text>
      </view>
      <view v-else>
        <view v-for="order in orders" :key="order.id" class="order-item">
          <view class="order-header">
            <text class="order-number">订单ID: {{ order.orderId ? (order.orderId.length > 8 ? order.orderId.slice(0, 8) + '…' : order.orderId) : '-' }}</text>
            <text class="order-status" :class="getStatusClass(order.status)">{{ getStatusText(order.status) }}</text>
          </view>
          <view class="order-body">
            <view class="product-info product-info-full">
              <text class="product-name">下单用户: {{ order.customerName || '-' }}</text>
              <text class="product-price">佣金: ¥{{ formatMoney(order.commission) }}</text>
              <text class="product-quantity">层级: {{ order.referrerLevel === 1 ? '一级' : '二级' }}</text>
            </view>
          </view>
          <view class="order-footer">
            <text class="order-time">{{ formatTime(order.createTime) }}</text>
          </view>
        </view>
        <view v-if="totalPages > 1" class="pagination-row">
          <button class="page-btn" :disabled="page <= 1" @click="goPage(page - 1)">上一页</button>
          <text class="page-info">第 {{ page }} / {{ totalPages }} 页</text>
          <button class="page-btn" :disabled="page >= totalPages" @click="goPage(page + 1)">下一页</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '@/utils/api.js';

function formatMoney(v) {
  if (v == null || isNaN(v)) return '0.00';
  return Number(v).toFixed(2);
}
function formatTime(t) {
  if (!t) return '-';
  const d = new Date(t);
  return d.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default {
  name: 'DistributionOrders',
  setup() {
    const statusBarHeight = ref(0);
    const safeAreaInsets = ref({ top: 0, bottom: 0, left: 0, right: 0 });
    const orders = ref([]);
    const currentTab = ref('all');
    const loading = ref(false);
    const page = ref(1);
    const pageSize = 10;
    const totalPages = ref(0);

    const getSystemInfo = () => {
      uni.getSystemInfo({
        success: (res) => {
          statusBarHeight.value = res.statusBarHeight || 0;
          if (res.safeAreaInsets && res.safeAreaInsets.top > res.statusBarHeight) {
            statusBarHeight.value = res.safeAreaInsets.top;
          }
          statusBarHeight.value = Math.max(statusBarHeight.value, 20);
        }
      });
    };

    const loadOrders = async () => {
      loading.value = true;
      try {
        const params = { page: page.value, pageSize };
        if (currentTab.value !== 'all') params.status = currentTab.value;
        const res = await api.distribution.getOrders(params);
        if (res && res.code === 200 && res.data) {
          orders.value = res.data.content || [];
          totalPages.value = res.data.totalPages != null ? res.data.totalPages : 0;
        } else {
          orders.value = [];
        }
      } catch (e) {
        console.warn('加载分销订单失败', e);
        orders.value = [];
      } finally {
        loading.value = false;
      }
    };

    const navigateBack = () => uni.navigateBack();

    const switchTab = (tab) => {
      currentTab.value = tab;
      page.value = 1;
      loadOrders();
    };

    const goPage = (p) => {
      if (p < 1 || p > totalPages.value) return;
      page.value = p;
      loadOrders();
    };

    const getStatusText = (status) => {
      if (status === 'pending') return '待结算';
      if (status === 'settled') return '已结算';
      return status || '未知';
    };

    const getStatusClass = (status) => {
      if (status === 'pending') return 'pending';
      if (status === 'settled') return 'completed';
      return '';
    };

    onMounted(() => {
      getSystemInfo();
      loadOrders();
    });

    return {
      statusBarHeight,
      orders,
      currentTab,
      loading,
      page,
      totalPages,
      navigateBack,
      switchTab,
      goPage,
      getStatusText,
      getStatusClass,
      formatMoney,
      formatTime
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

.product-info-full {
  width: 100%;
}

.pagination-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  padding: 30rpx 0;
}

.page-btn {
  font-size: 26rpx;
  padding: 12rpx 24rpx;
}

.page-info {
  font-size: 26rpx;
  color: #666;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  color: #666666;
}
</style>