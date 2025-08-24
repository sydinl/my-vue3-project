<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <text class="header-title">盛唐水镜</text>
      <view class="header-actions">
        <uni-icons type="search" size="20"></uni-icons>
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
        <image :src="entry1" mode="aspectFit" class="entry-image"></image>
        <text class="entry-text">分销中心</text>
      </view>
      <view class="entry-item" @click="goToMemberCenter">
        <image :src="entry2" mode="aspectFit" class="entry-image"></image>
        <text class="entry-text">会员中心</text>
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
                <button class="cart-button" @click="addToCart(service)">
                  <uni-icons type="cart" size="14" color="#FFFFFF"></uni-icons>
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 热门套餐 -->
    <view class="packages-section">
      <view class="section-header">
        <text class="section-title">热门套餐</text>
        <view class="more-link" @click="viewMorePackages">
          <text>更多套餐</text>
          <uni-icons type="right" size="12"></uni-icons>
        </view>
      </view>
      <view class="packages-list">
        <view class="package-card" v-for="(pkg, index) in packages" :key="index" :animation-delay="index * 0.1 + 's'">
          <image :src="pkg.img" mode="aspectFill" class="package-image"></image>
          <view class="package-info">
            <text class="package-name">{{ pkg.name }}</text>
            <view class="package-footer">
              <text class="package-price">¥{{ pkg.price }}</text>
              <text class="package-duration">{{ pkg.duration }}</text>
            </view>
            <button class="buy-button" @click="buyNow(pkg)">立即购买</button>
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
</template>

<script>
import { ref } from 'vue';

// 直接导入图片
import slide1 from '../../static/items/wxpic_20250822000826.jpg';
import slide2 from '../../static/items/wxpic_202508220008261.jpg';
import slide3 from '../../static/items/wxpic_202508220008262.jpg';
import service1 from '../../static/items/wxpic_202508220008253.jpg';
import service2 from '../../static/items/wxpic_202508220008254.jpg';
import package1 from '../../static/items/wxpic_202508220008261.jpg';
import package2 from '../../static/items/wxpic_202508220008262.jpg';
import tech1 from '../../static/items/wxpic_202508220008263.jpg';
import tech2 from '../../static/items/wxpic_202508220008264.jpg';
import tech3 from '../../static/items/wxpic_202508220008265.jpg';
import tech4 from '../../static/items/wxpic_202508220008266.jpg';
import avatar1 from '../../static/items/wxpic_202508220008267.jpg';
import entry1 from '../../static/items/wxpic_202508220008251.jpg';
import entry2 from '../../static/items/wxpic_202508220008252.jpg';

// 添加调试信息
console.log('页面加载 - 检查图片路径问题');


export default {
  name: 'HomePage',
  onLoad() {
    console.log('首页加载完成');
  },
  setup() {
    // 轮播图数据 - 使用导入的图片变量
    const slides = ref([
      { img: slide1, text: '新品上市' },
      { img: slide2, text: '会员专享' },
      { img: slide3, text: '限时优惠' }
    ]);
    
    // 服务项目数据 - 使用导入的图片变量
    const services = ref([
      { id: 1, name: '经典足道', desc: '60分钟足部按摩', price: 128, img: service1 },
      { id: 2, name: '皇室SPA', desc: '90分钟全身精油按摩', price: 268, img: service2 },
      { id: 3, name: '泰式按摩', desc: '75分钟传统泰式手法', price: 198, img: slide1 },
      { id: 4, name: '肩颈护理', desc: '45分钟肩颈舒缓按摩', price: 158, img: slide2 }
    ]);
    
    // 套餐数据 - 使用导入的图片变量
    const packages = ref([
      { id: 1, name: '身心放松套餐', price: 298, duration: '120分钟', img: slide2 },
      { id: 2, name: '皇家尊享套餐', price: 398, duration: '150分钟', img: slide3 }
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
      uni.showToast({ title: '前往分销中心', icon: 'none' });
    };

    // 导航到会员中心
    const goToMemberCenter = () => {
      uni.showToast({ title: '前往会员中心', icon: 'none' });
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
      buyNow,
      viewMorePackages,
      viewAllTechnicians,
      viewAllReviews
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

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
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
  padding: 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.entry-image {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
}

.entry-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #333;
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
  background-color: #FF5000;
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
</style>