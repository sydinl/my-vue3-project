<template>
  <view class="team-container">
    <view class="nav-bar">
      <view class="nav-left" @click="navigateBack">
        <uni-icons type="left" size="24" class="back-icon"></uni-icons>
      </view>
      <view class="nav-title">我的团队</view>
      <view class="nav-right"></view>
    </view>

    <view class="tabs">
      <view class="tab-item" :class="{ active: currentTab === 'first' }" @click="switchTab('first')">
        <text>一级 ({{ level1.length }})</text>
      </view>
      <view class="tab-item" :class="{ active: currentTab === 'second' }" @click="switchTab('second')">
        <text>二级 ({{ level2.length }})</text>
      </view>
    </view>

    <view class="team-list">
      <view v-if="loading" class="empty-state"><text class="empty-text">加载中...</text></view>
      <view v-else-if="displayList.length === 0" class="empty-state">
        <view class="empty-icon"><text class="user-icon">👤</text></view>
        <text class="empty-text">暂无相关成员</text>
      </view>
      <view v-else class="member-cards">
        <view v-for="m in displayList" :key="m.id" class="member-card">
          <image v-if="m.avatar" :src="m.avatar" class="member-avatar" mode="aspectFit"></image>
          <view v-else class="member-avatar placeholder"><text>👤</text></view>
          <view class="member-info">
            <text class="member-name">{{ m.fullName || m.username || '用户' }}</text>
            <text class="member-phone" v-if="m.phone">{{ m.phone }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import api from '@/utils/api.js';

export default {
  name: 'MyTeam',
  setup() {
    const loading = ref(false);
    const currentTab = ref('first');
    const level1 = ref([]);
    const level2 = ref([]);

    const displayList = computed(() => currentTab.value === 'first' ? level1.value : level2.value);

    const fetchTeamMembers = async () => {
      loading.value = true;
      try {
        const res = await api.distribution.getTeam();
        if (res && res.code === 200 && res.data) {
          level1.value = res.data.level1 || [];
          level2.value = res.data.level2 || [];
        } else {
          level1.value = [];
          level2.value = [];
        }
      } catch (e) {
        level1.value = [];
        level2.value = [];
      } finally {
        loading.value = false;
      }
    };

    const navigateBack = () => uni.navigateBack();
    const switchTab = (tab) => { currentTab.value = tab; };

    onMounted(() => fetchTeamMembers());

    return { loading, currentTab, level1, level2, displayList, navigateBack, switchTab };
  }
};
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
    .member-cards { display: flex; flex-direction: column; gap: 12px; }
    .member-card { display: flex; align-items: center; padding: 12px; background: #fff; border-radius: 8px; }
    .member-avatar { width: 44px; height: 44px; border-radius: 50%; margin-right: 12px; }
    .member-avatar.placeholder { background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 22px; }
    .member-info { display: flex; flex-direction: column; }
    .member-name { font-size: 15px; color: #333; }
    .member-phone { font-size: 12px; color: #999; margin-top: 4px; }
  }
}
</style>