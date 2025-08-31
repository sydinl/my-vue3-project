<template>
  <view class="team-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-left" @click="navigateBack">
        <text class="back-icon">←</text>
      </view>
      <view class="nav-title">我的团队</view>
      <view class="nav-right"></view>
    </view>

    <!-- 选项卡区域 -->
    <view class="tabs">
      <view class="tab-item active" @click="switchTab('first')">
        <text>一级分销名称(0)</text>
      </view>
    </view>

    <!-- 团队成员列表区域 -->
    <view class="team-list">
      <!-- 空状态显示 -->
      <view class="empty-state" v-if="!hasMembers">
        <view class="empty-icon">
          <text class="user-icon">👤</text>
        </view>
        <text class="empty-text">暂无相关成员</text>
      </view>

      <!-- 团队成员列表 (当前为空) -->
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 'first',
      hasMembers: false,
      teamMembers: []
    }
  },
  onLoad() {
    // 这里可以添加获取团队成员数据的逻辑
    this.fetchTeamMembers();
  },
  methods: {
    // 返回上一页
    navigateBack() {
      uni.navigateBack();
    },
    
    // 切换选项卡
    switchTab(tab) {
      this.currentTab = tab;
      // 根据不同选项卡获取不同的数据
      this.fetchTeamMembers();
    },
    
    // 获取团队成员数据
    fetchTeamMembers() {
      // 实际项目中这里应该调用接口获取数据
      // 模拟数据加载
      setTimeout(() => {
        // 目前设置为暂无数据状态
        this.hasMembers = false;
        this.teamMembers = [];
      }, 300);
    }
  }
}
</script>

<style lang="scss">
.team-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  
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
    }
  }
  
  .tabs {
    display: flex;
    background-color: #ffffff;
    margin-top: 44px;
    padding: 0 16px;
    
    .tab-item {
      padding: 12px 0;
      margin-right: 24px;
      position: relative;
      
      text {
        font-size: 14px;
        color: #666666;
      }
      
      &.active {
        text {
          color: #ff4e00;
          font-weight: 500;
        }
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #ff4e00;
        }
      }
    }
  }
  
  .team-list {
    padding: 20px 16px;
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 0;
      
      .empty-icon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
        
        .user-icon {
          font-size: 40px;
        }
      }
      
      .empty-text {
        font-size: 14px;
        color: #999999;
      }
    }
  }
}
</style>