<template>
  <view class="container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部导航栏 -->
    <view class="header" :style="{ marginTop: statusBarHeight + 'px' }">
      <view class="search-bar" @click="gotoSearch">
        <uni-icons type="search" size="16" color="#999"></uni-icons>
        <text class="search-placeholder">搜索项目名称...</text>
      </view>
      <view class="phone-number" @click="callCustomerService">
        <image src="/static/icons/customer-service1.png" mode="aspectFit" class="service-icon"></image>
        <uni-icons type="phone" size="16" color="#666666"></uni-icons>
        <text class="service-text">客服</text>
        <text class="phone-text">029-68638888</text>
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
      <view v-if="loading" class="loading-container">
        <uni-icons type="spinner" size="36" color="#4CAF50" animation="spin"></uni-icons>
        <text class="loading-text">加载中...</text>
      </view>
      <view v-else-if="services.length === 0" class="empty-container">
        <uni-icons type="empty" size="80" color="#ccc"></uni-icons>
        <text class="empty-text">暂无精选项目</text>
      </view>
      <view v-else class="services-list">
        <view class="service-card" v-for="(service, index) in services" :key="index" :animation-delay="index * 0.1 + 's'">
          <view class="card-content">
            <image :src="service.img" mode="aspectFill" class="service-image"></image>
            <view class="service-info">
              <text class="service-name">{{ service.name }}</text>
              <text class="service-desc">{{ service.desc }}</text>
              <view class="service-footer">
                <text class="service-price">¥{{ service.price }}</text>
                <button class="cart-button" @click="openBottomSheet(service)">
                  <image src="/static/icons/cart1.png" mode="aspectFit" class="cart-icon-button"></image>
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
      <view v-if="loading" class="loading-container">
        <uni-icons type="spinner" size="36" color="#4CAF50" animation="spin"></uni-icons>
        <text class="loading-text">加载中...</text>
      </view>
      <view v-else-if="technicians.length === 0" class="empty-container">
        <uni-icons type="empty" size="80" color="#ccc"></uni-icons>
        <text class="empty-text">暂无技师数据</text>
      </view>
      <scroll-view v-else scroll-x="true" class="technicians-scroll">
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
      <view v-if="loading" class="loading-container">
        <uni-icons type="spinner" size="36" color="#4CAF50" animation="spin"></uni-icons>
        <text class="loading-text">加载中...</text>
      </view>
      <view v-else-if="reviews.length === 0" class="empty-container">
        <uni-icons type="empty" size="80" color="#ccc"></uni-icons>
        <text class="empty-text">暂无评价数据</text>
      </view>
      <view v-else class="reviews-list">
        <view class="review-item" v-for="(review, index) in reviews" :key="index" :animation-delay="index * 0.1 + 's'">
          <view class="review-header">
            <image :src="review.avatar" mode="aspectFill" class="review-avatar"></image>
            <view class="review-user">
              <text class="review-name">{{ review.name }}</text>
              <view class="star-rating">
                <uni-icons type="star-filled" size="12" color="#4CAF50" v-for="n in review.stars" :key="n"></uni-icons>
                <uni-icons type="star-half-filled" size="12" color="#4CAF50" v-if="review.halfStar"></uni-icons>
              </view>
            </view>
          </view>
          <text class="review-content">{{ review.content }}</text>
        </view>
      </view>
    </view>
  </view>
  
  <!-- 底部弹出框 -->
  <view v-if="showBottomSheet" class="bottom-sheet" @click.self="closeBottomSheet">
    <view class="sheet-overlay" @click="closeBottomSheet"></view>
    <view class="sheet-content">
      <view class="sheet-header">
        <image v-if="selectedService" :src="selectedService.img" class="selected-image"></image>
        <view v-if="selectedService" class="selected-info">
          <text class="selected-name">{{selectedService.name}}</text>
          <text class="selected-price">¥{{selectedService.price}}</text>
        </view>
        <view class="sheet-close" @click="closeBottomSheet">
          <image :src="closeIcon" class="close-icon"></image>
        </view>
      </view>
      
      <view class="sheet-body">
        <!-- 时长选择 -->
        <view class="option-section">
          <text class="option-title">时长</text>
          <view class="duration-options">
            <view 
              v-for="duration in durations" 
              :key="duration"
              :class="['duration-option', {active: selectedDuration === duration}]"
              @click="selectDuration(duration)"
            >
              {{duration}}
            </view>
          </view>
        </view>
        
        <!-- 数量选择 -->
        <view class="option-section">
        <text class="option-title">数量</text>
        <view class="quantity-selector">
          <button class="quantity-btn" @click="decreaseQuantity">-</button>
          <text class="quantity">{{quantity}}</text>
          <button class="quantity-btn" @click="increaseQuantity">+</button>
        </view>
      </view>
      </view>
      
      <view class="sheet-footer">
        <button class="add-to-cart-btn" @click="confirmAddToCart">加入购物车</button>
        <button class="buy-now-btn" @click="buyNow">立即购买</button>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';

