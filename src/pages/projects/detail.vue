<template>
  <view class="container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部导航栏 -->
    <view class="header" :style="{ marginTop: statusBarHeight + 'px' }">
      <uni-icons type="arrow-left" size="24" class="back-icon" @click="navigateBack"></uni-icons>
      <text class="header-title">项目详情</text>
      <view class="header-right">
        <uni-icons 
          :type="isFavorite ? 'star-filled' : 'star'" 
          size="24" 
          class="favorite-icon"
          :class="isFavorite ? 'active' : ''"
          @click="toggleFavorite"
        ></uni-icons>
      </view>
    </view>

    <!-- 项目基本信息 -->
    <view class="project-info-section" v-if="projectInfo">
      <image :src="projectInfo.coverImage || '/static/icons/project.svg'" mode="aspectFill" class="cover-image"></image>
      <view class="project-basic-info">
        <text class="project-name">{{ projectInfo.projectName }}</text>
        <text class="project-price">¥{{ projectInfo.price }}</text>
        <text class="project-desc">{{ projectInfo.description }}</text>
      </view>
    </view>

    <!-- 项目详情图片 -->
    <view class="project-details-section">
      <view class="section-header">
        <text class="section-title">项目详情</text>
      </view>
      <view class="detail-images" v-if="detailImages.length > 0">
        <image v-for="(img, index) in detailImages" :key="index" :src="img" mode="aspectFit" class="detail-image"></image>
      </view>
    </view>

    <!-- 技师选择 -->
    <view class="technicians-section">
      <view class="section-header">
        <text class="section-title">选择技师</text>
      </view>
      <view class="technicians-list">
        <view 
          v-for="tech in technicians" 
          :key="tech.technicianId"
          class="technician-item"
          :class="{ active: selectedTechnicianId === tech.technicianId }"
          @click="selectTechnician(tech.technicianId)"
        >
          <image :src="tech.avatar || '/static/icons/user.svg'" mode="aspectFit" class="technician-avatar"></image>
          <text class="technician-name">{{ tech.name }}</text>
          <text class="technician-level">{{ tech.level }}</text>
        </view>
      </view>
    </view>

    <!-- 可用时间 -->
    <view class="time-section">
      <view class="section-header">
        <text class="section-title">选择时间</text>
      </view>
      <scroll-view scroll-y class="time-list" v-if="availableTimes.length > 0">
        <view 
          v-for="time in availableTimes"
          :key="time.timeSlot"
          class="time-item"
          @click="selectTime(time.timeSlot)"
        >
          <text class="time-text">{{ time.timeSlot }}</text>
          <text class="status-text" :class="time.status === 'available' ? 'available' : 'unavailable'">
            {{ time.status === 'available' ? '可预约' : '已满' }}
          </text>
        </view>
      </scroll-view>
    </view>

    <!-- 评价部分 -->
    <view class="reviews-section">
      <view class="section-header">
        <text class="section-title">用户评价</text>
        <text class="more-link" @click="viewAllReviews">查看全部 &gt;</text>
      </view>
      <view class="review-list" v-if="reviews.length > 0">
        <view v-for="review in reviews" :key="review.reviewId" class="review-item">
          <view class="reviewer-info">
            <image :src="review.avatar || '/static/icons/user.svg'" mode="aspectFit" class="reviewer-avatar"></image>
            <text class="reviewer-name">{{ review.nickname }}</text>
            <text class="review-time">{{ review.createTime }}</text>
          </view>
          <view class="review-content">
            <text class="review-text">{{ review.content }}</text>
          </view>
          <view class="review-rating">
            <uni-rate :value="review.rating" disabled></uni-rate>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部预约按钮 -->
    <view class="bottom-bar" v-if="projectInfo">
      <view class="price-info">
        <text class="price-text">¥{{ projectInfo.price }}</text>
        <text class="original-price">¥{{ projectInfo.originalPrice || projectInfo.price }}</text>
      </view>
      <button class="book-now-button" @click="confirmBooking" :disabled="!selectedTechnicianId || !selectedTimeSlot">立即购买</button>
    </view>
  </view>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import api from '../../utils/api';
import weChatPayment from '../../utils/payment.js';

