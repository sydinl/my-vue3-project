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
      <view class="user-name">用户_1283323</view>
    </view>

    <!-- 二维码展示区域 -->
    <view class="qrcode-section">
      <view class="qrcode-wrapper">
        <!-- 使用静态图片作为二维码占位符 -->
        <image src="/static/logo.png" mode="aspectFit" class="qrcode-image"></image>
        <!-- 二维码中间的logo -->
        <view class="qrcode-center-logo">
          <image src="/static/logo.png" mode="aspectFit" class="center-logo"></image>
        </view>
      </view>
    </view>

    <!-- 保存图片按钮 -->
    <view class="btn-section">
      <button class="save-btn" @click="saveQRCode">保存图片</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 二维码图片路径
      qrcodeImagePath: ''
    }
  },
  onLoad() {
    // 这里可以添加获取用户二维码的逻辑
    this.fetchQRCode();
  },
  methods: {
    // 返回上一页
    navigateBack() {
      uni.navigateBack();
    },
    
    // 获取用户的推广二维码
    fetchQRCode() {
      // 实际项目中这里应该调用接口获取用户的二维码图片
      // 模拟获取成功
      this.qrcodeImagePath = '/static/logo.png'; // 使用占位图
    },
    
    // 保存二维码图片到本地
    saveQRCode() {
      // 判断是否是小程序环境
      if (uni.getSystemInfoSync().platform === 'devtools') {
        // 开发工具环境，模拟保存
        uni.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        });
        return;
      }
      
      // 实际保存图片的逻辑
      uni.saveImageToPhotosAlbum({
        filePath: this.qrcodeImagePath,
        success: () => {
          uni.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          });
        },
        fail: (err) => {
          console.error('保存失败', err);
          uni.showToast({
            title: '保存失败',
            icon: 'none',
            duration: 2000
          });
          
          // 如果是因为用户拒绝授权，可以引导用户打开授权
          if (err.errMsg.indexOf('auth deny') >= 0) {
            this.showAuthModal();
          }
        }
      });
    },
    
    // 显示授权提示弹窗
    showAuthModal() {
      uni.showModal({
        title: '提示',
        content: '需要您授权保存图片权限才能保存二维码',
        success: (res) => {
          if (res.confirm) {
            // 打开设置页面
            uni.openSetting({
              success: (settingRes) => {
                console.log('设置结果', settingRes);
              }
            });
          }
        }
      });
    }
  }
}
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