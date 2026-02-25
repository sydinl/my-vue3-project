<script>
import wechatLoginManager from './utils/wechat-login.js';
import userManager from './utils/user-manager.js';

export default {
  onLaunch: function () {
    console.log('App Launch');
    
    // 初始化用户管理器
    userManager.init();
    
    // 初始化微信登录管理器
    wechatLoginManager.init();
    
    // 检查登录状态
    this.checkLoginStatus();
  },
  onShow: function () {
    console.log('App Show');
  },
  onHide: function () {
    console.log('App Hide');
  },
  methods: {
    // 检查登录状态
    async checkLoginStatus() {
      try {
        const isLoggedIn = await wechatLoginManager.autoLogin();
        if (!isLoggedIn) {
          // 未登录，跳转到登录页
          uni.reLaunch({
            url: '/pages/login/login'
          });
        }
      } catch (error) {
        console.error('检查登录状态失败:', error);
        // 检查失败，跳转到登录页
        uni.reLaunch({
          url: '/pages/login/login'
        });
      }
    }
  }
}
</script>

<style>
/*每个页面公共css */
</style>
