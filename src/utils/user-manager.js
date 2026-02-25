/**
 * 用户信息管理工具（基于Token认证）
 */
class UserManager {
  constructor() {
    this.currentUser = null;
  }

  /**
   * 初始化用户信息
   */
  init() {
    this.loadUserFromStorage();
  }

  /**
   * 从本地存储加载用户信息
   */
  loadUserFromStorage() {
    try {
      const userInfo = uni.getStorageSync('userInfo');
      const accessToken = uni.getStorageSync('accessToken');
      
      if (userInfo && accessToken) {
        this.currentUser = userInfo;
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  }

  /**
   * 设置当前用户信息
   */
  setUser(userInfo) {
    this.currentUser = userInfo;
    
    try {
      uni.setStorageSync('userInfo', userInfo);
    } catch (error) {
      console.error('保存用户信息失败:', error);
    }
  }

  /**
   * 获取当前用户信息
   */
  getCurrentUser() {
    if (!this.currentUser) {
      this.loadUserFromStorage();
    }
    return this.currentUser;
  }

  /**
   * 获取当前用户ID（兼容性方法）
   */
  getUserId() {
    const user = this.getCurrentUser();
    return user ? (user.userId || user.id) : null;
  }

  /**
   * 清除用户信息
   */
  clearUser() {
    this.currentUser = null;
    
    try {
      uni.removeStorageSync('userInfo');
      uni.removeStorageSync('accessToken');
      uni.removeStorageSync('refreshToken');
    } catch (error) {
      console.error('清除用户信息失败:', error);
    }
  }

  /**
   * 检查是否已登录（基于token）
   */
  isLoggedIn() {
    const accessToken = uni.getStorageSync('accessToken');
    return !!(accessToken && this.currentUser);
  }

  /**
   * 获取访问令牌
   */
  getAccessToken() {
    return uni.getStorageSync('accessToken');
  }

  /**
   * 获取刷新令牌
   */
  getRefreshToken() {
    return uni.getStorageSync('refreshToken');
  }
}

// 创建单例实例
const userManager = new UserManager();

export default userManager;
