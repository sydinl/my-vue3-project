// 支付配置管理
export const PaymentConfig = {
  // 微信支付配置
  wechat: {
    // 支付超时时间（毫秒）
    timeout: 300000, // 5分钟
    
    // 状态检查间隔（毫秒）
    statusCheckInterval: 2000,
    
    // 最大重试次数
    maxRetryCount: 10,
    
    // 支付环境检测
    environments: {
      // 微信小程序
      miniprogram: 'MP-WEIXIN',
      // 微信H5
      h5: 'H5',
      // App
      app: 'APP'
    }
  },
  
  // 支付状态
  status: {
    PENDING: 'pending',     // 待支付
    PAID: 'paid',          // 已支付
    FAILED: 'failed',      // 支付失败
    CANCELLED: 'cancelled', // 已取消
    EXPIRED: 'expired'     // 已过期
  },
  
  // 支付方式
  methods: {
    WECHAT: 'wechat',      // 微信支付
    ALIPAY: 'alipay',      // 支付宝
    BALANCE: 'balance'     // 余额支付
  },
  
  // 订单来源
  sources: {
    CART: 'cart',          // 购物车
    DETAIL: 'detail',      // 商品详情
    ORDER: 'order'         // 订单页面
  },
  
  // 错误代码
  errorCodes: {
    USER_CANCEL: 'user_cancel',
    PAYMENT_FAILED: 'payment_failed',
    NETWORK_ERROR: 'network_error',
    API_ERROR: 'api_error',
    PROCESS_FAILED: 'process_failed',
    NO_PAYMENT_URL: 'no_payment_url'
  },
  
  // 获取当前环境
  getCurrentEnvironment() {
    // #ifdef MP-WEIXIN
    return this.wechat.environments.miniprogram;
    // #endif
    
    // #ifdef H5
    return this.wechat.environments.h5;
    // #endif
    
    // #ifdef APP
    return this.wechat.environments.app;
    // #endif
    
    return 'unknown';
  },
  
  // 检查是否支持微信支付
  isWeChatPaySupported() {
    const env = this.getCurrentEnvironment();
    return env === this.wechat.environments.miniprogram || 
           env === this.wechat.environments.h5;
  },
  
  // 获取支付超时时间
  getPaymentTimeout() {
    return this.wechat.timeout;
  },
  
  // 获取状态检查配置
  getStatusCheckConfig() {
    return {
      interval: this.wechat.statusCheckInterval,
      maxRetry: this.wechat.maxRetryCount
    };
  },
  
  // 验证订单数据
  validateOrderData(orderData) {
    const requiredFields = ['items', 'totalAmount', 'paymentMethod'];
    
    for (const field of requiredFields) {
      if (!orderData[field]) {
        throw new Error(`订单数据缺少必要字段: ${field}`);
      }
    }
    
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error('订单项目不能为空');
    }
    
    if (typeof orderData.totalAmount !== 'number' || orderData.totalAmount <= 0) {
      throw new Error('订单金额必须大于0');
    }
    
    if (!Object.values(this.methods).includes(orderData.paymentMethod)) {
      throw new Error('不支持的支付方式');
    }
    
    return true;
  },
  
  // 格式化订单数据，符合后端 CreateOrderRequest：items(projectId, projectName, price, quantity, duration)、totalAmount、paymentMethod、source
  formatOrderData(orderData) {
    const items = (orderData.items || []).map(item => ({
      projectId: String(item.projectId != null ? item.projectId : item.id),
      projectName: item.projectName != null ? item.projectName : item.name,
      price: Number(item.price),
      quantity: Number(item.quantity) || 1,
      duration: item.duration != null ? item.duration : ''
    }));
    const result = {
      items,
      totalAmount: Number(orderData.totalAmount),
      paymentMethod: orderData.paymentMethod || this.methods.WECHAT,
      source: orderData.source || this.sources.CART
    };
    if (orderData.couponCode) result.couponCode = orderData.couponCode;
    return result;
  },
  
  // 生成订单号
  generateOrderNo() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORDER${timestamp}${random}`;
  }
};

export default PaymentConfig;




