import api from './api.js';
import userManager from './user-manager.js';

/**
 * 微信小程序登录管理类
 */
class WechatLoginManager {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.userInfo = null;
    this.tokenExpireTime = null;
  }

  /**
   * 初始化登录管理器
   */
  init() {
    // 从本地存储加载令牌
    this.loadTokensFromStorage();
    
    // 检查令牌是否过期
    if (this.accessToken && this.isTokenExpired()) {
      this.refreshAccessToken();
    }
  }

  /**
   * 从本地存储加载令牌
   */
  loadTokensFromStorage() {
    try {
      this.accessToken = uni.getStorageSync('accessToken');
      this.refreshToken = uni.getStorageSync('refreshToken');
      this.userInfo = uni.getStorageSync('userInfo');
      this.tokenExpireTime = uni.getStorageSync('tokenExpireTime');
    } catch (error) {
      console.error('加载令牌失败:', error);
    }
  }

  /**
   * 保存令牌到本地存储
   */
  saveTokensToStorage() {
    try {
      if (this.accessToken) {
        uni.setStorageSync('accessToken', this.accessToken);
      }
      if (this.refreshToken) {
        uni.setStorageSync('refreshToken', this.refreshToken);
      }
      if (this.userInfo) {
        uni.setStorageSync('userInfo', this.userInfo);
      }
      if (this.tokenExpireTime) {
        uni.setStorageSync('tokenExpireTime', this.tokenExpireTime);
      }
    } catch (error) {
      console.error('保存令牌失败:', error);
    }
  }

  /**
   * 检查令牌是否过期
   */
  isTokenExpired() {
    if (!this.tokenExpireTime) return true;
    return Date.now() > this.tokenExpireTime;
  }

  /**
   * 微信小程序登录
   */
  async login() {
    return new Promise((resolve, reject) => {
      // 检查是否在微信小程序环境
      // #ifdef MP-WEIXIN
      wx.login({
        success: async (res) => {
          if (res.code) {
            try {
              // 获取用户信息
              const userProfile = await this.getUserProfile();
              
              // 调用后端登录接口
              const loginData = {
                code: res.code,
                nickname: userProfile.nickname,
                avatarUrl: userProfile.avatarUrl,
                gender: userProfile.gender,
                city: userProfile.city,
                province: userProfile.province,
                country: userProfile.country,
                language: userProfile.language
              };

              const response = await api.wechat.miniprogramLogin(loginData);
              
              if (response.code === 200) {
                // 保存登录信息
                this.accessToken = response.data.accessToken;
                this.refreshToken = response.data.refreshToken;
                this.userInfo = {
                  userId: response.data.userId,
                  nickname: response.data.nickname,
                  avatarUrl: response.data.avatarUrl,
                  openId: response.data.openId,
                  unionId: response.data.unionId,
                  role: response.data.role,
                  enabled: response.data.enabled
                };
                this.tokenExpireTime = Date.now() + (response.data.expiresIn * 1000);
                
                // 保存到本地存储
                this.saveTokensToStorage();
                
                // 设置用户信息到用户管理器
                userManager.setUser({
                  userId: response.data.userId,
                  nickname: response.data.nickname,
                  avatarUrl: response.data.avatarUrl,
                  openId: response.data.openId,
                  unionId: response.data.unionId,
                  role: response.data.role,
                  enabled: response.data.enabled
                });
                
                resolve({
                  success: true,
                  data: response.data,
                  isNewUser: response.data.isNewUser
                });
              } else {
                reject(new Error(response.message || '登录失败'));
              }
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error('获取微信登录凭证失败: ' + res.errMsg));
          }
        },
        fail: (error) => {
          reject(new Error('微信登录失败: ' + error.errMsg));
        }
      });
      // #endif
      
      // #ifndef MP-WEIXIN
      // 非微信小程序环境，直接调用后端接口
      this.callBackendLogin().then(resolve).catch(reject);
      // #endif
    });
  }

  /**
   * 调用后端登录接口（非微信小程序环境）
   */
  async callBackendLogin() {
    try {
      // 获取用户信息
      const userProfile = await this.getUserProfile();
      
      // 调用后端登录接口
      const loginData = {
        code: 'dev_mock_code_' + Date.now(), // 开发环境使用模拟code
        nickname: userProfile.nickname,
        avatarUrl: userProfile.avatarUrl,
        gender: userProfile.gender,
        city: userProfile.city,
        province: userProfile.province,
        country: userProfile.country,
        language: userProfile.language
      };

      const response = await api.wechat.miniprogramLogin(loginData);
      
      if (response.code === 200) {
        // 保存登录信息
        this.accessToken = response.data.accessToken;
        this.refreshToken = response.data.refreshToken;
        this.userInfo = {
          userId: response.data.userId,
          nickname: response.data.nickname,
          avatarUrl: response.data.avatarUrl,
          openId: response.data.openId,
          unionId: response.data.unionId,
          role: response.data.role,
          enabled: response.data.enabled
        };
        this.tokenExpireTime = Date.now() + (response.data.expiresIn * 1000);
        
        // 保存到本地存储
        this.saveTokensToStorage();
        
        // 设置用户信息到用户管理器
        userManager.setUser({
          userId: response.data.userId,
          nickname: response.data.nickname,
          avatarUrl: response.data.avatarUrl,
          openId: response.data.openId,
          unionId: response.data.unionId,
          role: response.data.role,
          enabled: response.data.enabled
        });
        
        return {
          success: true,
          data: response.data,
          isNewUser: response.data.isNewUser
        };
      } else {
        throw new Error(response.message || '登录失败');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取用户信息（需要用户授权）
   */
  async getUserProfile() {
    return new Promise((resolve, reject) => {
      // #ifdef MP-WEIXIN
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          resolve({
            nickname: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
            gender: res.userInfo.gender,
            city: res.userInfo.city,
            province: res.userInfo.province,
            country: res.userInfo.country,
            language: res.userInfo.language
          });
        },
        fail: (error) => {
          // 如果用户拒绝授权，使用默认信息
          resolve({
            nickname: '微信用户',
            avatarUrl: '',
            gender: 0,
            city: '',
            province: '',
            country: '',
            language: 'zh_CN'
          });
        }
      });
      // #endif
      
      // #ifndef MP-WEIXIN
      resolve({
        nickname: '测试用户',
        avatarUrl: '',
        gender: 0,
        city: '',
        province: '',
        country: '',
        language: 'zh_CN'
      });
      // #endif
    });
  }

  /**
   * 刷新访问令牌
   */
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('没有刷新令牌');
    }

    try {
      const response = await api.wechat.refreshToken({
        refreshToken: this.refreshToken
      });

      if (response.code === 200) {
        this.accessToken = response.data.accessToken;
        this.tokenExpireTime = Date.now() + (response.data.expiresIn * 1000);
        this.saveTokensToStorage();
        return true;
      } else {
        throw new Error(response.message || '刷新令牌失败');
      }
    } catch (error) {
      // 刷新失败，清除本地令牌
      this.clearTokens();
      throw error;
    }
  }

  /**
   * 验证访问令牌
   */
  async validateToken() {
    if (!this.accessToken) {
      return false;
    }

    try {
      const response = await api.wechat.validateToken({
        accessToken: this.accessToken
      });

      return response.code === 200 && response.data.valid;
    } catch (error) {
      console.error('验证令牌失败:', error);
      return false;
    }
  }

  /**
   * 获取当前用户信息
   */
  getUserInfo() {
    return this.userInfo;
  }

  /**
   * 获取访问令牌
   */
  getAccessToken() {
    return this.accessToken;
  }

  /**
   * 检查是否已登录
   */
  isLoggedIn() {
    return userManager.isLoggedIn() && !this.isTokenExpired();
  }

  /**
   * 登出
   */
  async logout() {
    try {
      // 调用后端登出接口
      await api.user.logout();
    } catch (error) {
      console.error('调用登出接口失败:', error);
      // 即使后端登出失败，也要清除本地数据
    }
    
    this.clearTokens();
    uni.showToast({
      title: '已退出登录',
      icon: 'success'
    });
  }

  /**
   * 清除所有令牌
   */
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.userInfo = null;
    this.tokenExpireTime = null;

    try {
      uni.removeStorageSync('accessToken');
      uni.removeStorageSync('refreshToken');
      uni.removeStorageSync('userInfo');
      uni.removeStorageSync('tokenExpireTime');
    } catch (error) {
      console.error('清除令牌失败:', error);
    }
  }

  /**
   * 自动登录检查
   */
  async autoLogin() {
    if (this.isLoggedIn()) {
      // 验证令牌是否有效
      const isValid = await this.validateToken();
      if (isValid) {
        return true;
      } else {
        // 尝试刷新令牌
        try {
          await this.refreshAccessToken();
          return true;
        } catch (error) {
          console.error('自动登录失败:', error);
          return false;
        }
      }
    }
    return false;
  }
}

// 创建单例实例
const wechatLoginManager = new WechatLoginManager();

export default wechatLoginManager;
