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
      <view class="project-info">
        <image :src="createOrderData.image || '/static/icons/projects.png'" class="project-image"></image>
        <view class="project-details">
          <text class="project-name">{{ createOrderData.projectName || '加载中...' }}</text>
          <text class="project-detail-label" @click="goToProjectDetail">商品详情</text>
        </view>
      </view>
      <view class="form-item">
        <text class="form-label">数量</text>
        <view class="quantity-selector">
          <button class="quantity-btn" @click="decreaseQuantity" :disabled="createOrderData.quantity <= 1">-</button>
          <text class="quantity-value">{{ createOrderData.quantity }}</text>
          <button class="quantity-btn" @click="increaseQuantity">+</button>
        </view>
      </view>
      <view class="form-item">
        <text class="form-label">优惠券</text>
        <view class="coupon-selector" @click="selectCoupon">
          <text class="coupon-text">{{ selectedCoupon ? selectedCoupon.name : '选择优惠券' }}</text>
          <uni-icons type="right" size="16" class="arrow-icon"></uni-icons>
        </view>
      </view>
      <view class="form-item">
        <text class="form-label">订单金额</text>
        <view class="price-details">
          <text class="original-price">原价: ¥{{ (createOrderData.price * createOrderData.quantity) || 0 }}</text>
          <text v-if="discountAmount > 0" class="discount-amount">优惠: -¥{{ discountAmount }}</text>
          <text class="final-price">实付: ¥{{ finalPrice }}</text>
        </view>
      </view>
      <view class="form-item">
        <text class="form-label">支付方式</text>
        <view class="payment-methods">
          <view 
            class="payment-method" 
            :class="{ active: createOrderData.paymentMethod === 'wechat' }"
            @click="selectPaymentMethod('wechat')"
          >
            <image src="/static/icons/money.png" class="payment-icon"></image>
            <text class="payment-name">微信支付</text>
          </view>
          <view 
            class="payment-method" 
            :class="{ active: createOrderData.paymentMethod === 'balance' }"
            @click="selectPaymentMethod('balance')"
          >
            <image src="/static/icons/wallet.png" class="payment-icon"></image>
            <text class="payment-name">余额支付</text>
            <text class="balance-amount">余额: ¥{{ userBalance }}</text>
          </view>
        </view>
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
          <text class="tab-text">待支付</text>
          <view class="tab-underline" :class="{ active: currentTab === 'pending' }"></view>
        </view>
        <view class="tab-item" :class="{ active: currentTab === 'paid' }" @click="switchTab('paid')">
          <text class="tab-text">已支付</text>
          <view class="tab-underline" :class="{ active: currentTab === 'paid' }"></view>
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
              <text class="order-number">订单号: {{ order.orderNo }}</text>
              <text class="order-status">{{ getStatusText(order.status) }}</text>
            </view>
            <view class="order-content">
              <text class="order-project">{{ order.projectName }}</text>
              <text class="order-price">金额: ¥{{ order.totalAmount || order.finalAmount || order.amount || 0 }}</text>
              <view v-if="order.status === 'paid' && order.verificationCode" class="verification-code">
                <text class="verification-label">核销码:</text>
                <text class="verification-value">{{ order.verificationCode }}</text>
                <button class="copy-button" @click="copyVerificationCode(order.verificationCode)">复制</button>
              </view>
            </view>
            <view class="order-actions">
              <button class="action-button" @click="viewOrderDetail(order.orderId)">查看详情</button>
              <button class="action-button primary" v-if="order.status === 'pending'" @click="payOrder(order.orderId)">立即支付</button>
              <button class="action-button danger" v-if="order.status === 'pending'" @click="cancelOrder(order.orderId)">取消订单</button>
              <button
                class="action-button warning"
                v-if="canApplyRefund(order)"
                @click="applyRefund(order)"
              >
                申请退款
              </button>
            </view>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import api from '../../utils/api';
