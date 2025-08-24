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
        <uni-icons type="cart" size="80" color="#CCCCCC"></uni-icons>
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
      <button class="checkout-btn" @click="checkout">结算</button>
    </view>
  </view>
</template>

<script>
import { ref, computed } from 'vue';

// 直接导入图片
import img1 from '../../static/items/wxpic_202508220008253.jpg';
import img2 from '../../static/items/wxpic_202508220008254.jpg';

export default {
  name: 'CartPage',
  setup() {
    // 模拟购物车数据
    const cartItems = ref([
      {
        id: 1,
        name: '经典足道',
        price: 128,
        quantity: 1,
        img: img1
      },
      {
        id: 2,
        name: '皇室SPA',
        price: 268,
        quantity: 1,
        img: img2
      }
    ]);

    // 计算总价
    const totalPrice = computed(() => {
      return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
    });

    // 增加数量
    const increaseQuantity = (index) => {
      cartItems.value[index].quantity++;
    };

    // 减少数量
    const decreaseQuantity = (index) => {
      if (cartItems.value[index].quantity > 1) {
        cartItems.value[index].quantity--;
      } else {
        // 确认删除
        uni.showModal({
          title: '确认删除',
          content: '确定要从购物车中移除该项目吗？',
          success: (res) => {
            if (res.confirm) {
              cartItems.value.splice(index, 1);
            }
          }
        });
      }
    };

    // 结算
    const checkout = () => {
      uni.showToast({ title: '结算成功', icon: 'success' });
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
  background-color: #FF5000;
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
  color: #FF5000;
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
  bottom: 0;
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
  color: #FF5000;
}

.checkout-btn {
  background-color: #FF5000;
  color: #fff;
  padding: 0 60rpx;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
}
</style>