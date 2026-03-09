<template>
  <view class="login-container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部装饰 -->
    <view class="header-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
      <view class="decoration-circle circle-3"></view>
    </view>

    <!-- 登录内容 -->
    <view class="login-content">
      <!-- Logo区域 -->
      <view class="logo-section">
        <image src="/static/logo.png" class="logo" mode="aspectFit"></image>
        <text class="app-name">登录后可体验更多功能</text>
        <text class="app-slogan">专业足道按摩服务</text>
      </view>

      <!-- 登录按钮区域 -->
      <view class="login-section">
        <button 
          class="wechat-login-btn" 
          @click="handleWechatLogin"
          :disabled="loginLoading || !hasAgreed"
        >
          <image src="/static/icons/wechat.png" class="wechat-icon" v-if="!loginLoading"></image>
          <uni-loading v-if="loginLoading" size="20" color="#FFFFFF"></uni-loading>
          <text class="login-btn-text">
            {{ loginLoading ? '登录中...' : '微信一键登录' }}
          </text>
        </button>

        <view class="login-hint">登录后可在「我的」-「个人资料」完善昵称和头像</view>
        <!-- 服务协议：用户主动勾选后才能登录 -->
        <view class="agreement-section">
          <view class="agreement-wrapper" @click="toggleAgreement">
            <view class="agreement-checkbox" :class="{ checked: hasAgreed }">
              <view class="agreement-checkbox-inner" v-if="hasAgreed"></view>
            </view>
            <text class="agreement-text">
              我已阅读并同意
              <text class="agreement-link" @click.stop="goUserAgreement">《用户服务协议》</text>
              和
              <text class="agreement-link" @click.stop="goPrivacyPolicy">《隐私政策》</text>
            </text>
          </view>
        </view>
      </view>

      <!-- 功能介绍 -->
      <view class="features-section">
        <view class="feature-item">
          <image src="/static/icons/home.png" class="feature-icon"></image>
          <text class="feature-text">专业技师</text>
        </view>
        <view class="feature-item">
          <image src="/static/icons/projects.png" class="feature-icon"></image>
          <text class="feature-text">优质服务</text>
        </view>
        <view class="feature-item">
          <image src="/static/icons/user.png" class="feature-icon"></image>
          <text class="feature-text">会员特权</text>
        </view>
      </view>
    </view>

    <!-- 底部装饰 -->
    <view class="footer-decoration">
      <view class="wave wave-1"></view>
      <view class="wave wave-2"></view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';
import wechatLoginManager from '../../utils/wechat-login.js';

export default {
  name: 'LoginPage',
  setup() {
    const statusBarHeight = ref(0);
    const loginLoading = ref(false);
    const hasAgreed = ref(false);

    // 获取系统信息
    const getSystemInfo = () => {
      uni.getSystemInfo({
        success: (res) => {
          statusBarHeight.value = res.statusBarHeight || 0;
          if (res.safeAreaInsets) {
            if (res.safeAreaInsets.top > res.statusBarHeight) {
              statusBarHeight.value = res.safeAreaInsets.top;
            }
          }
          // 针对iPhone X系列设备
          if (res.model && (res.model.includes('iPhone X') || res.model.includes('iPhone 11') || res.model.includes('iPhone 12') || res.model.includes('iPhone 13') || res.model.includes('iPhone 14') || res.model.includes('iPhone 15'))) {
            statusBarHeight.value = Math.max(statusBarHeight.value, 44);
          }
          // 确保最小高度
          statusBarHeight.value = Math.max(statusBarHeight.value, 20);
        }
      });
    };

    const toggleAgreement = () => {
      hasAgreed.value = !hasAgreed.value;
    };

    // 微信登录
    const handleWechatLogin = async () => {
      if (!hasAgreed.value) {
        uni.showToast({
          title: '请先阅读并勾选同意《用户协议》和《隐私政策》',
          icon: 'none'
        });
        return;
      }

      try {
        loginLoading.value = true;
        const result = await wechatLoginManager.login();
        
        if (result.success) {
          // 记录用户已同意隐私政策
          uni.setStorageSync('privacyAgreed', true);

          uni.showToast({
            title: result.isNewUser ? '欢迎新用户！' : '登录成功',
            icon: 'success'
          });
          
          // 登录成功后跳转到首页
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/home/home'
            });
          }, 1500);
        }
      } catch (error) {
        console.error('登录失败:', error);
        uni.showToast({
          title: error.message || '登录失败，请重试',
          icon: 'error'
        });
      } finally {
        loginLoading.value = false;
      }
    };

    // 跳转用户服务协议页面
    const goUserAgreement = () => {
      uni.navigateTo({
        url: '/pages/agreement/user-agreement'
      });
    };

    // 跳转隐私政策页面
    const goPrivacyPolicy = () => {
      uni.navigateTo({
        url: '/pages/agreement/privacy-policy'
      });
    };

    // 检查是否已登录（仅在用户已同意隐私政策的前提下自动登录）
    const checkLoginStatus = async () => {
      const privacyAgreed = uni.getStorageSync('privacyAgreed');
      if (!privacyAgreed) {
        return;
      }

      const isLoggedIn = await wechatLoginManager.autoLogin();
      if (isLoggedIn) {
        // 已登录，直接跳转到首页
        uni.switchTab({
          url: '/pages/home/home'
        });
      }
    };

    onMounted(() => {
      getSystemInfo();
      checkLoginStatus();
    });

    return {
      statusBarHeight,
      loginLoading,
      hasAgreed,
      handleWechatLogin,
      toggleAgreement,
      goUserAgreement,
      goPrivacyPolicy
    };
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0F8F0 0%, #E8F5E8 50%, #F0F8F0 100%);
  position: relative;
  overflow: hidden;
}

