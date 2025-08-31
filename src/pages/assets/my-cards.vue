<template>
  <view class="cards-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @tap="goBack">
        <uni-icons type="left" size="18" color="#333333"></uni-icons>
      </view>
      <view class="nav-title">我的卡券</view>
      <view class="nav-right"></view>
    </view>

    <!-- 状态选项卡 -->
    <view class="tabs">
      <view class="tab-item" :class="{ active: activeTab === 'unused' }" @tap="switchTab('unused')">
        未使用
      </view>
      <view class="tab-item" :class="{ active: activeTab === 'used' }" @tap="switchTab('used')">
        已使用
      </view>
      <view class="tab-item" :class="{ active: activeTab === 'expired' }" @tap="switchTab('expired')">
        已过期
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 空状态 -->
      <view class="empty-state">
        <view class="empty-icon">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35 35H65V65H35V35Z" stroke="#E0E0E0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M40 45H60" stroke="#E0E0E0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M40 55H50" stroke="#E0E0E0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M25 35C25 30 29 25 35 25H65C71 25 75 30 75 35V65C75 70 71 75 65 75H35C29 75 25 70 25 65V35Z" stroke="#E0E0E0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </view>
        <view class="empty-text">
          {{ emptyText }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'MyCards',
    data() {
      return {
        activeTab: 'unused',
        emptyText: '暂无未使用卡券~'
      }
    },
    methods: {
      // 返回上一页
      goBack() {
        uni.navigateBack();
      },
      // 切换选项卡
      switchTab(tab) {
        this.activeTab = tab;
        // 更新空状态文本
        if (tab === 'unused') {
          this.emptyText = '暂无未使用卡券~';
        } else if (tab === 'used') {
          this.emptyText = '暂无已使用卡券~';
        } else if (tab === 'expired') {
          this.emptyText = '暂无已过期卡券~';
        }
      }
    }
  }
</script>

<style scoped>
  .cards-container {
    height: 100vh;
    background-color: #FFFFFF;
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
    width: 24px;
  }

  /* 选项卡 */
  .tabs {
    display: flex;
    height: 48px;
    background-color: #FFFFFF;
    border-bottom: 1px solid #F0F0F0;
  }

  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666666;
    position: relative;
  }

  .tab-item.active {
    color: #E64340;
  }

  .tab-item.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 40%;
    width: 20%;
    height: 2px;
    background-color: #E64340;
  }

  /* 内容区域 */
  .content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
  }

  /* 空状态 */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .empty-icon {
    margin-bottom: 16px;
  }

  .empty-text {
    font-size: 14px;
    color: #999999;
  }
</style>