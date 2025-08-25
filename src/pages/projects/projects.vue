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
            <button class="cart-button" @click="openBottomSheet(project)">
              <image src="/static/icons/cart1.svg" mode="aspectFit" class="cart-icon-button"></image>
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部弹出框 -->
    <view class="bottom-sheet" v-if="showBottomSheet">
      <view class="sheet-overlay" @click="closeBottomSheet"></view>
      <view class="sheet-content">
        <view class="sheet-header">
          <image :src="selectedProject.img" mode="aspectFill" class="selected-image"></image>
          <view class="selected-info">
            <text class="selected-name">{{ selectedProject.name }}</text>
            <text class="selected-price">¥{{ selectedProject.price }}</text>
          </view>
          <view class="sheet-close" @click="closeBottomSheet">
            <image src="/static/icons/close.svg" mode="aspectFit" class="close-icon"></image>
          </view>
        </view>
        
        <view class="sheet-body">
          <!-- 时长选择 -->
          <view class="option-section">
            <text class="option-title">时长</text>
            <view class="duration-options">
              <view class="duration-option" 
                :class="{ active: selectedDuration === duration }"
                v-for="duration in durations" 
                :key="duration"
                @click="selectDuration(duration)"
              >
                <text>{{ duration }}</text>
              </view>
            </view>
          </view>
          
          <!-- 数量选择 -->
          <view class="option-section">
            <text class="option-title">数量</text>
            <view class="quantity-selector">
              <button class="quantity-btn" @click="decreaseQuantity">-</button>
              <text class="quantity">{{ quantity }}</text>
              <button class="quantity-btn" @click="increaseQuantity">+</button>
            </view>
          </view>
          

        </view>
        
        <!-- 底部按钮 -->
        <view class="sheet-footer">
          <button class="add-to-cart-btn" @click="confirmAddToCart">加入购物车</button>
          <button class="buy-now-btn" @click="buyNow">立即购买</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, computed } from 'vue';

// 导入公共的添加购物车功能
import { useAddToCart } from '../../utils/cart-utils';

