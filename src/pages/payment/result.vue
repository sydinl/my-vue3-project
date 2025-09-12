<template>
  <view class="container">
    <!-- 支付结果 -->
    <view class="result-section">
      <view class="result-icon">
        <uni-icons 
          :type="paymentResult.success ? 'checkmarkempty' : 'closeempty'" 
          size="80" 
          :color="paymentResult.success ? '#07C160' : '#FF3B30'"
        ></uni-icons>
      </view>
      <text class="result-title">{{ paymentResult.success ? '支付成功' : '支付失败' }}</text>
      <text class="result-message">{{ paymentResult.message }}</text>
    </view>

    <!-- 订单信息 -->
    <view class="order-info" v-if="orderInfo">
      <view class="info-item">
        <text class="label">订单号：</text>
        <text class="value">{{ orderInfo.orderNo }}</text>
      </view>
      <view class="info-item">
        <text class="label">支付金额：</text>
        <text class="value amount">¥{{ orderInfo.totalAmount }}</text>
      </view>
      <view class="info-item">
        <text class="label">支付时间：</text>
        <text class="value">{{ formatTime(orderInfo.payTime) }}</text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button 
        v-if="!paymentResult.success" 
        class="retry-btn" 
        @click="retryPayment"
      >
        重新支付
      </button>
      <button 
        class="order-btn" 
        @click="viewOrders"
      >
        查看订单
      </button>
      <button 
        class="home-btn" 
        @click="goHome"
      >
        返回首页
      </button>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';
import weChatPayment from '../../utils/payment.js';

export default {
  name: 'PaymentResult',
  setup() {
    const paymentResult = ref({
      success: false,
      message: '',
      orderId: ''
    });
    
    const orderInfo = ref(null);

    // 获取页面参数
    const getPageParams = () => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const options = currentPage.options;
      
      return {
        success: options.success === 'true',
        message: decodeURIComponent(options.message || ''),
        orderId: options.orderId || '',
        orderNo: options.orderNo || '',
        totalAmount: options.totalAmount || '',
        payTime: options.payTime || ''
      };
    };

    // 格式化时间
    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return date.toLocaleString('zh-CN');
    };

    // 重新支付
    const retryPayment = () => {
      if (paymentResult.value.orderId) {
        // 重新发起支付
        uni.navigateBack();
      } else {
        uni.showToast({
          title: '无法重新支付',
          icon: 'none'
        });
      }
    };

    // 查看订单
    const viewOrders = () => {
      uni.navigateTo({
        url: '/pages/orders/my-orders'
      });
    };

    // 返回首页
    const goHome = () => {
      uni.switchTab({
        url: '/pages/index/index'
      });
    };

    // 页面加载时初始化数据
    onMounted(() => {
      const params = getPageParams();
      paymentResult.value = {
        success: params.success,
        message: params.message,
        orderId: params.orderId
      };
      
      if (params.orderNo || params.totalAmount) {
        orderInfo.value = {
          orderNo: params.orderNo,
          totalAmount: params.totalAmount,
          payTime: params.payTime
        };
      }
    });

    return {
      paymentResult,
      orderInfo,
      formatTime,
      retryPayment,
      viewOrders,
      goHome
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
  padding: 40rpx 30rpx;
}

.result-section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 80rpx 40rpx;
  text-align: center;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.result-icon {
  margin-bottom: 40rpx;
}

.result-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.result-message {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.order-info {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 28rpx;
  color: #666;
}

.value {
  font-size: 28rpx;
  color: #333;
}

.value.amount {
  font-size: 32rpx;
  font-weight: bold;
  color: #FF5000;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.retry-btn,
.order-btn,
.home-btn {
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
}

.retry-btn {
  background-color: #FF5000;
  color: #fff;
}

.order-btn {
  background-color: #007AFF;
  color: #fff;
}

.home-btn {
  background-color: #f0f0f0;
  color: #333;
}
</style>