.status-bar {
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300rpx;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(76, 175, 80, 0.1);
}

.circle-1 {
  width: 200rpx;
  height: 200rpx;
  top: -100rpx;
  right: -50rpx;
}

.circle-2 {
  width: 150rpx;
  height: 150rpx;
  top: 50rpx;
  left: -75rpx;
  background: rgba(102, 187, 106, 0.15);
}

.circle-3 {
  width: 100rpx;
  height: 100rpx;
  top: 150rpx;
  right: 100rpx;
  background: rgba(46, 125, 50, 0.1);
}

.login-content {
  padding: 0 60rpx;
  position: relative;
  z-index: 2;
}

.logo-section {
  text-align: center;
  padding: 120rpx 0 80rpx;
}

.logo {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 30rpx;
}

.app-name {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #2E7D32;
  margin-bottom: 20rpx;
}

.app-slogan {
  display: block;
  font-size: 28rpx;
  color: #4CAF50;
  opacity: 0.8;
}

.login-hint {
  font-size: 24rpx;
  color: #999;
  text-align: center;
  margin-bottom: 24rpx;
}

.login-section {
  margin-bottom: 100rpx;
}

.wechat-login-btn {
  width: 100%;
  height: 100rpx;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 20rpx rgba(76, 175, 80, 0.3);
  border: none;
  margin-bottom: 40rpx;
}

.wechat-login-btn:disabled {
  opacity: 0.7;
}

.wechat-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}

.login-btn-text {
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: bold;
}

.agreement-section {
  text-align: center;
}

.agreement-wrapper {
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.agreement-checkbox {
  width: 28rpx;
  height: 28rpx;
  border-radius: 8rpx;
  border: 2rpx solid #4CAF50;
  margin-right: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
}

.agreement-checkbox.checked {
  background-color: #4CAF50;
}

.agreement-checkbox-inner {
  width: 14rpx;
  height: 14rpx;
  border-radius: 4rpx;
  background-color: #FFFFFF;
}

.agreement-text {
  font-size: 24rpx;
  color: #666666;
  line-height: 1.5;
}

.agreement-link {
  color: #4CAF50;
  text-decoration: underline;
}

.features-section {
  display: flex;
  justify-content: space-around;
  padding: 40rpx 0;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.feature-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 20rpx;
  opacity: 0.8;
}

.feature-text {
  font-size: 24rpx;
  color: #4CAF50;
  font-weight: 500;
}

.footer-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200rpx;
  overflow: hidden;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  opacity: 0.1;
}

.wave-1 {
  border-radius: 50% 50% 0 0;
  transform: scaleX(1.2);
}

.wave-2 {
  height: 80rpx;
  background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%);
  opacity: 0.15;
  border-radius: 50% 50% 0 0;
  transform: scaleX(1.1);
}
</style>