// 直接导入图片
import tangzudao from '../../static/items/wxpic_202508220008253.jpg';
import yuespa from '../../static/items/wxpic_202508220008254.jpg';
import mengspa from '../../static/items/wxpic_20250822000826.jpg';
import qingspa from '../../static/items/wxpic_202508220008261.jpg';
import yunspa from '../../static/items/wxpic_202508220008262.jpg';
import jingzudao from '../../static/items/wxpic_202508220008263.jpg';
import chayi from '../../static/items/wxpic_202508220008264.jpg';
import chanspa from '../../static/items/wxpic_202508220008265.jpg';
import yispa from '../../static/items/wxpic_202508220008266.jpg';
import xiaoxiang from '../../static/items/wxpic_202508220008267.jpg';
import shuizudao from '../../static/items/wxpic_20250824234702.jpg';
import xiyucuozao from '../../static/items/wxpic_202508220008251.jpg';
import shengzudao from '../../static/items/wxpic_202508220008252.jpg';

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
        name: '唐足道',
        desc: '90分钟+精致自助餐',
        price: 128,
        category: 'foot',
        img: tangzudao
      },
      {
        id: 2,
        name: '韵SPA',
        desc: '120分钟+精致自助餐',
        price: 268,
        category: 'spa',
        img: yunspa
      },
      {
        id: 3,
        name: '梦SPA',
        desc: '100分钟+精致自助餐',
        price: 198,
        category: 'spa',
        img: mengspa
      },
      {
        id: 4,
        name: '清SPA',
        desc: '80分钟+精致自助餐',
        price: 158,
        category: 'spa',
        img: qingspa
      },
      {
        id: 5,
        name: '小项四选一',
        desc: '20分钟 采耳/修脚/刮痧/拔罐',
        price: 68,
        category: 'small',
        img: xiaoxiang
      },
      {
        id: 6,
        name: '怡SPA',
        desc: '80分钟+精致自助餐',
        price: 508,
        category: 'spa',
        img: yispa
      },
       {
        id: 11,
        name: '禅SPA',
        desc: '100分钟+精致自助餐',
        price: 688,
        category: 'spa',
        img: chanspa
      },
        {
        id: 12,
        name: '悦SPA',
        desc: '90分钟+精致自助餐',
        price: 388,
        category: 'spa',
        img: yuespa
      },
      {
        id: 7,
        name: '盛足道',
        desc: '70分钟+精致自助餐',
        price: 168,
        category: 'foot',
        img: shengzudao
      },
      {
        id: 8,
        name: '水足道',
        desc: '90分钟+精致自助餐',
        price: 288,
        category: 'foot',
        img: shuizudao
      },
       {
        id: 9,
        name: '镜足道',
        desc: '100分钟+精致自助餐',
        price: 338,
        category: 'foot',
        img: jingzudao
      },
       {
        id: 10,
        name: '茶艺',
        desc: '60分钟',
        price: 198,
        category: 'other',
        img: chayi
      },
       {
        id: 13,
        name: '洗浴搓澡',
        desc: '150分钟',
        price: 98,
        category: 'other',
        img: xiyucuozao
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

    // 使用公共的添加购物车功能
    const {
      showBottomSheet,
      selectedItem: selectedProject,
      durationOptions: durations,
      selectedDuration,
      quantity,
      itemStockCount: stockCount,
      openBottomSheet,
      closeBottomSheet,
      selectDuration,
      increaseQuantity,
      decreaseQuantity,
      confirmAddToCart,
      buyNow
    } = useAddToCart();

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
      openBottomSheet,
      closeBottomSheet,
      selectDuration,
      increaseQuantity,
      decreaseQuantity,
      confirmAddToCart,
      buyNow,
      backToHome,
      showBottomSheet,
      selectedProject,
      durations,
      selectedDuration,
      quantity,
      stockCount
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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

/* 底部弹出框样式 */
.bottom-sheet {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.sheet-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.sheet-content {
  background-color: #fff;
  border-radius: 30rpx 30rpx 0 0;
  padding: 30rpx;
  max-height: 80vh;
  overflow-y: auto;
  animation: slide-up 0.3s ease-out;
  position: relative;
  z-index: 1;
}

.sheet-header {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.selected-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 20rpx;
  margin-right: 30rpx;
}

.selected-info {
  flex: 1;
}

.selected-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.selected-price {
  font-size: 36rpx;
  font-weight: bold;
  color: #FF5000;
  margin-top: 20rpx;
  display: block;
}

.sheet-close {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-icon {
  width: 40rpx;
  height: 40rpx;
}

.sheet-body {
  margin-bottom: 40rpx;
}

.option-section {
  margin-bottom: 40rpx;
}

.option-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.duration-options {
  display: flex;
  gap: 20rpx;
}

.duration-option {
  padding: 15rpx 30rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 40rpx;
  font-size: 28rpx;
  color: #666;
}

.duration-option.active {
  border-color: #FF5000;
  color: #FF5000;
  background-color: rgba(255, 80, 0, 0.05);
}

.quantity-selector {
  display: flex;
  align-items: center;
  width: 200rpx;
}

.quantity-btn {
  width: 60rpx;
  height: 60rpx;
  background-color: #f5f5f5;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  border-radius: 50%;
}

.quantity {
  margin: 0 30rpx;
  font-size: 28rpx;
  color: #333;
}

.stock-info {
  font-size: 24rpx;
  color: #999;
  margin-top: 20rpx;
}

.sheet-footer {
  display: flex;
  gap: 20rpx;
}

.add-to-cart-btn {
  flex: 1;
  height: 90rpx;
  background-color: #FF5000;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
}

.buy-now-btn {
  flex: 1;
  height: 90rpx;
  background-color: #FFA500;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
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