// 导入API接口
import api from '../../utils/api';

// 添加调试信息
console.log('Home页面API对象:', api);

// 导入公共的添加购物车功能
import { useAddToCart } from '../../utils/cart-utils';

// 直接导入图片
import slide1 from '../../static/items/wxpic_head_20250822000722.jpg';
import slide2 from '../../static/items/wxpic_head_20250822000825.jpg';
import slide3 from '../../static/items/wxpic_head_20250901194736.jpg';
import slide4 from '../../static/items/wxpic_head_20250901194745.jpg';

import entry1 from '../../static/items/distribution-certificate.png';
import entry2 from '../../static/items/member-certificate.png';
import closeIcon from '../../static/icons/close.png';


export default {
  name: 'HomePage',
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
    
    // 跳转到搜索页面
    const gotoSearch = () => {
      uni.navigateTo({
        url: '/pages/search/search'
      });
    };
    
    // 拨打客服电话
    const callCustomerService = () => {
      const phoneNumber = '029-68638888'; // 客服电话号码
      
      uni.showModal({
        title: '联系客服',
        content: `客服电话：${phoneNumber}\n\n是否立即拨打？`,
        confirmText: '拨打',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 调用系统拨号功能
            uni.makePhoneCall({
              phoneNumber: phoneNumber,
              success: () => {
                // 拨打电话成功
              },
              fail: (err) => {
                console.error('拨打电话失败:', err);
                uni.showToast({
                  title: '拨打电话失败',
                  icon: 'none'
                });
              }
            });
          }
        }
      });
    };
    
    // 轮播图数据 - 初始使用本地图片，后续可以从API获取
    const slides = ref([
      { img: slide1, text: '' },
      { img: slide2, text: '' },
      { img: slide3, text: '' },
      { img: slide4, text: '' }
    ]);
    
    // 服务项目数据
    const services = ref([]);
    
    // 套餐数据
    const packages = ref([]);
    
    // 技师数据
    const technicians = ref([]);
    
    // 评价数据
    const reviews = ref([]);
    
    // 加载状态
    const loading = ref(true);
    
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


    // 查看更多套餐
    const viewMorePackages = () => {
      uni.navigateTo({ url: '/pages/projects/projects' });
    };

    // 查看所有技师
    const viewAllTechnicians = () => {
      uni.navigateTo({
        url: '/pages/technicians/list'
      });
    };

    // 查看所有评价
    const viewAllReviews = () => {
      uni.navigateTo({
        url: '/pages/reviews/list'
      });
    };
    
    // 获取项目列表数据
    const fetchProjects = async () => {
      try {
        // 获取热门项目
        const hotRes = await api.projects.getHotProjects({ pageSize: 4 });
        console.log('热门项目API响应:', hotRes);
        if (hotRes.code === 200 && hotRes.data && hotRes.data.list) {
          services.value = hotRes.data.list.map(project => ({
            id: project.id,
            name: project.name,
            desc: project.description || '暂无描述',
            price: project.price,
            img: project.image || '/static/icons/placeholder.png'
          }));
          console.log('热门项目数据已设置:', services.value);
        } else {
          console.log('热门项目API返回数据格式不正确，使用模拟数据');
          // API返回成功但数据格式不正确，使用模拟数据
          services.value = [
            { id: 1, name: '唐足道', desc: '90分钟+精致自助餐', price: 258, img: '/static/items/wxpic_202508220008253.jpg' },
            { id: 2, name: '悦SPA', desc: '90分钟+精致自助餐', price: 388, img: '/static/items/wxpic_202508220008254.jpg' },
            { id: 3, name: '水足道', desc: '70分钟+精致自助餐', price: 288, img: '/static/items/wxpic_20250824234702.jpg' },
            { id: 4, name: '韵SPA', desc: '120分钟+精致自助餐', price: 858, img: '/static/items/wxpic_202508220008262.jpg' }
          ];
        }
        
        // 获取套餐数据（可以使用推荐项目接口）
        const recommendRes = await api.projects.getRecommendProjects({ pageSize: 2 });
        if (recommendRes.code === 0 && recommendRes.data && recommendRes.data.list) {
          packages.value = recommendRes.data.list.map(project => ({
            id: project.id,
            name: project.name,
            price: project.price,
            duration: project.duration || '60分钟',
            img: project.imageUrl || '/static/icons/placeholder.png'
          }));
        } else {
          // API返回成功但数据格式不正确，使用模拟数据
          packages.value = [
            { id: 1, name: '盛足道', price: 178, duration: '70分钟', img: '/static/items/sheng.jpg' },
            { id: 2, name: '禅SPA', price: 298, duration: '80分钟', img: '/static/items/chan.jpg' }
          ];
        }
      } catch (error) {
        console.error('获取项目数据失败:', error);
        // 使用模拟数据作为备用
        services.value = [
          { id: 1, name: '唐足道', desc: '90分钟+精致自助餐', price: 258, img: '/static/items/tang.jpg' },
          { id: 2, name: '悦SPA', desc: '90分钟+精致自助餐', price: 388, img: '/static/items/yue.jpg' },
          { id: 3, name: '水足道', desc: '70分钟+精致自助餐', price: 288, img: '/static/items/shui.jpg' },
          { id: 4, name: '韵SPA', desc: '120分钟+精致自助餐', price: 858, img: '/static/items/yun.jpg' }
        ];
        packages.value = [
          { id: 1, name: '盛足道', price: 178, duration: '70分钟', img: '/static/items/wxpic_202508220008252.jpg' },
          { id: 2, name: '清SPA', price: 298, duration: '80分钟', img: '/static/items/wxpic_202508220008261.jpg' }
        ];
      }
    };
    
    // 获取技师列表数据
    const fetchTechnicians = async () => {
      try {
        const res = await api.technicians.getList({ pageSize: 4 });
        if (res.code === 200 && res.data && res.data.list) {
          technicians.value = res.data.list.map(tech => ({
            id: tech.id,
            name: tech.name,
            exp: `${tech.experience}年经验`,
            img: tech.avatar || '/static/icons/avatar.png'
          }));
        }
      } catch (error) {
        console.error('获取技师数据失败:', error);
        // 使用模拟数据作为备用
        technicians.value = [
          { id: 1, name: '张技师', exp: '10年经验', img: '/static/items/wxpic_202508220008263.jpg' },
          { id: 2, name: '李技师', exp: '8年经验', img: '/static/items/wxpic_202508220008264.jpg' },
          { id: 3, name: '王技师', exp: '12年经验', img: '/static/items/wxpic_202508220008265.jpg' },
          { id: 4, name: '赵技师', exp: '9年经验', img: '/static/items/wxpic_202508220008266.jpg' }
        ];
      }
    };
    
    // 获取评价数据
    const fetchReviews = async () => {
      try {
        // 尝试获取评价数据
        const res = await api.reviews.getList({ pageSize: 2 });
        if (res.code === 200 && res.data && res.data.list) {
          reviews.value = res.data.list.map(review => ({
            id: review.id,
            name: review.userName,
            stars: Math.floor(review.rating),
            halfStar: review.rating % 1 >= 0.5,
            content: review.content,
            avatar: review.userAvatar || '/static/icons/avatar.png'
          }));
        }
      } catch (error) {
        // 详细记录错误信息，特别是对于404错误
        console.error('获取评价数据失败:', error);
        // 检查错误是否包含404相关信息
        const is404Error = error.message.includes('404') || error.message.includes('Not Found');
        if (is404Error) {
          console.warn('评价API接口可能不存在，将使用本地模拟数据');
        }
        // 使用模拟数据作为备用
        reviews.value = [
          { id: 1, name: '张先生', stars: 5, halfStar: false, content: '服务非常专业，环境也很舒适，技师手法一流，下次还会再来！', avatar: '/static/items/wxpic_202508220008267.jpg' },
          { id: 2, name: '李女士', stars: 4, halfStar: true, content: '环境安静优雅，SPA体验非常放松，精油的味道很舒服，整体很满意。', avatar: '/static/items/wxpic_202508220008267.jpg' }
        ];
      }
    };
    
    // 加载所有数据
    const loadAllData = async () => {
      try {
        loading.value = true;
        // 并行请求所有数据
        await Promise.all([
          fetchProjects(),
          fetchTechnicians(),
          fetchReviews()
        ]);
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        loading.value = false;
      }
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
      confirmAddToCart,
      buyNow
    } = useAddToCart({
      durations: ['60分钟', '90分钟', '100分钟', '120分钟'],
      defaultDurationIndex: 2 // 默认选中第3个选项（索引为2）即'100分钟'
    });
    
    // 页面加载时获取数据
    onMounted(() => {
      getSystemInfo(); // 获取系统信息
      loadAllData();
    });

    return {
      statusBarHeight,
      slides,
      services,
      packages,
      technicians,
      reviews,
      entry1,
      entry2,
      gotoSearch,
      callCustomerService,
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
      closeIcon,
      loading
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 750rpx;
  margin: 0 auto;
  background-color: #e8f5e8;
  padding-bottom: 100rpx;
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  gap: 20rpx;
  position: relative;
  z-index: 9998;
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 10rpx 20rpx;
  background-color: #e8f5e8;
  border-radius: 30rpx;
}

