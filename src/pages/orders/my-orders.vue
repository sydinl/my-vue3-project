<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <uni-icons type="left" size="24" class="back-icon" @click="navigateBack"></uni-icons>
      <text class="header-title">我的订单</text>
      <view class="header-right">
        <uni-icons type="ellipsis" size="20"></uni-icons>
        <uni-icons type="eye" size="20" class="ml-4"></uni-icons>
      </view>
    </view>

    <!-- 搜索框 -->
    <view class="search-container">
      <view class="search-input">
        <uni-icons type="search" size="20" class="search-icon"></uni-icons>
        <text class="search-placeholder">搜索</text>
      </view>
    </view>

    <!-- 订单状态选项卡 -->
    <view class="order-tabs">
      <view class="tab-item" :class="{ active: currentTab === 'all' }" @click="switchTab('all')">
        <text class="tab-text">全部</text>
        <view class="tab-underline" :class="{ active: currentTab === 'all' }"></view>
      </view>
      <view class="tab-item" :class="{ active: currentTab === 'pending' }" @click="switchTab('pending')">
        <text class="tab-text">待付款</text>
        <view class="tab-underline" :class="{ active: currentTab === 'pending' }"></view>
      </view>
      <view class="tab-item" :class="{ active: currentTab === 'shipping' }" @click="switchTab('shipping')">
        <text class="tab-text">待服务</text>
        <view class="tab-underline" :class="{ active: currentTab === 'shipping' }"></view>
      </view>
      <view class="tab-item" :class="{ active: currentTab === 'completed' }" @click="switchTab('completed')">
        <text class="tab-text">已完成</text>
        <view class="tab-underline" :class="{ active: currentTab === 'completed' }"></view>
      </view>
    </view>

    <!-- 订单列表区域 -->
    <view class="order-list">
      <!-- 空状态显示 -->
      <view class="empty-state" v-if="!hasOrders">
        <image src="/static/icons/order-empty.svg" mode="aspectFit" class="empty-icon"></image>
        <text class="empty-text">暂无相关订单</text>
      </view>

      <!-- 订单列表（这里是模拟数据，实际项目中会从后端获取） -->
      <!-- 由于用户要求与上传图片一致，这里只显示空状态 -->
    </view>
  </view>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'MyOrders',
  data() {
    return {
      currentTab: 'all',
      hasOrders: false,
      statusFromParams: ''
    }
  },
  onLoad(options) {
    // 从参数中获取订单状态
    if (options.status) {
      this.statusFromParams = options.status;
      // 根据传入的状态设置当前选项卡
      switch (options.status) {
        case 'all':
          this.currentTab = 'all';
          break;
        case 'pending':
          this.currentTab = 'pending';
          break;
        case 'shipping':
          this.currentTab = 'shipping';
          break;
        case 'completed':
          this.currentTab = 'completed';
          break;
        default:
          this.currentTab = 'all';
      }
      // 加载对应状态的订单数据
      this.loadOrdersByStatus(this.currentTab);
    }
  },
  methods: {
    // 导航返回
    navigateBack() {
      uni.navigateBack();
    },
    
    // 切换选项卡
    switchTab(tabName) {
      this.currentTab = tabName;
      // 这里可以根据选项卡重新加载订单数据
      this.loadOrdersByStatus(tabName);
    },
    
    // 根据状态加载订单数据
    loadOrdersByStatus(status) {
      // 实际项目中会根据status请求不同的订单数据
      // 这里为了模拟空状态，暂时设置hasOrders为false
      this.hasOrders = false;
    }
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
  border-bottom: 1px solid #f0f0f0;
  position: relative;
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

.search-container {
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
}

.search-input {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 60rpx;
  padding: 15rpx 30rpx;
}

.search-icon {
  color: #999999;
  margin-right: 10rpx;
}

.search-placeholder {
  color: #999999;
  font-size: 28rpx;
}

.order-tabs {
  display: flex;
  background-color: #FFFFFF;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 25rpx 0;
  position: relative;
}

.tab-text {
  font-size: 28rpx;
  color: #666666;
}

.tab-item.active .tab-text {
  color: #FF5000;
}

.tab-underline {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 6rpx;
  background-color: #FF5000;
  border-radius: 3rpx;
  opacity: 0;
  transition: opacity 0.3s;
}

.tab-underline.active {
  opacity: 1;
}

.order-list {
  padding: 20rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  background-color: #FFFFFF;
  border-radius: 16rpx;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
}
</style>