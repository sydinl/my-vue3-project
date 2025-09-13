<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-left" @click="backToHome">
        <uni-icons type="left" size="24"></uni-icons>
      </view>
      <text class="header-title">购物车</text>
      <view class="header-right"></view>
    </view>

    <!-- 购物车内容 -->
    <view class="cart-content">
      <view v-if="cartItems.length === 0" class="empty-cart">
        <image src="/static/icons/cart1.png" mode="aspectFit" style="width: 80px; height: 80px; opacity: 0.6;"></image>
        <text class="empty-text">购物车还是空的，去添加一些项目吧~</text>
        <button class="go-shopping" @click="goToProjects">去选购</button>
      </view>
      <view v-else class="cart-items">
        <view class="cart-item" v-for="(item, index) in cartItems" :key="item.id">
          <view class="item-info">
            <image :src="item.img" mode="aspectFill" class="item-image"></image>
            <view class="item-details">
              <text class="item-name">{{ item.name }}</text>
              <text class="item-price">¥{{ item.price }}</text>
            </view>
          </view>
          <view class="item-quantity">
            <button class="quantity-btn" @click="decreaseQuantity(index)">-</button>
            <text class="quantity">{{ item.quantity }}</text>
            <button class="quantity-btn" @click="increaseQuantity(index)">+</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部结算 -->
    <view class="checkout-bar" v-if="cartItems.length > 0">
      <view class="total-price">
        <text>合计：</text>
        <text class="price">¥{{ totalPrice }}</text>
      </view>
      <button class="checkout-btn" :class="{ 'checking-out': isCheckingOut }" @click="checkout" :disabled="isCheckingOut">
        {{ isCheckingOut ? '处理中...' : '结算' }}
      </button>
    </view>
  </view>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import weChatPayment from '../../utils/payment.js';

// 直接导入图片
import img1 from '../../static/items/sheng.jpg';
import img2 from '../../static/items/yue.jpg';

// 购物车存储键名
const CART_STORAGE_KEY = 'spa_cart_items';