.phone-number {
  display: flex;
  align-items: center;
  padding: 12rpx 20rpx;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-radius: 25rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.service-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 8rpx;
}

.phone-number::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transition: left 0.5s ease;
}

.phone-number:active::before {
  left: 100%;
}

.phone-number:active {
  transform: translateY(1rpx);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.12);
}

.service-text {
  font-size: 22rpx;
  color: #666666;
  font-weight: 600;
  margin-left: 8rpx;
  letter-spacing: 0.5rpx;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.05);
}

.phone-text {
  font-size: 26rpx;
  color: #333333;
  font-weight: 700;
  margin-left: 12rpx;
  letter-spacing: 1rpx;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.05);
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
  padding: 12rpx;
  background: linear-gradient(135deg, #F0F8F0 0%, #E8F5E8 100%);
  margin-bottom: 20rpx;
  border: 2rpx solid #4CAF50;
  border-radius: 20rpx;
  box-shadow: 0 6rpx 20rpx rgba(76, 175, 80, 0.15);
  margin: 20rpx 0;
  position: relative;
  overflow: hidden;
}

.center-entry::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: linear-gradient(90deg, #4CAF50 0%, #66BB6A 50%, #4CAF50 100%);
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8rpx;
  position: relative;
  transition: all 0.3s ease;
  border-radius: 16rpx;
  margin: 4rpx;
}

