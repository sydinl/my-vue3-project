<template>
  <view class="container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部搜索栏 -->
    <view class="search-header" :style="{ marginTop: statusBarHeight + 'px' }">
      <view class="search-input-container">
        <uni-icons type="search" size="16" color="#999"></uni-icons>
        <input 
          v-model="searchKeyword" 
          type="text" 
          class="search-input" 
          placeholder="搜索项目名称..." 
          placeholder-style="color: #999;" 
          @confirm="performSearch"
        />
        <text v-if="searchKeyword" class="clear-btn" @click="clearSearch">×</text>
      </view>
      <text class="cancel-btn" @click="cancelSearch">取消</text>
    </view>

    <!-- 搜索结果 -->
    <view class="search-results" v-if="showResults">
      <view class="results-header">
        <text>搜索结果 ({{ filteredProjects.length }})</text>
      </view>
      
      <!-- 搜索结果列表 -->
      <view class="projects-list">
        <view 
          class="project-card" 
          v-for="project in filteredProjects" 
          :key="project.id"
        >
          <image :src="project.img" mode="aspectFill" class="project-image"></image>
          <view class="project-info">
            <text class="project-name">{{ project.name }}</text>
            <text class="project-desc">{{ project.desc }}</text>
            <view class="project-footer">
              <text class="project-price">¥{{ project.price }}</text>
              <button class="cart-button" @click="addToCart(project)">
                <image src="/static/icons/cart1.png" mode="aspectFit" class="cart-icon-button"></image>
              </button>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 无结果提示 -->
      <view class="no-results" v-if="filteredProjects.length === 0">
        <image src="../../static/icons/no-result.png" mode="aspectFit" class="no-result-icon"></image>
        <text class="no-result-text">暂无相关项目</text>
        <text class="no-result-hint">换个关键词试试吧</text>
      </view>
    </view>
    
    <!-- 搜索历史 -->
    <view class="search-history" v-else-if="!showResults && searchHistory.length > 0">
      <view class="history-header">
        <text>搜索历史</text>
        <uni-icons type="trash" size="18" color="#999" @click="clearHistory"></uni-icons>
      </view>
      <view class="history-tags">
        <text 
          v-for="(item, index) in searchHistory" 
          :key="index" 
          class="history-tag"
          @click="searchByHistory(item)"
        >
          {{ item }}
        </text>
      </view>
    </view>
    
    <!-- 热门搜索 -->
    <view class="hot-search" v-else-if="!showResults">
      <view class="hot-header">
        <text>热门搜索</text>
      </view>
      <view class="hot-tags">
        <text 
          v-for="(item, index) in hotSearches" 
          :key="index" 
          class="hot-tag"
          @click="searchByHot(item)"
        >
          {{ index + 1 }}. {{ item }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

// 导入项目图片
import img1 from '../../static/items/sheng.jpg';
import img2 from '../../static/items/tang.jpg';
import img3 from '../../static/items/shui.jpg';
import img4 from '../../static/items/chan.jpg';
import img5 from '../../static/items/yue.jpg';
import img6 from '../../static/items/yi.jpg';
import img7 from '../../static/items/yun.jpg';
import img8 from '../../static/items/chayi.jpg';

export default {
  name: 'SearchPage',
  setup() {
    // 状态栏高度
    const statusBarHeight = ref(0);
    // 安全区域信息
    const safeAreaInsets = ref({ top: 0, bottom: 0, left: 0, right: 0 });
    
    // 获取系统信息
    const getSystemInfo = () => {
      uni.getSystemInfo({
        success: (res) => {
          // 获取状态栏高度
          statusBarHeight.value = res.statusBarHeight || 0;
          
          // 获取安全区域信息（用于刘海屏等特殊屏幕）
          if (res.safeAreaInsets) {
            safeAreaInsets.value = res.safeAreaInsets;
            // 如果安全区域顶部大于状态栏高度，使用安全区域顶部
            if (res.safeAreaInsets.top > res.statusBarHeight) {
              statusBarHeight.value = res.safeAreaInsets.top;
            }
          }
          
          // 对于刘海屏设备，额外增加一些高度
          if (res.model && (res.model.includes('iPhone X') || res.model.includes('iPhone 11') || res.model.includes('iPhone 12') || res.model.includes('iPhone 13') || res.model.includes('iPhone 14') || res.model.includes('iPhone 15'))) {
            statusBarHeight.value = Math.max(statusBarHeight.value, 44); // iPhone X系列最小44px
          }
          
          // 确保最小高度
          statusBarHeight.value = Math.max(statusBarHeight.value, 20);
        }
      });
    };
    
    // 搜索关键词
    const searchKeyword = ref('');
    // 是否显示搜索结果
    const showResults = ref(false);
    // 搜索历史
    const searchHistory = ref([]);
    
    // 从本地存储加载搜索历史
    const loadSearchHistory = () => {
      try {
        const history = uni.getStorageSync('searchHistory');
        if (history && Array.isArray(history)) {
          searchHistory.value = history;
        }
      } catch (e) {
        console.error('Failed to load search history:', e);
      }
    };
    
    // 保存搜索历史到本地存储
    const saveSearchHistory = () => {
      try {
        uni.setStorageSync('searchHistory', searchHistory.value);
      } catch (e) {
        console.error('Failed to save search history:', e);
      }
    };
    // 热门搜索词
    const hotSearches = ref([
      '经典足道', '皇室SPA', '泰式按摩', '精油开背', '肩颈护理'
    ]);
    
    // 项目数据
    const projects = ref([
      {
        id: 1,
        name: '经典足道',
        desc: '60分钟足部按摩，放松身心，缓解疲劳',
        price: 128,
        category: 'foot',
        img: img1
      },
      {
        id: 2,
        name: '皇室SPA',
        desc: '90分钟全身精油按摩，深层放松，焕发活力',
        price: 268,
        category: 'spa',
        img: img2
      },
      {
        id: 3,
        name: '泰式按摩',
        desc: '75分钟传统泰式手法，舒筋活络，调理身体',
        price: 198,
        category: 'spa',
        img: img3
      },
      {
        id: 4,
        name: '精油开背',
        desc: '45分钟背部按摩，缓解肩颈疲劳，改善睡眠',
        price: 158,
        category: 'small',
        img: img4
      },
      {
        id: 5,
        name: '肩颈护理',
        desc: '30分钟肩颈按摩，缓解久坐不适，放松肌肉',
        price: 88,
        category: 'small',
        img: img5
      },
      {
        id: 6,
        name: '头部按摩',
        desc: '30分钟头部按摩，缓解头痛，改善睡眠',
        price: 68,
        category: 'small',
        img: img6
      },
      {
        id: 7,
        name: '全身按摩',
        desc: '80分钟全身按摩，舒缓压力，放松身心',
        price: 228,
        category: 'spa',
        img: img7
      },
      {
        id: 8,
        name: '足疗套餐',
        desc: '包含足部按摩和修脚服务，全面呵护足部健康',
        price: 168,
        category: 'foot',
        img: img8
      }
    ]);
    
    // 过滤后的项目列表
    const filteredProjects = computed(() => {
      if (!searchKeyword.value) return [];
      
      return projects.value.filter(project => 
        project.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        project.desc.toLowerCase().includes(searchKeyword.value.toLowerCase())
      );
    });
    
    // 执行搜索
    const performSearch = () => {
      if (searchKeyword.value.trim()) {
        showResults.value = true;
        
        // 添加到搜索历史，避免重复
        if (!searchHistory.value.includes(searchKeyword.value)) {
          searchHistory.value.unshift(searchKeyword.value);
          // 最多保存10条历史记录
          if (searchHistory.value.length > 10) {
            searchHistory.value.pop();
          }
          // 保存到本地存储
          saveSearchHistory();
        }
      }
    };
    
    // 清空搜索
    const clearSearch = () => {
      searchKeyword.value = '';
      showResults.value = false;
    };
    
    // 取消搜索 - 返回首页
    const cancelSearch = () => {
      uni.switchTab({ url: '/pages/home/home' });
    };
    
    // 清空搜索历史
    const clearHistory = () => {
      searchHistory.value = [];
      try {
        uni.removeStorageSync('searchHistory');
      } catch (e) {
        console.error('Failed to clear search history:', e);
      }
    };
    
    // 点击历史记录搜索
    const searchByHistory = (keyword) => {
      searchKeyword.value = keyword;
      performSearch();
    };
    
    // 点击热门搜索
    const searchByHot = (keyword) => {
      searchKeyword.value = keyword.replace(/^\d+\.\s/, '');
      performSearch();
    };
    
    // 添加到购物车
    const addToCart = (project) => {
      // 这里可以实现添加到购物车的逻辑
      uni.showToast({
        title: '已添加到购物车',
        icon: 'success',
        duration: 2000
      });
    };
    
    // 页面加载时自动聚焦搜索框
    onMounted(() => {
      getSystemInfo(); // 获取系统信息
      // 加载搜索历史
      loadSearchHistory();
      
      setTimeout(() => {
        // 自动聚焦，需要组件挂载后
        const input = document.querySelector('.search-input');
        if (input) {
          input.focus();
        }
      }, 100);
    });
    
    return {
      statusBarHeight,
      searchKeyword,
      showResults,
      searchHistory,
      hotSearches,
      projects,
      filteredProjects,
      performSearch,
      clearSearch,
      cancelSearch,
      clearHistory,
      searchByHistory,
      searchByHot,
      addToCart
    };
  }
};
</script>

<style scoped>
.container {
  padding-bottom: 20rpx;
}

.status-bar {
  background-color: #fff;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  /* 支持安全区域 */
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

.search-header {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
  border-bottom: 2rpx solid #f0f0f0;
}

.search-input-container {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 10rpx 20rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  margin-right: 20rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  padding: 0 10rpx;
  color: #333;
}

.clear-btn {
  font-size: 36rpx;
  color: #999;
  padding: 0 10rpx;
}

.cancel-btn {
  font-size: 30rpx;
  color: #333;
}

.search-results {
  padding: 20rpx;
  background-color: #fff;
}

.results-header {
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: #666;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.project-card {
  display: flex;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.project-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
}

.project-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.project-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.project-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rpx;
}

.project-price {
  font-size: 32rpx;
  color: #4CAF50;
  font-weight: bold;
}

.cart-button {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  padding: 0;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.no-result-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
}

.no-result-text {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.no-result-hint {
  font-size: 28rpx;
  color: #999;
}

.search-history {
  padding: 20rpx;
  background-color: #fff;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: #666;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.history-tag {
  padding: 12rpx 24rpx;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: #666;
}

.hot-search {
  padding: 20rpx;
  background-color: #fff;
}

.hot-header {
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: #666;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.hot-tag {
  padding: 12rpx 24rpx;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: #666;
}
</style>