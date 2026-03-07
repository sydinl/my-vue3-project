<script>
import wechatLoginManager from './utils/wechat-login.js';
import userManager from './utils/user-manager.js';
import api from './utils/api.js';

export default {
  data() {
    return {
      // 启动时的推荐人参数（小程序码 scene 或链接 query），登录成功后用于绑定
      _launchReferrerId: null
    };
  },
  onLaunch: function (options) {
    console.log('App Launch');
    // 保存推荐人参数：优先 query.referrerId，其次 scene 整段当作 referrerId（如小程序码 scene）
    const query = options && options.query ? options.query : {};
    const scene = (options && options.scene) ? String(options.scene) : '';
    if (query.referrerId) {
      this._launchReferrerId = String(query.referrerId).trim();
    } else if (scene) {
      // 兼容 scene 为 "referrerId=xxx" 或 直接 "xxx"
      const k = 'referrerId=';
      const i = scene.indexOf(k);
      this._launchReferrerId = i >= 0 ? scene.slice(i + k.length).trim() : scene.trim();
    }
    
    userManager.init();
    wechatLoginManager.init();
    this.checkLoginStatus();
  },
  onShow: function () {
    console.log('App Show');
  },
  onHide: function () {
    console.log('App Hide');
  },
  methods: {
    async checkLoginStatus() {
      try {
        const isLoggedIn = await wechatLoginManager.autoLogin();
        if (!isLoggedIn) {
          uni.reLaunch({ url: '/pages/login/login' });
          return;
        }
        // 登录成功后：若启动时带有推荐人参数，则尝试绑定（仅未绑定过时后端会成功）
        const referrerId = this._launchReferrerId;
        if (referrerId) {
          this._launchReferrerId = null;
          try {
            const res = await api.distribution.bindReferrer(referrerId);
            if (res && res.code === 200) {
              console.log('推荐人绑定成功');
            }
          } catch (e) {
            console.warn('推荐人绑定请求失败', e);
          }
        }
      } catch (error) {
        console.error('检查登录状态失败:', error);
        uni.reLaunch({ url: '/pages/login/login' });
      }
    }
  }
}
</script>

<style>
/*每个页面公共css */
</style>
