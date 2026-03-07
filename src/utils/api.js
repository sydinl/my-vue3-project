// API基础配置
// const API_BASE_URL = 'https://iousxaoupndv.sealoshzh.site';
const API_BASE_URL = 'https://wkudoxukpypt.sealoshzh.site';

// 导入用户管理器
import userManager from './user-manager.js';

// 处理token过期
const handleTokenExpired = async () => {
  try {
    const refreshToken = uni.getStorageSync('refreshToken');
    if (!refreshToken) {
      throw new Error('没有刷新令牌');
    }
    
    const response = await uni.request({
      url: `${API_BASE_URL}/api/wechat/miniprogram/refresh-token`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ refreshToken })
    });
    
    if (response.data.code === 200) {
      // 更新token
      uni.setStorageSync('accessToken', response.data.data.accessToken);
      return true;
    } else {
      throw new Error('刷新token失败');
    }
  } catch (error) {
    console.error('刷新token失败:', error);
    throw error;
  }
};

// 重试请求
const retryRequest = (url, method, data, options) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('accessToken');
    
    const requestOptions = {
      url: `${API_BASE_URL}${url}`,
      method,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*'
      },
      withCredentials: true,
      success: (res) => {
        if (res.statusCode === 200) {
          // 检查业务状态码
          if (res.data && res.data.code === 2001) {
            // 认证失败，跳转到登录页
            uni.showToast({ title: res.data.message || '认证失败，请重新登录', icon: 'none' });
            setTimeout(() => {
              uni.reLaunch({ url: '/pages/login/login' });
            }, 1500);
            reject(new Error('认证失败'));
            return;
          }
          resolve(res.data);
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        reject(err);
      },
      ...options
    };
    
    if (method === 'GET') {
      requestOptions.data = data;
    } else {
      requestOptions.data = JSON.stringify(data);
    }
    
    uni.request(requestOptions);
  });
};

