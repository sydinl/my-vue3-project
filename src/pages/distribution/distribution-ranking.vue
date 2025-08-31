<template>
  <view class="ranking-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-left" @click="navigateBack">
        <text class="back-icon">←</text>
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
          <image src="/static/icons/trophy.svg" mode="aspectFit" class="trophy-icon"></image>
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
export default {
  data() {
    return {
      // 排行榜数据
      rankingData: [
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
      ]
    }
  },
  onLoad() {
    // 这里可以添加获取排行榜数据的逻辑
    this.fetchRankingData();
  },
  methods: {
    // 返回上一页
    navigateBack() {
      uni.navigateBack();
    },
    
    // 获取排行榜数据
    fetchRankingData() {
      // 实际项目中这里应该调用接口获取排行榜数据
      // 模拟数据加载
      setTimeout(() => {
        // 数据已经在data中定义
        console.log('排行榜数据已加载');
      }, 300);
    }
  }
}
</script>

<style lang="scss">
.ranking-container {
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