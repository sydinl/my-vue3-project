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
      <text class="category-text">累计佣金</text>
    </view>

    <!-- 排行榜列表 -->
    <view class="ranking-list">
      <view class="ranking-header-row">
        <text class="rank-title">排名</text>
        <text class="nickname-title">昵称</text>
        <text class="count-title">累计佣金(元)</text>
      </view>

      <view v-if="loading" class="empty-tip">加载中...</view>
      <view v-else-if="rankingData.length === 0" class="empty-tip">暂无排行数据</view>
      <view v-else class="ranking-item" v-for="(item, index) in rankingData" :key="item.userId || index">
        <view class="rank-number">
          <text v-if="item.rank === 1" class="rank-first">1</text>
          <text v-else-if="item.rank === 2" class="rank-second">2</text>
          <text v-else-if="item.rank === 3" class="rank-third">3</text>
          <text v-else class="rank-other">{{ item.rank }}</text>
        </view>
        <view class="user-info">
          <image :src="item.avatar || '/static/icons/user.png'" mode="aspectFit" class="user-avatar"></image>
          <text class="user-nickname">{{ item.fullName || item.username || '用户' }}</text>
        </view>
        <view class="promote-count">
          <text class="count-text">¥{{ formatMoney(item.totalCommission) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '@/utils/api.js';

function formatMoney(v) {
  if (v == null || isNaN(v)) return '0.00';
  return Number(v).toFixed(2);
}

export default {
  name: 'DistributionRanking',
  setup() {
    const statusBarHeight = ref(20);
    const rankingData = ref([]);
    const loading = ref(false);

    const getSystemInfo = () => {
      uni.getSystemInfo({
        success: (res) => {
          statusBarHeight.value = Math.max(res.statusBarHeight || 20, 20);
        }
      });
    };

    const fetchRankingData = async () => {
      loading.value = true;
      try {
        const res = await api.distribution.getRanking({ limit: 20 });
        if (res && res.code === 200 && res.data) {
          rankingData.value = res.data;
        } else {
          rankingData.value = [];
        }
      } catch (e) {
        rankingData.value = [];
      } finally {
        loading.value = false;
      }
    };

    const navigateBack = () => uni.navigateBack();

    onMounted(() => {
      getSystemInfo();
      fetchRankingData();
    });

    return {
      statusBarHeight,
      rankingData,
      loading,
      navigateBack,
      formatMoney
    };
  }
};
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

    .empty-tip {
      text-align: center;
      padding: 40px;
      font-size: 14px;
      color: #999;
    }
    
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