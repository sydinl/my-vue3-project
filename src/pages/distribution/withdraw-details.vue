<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <uni-icons type="left" size="24" class="back-icon" @click="navigateBack"></uni-icons>
      <text class="header-title">提现明细</text>
      <view class="header-right">
        <uni-icons type="ellipsis" size="20"></uni-icons>
        <uni-icons type="eye" size="20" class="ml-4"></uni-icons>
      </view>
    </view>

    <!-- 提现状态选项卡 -->
    <view class="tabs">
      <view class="tab-item active" @click="switchTab('all')">全部</view>
      <view class="tab-item" @click="switchTab('pending')">待审核</view>
      <view class="tab-item" @click="switchTab('processing')">待打款</view>
      <view class="tab-item" @click="switchTab('completed')">已打款</view>
      <view class="tab-item" @click="switchTab('invalid')">无效</view>
    </view>

    <!-- 提现明细列表 -->
    <view class="details-list">
      <view v-if="details.length === 0" class="empty-state">
        <image src="/static/icons/empty-data.png" mode="aspectFit" class="empty-icon"></image>
        <text class="empty-text">暂无数据</text>
      </view>

      <!-- 提现明细节示例（有数据时显示） -->
      <view v-for="item in details" :key="item.id" class="detail-item" v-show="details.length > 0">
        <view class="detail-header">
          <text class="detail-number">提现编号: {{ item.number }}</text>
          <text class="detail-status" :class="getStatusClass(item.status)">{{ getStatusText(item.status) }}</text>
        </view>
        <view class="detail-body">
          <text class="detail-amount">+¥{{ item.amount }}</text>
          <text class="detail-date">{{ item.date }}</text>
        </view>
        <view class="detail-footer">
          <text class="detail-method">提现方式: {{ item.method }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'WithdrawDetails',
  setup() {
    // 提现明细数据（实际项目中可能从API获取）
    const details = ref([]); // 初始为空数据
    const currentTab = ref('all');

    // 导航返回
    const navigateBack = () => {
      uni.navigateBack();
    };

    // 切换选项卡
    const switchTab = (tab) => {
      currentTab.value = tab;
      // 根据选项卡加载不同状态的提现明细
      // 这里可以添加API调用逻辑
    };

    // 获取提现状态文本
    const getStatusText = (status) => {
      switch(status) {
        case 'pending':
          return '待审核';
        case 'processing':
          return '待打款';
        case 'completed':
          return '已打款';
        case 'invalid':
          return '无效';
        default:
          return '未知状态';
      }
    };

    // 获取提现状态样式
    const getStatusClass = (status) => {
      switch(status) {
        case 'pending':
          return 'pending';
        case 'processing':
          return 'processing';
        case 'completed':
          return 'completed';
        case 'invalid':
          return 'invalid';
        default:
          return '';
      }
    };

    return {
      details,
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
  overflow-x: auto;
  white-space: nowrap;
}

.tab-item {
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: #999999;
  position: relative;
  display: inline-block;
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

.details-list {
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

.detail-item {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.detail-number {
  font-size: 26rpx;
  color: #666666;
}

.detail-status {
  font-size: 26rpx;
  padding: 4rpx 16rpx;
  border-radius: 16rpx;
}

.detail-status.pending {
  color: #FF9500;
  background-color: rgba(255, 149, 0, 0.1);
}

.detail-status.processing {
  color: #1989FA;
  background-color: rgba(25, 137, 250, 0.1);
}

.detail-status.completed {
  color: #07C160;
  background-color: rgba(7, 193, 96, 0.1);
}

.detail-status.invalid {
  color: #999999;
  background-color: rgba(153, 153, 153, 0.1);
}

.detail-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.detail-amount {
  font-size: 36rpx;
  font-weight: bold;
  color: #FF5000;
}

.detail-date {
  font-size: 26rpx;
  color: #666666;
}

.detail-footer {
  font-size: 26rpx;
  color: #666666;
}
</style>