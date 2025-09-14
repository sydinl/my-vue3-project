<template>
  <view class="ranking-container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ marginTop: statusBarHeight + 'px' }">
      <view class="nav-left" @click="navigateBack">
        <uni-icons type="left" size="24" class="back-icon"></uni-icons>
      </view>
      <view class="nav-title">分销排行</view>
      <view class="nav-right">
        <text class="more-icon">...</text>
      </view>
    </view>

    <!-- 排行榜头部区域 -->
    <view class="ranking-header">
      <view class="header-content">
        <view class="header-left">
          <text class="ranking-title">分销排行榜</text>
          <text class="update-time">更新时间2025-8-26</text>
        </view>
        <view class="header-right">
          <image src="/static/icons/trophy.png" mode="aspectFit" class="trophy-icon"></image>
        </view>
      </view>
    </view>

    <!-- 排行榜类别 -->
    <view class="ranking-category">
      <text class="category-text">推广人数</text>
    </view>

    <!-- 排行榜列表 -->
    <view class="ranking-list">
      <!-- 排名标题 -->
      <view class="ranking-header-row">
        <text class="rank-title">排名</text>
        <text class="nickname-title">昵称</text>
        <text class="count-title">推广人数(人)</text>
      </view>

      <!-- 排行榜数据 -->
      <view class="ranking-item" v-for="(item, index) in rankingData" :key="index">
        <!-- 排名 -->
        <view class="rank-number">
          <text v-if="index === 0" class="rank-first">1</text>
          <text v-else-if="index === 1" class="rank-second">2</text>
          <text v-else-if="index === 2" class="rank-third">3</text>
          <text v-else class="rank-other">{{ index + 1 }}</text>
        </view>
        
        <!-- 头像和昵称 -->
        <view class="user-info">
          <image :src="item.avatar" mode="aspectFit" class="user-avatar"></image>
          <text class="user-nickname">{{ item.nickname }}</text>
        </view>
        
        <!-- 推广人数 -->
        <view class="promote-count">
          <text class="count-text">{{ item.count }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'DistributionRanking',
  setup() {
    // 状态栏高度
    const statusBarHeight = ref(0);
    const safeAreaInsets = ref({ top: 0, bottom: 0, left: 0, right: 0 });
    
    // 获取系统信息
    const getSystemInfo = () => {
      uni.getSystemInfo({
        success: (res) => {
          statusBarHeight.value = res.statusBarHeight || 0;
          if (res.safeAreaInsets) {
            safeAreaInsets.value = res.safeAreaInsets;
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
    
    // 排行榜数据
    const rankingData = ref([
      {
        nickname: 'K',
        avatar: '/static/icons/user.svg',
        count: 156
      },
      {
        nickname: '7777777',
        avatar: '/static/icons/user.svg',
        count: 94
      },
      {
        nickname: 'Amy🍓',
        avatar: '/static/icons/user.svg',
        count: 27
      },
      {
        nickname: 'AAAAA',
        avatar: '/static/icons/user.svg',
        count: 26
      },
      {
        nickname: 'S',
        avatar: '/static/icons/user.svg',
        count: 16
      },
      {
        nickname: '用户_201487',
        avatar: '/static/icons/user.svg',
        count: 13
      },
      {
        nickname: 'AI丶',
        avatar: '/static/icons/user.svg',
        count: 12
      },
      {
        nickname: '缘',
        avatar: '/static/icons/user.svg',
        count: 10
      }
    ]);
    
    // 返回上一页
    const navigateBack = () => {
      uni.navigateBack();
    };
    
    // 获取排行榜数据
    const fetchRankingData = () => {
      // 实际项目中这里应该调用接口获取排行榜数据
      // 模拟数据加载
      setTimeout(() => {
        // 数据已经在data中定义
        console.log('排行榜数据已加载');
      }, 300);
    };
    
    // 页面加载时获取系统信息
    onMounted(() => {
      getSystemInfo();
      fetchRankingData();
    });
    
    return {
      statusBarHeight,
      rankingData,
      navigateBack,
      fetchRankingData
    };
  }
}
</script>

<style lang="scss">
.ranking-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #F0F8F0 0%, #E8F5E8 100%);
  
  .status-bar {
    background-color: #4CAF50;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
  }
  
  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
    padding: 0 16px;
    position: relative;
    z-index: 9998;
    box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
    
    .nav-left {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .back-icon {
        font-size: 18px;
        color: #FFFFFF;
      }
    }
    
    .nav-title {
      flex: 1;
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      color: #FFFFFF;
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
  
  .ranking-header {
    background: linear-gradient(to bottom, #ff4e00, #ff7a00);
    padding: 20px 16px;
    margin-top: 44px;
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header-left {
      flex: 1;
      
      .ranking-title {
        font-size: 28px;
        font-weight: bold;
        color: #ffffff;
        display: block;
        margin-bottom: 8px;
      }
      
      .update-time {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
      }
    }
    
    .header-right {
      .trophy-icon {
        width: 60px;
        height: 60px;
      }
    }
  }
  
  .ranking-category {
    padding: 16px;
    background-color: #ffffff;
    
    .category-text {
      font-size: 16px;
      color: #333333;
    }
  }
  
  .ranking-list {
    background-color: #ffffff;
    
    .ranking-header-row {
      display: flex;
      padding: 12px 16px;
      background-color: #f5f5f5;
      border-bottom: 1px solid #eeeeee;
      
      .rank-title {
        width: 80px;
        font-size: 14px;
        color: #999999;
      }
      
      .nickname-title {
        flex: 1;
        font-size: 14px;
        color: #999999;
      }
      
      .count-title {
        width: 120px;
        text-align: right;
        font-size: 14px;
        color: #999999;
      }
    }
    
    .ranking-item {
      display: flex;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #eeeeee;
      
      .rank-number {
        width: 80px;
        display: flex;
        align-items: center;
        
        .rank-first {
          color: #ffc107;
          font-weight: bold;
          font-size: 16px;
        }
        
        .rank-second {
          color: #ced4da;
          font-weight: bold;
          font-size: 16px;
        }
        
        .rank-third {
          color: #cd7f32;
          font-weight: bold;
          font-size: 16px;
        }
        
        .rank-other {
          color: #666666;
          font-size: 16px;
        }
      }
      
      .user-info {
        flex: 1;
        display: flex;
        align-items: center;
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 12px;
          background-color: #f5f5f5;
        }
        
        .user-nickname {
          font-size: 16px;
          color: #333333;
        }
      }
      
      .promote-count {
        width: 120px;
        text-align: right;
        
        .count-text {
          font-size: 16px;
          color: #ff4e00;
          font-weight: bold;
        }
      }
    }
  }
}
</style>