// 请求方法封装
const request = (url, method, data = {}, options = {}) => {
  return new Promise((resolve, reject) => {
    // 获取存储的token（优先使用微信登录的accessToken）
    const wechatToken = uni.getStorageSync('accessToken');
    const userToken = uni.getStorageSync('userToken');
    const token = wechatToken || userToken;
    
    // 检查是否需要token的接口
    const needAuth = !url.includes('/login') && !url.includes('/register') && !url.includes('/public');
    
    if (needAuth && !token) {
      uni.showToast({ title: '请先登录', icon: 'none' });
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/login/login' });
      }, 1500);
      reject(new Error('用户未登录'));
      return;
    }
    
    // 构建请求参数
    const requestOptions = {
      url: `${API_BASE_URL}${url}`,
      method,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        // 添加CORS相关头信息
        'Access-Control-Allow-Origin': '*'
      },
      // 允许跨域携带凭证
      withCredentials: true,
      success: (res) => {
        if (res.statusCode === 200) {
          // 检查业务状态码
          if (res.data && res.data.code === 2001) {
            // 认证失败，跳转到登录页
            uni.showToast({ title: res.data.message || '认证失败，请重新登录', icon: 'none' });
            setTimeout(() => {
              uni.reLaunch({ url: '/pages/login/login' });
            }, 1500);
            reject(new Error('认证失败'));
            return;
          }
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // 未授权，尝试刷新token
          handleTokenExpired().then(() => {
            // 刷新成功后重试请求
            retryRequest(url, method, data, options).then(resolve).catch(reject);
          }).catch(() => {
            // 刷新失败，跳转到登录页
            uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' });
            setTimeout(() => {
              uni.reLaunch({ url: '/pages/login/login' });
            }, 1500);
            reject(new Error('未授权'));
          });
        } else {
          uni.showToast({ title: res.data?.message || '请求失败', icon: 'none' });
          reject(new Error(res.data?.message || `请求失败: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络异常，请重试', icon: 'none' });
        reject(err);
      },
      ...options
    };
    
    // 根据请求方法设置数据
    if (method === 'GET') {
      requestOptions.data = data;
    } else {
      requestOptions.data = JSON.stringify(data);
    }
    
    // 发起请求
    uni.request(requestOptions);
  });
};

// 统一处理分页参数
const handlePageParams = (params = {}) => {
  return {
    page: params.page || 1,
    pageSize: params.pageSize || 10,
    ...params
  };
};

// API接口方法
const api = {
  // 用户相关接口
  user: {
    // 用户登录
    login: (data) => request('/api/user/login', 'POST', data),
    
    // 获取用户信息
    getInfo: () => request('/api/user/info', 'GET'),
    
    // 更新用户信息
    updateInfo: (data) => request('/api/user/update', 'POST', data),
    
    // 退出登录
    logout: () => request('/api/user/logout', 'POST')
  },
  
  // 微信小程序登录相关接口
  wechat: {
    // 微信小程序登录
    miniprogramLogin: (data) => request('/api/wechat/miniprogram/login', 'POST', data),
    
    // 刷新访问令牌
    refreshToken: (data) => request('/api/wechat/miniprogram/refresh-token', 'POST', data),
    
    // 验证访问令牌
    validateToken: (data) => request('/api/wechat/miniprogram/validate-token', 'POST', data),
    
    // 获取用户信息
    getUserInfo: () => request('/api/wechat/miniprogram/userinfo', 'GET')
  },
  
  // 订单相关接口
  orders: {
    // 创建订单（简单方式）
    createSimple: (data) => request('/api/order/', 'POST', data),
    
    // 创建订单（支付方式）
    create: (data) => request('/api/order/create', 'POST', data),
    
    // 获取订单详情
    getDetail: (orderId) => request('/api/order/detail', 'GET', { orderId }),
    
    // 获取用户订单列表
    getList: (params) => request('/api/order/list', 'GET', handlePageParams(params)),
    
    // 按状态获取订单列表
    getListByStatus: (params) => request('/api/order/listByStatus', 'GET', handlePageParams(params)),
    
    // 更新订单状态
    updateStatus: (orderId, status) => request('/api/order/status', 'PUT', { orderId, status }),
    
    // 取消订单
    cancel: (orderId) => request('/api/order/status', 'PUT', { orderId, status: 'cancelled' }),
    
    // 确认收货
    confirm: (orderId) => request('/api/order/status', 'PUT', { orderId, status: 'completed' }),
    
    // 生成核销码
    generateVerificationCode: (orderId) => request('/api/order/verification/generate', 'POST', { orderId }),
    
    // 获取核销码
    getVerificationCode: (orderId) => request('/api/order/verification/get', 'GET', { orderId })
  },

  // 优惠券相关接口
  coupons: {
    // 验证优惠券
    validate: (data) => request('/api/order/coupon/validate', 'POST', data),
    
    // 获取可用优惠券列表
    getAvailable: (params) => request('/api/order/coupon/available', 'GET', params),
    
    // 计算最终金额
    calculate: (data) => request('/api/order/coupon/calculate', 'POST', data),
    
    // 用户领取优惠券（需要认证）
    claim: (data) => request('/api/coupons/user/claim', 'POST', data),
    
    // 获取用户优惠券列表（需要认证）
    getUserCoupons: (params) => request('/api/coupons/user/list', 'GET', params),
    
    // 获取用户可用优惠券（需要认证）
    getUserAvailable: () => request('/api/coupons/user/available', 'GET'),
    
    // 使用用户优惠券（需要认证）
    use: (data) => request('/api/coupons/user/use', 'POST', data),
    
    // 获取用户优惠券统计（需要认证）
    getUserStatistics: () => request('/api/coupons/user/statistics', 'GET'),
    
    // 公开领取优惠券（不需要认证）
    publicClaim: (data) => request('/api/coupons/public/claim', 'POST', data),
    
    // 公开获取用户优惠券列表（不需要认证）
    publicGetUserCoupons: (params) => request('/api/coupons/public/user/list', 'GET', params),
    
    // 公开获取用户可用优惠券（不需要认证）
    publicGetUserAvailable: (params) => request('/api/coupons/public/user/available', 'GET', params),
    
    // 公开验证优惠券（不需要认证）
    publicValidate: (data) => request('/api/coupons/validate', 'POST', data),
    
    // 公开获取优惠券列表（不需要认证）
    publicGetCoupons: (params) => request('/api/coupons/public/list', 'GET', params)
  },
  
  // 支付相关接口
  payment: {
    // 获取微信支付参数
    getWeChatPayParams: (data) => request('/api/order/payment/wechat/params', 'POST', data),
    
    // 查询支付状态
    queryStatus: (orderId) => request('/api/order/payment/status', 'GET', { orderId }),
    
    // 支付回调处理（内部使用）
    callback: (data) => request('/api/order/payment/callback', 'POST', data),
    
    // 申请退款
    refund: (data) => request('/api/payment/refund', 'POST', data)
  },
  
  // 资产相关接口
  assets: {
    // 积分明细
    getPointsList: (params) => request('/api/assets/points/list', 'GET', handlePageParams(params)),
    
    // 余额记录
    getBalanceList: (params) => request('/api/assets/balance/list', 'GET', handlePageParams(params)),
    
    // 余额充值
    recharge: (data) => request('/api/assets/balance/recharge', 'POST', data),
    
    // 获取优惠券列表
    getCouponsList: (params) => request('/api/assets/coupons/list', 'GET', handlePageParams(params)),
    
    // 获取卡券列表
    getCardsList: (params) => request('/api/assets/cards/list', 'GET', handlePageParams(params))
  },
  
  // 项目相关接口
  projects: {
    // 获取项目列表
    getList: (params) => request('/api/projects/list', 'GET', handlePageParams(params)),
    
    // 获取项目详情
    getDetail: (projectId) => request('/api/projects/detail', 'GET', { projectId }),
    
    // 获取项目分类列表
    getCategories: () => request('/api/projects/categories', 'GET'),
    
    // 获取热门项目列表
    getHotProjects: (params) => request('/api/projects/hot', 'GET', handlePageParams(params)),
    
    // 获取个性化推荐项目
    getRecommendProjects: (params) => request('/api/projects/recommend', 'GET', handlePageParams(params)),
    
    // 收藏/取消收藏项目
    toggleFavorite: (data) => request('/api/projects/favorite', 'POST', data),
    
    // 获取用户收藏项目列表
    getFavorites: (params) => request('/api/projects/favorites', 'GET', handlePageParams(params)),
    
    // 获取项目可用时间
    getAvailableTime: (params) => request('/api/projects/available-time', 'GET', params),
    
    // 获取项目详情图片
    getDetailImages: (projectId) => request('/api/projects/detail-images', 'GET', { projectId }),
    
    // 获取项目评论详情
    getReviewDetail: (reviewId) => request('/api/projects/reviews/detail', 'GET', { reviewId }),
    
    // 提交项目评价
    submitReview: (data) => request('/api/projects/reviews/submit', 'POST', data)
  },
  
  // 技师相关接口
  technicians: {
    // 获取技师列表
    getList: (params) => request('/api/technicians/list', 'GET', handlePageParams(params))
  },
  
  // 评价相关接口
  reviews: {
    // 获取用户评价
    getList: (params) => request('/api/reviews/list', 'GET', handlePageParams(params))
  },
  
  // 分销相关接口
  distribution: {
    // 获取分销中心数据
    getData: () => request('/api/distribution/data', 'GET'),
    
    // 绑定推荐人（二级分销一步：仅未绑定过时有效，需登录后调用）
    bindReferrer: (referrerId) => request('/api/distribution/bind-referrer', 'POST', { referrerId }),
    
    // 获取分销订单列表
    getOrders: (params) => request('/api/distribution/orders', 'GET', handlePageParams(params)),
    // 我的团队（一级、二级下级）
    getTeam: () => request('/api/distribution/team', 'GET'),
    // 推广信息（referrerId / scene 用于生成链接或小程序码）
    getPromotionInfo: () => request('/api/distribution/promotion-info', 'GET'),
    // 获取提现记录
    getWithdrawals: (params) => request('/api/distribution/withdrawals', 'GET', handlePageParams(params)),
    
    // 申请提现
    applyWithdrawal: (data) => request('/api/distribution/applyWithdrawal', 'POST', data)
  },
  
  // 门店相关接口
  stores: {
    // 获取门店地址列表
    getList: () => request('/api/stores/list', 'GET')
  },
  
  // 会员中心接口
  member: {
    // 获取会员中心信息
    getCenterInfo: () => request('/api/member/center', 'GET')
  }
};

// 添加调试信息
console.log('API模块加载成功', api);

// 导出API对象
export default api;

// 导出请求方法供其他地方使用
export { request };