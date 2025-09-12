// 微信支付工具类
import api from './api.js';
import paymentStatusManager from './payment-status.js';
import PaymentConfig from './payment-config.js';

/**
 * 微信支付工具类
 */
class WeChatPayment {
  constructor() {
    this.isPaymentInProgress = false;
  }

  /**
   * 创建订单并获取支付参数
   * @param {Object} orderData - 订单数据
   * @returns {Promise} 支付参数
   */
  async createOrder(orderData) {
    try {
      const response = await api.orders.create(orderData);
      if (response.code === 0) {
        return response.data;
      } else {
        throw new Error(response.message || '创建订单失败');
      }
    } catch (error) {
      console.error('创建订单失败:', error);
      throw error;
    }
  }

  /**
   * 获取微信支付参数
   * @param {string} orderId - 订单ID
   * @returns {Promise} 微信支付参数
   */
  async getPaymentParams(orderId) {
    try {
      const response = await api.payment.getWeChatPayParams({ orderId });
      if (response.code === 0) {
        return response.data;
      } else {
        throw new Error(response.message || '获取支付参数失败');
      }
    } catch (error) {
      console.error('获取支付参数失败:', error);
      throw error;
    }
  }

  /**
   * 发起微信支付
   * @param {Object} paymentData - 支付数据
   * @returns {Promise} 支付结果
   */
  async pay(paymentData) {
    if (this.isPaymentInProgress) {
      throw new Error('支付正在进行中，请勿重复操作');
    }

    this.isPaymentInProgress = true;

    try {
      // 检查是否在微信小程序环境
      // #ifdef MP-WEIXIN
      return await this.payInWeChatMiniProgram(paymentData);
      // #endif

      // 检查是否在微信H5环境
      // #ifdef H5
      return await this.payInWeChatH5(paymentData);
      // #endif

      // 其他环境
      throw new Error('当前环境不支持微信支付');
    } finally {
      this.isPaymentInProgress = false;
    }
  }

  /**
   * 微信小程序支付
   * @param {Object} paymentData - 支付数据
   * @returns {Promise} 支付结果
   */
  async payInWeChatMiniProgram(paymentData) {
    return new Promise((resolve, reject) => {
      uni.requestPayment({
        provider: 'wxpay',
        timeStamp: paymentData.timeStamp,
        nonceStr: paymentData.nonceStr,
        package: paymentData.package,
        signType: paymentData.signType,
        paySign: paymentData.paySign,
        success: (res) => {
          console.log('支付成功:', res);
          resolve({
            success: true,
            result: res,
            message: '支付成功'
          });
        },
        fail: (err) => {
          console.error('支付失败:', err);
          if (err.errMsg && err.errMsg.includes('cancel')) {
            reject({
              success: false,
              error: 'user_cancel',
              message: '用户取消支付'
            });
          } else {
            reject({
              success: false,
              error: 'payment_failed',
              message: err.errMsg || '支付失败'
            });
          }
        }
      });
    });
  }

  /**
   * 微信H5支付
   * @param {Object} paymentData - 支付数据
   * @returns {Promise} 支付结果
   */
  async payInWeChatH5(paymentData) {
    return new Promise((resolve, reject) => {
      // H5环境下的微信支付需要跳转到微信支付页面
      if (paymentData.mweb_url) {
        // 跳转到微信支付页面
        window.location.href = paymentData.mweb_url;
        resolve({
          success: true,
          message: '正在跳转到微信支付...'
        });
      } else {
        reject({
          success: false,
          error: 'no_payment_url',
          message: '支付链接不存在'
        });
      }
    });
  }

  /**
   * 查询支付状态
   * @param {string} orderId - 订单ID
   * @returns {Promise} 支付状态
   */
  async queryPaymentStatus(orderId) {
    try {
      const response = await api.payment.queryStatus({ orderId });
      if (response.code === 0) {
        return response.data;
      } else {
        throw new Error(response.message || '查询支付状态失败');
      }
    } catch (error) {
      console.error('查询支付状态失败:', error);
      throw error;
    }
  }

  /**
   * 处理支付结果
   * @param {Object} result - 支付结果
   * @param {Function} onSuccess - 成功回调
   * @param {Function} onError - 错误回调
   * @param {string} orderId - 订单ID（用于状态检查）
   */
  handlePaymentResult(result, onSuccess, onError, orderId) {
    console.log('handlePaymentResult 被调用:', result);
    console.log('onSuccess 回调函数存在:', !!onSuccess);
    console.log('onError 回调函数存在:', !!onError);
    
    if (result.success) {
      // 支付成功，直接处理成功回调，不进行状态检查
      console.log('支付成功，直接调用成功回调');
      if (onSuccess) {
        console.log('正在调用成功回调...');
        onSuccess(result);
        console.log('成功回调调用完成');
      } else {
        console.error('成功回调函数不存在！');
      }
    } else {
      console.log('支付失败，调用失败回调');
      let errorMessage = '支付失败';
      
      if (result.error === 'user_cancel') {
        errorMessage = '支付已取消';
      } else if (result.error === 'payment_failed') {
        errorMessage = result.message || '支付失败，请重试';
      }
      
      uni.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 2000
      });
      
      if (onError) {
        onError(result);
      }
    }
  }

  /**
   * 完整的支付流程
   * @param {Object} orderData - 订单数据
   * @param {Function} onSuccess - 成功回调
   * @param {Function} onError - 错误回调
   */
  async processPayment(orderData, onSuccess, onError) {
    try {
      // 验证支付环境
      if (!PaymentConfig.isWeChatPaySupported()) {
        throw new Error('当前环境不支持微信支付');
      }

      // 验证订单数据
      PaymentConfig.validateOrderData(orderData);

      // 格式化订单数据
      const formattedOrderData = PaymentConfig.formatOrderData(orderData);

      // 显示加载提示
      uni.showLoading({
        title: '正在创建订单...',
        mask: true
      });

      // 1. 创建订单
      const order = await this.createOrder(formattedOrderData);
      console.log('订单创建成功:', order);

      uni.showLoading({
        title: '正在获取支付参数...',
        mask: true
      });

      // 2. 获取支付参数
      const paymentParams = await this.getPaymentParams(order.orderId);
      console.log('支付参数获取成功:', paymentParams);

      uni.hideLoading();

      // 3. 发起支付
      const paymentResult = await this.pay(paymentParams);
      
      // 4. 处理支付结果
      this.handlePaymentResult(paymentResult, onSuccess, onError, order.orderId);

    } catch (error) {
      uni.hideLoading();
      console.error('支付流程失败:', error);
      
      const errorResult = {
        success: false,
        error: PaymentConfig.errorCodes.PROCESS_FAILED,
        message: error.message || '支付流程失败'
      };
      
      this.handlePaymentResult(errorResult, onSuccess, onError);
    }
  }

  /**
   * 跳转到支付结果页面
   * @param {boolean} success - 支付是否成功
   * @param {string} message - 结果消息
   * @param {Object} data - 附加数据
   */
  navigateToPaymentResult(success, message, data = {}) {
    const params = {
      success: success.toString(),
      message: encodeURIComponent(message),
      orderId: data.orderId || '',
      orderNo: data.orderNo || '',
      totalAmount: data.totalAmount || '',
      payTime: data.payTime || new Date().toISOString()
    };

    const queryString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');

    uni.navigateTo({
      url: `/pages/payment/result?${queryString}`
    });
  }
}

// 创建支付实例
const weChatPayment = new WeChatPayment();

// 导出支付实例和类
export default weChatPayment;
export { WeChatPayment };
