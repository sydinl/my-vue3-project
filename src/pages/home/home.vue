<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="search-bar" @click="gotoSearch">
        <uni-icons type="search" size="16" color="#999"></uni-icons>
        <text class="search-placeholder">搜索项目名称...</text>
      </view>
      <view class="header-actions">
        <uni-icons type="bell" size="20" class="ml-4"></uni-icons>
        <uni-icons type="person" size="20" class="ml-4"></uni-icons>
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="swiper-container">
      <swiper 
        class="swiper" 
        :indicator-dots="true" 
        :autoplay="true" 
        :interval="5000" 
        :duration="300"
        indicator-active-color="#FFFFFF"
        indicator-color="rgba(255, 255, 255, 0.5)"
      >
        <swiper-item v-for="(slide, index) in slides" :key="index">
          <image :src="slide.img" mode="aspectFill" class="slide-image"></image>
          <view class="slide-text" v-if="slide.text">{{ slide.text }}</view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 中心入口 -->
    <view class="center-entry">
      <view class="entry-item" @click="goToDistributionCenter">
        <view class="entry-icon distribution-icon">
          <image :src="entry1" mode="aspectFit" class="entry-image"></image>
        </view>
      </view>
      <view class="entry-item" @click="goToMemberCenter">
        <view class="entry-icon member-icon">
          <image :src="entry2" mode="aspectFit" class="entry-image"></image>
        </view>
      </view>
    </view>

    <!-- 服务项目 -->
    <view class="services-section">
      <view class="section-header">
        <text class="section-title">精选项目</text>
        <navigator url="/pages/projects/projects" class="more-link">
          <text>全部项目</text>
          <uni-icons type="right" size="12"></uni-icons>
        </navigator>
      </view>
      <view class="services-list">
        <view class="service-card" v-for="(service, index) in services" :key="index" :animation-delay="index * 0.1 + 's'">
          <view class="card-content">
            <image :src="service.img" mode="aspectFill" class="service-image"></image>
            <view class="service-info">
              <text class="service-name">{{ service.name }}</text>
              <text class="service-desc">{{ service.desc }}</text>
              <view class="service-footer">
                <text class="service-price">¥{{ service.price }}</text>
                <button class="cart-button" @click="openBottomSheet(service)">
                  <image src="/static/icons/cart1.svg" mode="aspectFit" class="cart-icon-button"></image>
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 技师展示 -->
    <view class="technicians-section">
      <view class="section-header">
        <text class="section-title">资深技师</text>
        <view class="more-link" @click="viewAllTechnicians">
          <text>查看全部</text>
          <uni-icons type="right" size="12"></uni-icons>
        </view>
      </view>
      <scroll-view scroll-x="true" class="technicians-scroll">
        <view class="technician-item" v-for="(tech, index) in technicians" :key="index" :animation-delay="index * 0.1 + 's'">
          <image :src="tech.img" mode="aspectFill" class="technician-image"></image>
          <text class="technician-name">{{ tech.name }}</text>
          <text class="technician-exp">{{ tech.exp }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 评价展示 -->
    <view class="reviews-section">
      <view class="section-header">
        <text class="section-title">顾客评价</text>
        <view class="more-link" @click="viewAllReviews">
          <text>查看全部</text>
          <uni-icons type="right" size="12"></uni-icons>
        </view>
      </view>
      <view class="reviews-list">
        <view class="review-item" v-for="(review, index) in reviews" :key="index" :animation-delay="index * 0.1 + 's'">
          <view class="review-header">
            <image :src="review.avatar" mode="aspectFill" class="review-avatar"></image>
            <view class="review-user">
              <text class="review-name">{{ review.name }}</text>
              <view class="star-rating">
                <uni-icons type="star-filled" size="12" color="#FF5000" v-for="n in review.stars" :key="n"></uni-icons>
                <uni-icons type="star-half-filled" size="12" color="#FF5000" v-if="review.halfStar"></uni-icons>
              </view>
            </view>
          </view>
          <text class="review-content">{{ review.content }}</text>
        </view>
      </view>
    </view>
  </view>
  
  <!-- 底部弹出框 -->
  <div v-if="showBottomSheet" class="bottom-sheet" @click.self="closeBottomSheet">
    <div class="sheet-overlay"></div>
    <div class="sheet-content">
      <div class="sheet-header">
        <image v-if="selectedService" :src="selectedService.img" class="selected-image"></image>
        <div v-if="selectedService" class="selected-info">
          <text class="selected-name">{{selectedService.name}}</text>
          <text class="selected-price">¥{{selectedService.price}}</text>
        </div>
        <div class="sheet-close" @click="closeBottomSheet">
          <image :src="closeIcon" class="close-icon"></image>
        </div>
      </div>
      
      <div class="sheet-body">
        <!-- 时长选择 -->
        <div class="option-section">
          <text class="option-title">时长</text>
          <div class="duration-options">
            <div 
              v-for="duration in durations" 
              :key="duration"
              :class="['duration-option', {active: selectedDuration === duration}]"
              @click="selectDuration(duration)"
            >
              {{duration}}
            </div>
          </div>
        </div>
        
        <!-- 数量选择 -->
        <div class="option-section">
        <text class="option-title">数量</text>
        <div class="quantity-selector">
          <button class="quantity-btn" @click="decreaseQuantity">-</button>
          <text class="quantity">{{quantity}}</text>
          <button class="quantity-btn" @click="increaseQuantity">+</button>
        </div>
      </div>
      </div>
      
      <div class="sheet-footer">
        <button class="add-to-cart-btn" @click="confirmAddToCart">加入购物车</button>
        <button class="buy-now-btn" @click="closeBottomSheet">立即购买</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

// 导入公共的添加购物车功能
import { useAddToCart } from '../../utils/cart-utils';

// 直接导入图片
import slide1 from '../../static/items/wxpic_head_20250822000722.jpg';
import slide2 from '../../static/items/wxpic_head_20250822000825.jpg';
import slide3 from '../../static/items/wxpic_202508220008262.jpg';
import service1 from '../../static/items/wxpic_202508220008253.jpg';
import service2 from '../../static/items/wxpic_202508220008254.jpg';
import qingspa from '../../static/items/wxpic_202508220008261.jpg';
import yunspa from '../../static/items/wxpic_202508220008262.jpg';
import tech1 from '../../static/items/wxpic_202508220008263.jpg';
import tech2 from '../../static/items/wxpic_202508220008264.jpg';
import tech3 from '../../static/items/wxpic_202508220008265.jpg';
import tech4 from '../../static/items/wxpic_202508220008266.jpg';
import avatar1 from '../../static/items/wxpic_202508220008267.jpg';

import shuizudao from '../../static/items/wxpic_20250824234702.jpg';

import shengzudao from '../../static/items/wxpic_202508220008252.jpg';


// 导入新的中心入口图片
import entry1 from '../../static/items/distribution-certificate.svg';
import entry2 from '../../static/items/member-certificate.svg';
// 导入关闭图标
import closeIcon from '../../static/icons/close.svg';

// 添加调试信息
console.log('页面加载 - 检查图片路径问题');


export default {
  name: 'HomePage',
  onLoad() {
    console.log('首页加载完成');
  },
  setup() {
    // 跳转到搜索页面
    const gotoSearch = () => {
      uni.navigateTo({
        url: '/pages/search/search'
      });
    };
    
    // 轮播图数据 - 使用导入的图片变量
    const slides = ref([
      { img: slide1, text: '新品上市' },
      { img: slide2, text: '会员专享' },
      { img: slide3, text: '限时优惠' }
    ]);
    
    // 服务项目数据 - 使用导入的图片变量
    const services = ref([
      { id: 1, name: '唐足道', desc: '90分钟+精致自助餐', price: 258, img: service1 },
      { id: 2, name: '悦SPA', desc: '90分钟+精致自助餐', price: 388, img: service2 },
      { id: 3, name: '水足道', desc: '70分钟+精致自助餐', price: 288, img: shuizudao },
      { id: 4, name: '韵SPA', desc: '120分钟+精致自助餐', price: 858, img: yunspa }
    ]);
    
    // 套餐数据 - 使用导入的图片变量
    const packages = ref([
      { id: 1, name: '盛足道', price: 178, duration: '70分钟', img: shengzudao },
      { id: 2, name: '清SPA', price: 298, duration: '80分钟', img: qingspa }
    ]);
    
    // 技师数据 - 使用导入的图片变量
    const technicians = ref([
      { id: 1, name: '张技师', exp: '10年经验', img: tech1 },
      { id: 2, name: '李技师', exp: '8年经验', img: tech2 },
      { id: 3, name: '王技师', exp: '12年经验', img: tech3 },
      { id: 4, name: '赵技师', exp: '9年经验', img: tech4 }
    ]);
    
    // 评价数据 - 使用导入的图片变量
    const reviews = ref([
      { id: 1, name: '张先生', stars: 5, halfStar: false, content: '服务非常专业，环境也很舒适，技师手法一流，下次还会再来！', avatar: avatar1 },
      { id: 2, name: '李女士', stars: 4, halfStar: true, content: '环境安静优雅，SPA体验非常放松，精油的味道很舒服，整体很满意。', avatar: avatar1 }
    ]);
    
    // 添加调试信息检查图片路径
    console.log('slide1路径:', slide1);
    console.log('entry1路径:', entry1);

    // 导航到分销中心
    const goToDistributionCenter = () => {
      uni.navigateTo({ url: '/pages/distribution/distribution' });
    };

    // 导航到会员中心
    const goToMemberCenter = () => {
      uni.navigateTo({ url: '/pages/member/member' });
    };

    // 添加到购物车
    const addToCart = (service) => {
      uni.showToast({ title: `${service.name}已加入购物车`, icon: 'success' });
    };

    // 立即购买
    const buyNow = (pkg) => {
      uni.showToast({ title: `购买${pkg.name}`, icon: 'success' });
    };

    // 查看更多套餐
    const viewMorePackages = () => {
      uni.showToast({ title: '查看更多套餐', icon: 'none' });
    };

    // 查看所有技师
    const viewAllTechnicians = () => {
      uni.showToast({ title: '查看所有技师', icon: 'none' });
    };

    // 查看所有评价
    const viewAllReviews = () => {
      uni.showToast({ title: '查看所有评价', icon: 'none' });
    };

    // 使用公共的添加购物车功能
    const {
      showBottomSheet,
      selectedItem: selectedService,
      durationOptions: durations,
      selectedDuration,
      quantity,
      itemStockCount: stockCount,
      openBottomSheet,
      closeBottomSheet,
      selectDuration,
      increaseQuantity,
      decreaseQuantity,
      confirmAddToCart
    } = useAddToCart({
      durations: ['60分钟', '90分钟', '100分钟', '120分钟'],
      defaultDurationIndex: 2 // 默认选中第3个选项（索引为2）即'100分钟'
    });

    return {
      slides,
      services,
      packages,
      technicians,
      reviews,
      entry1,
      entry2,
      goToDistributionCenter,
      goToMemberCenter,
      addToCart,
      openBottomSheet,
      closeBottomSheet,
      selectDuration,
      increaseQuantity,
      decreaseQuantity,
      confirmAddToCart,
      buyNow,
      viewMorePackages,
      viewAllTechnicians,
      viewAllReviews,
      gotoSearch,
      showBottomSheet,
      selectedService,
      durations,
      selectedDuration,
      quantity,
      stockCount,
      closeIcon
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
  }

  .search-bar {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 10rpx 20rpx;
    background-color: #f5f5f5;
    border-radius: 30rpx;
    margin-right: 20rpx;
  }

  .search-placeholder {
    margin-left: 10rpx;
    font-size: 28rpx;
    color: #999;
  }

.header-actions {
  display: flex;
  align-items: center;
}

.swiper-container {
  width: 100%;
  height: 450rpx;
}

.swiper {
  width: 100%;
  height: 100%;
}

.slide-image {
  width: 100%;
  height: 100%;
}

.slide-text {
  position: absolute;
  bottom: 40rpx;
  left: 40rpx;
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.5);
}

.center-entry {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 8rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  margin: 20rpx 0;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 12rpx;
}

.entry-icon {
  width: 95%;
  padding: 0;
}

.entry-image {
  width: 100%;
  height: 200rpx;
  border-radius: 10rpx;
}

.entry-text {
  display: none;
}

.services-section,
.packages-section,
.technicians-section,
.reviews-section {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.more-link {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #FF5000;
}

.services-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.service-card {
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  animation: slide-up 0.5s ease-out;
}

.service-card:hover {
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
}

.service-image {
  width: 200rpx;
  height: 200rpx;
}

.service-info {
  flex: 1;
  padding: 20rpx;
}

.service-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.service-desc {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制显示2行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.service-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
}

.service-price {
  font-size: 28rpx;
  font-weight: bold;
  color: #FF5000;
}

.cart-button {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.packages-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.package-card {
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  animation: slide-up 0.5s ease-out;
}

.package-card:hover {
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.package-image {
  width: 100%;
  height: 240rpx;
}

.package-info {
  padding: 20rpx;
}

.package-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.package-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rpx;
}

.package-price {
  font-size: 28rpx;
  font-weight: bold;
  color: #FF5000;
}

.package-duration {
  font-size: 24rpx;
  color: #999;
}

.buy-button {
  margin-top: 20rpx;
  width: 100%;
  height: 60rpx;
  background-color: rgba(255, 80, 0, 0.1);
  color: #FF5000;
  font-size: 24rpx;
  border-radius: 30rpx;
}

.technicians-scroll {
  white-space: nowrap;
}

.technician-item {
  display: inline-block;
  text-align: center;
  margin-right: 40rpx;
  animation: slide-up 0.5s ease-out;
}

.technician-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  border: 4rpx solid #FF5000;
}

.technician-name {
  display: block;
  margin-top: 10rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.technician-exp {
  display: block;
  font-size: 24rpx;
  color: #999;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.review-item {
  background-color: #f5f5f5;
  border-radius: 16rpx;
  padding: 20rpx;
  animation: slide-up 0.5s ease-out;
}

.review-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.review-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
}

.review-user {
  margin-left: 20rpx;
}

.review-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.star-rating {
  display: flex;
  margin-top: 10rpx;
}

.review-content {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
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
  flex-wrap: wrap;
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
</style>