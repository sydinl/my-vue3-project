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
      <view class="tab-item" :class="{ active: currentTab === 'all' }" @click="switchTab('all')">全部</view>
      <view class="tab-item" :class="{ active: currentTab === 'pending' }" @click="switchTab('pending')">待审核</view>
      <view class="tab-item" :class="{ active: currentTab === 'completed' }" @click="switchTab('completed')">已打款</view>
    </view>

    <!-- 提现明细列表 -->
    <view class="details-list">
      <view v-if="loading" class="empty-state"><text class="empty-text">加载中...</text></view>
      <view v-else-if="details.length === 0" class="empty-state">
        <image src="/static/icons/empty-data.png" mode="aspectFit" class="empty-icon"></image>
        <text class="empty-text">暂无提现记录</text>
      </view>
      <view v-else>
        <view v-for="item in details" :key="item.id" class="detail-item">
          <view class="detail-header">
            <text class="detail-number">编号: {{ (item.id || '').slice(0, 8) }}…</text>
            <text class="detail-status" :class="getStatusClass(item.status)">{{ getStatusText(item.status) }}</text>
          </view>
          <view class="detail-body">
            <text class="detail-amount">¥{{ formatMoney(item.amount) }}</text>
            <text class="detail-date">{{ formatTime(item.createTime) }}</text>
          </view>
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
  return new Date(t).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default {
  name: 'WithdrawDetails',
  setup() {
    const details = ref([]);
    const currentTab = ref('all');
    const loading = ref(false);
    const page = ref(1);
    const pageSize = 10;

    const loadDetails = async () => {
      loading.value = true;
      try {
        const params = { page: page.value, pageSize };
        if (currentTab.value !== 'all') params.status = currentTab.value;
        const res = await api.distribution.getWithdrawals(params);
        if (res && res.code === 200 && res.data) {
          details.value = res.data.content || [];
        } else {
          details.value = [];
        }
      } catch (e) {
        details.value = [];
      } finally {
        loading.value = false;
      }
    };

    const navigateBack = () => uni.navigateBack();

    const switchTab = (tab) => {
      currentTab.value = tab;
      page.value = 1;
      loadDetails();
    };

    const getStatusText = (status) => {
      if (status === 'pending') return '待审核';
      if (status === 'completed') return '已打款';
      return status || '未知';
    };

    const getStatusClass = (status) => {
      if (status === 'pending') return 'pending';
      if (status === 'completed') return 'completed';
      return '';
    };

    onMounted(() => loadDetails());

    return {
      details,
      currentTab,
      loading,
      navigateBack,
      switchTab,
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