export default {
  name: 'CartPage',
  // 页面显示时重新加载购物车数据 - 在uni-app中，onShow应该定义为组件选项
  onShow() {
    this.loadCartItems();
  },
  setup() {
    // 购物车数据
    const cartItems = ref([]);
    
    // 防抖相关状态
    const isCheckingOut = ref(false);
    let checkoutTimer = null;

    // 从本地存储加载购物车数据
    const loadCartItems = () => {
      try {
        const cartData = uni.getStorageSync(CART_STORAGE_KEY);
        if (cartData) {
          cartItems.value = JSON.parse(cartData);
        }
      } catch (e) {
        console.error('加载购物车数据失败:', e);
      }
    };

    // 保存购物车数据到本地存储
    const saveCartItems = () => {
      try {
        uni.setStorageSync(CART_STORAGE_KEY, JSON.stringify(cartItems.value));
      } catch (e) {
        console.error('保存购物车数据失败:', e);
      }
    };

    // 组件挂载时加载购物车数据
    onMounted(() => {
      loadCartItems();
      
      // 如果购物车为空，添加一些默认商品
      if (cartItems.value.length === 0) {
        cartItems.value = [
          {
            id: 1,
            name: '经典足道',
            price: 128,
            originalPrice: 168,
            quantity: 1,
            duration: '60分钟',
            img: img1
          },
          {
            id: 2,
            name: '皇室SPA',
            price: 268,
            originalPrice: 328,
            quantity: 1,
            duration: '90分钟',
            img: img2
          }
        ];
        saveCartItems();
      }
    });

    // 计算总价
    const totalPrice = computed(() => {
      return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
    });

    // 增加数量
    const increaseQuantity = (index) => {
      cartItems.value[index].quantity++;
      saveCartItems();
    };

    // 减少数量
    const decreaseQuantity = (index) => {
      if (cartItems.value[index].quantity > 1) {
        cartItems.value[index].quantity--;
        saveCartItems();
      } else {
        // 确认删除
        uni.showModal({
          title: '确认删除',
          content: '确定要从购物车中移除该项目吗？',
          success: (res) => {
            if (res.confirm) {
              cartItems.value.splice(index, 1);
              saveCartItems();
            }
          }
        });
      }
    };

    // 结算
    const checkout = () => {
      // 防抖处理：如果正在结算中，直接返回
      if (isCheckingOut.value) {
        uni.showToast({ 
          title: '正在处理中，请稍候...', 
          icon: 'none',
          duration: 1500
        });
        return;
      }
      
      if (cartItems.value.length === 0) {
        uni.showToast({ title: '购物车为空', icon: 'none' });
        return;
      }
      
      // 设置防抖状态
      isCheckingOut.value = true;
      
      // 清除之前的定时器
      if (checkoutTimer) {
        clearTimeout(checkoutTimer);
      }
      
      // 设置防抖定时器（1秒内只能点击一次）
      checkoutTimer = setTimeout(() => {
        isCheckingOut.value = false;
      }, 1000);
      
      // 构建订单数据
      const orderData = {
        items: cartItems.value.map(item => ({
          projectId: item.id,
          projectName: item.name,
          price: item.price,
          quantity: item.quantity,
          duration: item.duration
        })),
        totalAmount: totalPrice.value,
        paymentMethod: 'wechat',
        source: 'cart'
      };
      
      // 发起支付
      console.log('开始发起支付流程...');
      weChatPayment.processPayment(
        orderData,
        // 支付成功回调
        (result) => {
          console.log('支付成功回调被调用:', result);
          console.log('清空购物车前的商品数量:', cartItems.value.length);
          // 清空购物车
          cartItems.value = [];
          console.log('清空购物车后的商品数量:', cartItems.value.length);
          saveCartItems();
          console.log('购物车已保存到本地存储');
          // 重置防抖状态
          isCheckingOut.value = false;
          if (checkoutTimer) {
            clearTimeout(checkoutTimer);
            checkoutTimer = null;
          }
          // 显示成功提示
          uni.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          });
          // 直接跳转到订单页面，不等待状态检查
          setTimeout(() => {
            console.log('准备跳转到订单页面');
            uni.navigateTo({
              url: '/pages/orders/my-orders'
            });
          }, 2000);
        },
        // 支付失败回调
        (error) => {
          console.error('支付失败回调被调用:', error);
          // 重置防抖状态
          isCheckingOut.value = false;
          if (checkoutTimer) {
            clearTimeout(checkoutTimer);
            checkoutTimer = null;
          }
          // 显示失败提示
          uni.showToast({
            title: error.message || '支付失败，请重试',
            icon: 'none',
            duration: 2000
          });
        }
      );
    };

    // 返回首页
    const backToHome = () => {
      uni.navigateBack();
    };

    // 去项目列表
    const goToProjects = () => {
      uni.navigateTo({
        url: '/pages/projects/projects'
      });
    };

    return {
      cartItems,
      totalPrice,
      isCheckingOut,
      loadCartItems,
      increaseQuantity,
      decreaseQuantity,
      checkout,
      backToHome,
      goToProjects
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
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.header-left,
.header-right {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.cart-content {
  padding: 20rpx;
  min-height: calc(100vh - 200rpx);
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-text {
  margin-top: 40rpx;
  font-size: 28rpx;
  color: #999;
}

.go-shopping {
  margin-top: 40rpx;
  background-color: #4CAF50;
  color: #fff;
  width: 200rpx;
  border-radius: 30rpx;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.cart-item {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.item-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.item-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 10rpx;
}

.item-details {
  margin-left: 20rpx;
  flex: 1;
}

.item-name {
  font-size: 28rpx;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.item-price {
  margin-top: 10rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #4CAF50;
}

.item-quantity {
  display: flex;
  align-items: center;
}

.quantity-btn {
  width: 50rpx;
  height: 50rpx;
  background-color: #f5f5f5;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  border-radius: 50%;
}

.quantity {
  margin: 0 20rpx;
  font-size: 28rpx;
  color: #333;
}

.checkout-bar {
  position: fixed;
  bottom: 100rpx;
  left: 0;
  right: 0;
  max-width: 750rpx;
  margin: 0 auto;
  background-color: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.total-price {
  display: flex;
  align-items: center;
}

.total-price text {
  font-size: 28rpx;
  color: #333;
}

.total-price .price {
  font-size: 32rpx;
  font-weight: bold;
  color: #4CAF50;
}

.checkout-btn {
  background-color: #4CAF50;
  color: #fff;
  padding: 0 60rpx;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  transition: all 0.3s ease;
}

.checkout-btn.checking-out {
  background-color: #ccc;
  opacity: 0.7;
}

.checkout-btn:disabled {
  background-color: #ccc;
  opacity: 0.7;
  cursor: not-allowed;
}
</style>