<template>
  <view class="qrcode-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-left" @click="navigateBack">
        <uni-icons type="left" size="24" class="back-icon"></uni-icons>
      </view>
      <view class="nav-title">推广二维码</view>
      <view class="nav-right">
        <text class="more-icon">...</text>
      </view>
    </view>

    <!-- 用户信息区域 -->
    <view class="user-info">
      <view class="user-avatar">
        <image src="/static/icons/user.png" mode="aspectFit" class="avatar"></image>
      </view>
      <view class="user-name">我的推广</view>
    </view>

    <!-- 推广链接/参数 -->
    <view class="promo-section" v-if="promo.referrerId">
      <view class="promo-tip">好友通过以下链接或扫码进入并登录后，将自动绑定为您的下级</view>
      <view class="promo-row">
        <text class="promo-label">推荐人ID：</text>
        <text class="promo-value" selectable>{{ promo.referrerId }}</text>
        <button class="copy-btn" size="mini" @click="copyReferrerId">复制</button>
      </view>
      <view class="promo-row">
        <text class="promo-label">Scene 参数：</text>
        <text class="promo-value" selectable>{{ promo.scene }}</text>
        <button class="copy-btn" size="mini" @click="copyScene">复制</button>
      </view>
    </view>

    <!-- 二维码展示区域（占位，真实小程序码需后端调微信接口） -->
    <view class="qrcode-section">
      <view class="qrcode-wrapper">
        <image src="/static/logo.png" mode="aspectFit" class="qrcode-image"></image>
        <view class="qrcode-center-logo">
          <image src="/static/logo.png" mode="aspectFit" class="center-logo"></image>
        </view>
      </view>
      <text class="qrcode-hint">小程序码需配置后生成，当前为占位</text>
    </view>

    <view class="btn-section">
      <button class="save-btn" @click="saveQRCode">保存图片</button>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '@/utils/api.js';

export default {
  setup() {
    const qrcodeImagePath = ref('/static/logo.png');
    const promo = ref({ referrerId: '', scene: '', invitePath: '' });

    const fetchQRCode = async () => {
      try {
        const res = await api.distribution.getPromotionInfo();
        if (res && res.code === 200 && res.data) {
          promo.value = { referrerId: res.data.referrerId || '', scene: res.data.scene || '', invitePath: res.data.invitePath || '' };
        }
      } catch (e) {
        console.warn('获取推广信息失败', e);
      }
    };

    const copyReferrerId = () => {
      if (promo.value.referrerId) {
        uni.setClipboardData({ data: promo.value.referrerId, success: () => uni.showToast({ title: '已复制', icon: 'success' }) });
      }
    };
    const copyScene = () => {
      if (promo.value.scene) {
        uni.setClipboardData({ data: promo.value.scene, success: () => uni.showToast({ title: '已复制', icon: 'success' }) });
      }
    };

    const navigateBack = () => uni.navigateBack();
    
    const saveQRCode = () => {
      if (uni.getSystemInfoSync().platform === 'devtools') {
        uni.showToast({ title: '保存成功', icon: 'success' });
        return;
      }
      uni.saveImageToPhotosAlbum({
        filePath: qrcodeImagePath.value,
        success: () => uni.showToast({ title: '保存成功', icon: 'success' }),
        fail: (err) => {
          uni.showToast({ title: '保存失败', icon: 'none' });
          if (err.errMsg && err.errMsg.indexOf('auth deny') >= 0) {
            uni.showModal({
              title: '提示',
              content: '需要您授权保存图片权限才能保存二维码',
              success: (r) => { if (r.confirm) uni.openSetting({}); }
            });
          }
        }
      });
    };

    onMounted(() => fetchQRCode());

    return {
      qrcodeImagePath,
      promo,
      navigateBack,
      copyReferrerId,
      copyScene,
      saveQRCode
    };
  }
};
</script>

<style lang="scss">
.qrcode-container {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  
  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    background-color: #ffffff;
    padding: 0 16px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    
    .nav-left {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .back-icon {
        font-size: 18px;
        color: #333333;
      }
    }
    
    .nav-title {
      flex: 1;
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      color: #333333;
    }
    
    .nav-right {
      width: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .more-icon {
        font-size: 18px;
        color: #333333;
      }
    }
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 60px;
    padding: 20px 0;
    
    .user-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    
  .user-name {
    font-size: 16px;
    color: #333333;
  }
  }

  .promo-section {
    padding: 16px;
    margin: 0 16px;
    background: #f8f8f8;
    border-radius: 8px;
  }
  .promo-tip {
    font-size: 12px;
    color: #666;
    margin-bottom: 12px;
  }
  .promo-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  .promo-label { font-size: 13px; color: #333; min-width: 80px; }
  .promo-value { flex: 1; font-size: 12px; color: #666; word-break: break-all; }
  .copy-btn { margin-left: 8px; }
  .qrcode-hint {
    display: block;
    text-align: center;
    font-size: 12px;
    color: #999;
    margin-top: 8px;
  }
  
  .qrcode-section {
    display: flex;
    justify-content: center;
    padding: 30px 0;
    
    .qrcode-wrapper {
      width: 260px;
      height: 260px;
      background-color: #ffffff;
      padding: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .qrcode-image {
        width: 100%;
        height: 100%;
      }
      
      .qrcode-center-logo {
        position: absolute;
        width: 60px;
        height: 60px;
        background-color: #ffffff;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        
        .center-logo {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  
  .btn-section {
    padding: 0 40px;
    margin-top: 20px;
    
    .save-btn {
      width: 100%;
      height: 48px;
      background-color: #ff4e00;
      color: #ffffff;
      font-size: 16px;
      border-radius: 24px;
      border: none;
      box-shadow: 0 2px 8px rgba(255, 78, 0, 0.3);
    }
  }
}
</style>