export default {
  name: 'ProjectDetail',
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
    
    // 路由参数
    const route = getCurrentPages().slice(-1)[0].route;
    const projectId = ref('');
    
    // 项目数据
    const projectInfo = ref(null);
    const detailImages = ref([]);
    const technicians = ref([]);
    const availableTimes = ref([]);
    const reviews = ref([]);
    const isFavorite = ref(false);
    const loading = ref(false);
    
    // 选择状态
    const selectedTechnicianId = ref('');
    const selectedTimeSlot = ref('');
    
    // 从URL获取项目ID
    const getProjectIdFromUrl = () => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const options = currentPage.options;
      return options.id || '';
    };
    
    // 获取项目详情
    const loadProjectDetail = async () => {
      try {
        loading.value = true;
        const res = await api.projects.getDetail(projectId.value);
        if (res.code === 200 && res.data) {
          projectInfo.value = res.data;
          isFavorite.value = res.data.isFavorite || false;
        }
      } catch (error) {
        console.error('获取项目详情失败:', error);
        uni.showToast({
          title: '获取项目详情失败',
          icon: 'none'
        });
      } finally {
        loading.value = false;
      }
    };
    
    // 获取项目详情图片
    const loadDetailImages = async () => {
      try {
        const res = await api.projects.getDetailImages(projectId.value);
        if (res.code === 200 && res.data) {
          detailImages.value = res.data;
        }
      } catch (error) {
        console.error('获取项目详情图片失败:', error);
      }
    };
    
    // 获取技师列表
    const loadTechnicians = async () => {
      try {
        const res = await api.technicians.getList({ projectId: projectId.value });
        if (res.code === 200 && res.data) {
          technicians.value = res.data;
          if (res.data.length > 0) {
            selectedTechnicianId.value = res.data[0].technicianId;
            // 选择技师后加载可用时间
            loadAvailableTimes();
          }
        }
      } catch (error) {
        console.error('获取技师列表失败:', error);
      }
    };
    
    // 获取可用时间
    const loadAvailableTimes = async () => {
      if (!selectedTechnicianId.value) return;
      
      try {
        const res = await api.projects.getAvailableTime({
          projectId: projectId.value,
          technicianId: selectedTechnicianId.value
        });
        if (res.code === 200 && res.data) {
          availableTimes.value = res.data;
        }
      } catch (error) {
        console.error('获取可用时间失败:', error);
      }
    };
    
    // 获取评价列表
    const loadReviews = async () => {
      try {
        const res = await api.reviews.getList({ projectId: projectId.value, page: 1, pageSize: 3 });
        if (res.code === 200 && res.data && res.data.list) {
          reviews.value = res.data.list;
        }
      } catch (error) {
        console.error('获取评价列表失败:', error);
      }
    };
    
    // 切换收藏状态
    const toggleFavorite = async () => {
      try {
        const res = await api.projects.toggleFavorite({ projectId: projectId.value });
        if (res.code === 200) {
          isFavorite.value = !isFavorite.value;
          uni.showToast({
            title: isFavorite.value ? '收藏成功' : '取消收藏',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('切换收藏状态失败:', error);
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        });
      }
    };
    
    // 选择技师
    const selectTechnician = (technicianId) => {
      selectedTechnicianId.value = technicianId;
      selectedTimeSlot.value = '';
      loadAvailableTimes();
    };
    
    // 选择时间
    const selectTime = (timeSlot) => {
      const timeItem = availableTimes.value.find(item => item.timeSlot === timeSlot);
      if (timeItem && timeItem.status === 'available') {
        selectedTimeSlot.value = timeSlot;
      }
    };
    
    // 确认预约
    const confirmBooking = () => {
      if (!selectedTechnicianId.value || !selectedTimeSlot.value) {
        uni.showToast({
          title: '请选择技师和时间',
          icon: 'none'
        });
        return;
      }
      
      if (!projectInfo.value) {
        uni.showToast({
          title: '项目信息加载中，请稍后重试',
          icon: 'none'
        });
        return;
      }
      
      // 构建订单数据
      const orderData = {
        items: [{
          projectId: projectId.value,
          projectName: projectInfo.value.projectName,
          price: projectInfo.value.price,
          quantity: 1,
          duration: projectInfo.value.duration || '60分钟',
          technicianId: selectedTechnicianId.value,
          timeSlot: selectedTimeSlot.value
        }],
        totalAmount: projectInfo.value.price,
        paymentMethod: 'wechat',
        source: 'detail'
      };
      
      // 发起支付
      weChatPayment.processPayment(
        orderData,
        // 支付成功回调
        (result) => {
          console.log('支付成功:', result);
          // 跳转到订单页面
          uni.navigateTo({
            url: '/pages/orders/my-orders'
          });
        },
        // 支付失败回调
        (error) => {
          console.error('支付失败:', error);
          // 支付失败不处理，用户可以选择重试
        }
      );
    };
    
    // 查看全部评价
    const viewAllReviews = () => {
      uni.navigateTo({
        url: `/pages/projects/reviews?projectId=${projectId.value}`
      });
    };
    
    // 返回上一页
    const navigateBack = () => {
      uni.navigateBack();
    };
    
    // 页面加载时获取数据
    onMounted(() => {
      getSystemInfo();
      projectId.value = getProjectIdFromUrl();
      if (projectId.value) {
        loadProjectDetail();
        loadDetailImages();
        loadTechnicians();
        loadReviews();
      }
    });
    
    return {
      statusBarHeight,
      projectInfo,
      detailImages,
      technicians,
      availableTimes,
      reviews,
      isFavorite,
      loading,
      selectedTechnicianId,
      selectedTimeSlot,
      toggleFavorite,
      selectTechnician,
      selectTime,
      confirmBooking,
      viewAllReviews,
      navigateBack
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
  padding-bottom: 120rpx;
}

.status-bar {
  background-color: #fff;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #FF5000;
  position: relative;
  z-index: 9998;
  color: #FFFFFF;
  max-width: 750rpx;
  margin: 0 auto;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.back-icon {
  color: #FFFFFF;
}

.favorite-icon {
  color: #FFFFFF;
}

.favorite-icon.active {
  color: #FFD700;
}

.project-info-section {
  padding-top: 88rpx;
}

.cover-image {
  width: 100%;
  height: 400rpx;
}

.project-basic-info {
  padding: 30rpx;
  background-color: #FFFFFF;
}

.project-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 20rpx;
}

.project-price {
  font-size: 40rpx;
  color: #FF5000;
  display: block;
  margin-bottom: 20rpx;
}

.project-desc {
  font-size: 30rpx;
  color: #666666;
  line-height: 1.6;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
  margin-top: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.more-link {
  font-size: 28rpx;
  color: #999999;
}

.detail-images {
  background-color: #FFFFFF;
  padding: 0 30rpx 30rpx;
}

.detail-image {
  width: 100%;
  height: 400rpx;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
}

.technicians-list {
  display: flex;
  overflow-x: auto;
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
}

.technician-item {
  flex-shrink: 0;
  width: 160rpx;
  margin-right: 30rpx;
  text-align: center;
  padding: 20rpx;
  border: 2rpx solid #f0f0f0;
  border-radius: 16rpx;
}

.technician-item.active {
  border-color: #FF5000;
  background-color: rgba(255, 80, 0, 0.05);
}

.technician-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-bottom: 10rpx;
}

.technician-name {
  font-size: 28rpx;
  color: #333333;
  display: block;
  margin-bottom: 5rpx;
}

.technician-level {
  font-size: 24rpx;
  color: #999999;
}

.time-list {
  background-color: #FFFFFF;
  padding: 0 30rpx 30rpx;
  max-height: 400rpx;
}

.time-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.time-item:last-child {
  border-bottom: none;
}

.time-text {
  font-size: 30rpx;
  color: #333333;
}

.status-text {
  font-size: 28rpx;
}

.status-text.available {
  color: #07C160;
}

.status-text.unavailable {
  color: #999999;
}

.review-list {
  background-color: #FFFFFF;
  padding: 0 30rpx 30rpx;
}

.review-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.review-item:last-child {
  border-bottom: none;
}

.reviewer-info {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.reviewer-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.reviewer-name {
  font-size: 28rpx;
  color: #333333;
  flex: 1;
}

.review-time {
  font-size: 24rpx;
  color: #999999;
}

.review-content {
  margin-bottom: 15rpx;
}

.review-text {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
}

.review-rating {
  margin-top: 10rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
  border-top: 2rpx solid #f0f0f0;
  max-width: 750rpx;
  margin: 0 auto;
}

.price-info {
  display: flex;
  align-items: baseline;
}

.price-text {
  font-size: 40rpx;
  color: #FF5000;
  font-weight: bold;
  margin-right: 10rpx;
}

.original-price {
  font-size: 28rpx;
  color: #999999;
  text-decoration: line-through;
}

.book-now-button {
  width: 280rpx;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #FF5000;
  color: #FFFFFF;
  border-radius: 40rpx;
  font-size: 32rpx;
  padding: 0;
}

.book-now-button:disabled {
  background-color: #CCCCCC;
  color: #FFFFFF;
}
</style>