# 配置文件说明

## 目录结构
```
src/config/
├── index.js      # 主配置文件
├── env.js        # 环境配置文件
└── README.md     # 配置说明文档
```

## 配置项说明

### 1. 微信小程序配置
- **appid**: 微信小程序的唯一标识
- 当前配置: `wxc1677434b58be76d`

### 2. API 配置
- **baseURL**: 后台接口的基础URL
- 当前配置: `https://iousxaoupndv.sealoshzh.site`
- **timeout**: 请求超时时间（毫秒）
- **headers**: 默认请求头

### 3. 环境配置
支持开发环境和生产环境的不同配置：

#### 开发环境 (development)
- API BaseURL: `https://iousxaoupndv.sealoshzh.site`
- 调试模式: 开启
- 日志级别: debug

#### 生产环境 (production)
- API BaseURL: `https://iousxaoupndv.sealoshzh.site`
- 调试模式: 关闭
- 日志级别: error

## 如何修改配置

### 修改微信小程序 AppID
编辑 `src/config/index.js` 文件中的 `wechat.appid` 字段。

### 修改 API BaseURL
编辑 `src/config/env.js` 文件中的 `ENV_CONFIG` 对象，修改对应环境的 `apiBaseURL` 字段。

### 切换环境
编辑 `src/config/env.js` 文件中的 `CURRENT_ENV` 变量：
- `'development'` - 开发环境
- `'production'` - 生产环境

## 使用示例

```javascript
import { getCurrentConfig } from '@/config/index.js';

const config = getCurrentConfig();
console.log('API BaseURL:', config.api.baseURL);
console.log('WeChat AppID:', config.wechat.appid);
```

## 注意事项

1. 修改配置后需要重新构建项目
2. 生产环境配置请确保 API BaseURL 正确
3. 微信小程序 AppID 需要在微信公众平台申请
