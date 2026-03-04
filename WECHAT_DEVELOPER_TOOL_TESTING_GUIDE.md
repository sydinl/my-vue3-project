# 微信开发者工具测试指南

## 📋 目录
1. [环境准备](#环境准备)
2. [项目导入](#项目导入)
3. [基础配置](#基础配置)
4. [功能测试](#功能测试)
5. [支付功能测试](#支付功能测试)
6. [调试技巧](#调试技巧)
7. [常见问题](#常见问题)

---

## 🚀 环境准备

### 1. 下载微信开发者工具
- 下载地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
- 选择稳定版（Stable Build）下载并安装

### 2. 准备小程序账号
- 已有 AppID：`wxc1677434b58be76d`（已在 manifest.json 中配置）
- 如果没有 AppID，可以使用测试号：
  - 在微信开发者工具中点击"不使用云服务"
  - 选择"测试号"进行开发测试

---

## 📦 项目导入

### 步骤 1：打包项目
在项目根目录执行：
```powershell
npm run build:mp-weixin
```

### 步骤 2：导入到微信开发者工具
1. 打开微信开发者工具
2. 点击"+" → "导入项目"
3. **项目目录**：选择 `D:\WorkSpace\my-vue3-project\dist\build\mp-weixin`
4. **AppID**：`wxc1677434b58be76d`
5. **项目名称**：SPA休闲会所（或自定义）
6. 点击"导入"

### 步骤 3：首次编译
- 导入后会自动编译
- 等待编译完成，看到预览界面即成功

---

## ⚙️ 基础配置

### 1. 开发环境设置
在微信开发者工具中：
- **详情** → **本地设置** → 勾选以下选项：
  - ✅ **不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书**
  - ✅ **不校验安全域名 TLS 版本**
  - ✅ **启用调试**

> ⚠️ **重要**：这些设置仅在开发阶段使用，正式发布前需要配置合法域名！

### 2. 网络配置
- **设置** → **代理设置** → 选择"不使用代理"或"系统代理"
- 确保能访问后端 API：`https://wkudoxukpypt.sealoshzh.site`

### 3. 模拟器设置
- **设置** → **编辑** → 选择设备型号（建议 iPhone 6/7/8）
- 设置网络类型（WiFi/4G）

---

## 🧪 功能测试

### 1. 基础功能测试

#### 登录功能
1. 进入登录页面
2. 点击"微信登录"
3. 在开发者工具中会自动模拟登录
4. 检查是否成功获取 token 并存储

**预期结果**：
- 能成功调用 `wx.login()` 获取 code
- 后端返回 accessToken
- 成功跳转到首页

**调试方法**：
```javascript
// 在 Console 中查看
console.log('Token:', uni.getStorageSync('accessToken'));
```

#### 首页功能
1. 检查轮播图是否正常显示
2. 检查"精选项目"是否加载数据
3. 检查"资深技师"是否显示
4. 检查"顾客评价"是否加载

**调试方法**：
- 打开 **调试器** → **Console** 查看日志
- 查看 **Network** 面板检查 API 请求

#### 项目列表
1. 点击底部导航"项目"
2. 检查项目列表是否加载
3. 测试分类筛选
4. 测试搜索功能

#### 购物车
1. 添加商品到购物车
2. 检查购物车数据是否正确
3. 测试数量修改
4. 测试删除商品

---

## 💳 支付功能测试

### ⚠️ 重要说明

**微信支付在开发者工具中的限制**：
1. **真实支付无法测试**：开发者工具无法调用真实的微信支付
2. **需要使用真机调试**：支付功能必须在真机上测试
3. **沙箱环境**：可以使用微信支付沙箱环境进行测试

### 方法一：真机调试（推荐）

#### 步骤 1：开启真机调试
1. 在微信开发者工具中点击 **预览**
2. 生成二维码
3. 用微信扫码打开（必须是开发者账号绑定的微信）

#### 步骤 2：在手机上测试支付
1. 在手机上打开小程序
2. 完成登录
3. 添加商品到购物车
4. 点击"结算"或"立即购买"
5. 进入支付流程
6. 使用真实微信支付（小额测试）

#### 步骤 3：查看支付结果
- 支付成功后会跳转到支付结果页面
- 可以在"我的订单"中查看订单状态

### 方法二：模拟支付流程

由于开发者工具无法真实支付，可以修改代码模拟支付成功：

#### 临时修改支付代码（仅用于测试）

在 `src/utils/payment.js` 中临时添加模拟支付：

```javascript
// 在 payInWeChatMiniProgram 方法中添加开发环境判断
async payInWeChatMiniProgram(paymentData) {
  // 开发环境模拟支付（仅用于测试）
  // #ifdef MP-WEIXIN
  if (process.env.NODE_ENV === 'development') {
    console.log('开发环境：模拟支付成功');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          result: { errMsg: 'requestPayment:ok' },
          message: '支付成功（模拟）'
        });
      }, 1000);
    });
  }
  // #endif
  
  // 真实支付代码...
  return new Promise((resolve, reject) => {
    uni.requestPayment({
      // ... 原有代码
    });
  });
}
```

### 方法三：使用微信支付沙箱

#### 配置沙箱环境
1. 登录微信商户平台：https://pay.weixin.qq.com
2. 进入 **开发配置** → **沙箱环境**
3. 获取沙箱密钥
4. 修改后端 API 使用沙箱环境

#### 测试支付流程
1. 创建订单 → 调用 `/api/order/create`
2. 获取支付参数 → 调用 `/api/order/payment/wechat/params`
3. 发起支付 → 调用 `uni.requestPayment`
4. 查询支付状态 → 调用 `/api/order/payment/status`

### 支付流程测试检查清单

- [ ] **订单创建**
  - [ ] 购物车结算能创建订单
  - [ ] 立即购买能创建订单
  - [ ] 订单数据格式正确
  - [ ] 订单号生成正确

- [ ] **支付参数获取**
  - [ ] 能成功调用支付参数接口
  - [ ] 返回的支付参数格式正确
  - [ ] 包含必要的字段：timeStamp, nonceStr, package, signType, paySign

- [ ] **支付调用**
  - [ ] 能成功调用 `uni.requestPayment`
  - [ ] 支付参数传递正确
  - [ ] 支付成功回调正常
  - [ ] 支付失败/取消处理正常

- [ ] **支付结果处理**
  - [ ] 支付成功后跳转到结果页
  - [ ] 支付失败显示错误提示
  - [ ] 订单状态正确更新
  - [ ] 购物车正确清空（结算后）

---

## 🔍 调试技巧

### 1. Console 调试

#### 查看支付相关日志
```javascript
// 在支付代码中已添加的日志
console.log('订单创建成功:', order);
console.log('支付参数获取成功:', paymentParams);
console.log('支付成功:', res);
console.error('支付失败:', err);
```

#### 手动测试支付流程
在 Console 中执行：
```javascript
// 导入支付工具
import weChatPayment from '@/utils/payment.js';

// 测试订单数据
const testOrderData = {
  items: [
    {
      projectId: 'test-001',
      projectName: '测试项目',
      price: 0.01, // 使用最小金额测试
      quantity: 1
    }
  ],
  totalAmount: 0.01,
  paymentMethod: 'wechat',
  source: 'cart'
};

// 执行支付流程
weChatPayment.processPayment(
  testOrderData,
  (result) => {
    console.log('支付成功:', result);
  },
  (error) => {
    console.error('支付失败:', error);
  }
);
```

### 2. Network 调试

#### 查看 API 请求
1. 打开 **调试器** → **Network**
2. 筛选 **XHR** 或 **Fetch**
3. 查看请求详情：
   - Request Headers（检查 Authorization token）
   - Request Payload（检查请求数据）
   - Response（检查返回数据）

#### 常见 API 请求
- `POST /api/order/create` - 创建订单
- `POST /api/order/payment/wechat/params` - 获取支付参数
- `GET /api/order/payment/status` - 查询支付状态
- `GET /api/projects/hot` - 获取热门项目

### 3. Storage 调试

#### 查看存储的数据
在 Console 中：
```javascript
// 查看 token
console.log('AccessToken:', uni.getStorageSync('accessToken'));

// 查看购物车
console.log('Cart:', uni.getStorageSync('cart'));

// 查看用户信息
console.log('UserInfo:', uni.getStorageSync('userInfo'));

// 清空所有存储（谨慎使用）
// uni.clearStorageSync();
```

### 4. 断点调试

#### 设置断点
1. 在代码中点击行号设置断点
2. 触发对应功能
3. 查看变量值
4. 单步执行

#### 常用断点位置
- `src/utils/payment.js` - 支付流程
- `src/pages/cart/cart.vue` - 购物车结算
- `src/pages/projects/detail.vue` - 立即购买

---

## ❓ 常见问题

### Q1: 支付时提示"当前环境不支持微信支付"
**原因**：不在微信小程序环境中运行

**解决方案**：
1. 确保在微信开发者工具中运行
2. 检查 `PaymentConfig.isWeChatPaySupported()` 返回值
3. 确认 manifest.json 中 `mp-weixin` 配置正确

### Q2: 支付参数获取失败
**原因**：后端接口返回错误或网络问题

**解决方案**：
1. 检查 Network 面板查看请求是否成功
2. 检查后端 API 是否正常
3. 检查订单是否创建成功
4. 查看 Console 错误信息

### Q3: 支付成功后订单状态未更新
**原因**：支付回调未正确处理

**解决方案**：
1. 检查后端支付回调接口是否正常
2. 检查支付状态查询接口
3. 手动刷新订单列表

### Q4: 开发者工具中无法真实支付
**原因**：这是微信开发者工具的限制

**解决方案**：
1. 使用真机调试（推荐）
2. 使用支付沙箱环境
3. 临时修改代码模拟支付成功（仅测试用）

### Q5: 登录失败，提示"获取微信用户信息失败"
**原因**：AppID 或 Secret 配置错误，或网络问题

**解决方案**：
1. 检查 manifest.json 中的 appid 是否正确
2. 检查后端微信小程序配置
3. 检查网络连接
4. 查看后端日志

### Q6: API 请求被拦截，提示域名不在白名单
**原因**：未配置合法域名

**解决方案**：
1. 开发阶段：勾选"不校验合法域名"
2. 正式发布：在微信公众平台配置服务器域名

### Q7: 图片不显示
**原因**：图片路径错误或域名未配置

**解决方案**：
1. 检查图片路径是否正确
2. 开发阶段：勾选"不校验合法域名"
3. 正式发布：配置 downloadFile 合法域名

---

## 📝 测试检查清单

### 基础功能
- [ ] 登录功能正常
- [ ] 首页数据加载正常
- [ ] 项目列表显示正常
- [ ] 项目详情显示正常
- [ ] 购物车功能正常
- [ ] 用户中心显示正常

### 支付功能
- [ ] 购物车结算流程正常
- [ ] 立即购买流程正常
- [ ] 订单创建成功
- [ ] 支付参数获取成功
- [ ] 支付调用成功（真机测试）
- [ ] 支付结果处理正常
- [ ] 订单状态更新正常

### 其他功能
- [ ] 优惠券功能正常
- [ ] 分销功能正常
- [ ] 会员中心正常
- [ ] 订单列表正常
- [ ] 搜索功能正常

---

## 🎯 最佳实践

1. **开发阶段**：
   - 使用"不校验合法域名"快速开发
   - 使用 Console 和 Network 面板调试
   - 使用模拟数据测试流程

2. **测试阶段**：
   - 使用真机调试测试支付功能
   - 测试各种异常情况
   - 检查错误处理是否完善

3. **发布前**：
   - 配置合法域名
   - 关闭调试模式
   - 测试真实支付流程
   - 检查性能优化

---

## 📞 技术支持

如遇到问题：
1. 查看 Console 错误信息
2. 查看 Network 请求详情
3. 检查后端日志
4. 参考微信官方文档：https://developers.weixin.qq.com/miniprogram/dev/framework/

---

**最后更新**：2025-03-03
