<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-left" @click="backToHome">
        <uni-icons type="left" size="24"></uni-icons>
      </view>
      <text class="header-title">项目列表</text>
      <view class="header-right"></view>
    </view>

    <!-- 分类导航 -->
    <scroll-view scroll-x="true" class="category-scroll">
      <view class="category-item" 
        :class="{ active: currentCategory === category.id }"
        v-for="category in categories" 
        :key="category.id"
        @click="switchCategory(category.id)"
      >
        <text>{{ category.name }}</text>
        <view class="category-active-line" v-if="currentCategory === category.id"></view>
      </view>
    </scroll-view>

    <!-- 项目列表 -->
    <view class="projects-list">
      <view class="project-card" 
        v-for="(project, index) in filteredProjects" 
        :key="project.id"
        :animation-delay="index * 0.1 + 's'"
      >
        <image :src="project.img" mode="aspectFill" class="project-image"></image>
        <view class="project-info">
          <text class="project-name">{{ project.name }}</text>
          <text class="project-desc">{{ project.desc }}</text>
          <view class="project-footer">
            <text class="project-price">¥{{ project.price }}</text>
            <button class="cart-button" @click="addToCart(project)">
              <uni-icons type="cart" size="16" color="#FFFFFF"></uni-icons>
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, computed } from 'vue';

// 直接导入图片
import img1 from '../../static/items/wxpic_202508220008253.jpg';
import img2 from '../../static/items/wxpic_202508220008254.jpg';
import img3 from '../../static/items/wxpic_20250822000826.jpg';
import img4 from '../../static/items/wxpic_202508220008261.jpg';
import img5 from '../../static/items/wxpic_202508220008262.jpg';
import img6 from '../../static/items/wxpic_202508220008263.jpg';
import img7 from '../../static/items/wxpic_202508220008264.jpg';
import img8 from '../../static/items/wxpic_202508220008265.jpg';

export default {
  name: 'ProjectsPage',
  setup() {
    // 分类数据
    const categories = ref([
      { id: 'all', name: '全部' },
      { id: 'spa', name: 'SPA' },
      { id: 'foot', name: '足道' },
      { id: 'small', name: '小项' },
      { id: 'other', name: '其他' }
    ]);

    // 当前选中的分类
    const currentCategory = ref('all');

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
        name: '肩颈护理',
        desc: '45分钟肩颈舒缓按摩，缓解肩颈僵硬和疼痛',
        price: 158,
        category: 'small',
        img: img4
      },
      {
        id: 5,
        name: '头部按摩',
        desc: '30分钟头部舒缓按摩，缓解头痛和压力',
        price: 88,
        category: 'small',
        img: img5
      },
      {
        id: 6,
        name: '背部精油按摩',
        desc: '60分钟背部精油按摩，缓解背部疲劳和紧张',
        price: 188,
        category: 'spa',
        img: img6
      },
      {
        id: 7,
        name: '足疗套餐',
        desc: '90分钟足部护理套餐，包含泡脚、按摩和护理',
        price: 168,
        category: 'foot',
        img: img7
      },
      {
        id: 8,
        name: '全身推拿',
        desc: '90分钟传统中医推拿，调理气血，舒缓疲劳',
        price: 228,
        category: 'other',
        img: img8
      }
    ]);

    // 计算筛选后的项目
    const filteredProjects = computed(() => {
      if (currentCategory.value === 'all') {
        return projects.value;
      }
      return projects.value.filter(project => project.category === currentCategory.value);
    });

    // 切换分类
    const switchCategory = (categoryId) => {
      currentCategory.value = categoryId;
    };

    // 添加到购物车
    const addToCart = (project) => {
      uni.showToast({ title: `${project.name}已加入购物车`, icon: 'success' });
    };

    // 返回首页
    const backToHome = () => {
      uni.navigateBack();
    };

    return {
      categories,
      currentCategory,
      projects,
      filteredProjects,
      switchCategory,
      addToCart,
      backToHome
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 750rpx;
  margin: 0 auto;
  background-color: #f5f5f5;
  padding-bottom: 100rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.header-left,
.header-right {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.category-scroll {
  background-color: #fff;
  padding: 20rpx 0;
  white-space: nowrap;
  position: sticky;
  top: 80rpx;
  z-index: 998;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.category-item {
  display: inline-block;
  padding: 0 30rpx;
  text-align: center;
  position: relative;
}

.category-item text {
  font-size: 28rpx;
  color: #666;
}

.category-item.active text {
  color: #FF5000;
  font-weight: bold;
}

.category-active-line {
  position: absolute;
  bottom: -20rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #FF5000;
  border-radius: 2rpx;
}

.projects-list {
  padding: 20rpx;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.project-card {
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  animation: slide-up 0.5s ease-out;
}

.project-card:hover {
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.project-image {
  width: 100%;
  height: 240rpx;
}

.project-info {
  padding: 20rpx;
}

.project-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-desc {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
}

.project-price {
  font-size: 28rpx;
  font-weight: bold;
  color: #FF5000;
}

.cart-button {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background-color: #FF5000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(50rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

[animation-delay] {
  animation-delay: var(--animation-delay);
}
</style>