<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <text class="header-title">项目列表</text>
    </view>

    <!-- 项目分类 -->
    <view class="category-section">
      <scroll-view scroll-x class="category-scroll">
        <view 
          v-for="category in categories" 
          :key="category.categoryId"
          class="category-item"
          :class="{ active: selectedCategoryId === category.categoryId }"
          @click="selectCategory(category.categoryId)"
        >
          {{ category.categoryName }}
        </view>
      </scroll-view>
    </view>

    <!-- 热门项目 -->
    <view class="popular-section">
      <view class="section-header">
        <text class="section-title">热门项目</text>
      </view>
      
      <view class="project-list">
        <view v-for="project in popularProjects" :key="project.projectId" class="project-item">
          <image :src="project.coverImage || '/static/icons/project.svg'" mode="aspectFill" class="project-image"></image>
          <view class="project-info">
            <text class="project-name">{{ project.projectName }}</text>
            <text class="project-price">¥{{ project.price }}</text>
            <text class="project-desc">{{ project.description }}</text>
          </view>
          <button class="book-button" @click="bookProject(project.projectId)">预约</button>
        </view>
      </view>
    </view>

    <!-- 个性化推荐 -->
    <view class="recommend-section">
      <view class="section-header">
        <text class="section-title">为您推荐</text>
      </view>
      
      <view class="project-grid">
        <view v-for="project in recommendedProjects" :key="project.projectId" class="project-grid-item">
          <image :src="project.coverImage || '/static/icons/project.svg'" mode="aspectFill" class="project-grid-image"></image>
          <view class="project-grid-info">
            <text class="project-grid-name">{{ project.projectName }}</text>
            <text class="project-grid-price">¥{{ project.price }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getProjectCategories, getPopularProjects, getRecommendedProjects } from '../../utils/api';

export default {
  name: 'ProjectList',
  setup() {
    // 数据
    const categories = ref([]);
    const selectedCategoryId = ref('all');
    const popularProjects = ref([]);
    const recommendedProjects = ref([]);
    const loading = ref(false);

    // 获取项目分类
    const loadCategories = async () => {
      try {
        const res = await getProjectCategories();
        if (res.code === 0 && res.data) {
          categories.value = [{ categoryId: 'all', categoryName: '全部' }, ...res.data];
        }
      } catch (error) {
        console.error('获取项目分类失败:', error);
        uni.showToast({
          title: '获取项目分类失败',
          icon: 'none'
        });
      }
    };

    // 获取热门项目
    const loadPopularProjects = async (categoryId = 'all') => {
      try {
        loading.value = true;
        const res = await getPopularProjects({ categoryId });
        if (res.code === 0 && res.data) {
          popularProjects.value = res.data;
        }
      } catch (error) {
        console.error('获取热门项目失败:', error);
        uni.showToast({
          title: '获取热门项目失败',
          icon: 'none'
        });
      } finally {
        loading.value = false;
      }
    };

    // 获取个性化推荐项目
    const loadRecommendedProjects = async () => {
      try {
        const res = await getRecommendedProjects();
        if (res.code === 0 && res.data) {
          recommendedProjects.value = res.data;
        }
      } catch (error) {
        console.error('获取推荐项目失败:', error);
        uni.showToast({
          title: '获取推荐项目失败',
          icon: 'none'
        });
      }
    };

    // 选择分类
    const selectCategory = (categoryId) => {
      selectedCategoryId.value = categoryId;
      loadPopularProjects(categoryId);
    };

    // 预约项目
    const bookProject = (projectId) => {
      uni.navigateTo({
        url: `/pages/project/detail?id=${projectId}`
      });
    };

    // 页面加载时获取数据
    onMounted(() => {
      loadCategories();
      loadPopularProjects();
      loadRecommendedProjects();
    });

    return {
      categories,
      selectedCategoryId,
      popularProjects,
      recommendedProjects,
      loading,
      selectCategory,
      bookProject
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 750rpx;
  margin: 0 auto;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
  background-color: #FF5000;
  color: #FFFFFF;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.category-section {
  background-color: #FFFFFF;
  padding: 20rpx 0;
  margin-bottom: 20rpx;
}

.category-scroll {
  white-space: nowrap;
  padding: 0 20rpx;
}

.category-item {
  display: inline-block;
  padding: 10rpx 30rpx;
  margin-right: 20rpx;
  font-size: 28rpx;
  color: #666666;
  background-color: #f0f0f0;
  border-radius: 30rpx;
}

.category-item.active {
  color: #FFFFFF;
  background-color: #FF5000;
}

.section-header {
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.project-list {
  background-color: #FFFFFF;
  padding: 0 30rpx 30rpx;
  margin-bottom: 20rpx;
}

.project-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  align-items: center;
}

.project-item:last-child {
  border-bottom: none;
}

.project-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 16rpx;
  margin-right: 20rpx;
}

.project-info {
  flex: 1;
}

.project-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-price {
  font-size: 36rpx;
  color: #FF5000;
  margin: 10rpx 0;
  display: block;
}

.project-desc {
  font-size: 28rpx;
  color: #999999;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-button {
  width: 120rpx;
  height: 60rpx;
  line-height: 60rpx;
  background-color: #FF5000;
  color: #FFFFFF;
  border-radius: 30rpx;
  font-size: 28rpx;
  padding: 0;
}

.recommend-section {
  background-color: #FFFFFF;
}

.project-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  padding: 0 30rpx 30rpx;
}

.project-grid-item {
  background-color: #f8f8f8;
  border-radius: 16rpx;
  overflow: hidden;
}

.project-grid-image {
  width: 100%;
  height: 240rpx;
}

.project-grid-info {
  padding: 20rpx;
}

.project-grid-name {
  font-size: 28rpx;
  color: #333333;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-grid-price {
  font-size: 32rpx;
  color: #FF5000;
  margin-top: 10rpx;
  display: block;
}
</style>
