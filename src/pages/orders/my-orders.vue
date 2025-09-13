<template>
  <view class="container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部导航栏 -->
    <view class="header" :style="{ marginTop: statusBarHeight + 'px' }">
      <uni-icons type="left" size="24" class="back-icon" @click="navigateBack"></uni-icons>
      <text class="header-title">{{ showCreateForm ? '创建订单' : '我的订单' }}</text>
      <view class="header-right" v-if="!showCreateForm">
        <uni-icons type="ellipsis" size="20"></uni-icons>
        <uni-icons type="eye" size="20" class="ml-4"></uni-icons>
      </view>
    </view>

    <!-- 创建订单表单 -->
    <view class="create-order-form" v-if="showCreateForm">
      <view class="form-item">
        <text class="form-label">项目名称</text>
        <text class="form-value">{{ createOrderData.projectName || '加载中...' }}</text>
      </view>
      <view class="form-item">
        <text class="form-label">选择技师</text>
        <text class="form-value">{{ createOrderData.technicianName || '加载中...' }}</text>
      </view>
      <view class="form-item">
        <text class="form-label">预约时间</text>
        <text class="form-value">{{ createOrderData.timeSlot || '未选择' }}</text>
      </view>
      <view class="form-item">
        <text class="form-label">订单金额</text>
        <text class="form-value price">¥{{ createOrderData.price || 0 }}</text>
      </view>
      <view class="form-actions">
        <button class="cancel-button" @click="closeCreateForm">取消</button>
        <button class="submit-button" @click="handleCreateOrder" :disabled="loading">确认创建</button>
      </view>
    </view>

    <!-- 订单列表内容（非创建订单模式） -->
    <template v-else>
      <!-- 搜索框 -->
      <view class="search-container">
        <view class="search-input">
          <uni-icons type="search" size="20" class="search-icon"></uni-icons>
          <text class="search-placeholder">搜索</text>
        </view>
      </view>

      <!-- 订单状态选项卡 -->
      <view class="order-tabs">
        <view class="tab-item" :class="{ active: currentTab === 'all' }" @click="switchTab('all')">
          <text class="tab-text">全部</text>
          <view class="tab-underline" :class="{ active: currentTab === 'all' }"></view>
        </view>
        <view class="tab-item" :class="{ active: currentTab === 'pending' }" @click="switchTab('pending')">
          <text class="tab-text">待付款</text>
          <view class="tab-underline" :class="{ active: currentTab === 'pending' }"></view>
        </view>
        <view class="tab-item" :class="{ active: currentTab === 'shipping' }" @click="switchTab('shipping')">
          <text class="tab-text">待服务</text>
          <view class="tab-underline" :class="{ active: currentTab === 'shipping' }"></view>
        </view>
        <view class="tab-item" :class="{ active: currentTab === 'completed' }" @click="switchTab('completed')">
          <text class="tab-text">已完成</text>
          <view class="tab-underline" :class="{ active: currentTab === 'completed' }"></view>
        </view>
      </view>

      <!-- 订单列表区域 -->
      <view class="order-list">
        <!-- 加载状态 -->
        <view class="loading-state" v-if="loading">
          <uni-loading></uni-loading>
          <text>加载中...</text>
        </view>
        
        <!-- 空状态显示 -->
        <view class="empty-state" v-else-if="!hasOrders">
          <image src="/static/icons/order-empty.png" mode="aspectFit" class="empty-icon"></image>
          <text class="empty-text">暂无相关订单</text>
        </view>

        <!-- 订单列表 -->
        <view class="orders-container" v-else>
          <view v-for="order in orders" :key="order.orderId" class="order-item">
            <view class="order-header">
              <text class="order-number">订单号: {{ order.orderId }}</text>
              <text class="order-status">{{ getStatusText(order.status) }}</text>
            </view>
            <view class="order-content">
              <text class="order-project">{{ order.projectName }}</text>
              <text class="order-time">预约时间: {{ order.appointmentTime }}</text>
              <text class="order-technician">技师: {{ order.technicianName }}</text>
              <text class="order-price">金额: ¥{{ order.amount }}</text>
            </view>
            <view class="order-actions">
              <button class="action-button" @click="viewOrderDetail(order.orderId)">查看详情</button>
              <button class="action-button primary" v-if="order.status === 'pending'" @click="payOrder(order.orderId)">立即支付</button>
            </view>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../../utils/api';

