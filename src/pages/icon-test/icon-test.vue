<template>
  <view class="container">
    <text class="title">图标测试页面</text>
    <view class="icon-container">
      <text>首页图标:</text>
      <image :src="'/static/icons/home.svg'" class="icon" mode="aspectFit"></image>
    </view>
    <view class="icon-container">
      <text>首页激活图标:</text>
      <image :src="'/static/icons/home-active.svg'" class="icon" mode="aspectFit"></image>
    </view>
    <view class="icon-container">
      <text>项目图标:</text>
      <image :src="'/static/icons/projects.svg'" class="icon" mode="aspectFit"></image>
    </view>
    <view class="icon-container">
      <text>项目激活图标:</text>
      <image :src="'/static/icons/projects-active.svg'" class="icon" mode="aspectFit"></image>
    </view>
    <view class="icon-container">
      <text>购物车图标:</text>
      <image :src="'/static/icons/cart.svg'" class="icon" mode="aspectFit"></image>
    </view>
    <view class="icon-container">
      <text>购物车激活图标:</text>
      <image :src="'/static/icons/cart-active.svg'" class="icon" mode="aspectFit"></image>
    </view>
    <view class="icon-container">
      <text>我的图标:</text>
      <image :src="'/static/icons/user.svg'" class="icon" mode="aspectFit"></image>
    </view>
    <view class="icon-container">
      <text>我的激活图标:</text>
      <image :src="'/static/icons/user-active.svg'" class="icon" mode="aspectFit"></image>
    </view>
    
    <text class="subtitle">直接URL测试:</text>
    <text class="url-text">请尝试直接在浏览器中访问: http://localhost:5174/static/icons/home.svg</text>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 可以在这里添加需要的测试数据
    }
  },
  onLoad() {
    console.log('图标测试页面已加载');
    // 可以在这里添加额外的测试代码
  }
}
</script>

<style>
.container {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.subtitle {
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 30rpx;
  margin-bottom: 10rpx;
}

.icon-container {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 10rpx 0;
}

.icon {
  width: 80rpx;
  height: 80rpx;
}

.url-text {
  font-size: 28rpx;
  color: #0066cc;
  word-break: break-all;
}
</style>