.entry-item:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 8rpx 25rpx rgba(76, 175, 80, 0.2);
}

.entry-icon {
  width: 95%;
  padding: 0;
  position: relative;
}

.entry-image {
  width: 100%;
  height: 200rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 15rpx rgba(76, 175, 80, 0.1);
  transition: all 0.3s ease;
}

.entry-image:hover {
  transform: scale(1.02);
  box-shadow: 0 6rpx 20rpx rgba(76, 175, 80, 0.2);
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

  .loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60rpx 0;
    color: #999;
  }

  .loading-text {
    margin-top: 20rpx;
    font-size: 28rpx;
  }

  .empty-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60rpx 0;
    color: #999;
  }

  .empty-text {
    margin-top: 20rpx;
    font-size: 28rpx;
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
  color: #4CAF50;
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
  color: #4CAF50;
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
  color: #4CAF50;
}

.package-duration {
  font-size: 24rpx;
  color: #999;
}

.buy-button {
  margin-top: 20rpx;
  width: 100%;
  height: 60rpx;
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
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
  border: 4rpx solid #4CAF50;
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
  background-color: #e8f5e8;
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
  color: #4CAF50;
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
  border-color: #4CAF50;
  color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.05);
}

.quantity-selector {
  display: flex;
  align-items: center;
  width: 200rpx;
}

.quantity-btn {
  width: 60rpx;
  height: 60rpx;
  background-color: #e8f5e8;
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
  background-color: #4CAF50;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
}

.buy-now-btn {
  flex: 1;
  height: 90rpx;
  background-color: #66BB6A;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
}
</style>