export default {
  name: 'MyOrders',
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
    
    // 状态数据
    const currentTab = ref('all');
    const hasOrders = ref(false);
    const orders = ref([]);
    const loading = ref(false);
    const showCreateForm = ref(false);
    
    // 创建订单相关数据
    const createOrderData = ref({
      projectId: '',
      technicianId: '',
      timeSlot: '',
      projectName: '',
      technicianName: '',
      price: 0
    });
    
    // 获取路由参数
    const getRouteParams = () => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      return currentPage.options || {};
    };
    
    // 加载订单数据
    const loadOrdersByStatus = async (status) => {
      try {
        loading.value = true;
        const res = await api.orders.getList({ status });
        if (res.code === 0 && res.data && res.data.list) {
          orders.value = res.data.list;
          hasOrders.value = orders.value.length > 0;
        } else {
          orders.value = [];
          hasOrders.value = false;
        }
      } catch (error) {
        console.error('获取订单数据失败:', error);
        uni.showToast({
          title: '获取订单数据失败',
          icon: 'none'
        });
        orders.value = [];
        hasOrders.value = false;
      } finally {
        loading.value = false;
      }
    };
    
    // 切换选项卡
    const switchTab = (tabName) => {
      currentTab.value = tabName;
      loadOrdersByStatus(tabName);
    };
    
    // 处理创建订单
    const handleCreateOrder = async () => {
      try {
        loading.value = true;
        const res = await api.orders.create(createOrderData.value);
        if (res.code === 0) {
          uni.showToast({
            title: '订单创建成功',
            icon: 'success'
          });
          // 创建成功后跳转到订单详情或待付款页面
          setTimeout(() => {
            showCreateForm.value = false;
            switchTab('pending');
          }, 1500);
        } else {
          uni.showToast({
            title: res.message || '订单创建失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('创建订单失败:', error);
        uni.showToast({
          title: '订单创建失败',
          icon: 'none'
        });
      } finally {
        loading.value = false;
      }
    };
    
    // 关闭创建表单
    const closeCreateForm = () => {
      showCreateForm.value = false;
    };
    
    // 导航返回
    const navigateBack = () => {
      if (showCreateForm.value) {
        closeCreateForm();
      } else {
        uni.navigateBack();
      }
    };
    
    // 获取订单状态文本
    const getStatusText = (status) => {
      const statusMap = {
        'pending': '待付款',
        'shipping': '待服务',
        'completed': '已完成',
        'canceled': '已取消'
      };
      return statusMap[status] || status;
    };
    
    // 查看订单详情
    const viewOrderDetail = (orderId) => {
      // 这里应该跳转到订单详情页面
      uni.navigateTo({
        url: `/pages/orders/order-detail?id=${orderId}`
      });
    };
    
    // 支付订单
    const payOrder = (orderId) => {
      // 这里应该调用支付相关API
      uni.showLoading({
        title: '处理中...'
      });
      
      // 模拟支付流程
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '支付成功',
          icon: 'success'
        });
        // 支付成功后刷新订单列表
        loadOrdersByStatus(currentTab.value);
      }, 1500);
    };
    
    // 获取项目详情用于创建订单
    const loadProjectDetailForCreate = async (projectId) => {
      try {
        const res = await api.projects.getDetail(projectId);
        if (res.code === 0 && res.data) {
          const project = res.data;
          createOrderData.value.projectName = project.name;
          createOrderData.value.price = project.price;
          
          // 如果有技师信息也填充
          if (createOrderData.value.technicianId && project.technicians) {
            const technician = project.technicians.find(t => t.id === createOrderData.value.technicianId);
            if (technician) {
              createOrderData.value.technicianName = technician.name;
            }
          }
        }
      } catch (error) {
        console.error('获取项目详情失败:', error);
      }
    };
    
    // 页面加载时的处理
    onMounted(() => {
      getSystemInfo();
      const params = getRouteParams();
      
      // 检查是否是从项目详情页面跳转过来创建订单的
      if (params.action === 'create' && params.projectId) {
        showCreateForm.value = true;
        createOrderData.value = {
          projectId: params.projectId,
          technicianId: params.technicianId || '',
          timeSlot: params.timeSlot || '',
          projectName: '',
          technicianName: '',
          price: 0
        };
        
        // 根据projectId获取项目详情，填充更多信息
        loadProjectDetailForCreate(params.projectId);
      } else if (params.status) {
        // 正常的订单列表查看
        currentTab.value = params.status;
        loadOrdersByStatus(params.status);
      } else {
        // 默认加载全部订单
        loadOrdersByStatus('all');
      }
    });
    
    return {
      statusBarHeight,
      currentTab,
      hasOrders,
      orders,
      loading,
      showCreateForm,
      createOrderData,
      switchTab,
      handleCreateOrder,
      closeCreateForm,
      navigateBack,
      getStatusText,
      viewOrderDetail,
      payOrder
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 750rpx;
  margin: 0 auto;
  background-color: #f5f5f5;
  min-height: 100vh;
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
  background-color: #FFFFFF;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  z-index: 9998;
}

