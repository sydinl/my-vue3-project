// 支付状态管理工具
import api from './api.js';

/**
 * 支付状态管理类
 */
class PaymentStatusManager {
  constructor() {
    this.statusCheckInterval = null;
    this.maxRetryCount = 10; // 最大重试次数
    this.retryInterval = 2000; // 重试间隔（毫秒）
  }

  /**
   * 开始监听支付状态
   * @param {string} orderId - 订单ID
   * @param {Function} onSuccess - 支付成功回调
   * @param {Function} onError - 支付失败回调
   * @param {Function} onTimeout - 超时回调
   */
  startStatusCheck(orderId, onSuccess, onError, onTimeout) {
    if (this.statusCheckInterval) {
      this.stopStatusCheck();
    }

    let retryCount = 0;
    
    this.statusCheckInterval = setInterval(async () => {
      try {
        const status = await api.payment.queryStatus({ orderId });
        
        if (status.code === 0) {
          const paymentStatus = status.data.status;
          
          if (paymentStatus === 'paid') {
            // 支付成功
            this.stopStatusCheck();
            if (onSuccess) {
              onSuccess(status.data);
            }
          } else if (paymentStatus === 'failed' || paymentStatus === 'cancelled') {
            // 支付失败或取消
            this.stopStatusCheck();
            if (onError) {
              onError({
                status: paymentStatus,
                message: this.getStatusMessage(paymentStatus)
              });
            }
          } else if (paymentStatus === 'pending') {
            // 支付中，继续检查
            retryCount++;
            if (retryCount >= this.maxRetryCount) {
              // 超时
              this.stopStatusCheck();
              if (onTimeout) {
                onTimeout({
                  message: '支付状态检查超时，请手动刷新页面查看订单状态'
                });
              }
            }
          }
        } else {
          // API调用失败
          retryCount++;
          if (retryCount >= this.maxRetryCount) {
            this.stopStatusCheck();
            if (onError) {
              onError({
                status: 'api_error',
                message: '无法获取支付状态，请稍后重试'
              });
            }
          }
        }
      } catch (error) {
        console.error('检查支付状态失败:', error);
        retryCount++;
        if (retryCount >= this.maxRetryCount) {
          this.stopStatusCheck();
          if (onError) {
            onError({
              status: 'network_error',
              message: '网络异常，请检查网络连接'
            });
          }
        }
      }
    }, this.retryInterval);
  }

  /**
   * 停止监听支付状态
   */
  stopStatusCheck() {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
      this.statusCheckInterval = null;
    }
  }

  /**
   * 获取状态消息
   * @param {string} status - 支付状态
   * @returns {string} 状态消息
   */
  getStatusMessage(status) {
    const statusMessages = {
      'paid': '支付成功',
      'failed': '支付失败',
      'cancelled': '支付已取消',
      'pending': '支付中',
      'expired': '支付已过期'
    };
    
    return statusMessages[status] || '未知状态';
  }

  /**
   * 处理支付回调
   * @param {Object} callbackData - 回调数据
   * @returns {Promise} 处理结果
   */
  async handlePaymentCallback(callbackData) {
    try {
      const response = await api.payment.callback(callbackData);
      return response;
    } catch (error) {
      console.error('处理支付回调失败:', error);
      throw error;
    }
  }

  /**
   * 检查订单支付状态
   * @param {string} orderId - 订单ID
   * @returns {Promise} 支付状态
   */
  async checkOrderPaymentStatus(orderId) {
    try {
      const response = await api.payment.queryStatus({ orderId });
      if (response.code === 0) {
        return response.data;
      } else {
        throw new Error(response.message || '查询支付状态失败');
      }
    } catch (error) {
      console.error('查询订单支付状态失败:', error);
      throw error;
    }
  }

  /**
   * 显示支付状态提示
   * @param {string} status - 支付状态
   * @param {string} message - 自定义消息
   */
  showStatusToast(status, message) {
    const statusConfig = {
      'paid': {
        title: message || '支付成功',
        icon: 'success',
        duration: 2000
      },
      'failed': {
        title: message || '支付失败',
        icon: 'none',
        duration: 2000
      },
      'cancelled': {
        title: message || '支付已取消',
        icon: 'none',
        duration: 2000
      },
      'pending': {
        title: message || '支付中，请稍候...',
        icon: 'loading',
        duration: 0
      },
      'expired': {
        title: message || '支付已过期',
        icon: 'none',
        duration: 2000
      }
    };

    const config = statusConfig[status] || {
      title: message || '未知状态',
      icon: 'none',
      duration: 2000
    };

    uni.showToast(config);
  }

  /**
   * 清理资源
   */
  destroy() {
    this.stopStatusCheck();
  }
}

// 创建支付状态管理实例
const paymentStatusManager = new PaymentStatusManager();

// 导出实例和类
export default paymentStatusManager;
export { PaymentStatusManager };

