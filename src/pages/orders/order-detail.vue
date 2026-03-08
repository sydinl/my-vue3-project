<template>
  <view class="container">
    <view class="header">
      <uni-icons type="left" size="24" @click="goBack"></uni-icons>
      <text class="title">订单详情</text>
    </view>
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="error" class="error">{{ error }}</view>
    <view v-else-if="order" class="detail">
      <view class="section">
        <view class="section-title">订单信息</view>
        <view class="row"><text class="label">订单号</text><text class="value">{{ order.orderNo }}</text></view>
        <view class="row"><text class="label">状态</text><text class="value">{{ statusText }}</text></view>
        <view class="row"><text class="label">实付</text><text class="value price">¥{{ displayAmount }}</text></view>
        <view class="row" v-if="order.payTime"><text class="label">支付时间</text><text class="value">{{ formatTime(order.payTime) }}</text></view>
      </view>
      <view class="section" v-if="items.length">
        <view class="section-title">商品明细</view>
        <view class="item" v-for="(item, i) in items" :key="item.id || i">
          <text class="item-name">{{ item.projectName }}</text>
          <text class="item-meta">¥{{ item.price }} × {{ item.quantity }}</text>
        </view>
      </view>
      <view class="section" v-if="order.status === 'paid'">
        <view class="section-title">核销码</view>
        <view class="verification-row" v-if="order.verificationCode">
          <text class="verification-value">{{ order.verificationCode }}</text>
          <button class="btn-small" @click="copyCode(order.verificationCode)">复制</button>
        </view>
        <view v-else>
          <button class="btn-primary" @click="generateCode" :disabled="generating">{{ generating ? '生成中...' : '生成核销码' }}</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import api from '../../utils/api.js';

export default {
  name: 'OrderDetail',
  setup() {
    const orderId = ref('');
    const order = ref(null);
    const loading = ref(true);
    const error = ref('');
    const generating = ref(false);

    const items = computed(() => {
      if (!order.value || !order.value.items) return [];
      return order.value.items;
    });

    const statusText = computed(() => {
      const map = { pending: '待付款', paid: '已支付', shipping: '服务中', completed: '已完成', aftersale: '售后', cancelled: '已取消' };
      return map[order.value?.status] || order.value?.status || '';
    });

    const displayAmount = computed(() => {
      const o = order.value;
      if (!o) return '0.00';
      const v = o.finalAmount != null ? o.finalAmount : o.totalPrice;
      return Number(v).toFixed(2);
    });

    const formatTime = (t) => {
      if (!t) return '';
      const d = new Date(t);
      return d.toLocaleString('zh-CN');
    };

    const loadDetail = async () => {
      if (!orderId.value) {
        error.value = '缺少订单ID';
        loading.value = false;
        return;
      }
      loading.value = true;
      error.value = '';
      try {
        const res = await api.orders.getDetail(orderId.value);
        if (res.code === 200 && res.data) {
          order.value = res.data;
        } else {
          error.value = res.message || '加载失败';
        }
      } catch (e) {
        error.value = '网络错误';
      } finally {
        loading.value = false;
      }
    };

    const generateCode = async () => {
      if (!orderId.value) return;
      generating.value = true;
      try {
        const res = await api.orders.generateVerificationCode(orderId.value);
        if (res.code === 200 && res.data?.verificationCode) {
          order.value = { ...order.value, verificationCode: res.data.verificationCode };
          uni.showToast({ title: '生成成功', icon: 'success' });
        } else {
          uni.showToast({ title: res.message || '生成失败', icon: 'none' });
        }
      } catch (e) {
        uni.showToast({ title: '生成失败', icon: 'none' });
      } finally {
        generating.value = false;
      }
    };

    const copyCode = (code) => {
      uni.setClipboardData({
        data: code,
        success: () => uni.showToast({ title: '已复制', icon: 'success' })
      });
    };

    const goBack = () => uni.navigateBack();

    onMounted(() => {
      if (orderId.value) loadDetail();
    });

    return {
      orderId,
      order,
      loading,
      error,
      generating,
      items,
      statusText,
      displayAmount,
      formatTime,
      loadDetail,
      generateCode,
      copyCode,
      goBack
    };
  },
  onLoad(options) {
    const id = (options && (options.id || options.orderId)) || '';
    if (id && this.orderId) this.orderId.value = id;
    if (id && this.loadDetail) this.loadDetail();
  }
};
</script>

<style lang="scss" scoped>
.container { padding: 20rpx; min-height: 100vh; background: #f5f5f5; }
.header { display: flex; align-items: center; padding: 20rpx 0; }
.header .title { margin-left: 20rpx; font-size: 36rpx; font-weight: bold; }
.loading, .error { text-align: center; padding: 80rpx; color: #999; }
.error { color: #f56c6c; }
.detail { margin-top: 20rpx; }
.section { background: #fff; border-radius: 16rpx; padding: 24rpx; margin-bottom: 20rpx; }
.section-title { font-size: 30rpx; font-weight: 600; margin-bottom: 20rpx; }
.row { display: flex; justify-content: space-between; padding: 12rpx 0; font-size: 28rpx; }
.label { color: #666; }
.value { color: #333; }
.value.price { color: #f56c6c; font-weight: 600; }
.item { padding: 16rpx 0; border-bottom: 1rpx solid #eee; }
.item:last-child { border-bottom: none; }
.item-name { font-size: 28rpx; color: #333; }
.item-meta { font-size: 26rpx; color: #999; margin-top: 8rpx; display: block; }
.verification-row { display: flex; align-items: center; gap: 20rpx; }
.verification-value { font-family: monospace; font-size: 36rpx; letter-spacing: 4rpx; }
.btn-small { padding: 8rpx 24rpx; font-size: 24rpx; }
.btn-primary { margin-top: 16rpx; background: #4CAF50; color: #fff; padding: 24rpx; border-radius: 12rpx; }
</style>