.back-icon {
  color: #333333;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
}

.header-right {
  display: flex;
  align-items: center;
}

.ml-4 {
  margin-left: 32rpx;
}

/* 创建订单表单样式 */
.create-order-form {
  padding: 30rpx;
  background-color: #FFFFFF;
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  font-size: 30rpx;
  color: #333333;
}

.form-value {
  font-size: 30rpx;
  color: #666666;
}

.form-value.price {
  color: #FF5000;
  font-size: 36rpx;
  font-weight: bold;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
}

.cancel-button {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #f0f0f0;
  color: #333333;
  border-radius: 40rpx;
  font-size: 32rpx;
  margin-right: 20rpx;
}

.submit-button {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #FF5000;
  color: #FFFFFF;
  border-radius: 40rpx;
  font-size: 32rpx;
}

.submit-button:disabled {
  background-color: #CCCCCC;
}

/* 搜索框样式 */
.search-container {
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
}

.search-input {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 60rpx;
  padding: 15rpx 30rpx;
}

.search-icon {
  color: #999999;
  margin-right: 10rpx;
}

.search-placeholder {
  color: #999999;
  font-size: 28rpx;
}

/* 订单选项卡样式 */
.order-tabs {
  display: flex;
  background-color: #FFFFFF;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 25rpx 0;
  position: relative;
}

.tab-text {
  font-size: 28rpx;
  color: #666666;
}

.tab-item.active .tab-text {
  color: #FF5000;
}

.tab-underline {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 6rpx;
  background-color: #FF5000;
  border-radius: 3rpx;
  opacity: 0;
  transition: opacity 0.3s;
}

.tab-underline.active {
  opacity: 1;
}

/* 订单列表样式 */
.order-list {
  padding: 20rpx;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  background-color: #FFFFFF;
  border-radius: 16rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  background-color: #FFFFFF;
  border-radius: 16rpx;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
}

/* 订单项样式 */
.orders-container {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
}

.order-item {
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.order-number {
  font-size: 28rpx;
  color: #999999;
}

.order-status {
  font-size: 28rpx;
  color: #FF5000;
}

.order-content {
  margin-bottom: 20rpx;
}

.order-project {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10rpx;
}

.order-time,
.order-technician,
.order-price {
  display: block;
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 10rpx;
}

.order-price {
  color: #FF5000;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
}

.action-button {
  padding: 0 30rpx;
  height: 70rpx;
  line-height: 70rpx;
  background-color: #f0f0f0;
  color: #333333;
  border-radius: 35rpx;
  font-size: 28rpx;
  margin-left: 20rpx;
}

.action-button.primary {
  background-color: #FF5000;
  color: #FFFFFF;
}
</style>