import weChatPayment from '../../utils/payment.js';
import PaymentConfig from '../../utils/payment-config.js';

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
      projectName: '',
      price: 0,
      quantity: 1,
      image: '',
      paymentMethod: 'wechat' // 默认选择微信支付
    });
    
    // 用户余额
    const userBalance = ref(0);
    
    // 优惠券相关
    const selectedCoupon = ref(null);
    const availableCoupons = ref([]);
    
    // 计算优惠金额
    const discountAmount = computed(() => {
      if (selectedCoupon.value && selectedCoupon.value.discountAmount) {
        return selectedCoupon.value.discountAmount;
      }
      return createOrderData.value.discountAmount || 0;
    });
    
    // 计算最终价格
    const finalPrice = computed(() => {
      if (selectedCoupon.value && selectedCoupon.value.finalAmount) {
        return selectedCoupon.value.finalAmount;
      }
      return createOrderData.value.finalAmount || (createOrderData.value.price * createOrderData.value.quantity);
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
        const res = await api.orders.getListByStatus({ status });
        if (res.code === 200 && res.data && res.data.content) {
          orders.value = res.data.content;
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
        
        // 检查余额支付时余额是否足够
        if (createOrderData.value.paymentMethod === 'balance') {
          if (userBalance.value < finalPrice.value) {
            uni.showToast({
              title: '余额不足，请选择其他支付方式',
              icon: 'none'
            });
            return;
          }
        }
        
        // 构建符合API期望格式的请求参数
        const orderRequest = {
          items: [{
            projectId: createOrderData.value.projectId,
            projectName: createOrderData.value.projectName,
            price: createOrderData.value.price,
            quantity: createOrderData.value.quantity || 1
          }],
          totalAmount: createOrderData.value.price * createOrderData.value.quantity,
          paymentMethod: createOrderData.value.paymentMethod,
          source: 'cart',
          couponCode: selectedCoupon.value ? selectedCoupon.value.code : '',
          discountAmount: discountAmount.value,
          finalAmount: finalPrice.value,
          remarks: createOrderData.value.remarks || ''
        };
        
        const res = await api.orders.create(orderRequest);
        if (res.code === 200) {
          uni.showToast({
            title: '订单创建成功',
            icon: 'success'
          });
          // 创建成功后跳转到订单详情或待付款页面
          setTimeout(() => {
            showCreateForm.value = false;
            switchTab('pending');
            // 刷新订单列表
            getOrders();
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

    // 跳转商品详情
    const goToProjectDetail = () => {
      const id = createOrderData.value.projectId;
      if (id) {
        uni.navigateTo({
          url: `/pages/projects/detail?id=${id}`
        });
      } else {
        uni.showToast({ title: '暂无商品详情', icon: 'none' });
      }
    };
    
    // 选择支付方式
    const selectPaymentMethod = (method) => {
      createOrderData.value.paymentMethod = method;
    };
    
    // 获取用户余额
    const getUserBalance = async () => {
      try {
        const res = await api.user.getInfo();
        if (res.code === 200 && res.data) {
          userBalance.value = res.data.balance || 0;
        }
      } catch (error) {
        console.error('获取用户余额失败:', error);
        userBalance.value = 0;
      }
    };
    
    // 数量控制
    const increaseQuantity = () => {
      createOrderData.value.quantity++;
    };
    
    const decreaseQuantity = () => {
      if (createOrderData.value.quantity > 1) {
        createOrderData.value.quantity--;
      }
    };
    
    // 获取可用优惠券
    const getAvailableCoupons = async () => {
      try {
        const totalAmount = createOrderData.value.price * createOrderData.value.quantity;
        const projectIds = createOrderData.value.projectId ? [createOrderData.value.projectId] : [];
        
        const res = await api.coupons.getAvailable({
          orderAmount: totalAmount,
          projectIds: projectIds.join(',')
        });
        
        if (res.code === 200 && res.data) {
          availableCoupons.value = res.data || [];
        }
      } catch (error) {
        console.error('获取优惠券失败:', error);
        availableCoupons.value = [];
      }
    };
    
    // 选择优惠券
    const selectCoupon = () => {
      if (availableCoupons.value.length === 0) {
        uni.showToast({
          title: '暂无可用的优惠券',
          icon: 'none'
        });
        return;
      }
      
      // 显示优惠券选择弹窗
      const couponNames = availableCoupons.value.map(coupon => coupon.couponName);
      couponNames.push('不使用优惠券');
      
      uni.showActionSheet({
        itemList: couponNames,
        success: (res) => {
          if (res.tapIndex < availableCoupons.value.length) {
            const selectedCouponData = availableCoupons.value[res.tapIndex];
            validateAndSelectCoupon(selectedCouponData);
          } else {
            selectedCoupon.value = null;
            // 重新计算价格
            calculateFinalPrice();
          }
        }
      });
    };

    // 验证并选择优惠券
    const validateAndSelectCoupon = async (couponData) => {
      try {
        uni.showLoading({ title: '验证优惠券...' });
        
        const totalAmount = createOrderData.value.price * createOrderData.value.quantity;
        const projectIds = createOrderData.value.projectId ? [createOrderData.value.projectId] : [];
        
        const res = await api.coupons.validate({
          couponCode: couponData.couponCode,
          orderAmount: totalAmount,
          projectIds: projectIds
        });
        
        if (res.code === 200 && res.data.valid) {
          selectedCoupon.value = {
            id: res.data.couponId,
            name: res.data.couponName,
            code: couponData.couponCode,
            discountAmount: res.data.discountAmount,
            finalAmount: res.data.finalAmount
          };
          
          // 重新计算价格
          calculateFinalPrice();
          
          uni.showToast({
            title: '优惠券验证成功',
            icon: 'success'
          });
        } else {
          uni.showToast({
            title: res.data.message || '优惠券验证失败',
            icon: 'error'
          });
        }
      } catch (error) {
        console.error('验证优惠券失败:', error);
        uni.showToast({
          title: '验证优惠券失败',
          icon: 'error'
        });
      } finally {
        uni.hideLoading();
      }
    };

    // 计算最终价格
    const calculateFinalPrice = async () => {
      try {
        const totalAmount = createOrderData.value.price * createOrderData.value.quantity;
        const projectIds = createOrderData.value.projectId ? [createOrderData.value.projectId] : [];
        
        const res = await api.coupons.calculate({
          originalAmount: totalAmount,
          couponCode: selectedCoupon.value ? selectedCoupon.value.code : '',
          projectIds: projectIds
        });
        
        if (res.code === 200) {
          // 更新价格信息
          createOrderData.value.totalAmount = res.data.originalAmount;
          createOrderData.value.discountAmount = res.data.discountAmount;
          createOrderData.value.finalAmount = res.data.finalAmount;
        }
      } catch (error) {
        console.error('计算价格失败:', error);
      }
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
        pending: '待支付',
        paid: '已支付',
        shipping: '服务中',
        completed: '已完成',
        cancelled: '已取消',
        refunded: '已退款'
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
    
    // 支付订单（调起微信支付）
    const payOrder = async (orderId) => {
      const order = orders.value.find(o => o.orderId === orderId);
      if (order && order.paymentMethod === 'balance') {
        uni.showToast({ title: '余额支付请使用其他入口', icon: 'none' });
        return;
      }
      if (!PaymentConfig.isWeChatPaySupported()) {
        uni.showToast({ title: '当前环境不支持微信支付', icon: 'none' });
        return;
      }
      try {
        uni.showLoading({ title: '获取支付参数...', mask: true });
        const res = await api.payment.getWeChatPayParams({ orderId });
        uni.hideLoading();
        if (res.code !== 200 || !res.data) {
          uni.showToast({ title: res.message || '获取支付参数失败', icon: 'none' });
          return;
        }
        const params = res.data;
        if (params.packageValue != null && params.package == null) params.package = params.packageValue;
        uni.showLoading({ title: '调起支付...', mask: true });
        const payResult = await weChatPayment.pay(params);
        uni.hideLoading();
        if (payResult && payResult.success) {
          uni.showToast({ title: '支付成功', icon: 'success' });
          loadOrdersByStatus(currentTab.value);
        } else {
          uni.showToast({ title: (payResult && payResult.message) || '支付失败', icon: 'none' });
        }
      } catch (err) {
        uni.hideLoading();
        const msg = err.message || (err.error === 'user_cancel' ? '用户取消支付' : '支付失败');
        uni.showToast({ title: msg, icon: 'none' });
      }
    };
    
    // 复制核销码
    const copyVerificationCode = (verificationCode) => {
      uni.setClipboardData({
        data: verificationCode,
        success: () => {
          uni.showToast({ title: '核销码已复制', icon: 'success' });
        },
        fail: () => {
          uni.showToast({ title: '复制失败', icon: 'error' });
        }
      });
    };

    // 申请服务
    const requestService = async (orderId) => {
      try {
        uni.showModal({
          title: '申请服务',
          content: '确定要申请开始服务吗？',
          success: async (res) => {
            if (res.confirm) {
              uni.showLoading({ title: '处理中...' });
              
              const result = await api.orders.updateStatus(orderId, 'shipping');
              if (result.code === 200) {
                uni.showToast({
                  title: '服务申请成功',
                  icon: 'success'
                });
                // 刷新订单列表
                loadOrders();
              } else {
                uni.showToast({
                  title: result.message || '申请失败',
                  icon: 'error'
                });
              }
            }
          }
        });
      } catch (error) {
        console.error('申请服务失败:', error);
        uni.showToast({
          title: '申请失败',
          icon: 'error'
        });
      } finally {
        uni.hideLoading();
      }
    };

    // 取消订单
    const cancelOrder = async (orderId) => {
      try {
        uni.showModal({
          title: '取消订单',
          content: '确定要取消这个订单吗？',
          success: async (res) => {
            if (res.confirm) {
              uni.showLoading({ title: '处理中...' });
              
              const result = await api.orders.cancel(orderId);
              if (result.code === 200) {
                uni.showToast({
                  title: '订单已取消',
                  icon: 'success'
                });
                // 刷新订单列表
                loadOrders();
              } else {
                uni.showToast({
                  title: result.message || '取消失败',
                  icon: 'error'
                });
              }
            }
          }
        });
      } catch (error) {
        console.error('取消订单失败:', error);
        uni.showToast({
          title: '取消失败',
          icon: 'error'
        });
      } finally {
        uni.hideLoading();
      }
    };

    // 是否可以申请退款：已支付/服务中，且未退款中/已退款
    const canApplyRefund = (order) => {
      if (!order) return false;
      const refundableStatus = ['paid', 'shipping'];
      if (!refundableStatus.includes(order.status)) return false;
      const rs = (order.refundStatus || '').toUpperCase();
      if (rs && rs !== 'NONE' && rs !== 'FAIL') return false;
      return true;
    };

    // 申请退款（前端常见原因选择，实际规则由后端校验）
    const applyRefund = (order) => {
      if (!order || !order.orderId) return;

      const reasons = ['不想要了', '下单信息有误', '计划有变无法到店', '其他原因'];
      uni.showActionSheet({
        itemList: reasons,
        success: (res) => {
          const reason = reasons[res.tapIndex] || '用户申请退款';
          uni.showModal({
            title: '申请退款',
            content: `确定要为该订单申请退款吗？\n原因：${reason}`,
            success: async (modalRes) => {
              if (!modalRes.confirm) return;
              try {
                uni.showLoading({ title: '正在提交退款申请...' });
                const result = await api.orders.applyRefund({
                  orderId: order.orderId,
                  reason
                });
                uni.hideLoading();
                if (result.code === 200) {
                  uni.showToast({
                    title: '退款申请已提交',
                    icon: 'success'
                  });
                  // 刷新当前标签下订单列表
                  loadOrdersByStatus(currentTab.value);
                } else {
                  uni.showToast({
                    title: result.message || '退款申请失败',
                    icon: 'none'
                  });
                }
              } catch (error) {
                uni.hideLoading();
                console.error('申请退款失败:', error);
                uni.showToast({
                  title: error.message || '申请退款失败',
                  icon: 'none'
                });
              }
            }
          });
        }
      });
    };
    
    // 获取项目详情用于创建订单
    const loadProjectDetailForCreate = async (projectId) => {
      try {
        const res = await api.projects.getDetail(projectId);
        if (res.code === 200 && res.data) {
          const project = res.data;
          createOrderData.value.projectName = project.name;
          createOrderData.value.price = project.price;
          
        }
      } catch (error) {
        console.error('获取项目详情失败:', error);
      }
    };
    
    // 页面加载时的处理
    onMounted(() => {
      getSystemInfo();
      getUserBalance(); // 获取用户余额
      getAvailableCoupons(); // 获取可用优惠券
      const params = getRouteParams();
      
      // 检查是否是从项目详情页面或主页面跳转过来创建订单的
      if (params.action === 'create' && params.projectId) {
        showCreateForm.value = true;
        createOrderData.value = {
          projectId: params.projectId,
          projectName: params.projectName ? decodeURIComponent(params.projectName) : '',
          price: params.price ? parseFloat(params.price) : 0,
          quantity: params.quantity ? parseInt(params.quantity) : 1,
          image: params.image ? decodeURIComponent(params.image) : ''
        };
        
        // 如果已经有项目名称，直接显示；否则根据projectId获取项目详情
        if (params.projectName) {
          // 从主页面跳转，直接显示项目信息
          uni.showToast({
            title: '订单预览',
            icon: 'success',
            duration: 1500
          });
        } else {
          // 从项目详情页面跳转，需要获取项目详情
          loadProjectDetailForCreate(params.projectId);
        }
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
      userBalance,
      selectedCoupon,
      discountAmount,
      finalPrice,
      switchTab,
      handleCreateOrder,
      closeCreateForm,
      goToProjectDetail,
      selectPaymentMethod,
      increaseQuantity,
      decreaseQuantity,
      selectCoupon,
      validateAndSelectCoupon,
      calculateFinalPrice,
      navigateBack,
      getStatusText,
      viewOrderDetail,
      payOrder,
      copyVerificationCode,
      cancelOrder,
      canApplyRefund,
      applyRefund
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

/* 项目信息样式 */
.project-info {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  margin-bottom: 20rpx;
}

.project-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.project-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.project-name {
  font-size: 32rpx;
  color: #333333;
  font-weight: bold;
}

.project-detail-label {
  font-size: 26rpx;
  color: #1989fa;
}

/* 数量选择器样式 */
.quantity-selector {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.quantity-btn {
  width: 60rpx;
  height: 60rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 50%;
  background-color: #f5f5f5;
  color: #333333;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn:disabled {
  background-color: #f0f0f0;
  color: #cccccc;
}

.quantity-value {
  font-size: 32rpx;
  color: #333333;
  min-width: 60rpx;
  text-align: center;
}

/* 优惠券选择器样式 */
.coupon-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 12rpx;
  background-color: #fafafa;
}

.coupon-text {
  font-size: 30rpx;
  color: #333333;
}

.arrow-icon {
  color: #999999;
}

/* 价格详情样式 */
.price-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5rpx;
}

.original-price {
  font-size: 26rpx;
  color: #999999;
  text-decoration: line-through;
}

.discount-amount {
  font-size: 26rpx;
  color: #4CAF50;
}

.final-price {
  font-size: 36rpx;
  color: #4CAF50;
  font-weight: bold;
}

/* 支付方式样式 */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 10rpx;
}

.payment-method {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  background-color: #fafafa;
  transition: all 0.3s;
}

.payment-method.active {
  border-color: #4CAF50;
  background-color: #f0f8f0;
}

.payment-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}

.payment-name {
  font-size: 30rpx;
  color: #333333;
  margin-right: 20rpx;
}

.balance-amount {
  font-size: 26rpx;
  color: #4CAF50;
  margin-left: auto;
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

.order-price {
  display: block;
  font-size: 28rpx;
  color: #FF5000;
  margin-bottom: 10rpx;
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

.action-button.success {
  background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%);
  color: #FFFFFF;
}

.action-button.warning {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  color: #FFFFFF;
}

.action-button.danger {
  background: linear-gradient(135deg, #F44336 0%, #D32F2F 100%);
  color: #FFFFFF;
}

.action-button.info {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: #FFFFFF;
}

.verification-code {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  padding: 20rpx;
  background: linear-gradient(135deg, #F0F8F0 0%, #E8F5E8 100%);
  border-radius: 12rpx;
  border: 2rpx solid #4CAF50;
}

.verification-label {
  font-size: 28rpx;
  color: #2E7D32;
  font-weight: bold;
  margin-right: 20rpx;
}

.verification-value {
  flex: 1;
  font-size: 32rpx;
  color: #4CAF50;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  letter-spacing: 2rpx;
}

.copy-button {
  padding: 10rpx 20rpx;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: #FFFFFF;
  border-radius: 20rpx;
  font-size: 24rpx;
  border: none;
}
</style>