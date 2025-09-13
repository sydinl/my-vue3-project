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
        <view class="info-value">1283323</view>
      </view>

      <!-- 头像 -->
      <view class="info-item" @tap="changeAvatar">
        <view class="info-label">头像</view>
        <view class="avatar-container">
          <view class="avatar-icon">
            <image src="/static/icons/user-avatar.png" mode="aspectFit" class="avatar"></image>
          </view>
          <uni-icons type="right" size="14" color="#CCCCCC"></uni-icons>
        </view>
      </view>

      <!-- 昵称 -->
      <view class="info-item" @tap="editNickname">
        <view class="info-label">昵称</view>
        <view class="info-value-right">
          <view class="info-value">用户_1283323</view>
          <uni-icons type="right" size="14" color="#CCCCCC"></uni-icons>
        </view>
      </view>

      <!-- 姓名 -->
      <view class="info-item" @tap="editName">
        <view class="info-label">姓名</view>
        <view class="info-value-right">
          <view class="info-value">请输入姓名</view>
          <uni-icons type="right" size="14" color="#CCCCCC"></uni-icons>
        </view>
      </view>

      <!-- 性别 -->
      <view class="info-item" @tap="selectGender">
        <view class="info-label">性别</view>
        <view class="info-value-right">
          <view class="info-value">男</view>
          <uni-icons type="right" size="14" color="#CCCCCC"></uni-icons>
        </view>
      </view>

      <!-- 出生日期 -->
      <view class="info-item" @tap="selectBirthdate">
        <view class="info-label">出生日期</view>
        <view class="info-value-right">
          <view class="info-value">2025-08-24</view>
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

      <!-- 绑定手机号 -->
      <view class="info-item" @tap="bindPhone">
        <view class="info-label">绑定手机号</view>
        <view class="info-value-right">
          <view class="info-value">未绑定</view>
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
  export default {
    name: 'PersonalInfo',
    data() {
      return {
        userId: '1283323',
        nickname: '用户_1283323',
        realName: '',
        gender: '男',
        birthdate: '2025-08-24',
        phoneNumber: ''
      }
    },
    methods: {
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
      logout() {
        uni.showModal({
          title: '确认退出',
          content: '确定要退出登录吗？',
          success: (res) => {
            if (res.confirm) {
              uni.showToast({
                title: '退出登录成功',
                icon: 'success',
                duration: 2000,
                success: () => {
                  // 退出登录后可以跳转到登录页面
                  setTimeout(() => {
                    uni.navigateTo({
                      url: '/pages/login/login'
                    });
                  }, 1500);
                }
              });
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