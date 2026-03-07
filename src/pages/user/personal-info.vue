<template>
  <view class="personal-info-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @tap="goBack">
        <uni-icons type="left" size="18" color="#333333"></uni-icons>
      </view>
      <view class="nav-title">个人资料</view>
      <view class="nav-right">
        <uni-icons type="ellipsis" size="18" color="#333333" class="mr-10"></uni-icons>
        <uni-icons type="eye" size="18" color="#333333"></uni-icons>
      </view>
    </view>

    <!-- 个人信息列表 -->
    <view class="info-list">
      <!-- ID -->
      <view class="info-item">
        <view class="info-label">ID</view>
        <view class="info-value">{{ userId || '-' }}</view>
      </view>

      <!-- 头像（微信登录后显示微信头像） -->
      <view class="info-item" @tap="changeAvatar">
        <view class="info-label">头像</view>
        <view class="avatar-container">
          <view class="avatar-icon">
            <image :src="avatarUrl || '/static/icons/user-avatar.png'" mode="aspectFit" class="avatar"></image>
          </view>
          <uni-icons type="right" size="14" color="#CCCCCC"></uni-icons>
        </view>
      </view>

      <!-- 昵称（微信登录后显示微信昵称） -->
      <view class="info-item" @tap="editNickname">
        <view class="info-label">昵称</view>
        <view class="info-value-right">
          <view class="info-value">{{ nickname || '未设置' }}</view>
          <uni-icons type="right" size="14" color="#CCCCCC"></uni-icons>
        </view>
      </view>

      <!-- 姓名 -->
      <view class="info-item" @tap="editName">
        <view class="info-label">姓名</view>
        <view class="info-value-right">
          <view class="info-value">{{ realName || '请输入姓名' }}</view>
          <uni-icons type="right" size="14" color="#CCCCCC"></uni-icons>
        </view>
      </view>

      <!-- 性别（微信登录后显示微信性别） -->
      <view class="info-item" @tap="selectGender">
        <view class="info-label">性别</view>
        <view class="info-value-right">
          <view class="info-value">{{ gender || '未设置' }}</view>
          <uni-icons type="right" size="14" color="#CCCCCC"></uni-icons>
        </view>
      </view>

      <!-- 出生日期 -->
      <view class="info-item" @tap="selectBirthdate">
        <view class="info-label">出生日期</view>
        <view class="info-value-right">
          <view class="info-value">{{ birthdate || '请选择' }}</view>
          <uni-icons type="right" size="14" color="#CCCCCC"></uni-icons>
        </view>
      </view>

      <!-- 我的地址 -->
      <view class="info-item" @tap="viewAddresses">
        <view class="info-label">我的地址</view>
        <view class="info-value-right">
          <uni-icons type="right" size="14" color="#CCCCCC"></uni-icons>
        </view>
      </view>

      <!-- 绑定手机号（微信不提供手机号，需用户授权获取） -->
      <view class="info-item" @tap="bindPhone">
        <view class="info-label">绑定手机号</view>
        <view class="info-value-right">
          <view class="info-value">{{ phoneDisplay }}</view>
          <uni-icons type="right" size="14" color="#CCCCCC"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view class="logout-section">
      <button class="logout-btn" @tap="logout">退出登录</button>
    </view>
  </view>
</template>

<script>
  import api from '../../utils/api.js';
  import wechatLoginManager from '../../utils/wechat-login.js';
  import userManager from '../../utils/user-manager.js';

  export default {
    name: 'PersonalInfo',
    data() {
      return {
        userId: '',
        nickname: '',
        realName: '',
        avatarUrl: '',
        gender: '',
        birthdate: '',
        phoneNumber: ''
      }
    },
    computed: {
      phoneDisplay() {
        const p = this.phoneNumber;
        if (!p || p.trim() === '') return '未绑定';
        return p;
      }
    },
    onLoad() {
      this.loadUserInfo();
    },
    onShow() {
      this.loadUserInfo();
    },
    methods: {
      async loadUserInfo() {
        try {
          const res = await api.user.getInfo();
          if (res.code === 200 && res.data) {
            const d = res.data;
            this.userId = d.userId || '';
            this.nickname = d.nickname || '';
            this.realName = d.realName || '';
            this.avatarUrl = d.avatar || '';
            this.gender = d.gender || '';
            this.birthdate = d.birthdate || '';
            this.phoneNumber = d.phone || '';
          }
        } catch (e) {
          console.error('获取用户信息失败', e);
          uni.showToast({ title: '获取用户信息失败', icon: 'none' });
        }
      },
      // 返回上一页
      goBack() {
        uni.navigateBack();
      },
      
      // 修改头像
      changeAvatar() {
        uni.showToast({
          title: '选择头像',
          icon: 'none',
          duration: 2000
        });
      },
      
      // 编辑昵称
      editNickname() {
        uni.showToast({
          title: '编辑昵称',
          icon: 'none',
          duration: 2000
        });
      },
      
      // 编辑姓名
      editName() {
        uni.showToast({
          title: '编辑姓名',
          icon: 'none',
          duration: 2000
        });
      },
      
      // 选择性别
      selectGender() {
        uni.showToast({
          title: '选择性别',
          icon: 'none',
          duration: 2000
        });
      },
      
      // 选择出生日期
      selectBirthdate() {
        uni.showToast({
          title: '选择出生日期',
          icon: 'none',
          duration: 2000
        });
      },
      
      // 查看地址
      viewAddresses() {
        uni.showToast({
          title: '查看地址',
          icon: 'none',
          duration: 2000
        });
      },
      
      // 绑定手机号
      bindPhone() {
        uni.showToast({
          title: '绑定手机号',
          icon: 'none',
          duration: 2000
        });
      },
      
      // 退出登录
      async logout() {
        uni.showModal({
          title: '确认退出',
          content: '确定要退出登录吗？',
          success: async (res) => {
            if (res.confirm) {
              try {
                await api.user.logout();
              } catch (e) {}
              await wechatLoginManager.logout();
              userManager.clearUser();
              uni.removeStorageSync('privacyAgreed');
              uni.showToast({ title: '已退出登录', icon: 'success' });
              setTimeout(() => {
                uni.reLaunch({ url: '/pages/login/login' });
              }, 500);
            }
          }
        });
      }
    }
  }
</script>

<style scoped>
  .personal-info-container {
    height: 100vh;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
  }

  /* 顶部导航栏 */
  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    padding: 0 16px;
    background-color: #FFFFFF;
    border-bottom: 1px solid #F0F0F0;
  }

  .back-btn {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-title {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
  }

  .nav-right {
    display: flex;
    align-items: center;
  }

  .mr-10 {
    margin-right: 10px;
  }

  /* 个人信息列表 */
  .info-list {
    flex: 1;
    background-color: #FFFFFF;
  }

  .info-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
    border-bottom: 1px solid #F0F0F0;
  }

  .info-label {
    font-size: 14px;
    color: #333333;
  }

  .info-value {
    font-size: 14px;
    color: #666666;
  }

  .info-value-right {
    display: flex;
    align-items: center;
  }

  /* 头像容器 */
  .avatar-container {
    display: flex;
    align-items: center;
  }

  .avatar-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #F0F0F0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
  }

  .avatar {
    width: 24px;
    height: 24px;
  }

  /* 退出登录按钮 */
  .logout-section {
    padding: 30px 20px;
    background-color: #F8F8F8;
  }

  .logout-btn {
    width: 100%;
    height: 44px;
    background-color: #FFFFFF;
    color: #333333;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    font-size: 14px;
  }
</style>