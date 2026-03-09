<template>
  <view class="edit-nickname-container">
    <view class="nav-bar">
      <view class="back-btn" @tap="goBack">
        <uni-icons type="left" size="18" color="#333333"></uni-icons>
      </view>
      <view class="nav-title">编辑昵称</view>
      <view class="nav-right"></view>
    </view>
    <view class="form-section">
      <input
        v-model="nickname"
        type="nickname"
        class="nickname-input"
        placeholder="请输入昵称，可点击键盘上方快速填入微信昵称"
        placeholder-class="placeholder"
      />
      <button class="save-btn" :disabled="saving" @tap="save">保存</button>
    </view>
  </view>
</template>

<script>
import api from '@/utils/api.js';
import userManager from '@/utils/user-manager.js';

export default {
  name: 'EditNickname',
  data() {
    return {
      nickname: '',
      saving: false
    };
  },
  onLoad() {
    this.loadCurrent();
  },
  methods: {
    async loadCurrent() {
      try {
        const res = await api.user.getInfo();
        if (res.code === 200 && res.data) {
          this.nickname = res.data.nickname || res.data.realName || '';
        }
      } catch (e) {
        console.error(e);
      }
    },
    goBack() {
      uni.navigateBack();
    },
    async save() {
      const n = (this.nickname || '').trim();
      if (!n) {
        uni.showToast({ title: '请输入昵称', icon: 'none' });
        return;
      }
      this.saving = true;
      try {
        await api.user.updateInfo({ nickname: n });
        userManager.setUser({ ...userManager.getCurrentUser(), nickname: n });
        uni.showToast({ title: '已保存', icon: 'success' });
        setTimeout(() => uni.navigateBack(), 500);
      } catch (e) {
        uni.showToast({ title: e.message || '保存失败', icon: 'none' });
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.edit-nickname-container {
  min-height: 100vh;
  background: #f5f5f5;
}
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}
.back-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
.nav-right {
  width: 24px;
}
.form-section {
  padding: 24px 16px;
  background: #fff;
  margin-top: 12px;
}
.nickname-input {
  height: 48px;
  padding: 0 16px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 15px;
  color: #333;
  margin-bottom: 24px;
}
.placeholder {
  color: #999;
}
.save-btn {
  width: 100%;
  height: 44px;
  background: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
}
.save-btn[disabled] {
  opacity: 0.6;
}
</style>
