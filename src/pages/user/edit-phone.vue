<template>
  <view class="edit-phone-container">
    <view class="nav-bar">
      <view class="back-btn" @tap="goBack">
        <uni-icons type="left" size="18" color="#333333"></uni-icons>
      </view>
      <view class="nav-title">绑定手机号</view>
      <view class="nav-right"></view>
    </view>
    <view class="form-section">
      <input
        v-model="phone"
        type="number"
        maxlength="11"
        class="phone-input"
        placeholder="请输入11位手机号"
        placeholder-class="placeholder"
      />
      <view class="form-tip">绑定后即可参与分销、发展下级并获取佣金</view>
      <button class="save-btn" :disabled="saving" @tap="save">保存</button>
    </view>
  </view>
</template>

<script>
import api from '@/utils/api.js';
import userManager from '@/utils/user-manager.js';

export default {
  name: 'EditPhone',
  data() {
    return {
      phone: '',
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
        if (res.code === 200 && res.data && res.data.phone) {
          this.phone = res.data.phone || '';
        }
      } catch (e) {
        console.error(e);
      }
    },
    goBack() {
      uni.navigateBack();
    },
    async save() {
      const p = (this.phone || '').trim().replace(/\D/g, '');
      if (p.length !== 11) {
        uni.showToast({ title: '请输入正确的11位手机号', icon: 'none' });
        return;
      }
      this.saving = true;
      try {
        const res = await api.user.updateInfo({ phone: p });
        if (res && res.code !== 200) {
          uni.showToast({ title: res.message || '保存失败', icon: 'none' });
          this.saving = false;
          return;
        }
        userManager.setUser({ ...userManager.getCurrentUser(), phone: p });
        const pendingReferrerId = uni.getStorageSync('pendingReferrerId');
        if (pendingReferrerId) {
          uni.removeStorageSync('pendingReferrerId');
          try {
            let referrerId = pendingReferrerId;
            if (referrerId.length === 32 && /^[0-9a-fA-F-]+$/.test(referrerId.replace(/-/g, ''))) {
              referrerId = referrerId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
            }
            const res = await api.distribution.bindReferrer(referrerId);
            if (res && res.code === 200) {
              uni.showToast({ title: '已绑定手机并成为下级', icon: 'success' });
            } else {
              uni.showToast({ title: '已绑定手机', icon: 'success' });
            }
          } catch (e) {
            uni.showToast({ title: '已绑定手机', icon: 'success' });
          }
        } else {
          uni.showToast({ title: '已保存', icon: 'success' });
        }
        setTimeout(() => uni.navigateBack(), 500);
      } catch (e) {
        uni.showToast({ title: e.message || e.data?.message || '保存失败', icon: 'none' });
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.edit-phone-container {
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
.phone-input {
  height: 48px;
  padding: 0 16px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 15px;
  color: #333;
  margin-bottom: 12px;
}
.placeholder {
  color: #999;
}
.form-tip {
  font-size: 12px;
  color: #999;
  margin-bottom: 24px;
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
