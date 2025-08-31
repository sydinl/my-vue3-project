# SPA休闲会所项目后端接口文档

## 文档信息

- 版本：1.0.0
- 描述：SPA休闲会所项目后端接口文档

## 接口列表

### 1. 用户管理

#### 1.1 用户登录

- **接口名称**：用户登录
- **接口路径**：`/api/user/login`
- **请求方法**：POST
- **接口描述**：用户登录接口
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | phone | string | 手机号 |
  | password | string | 密码 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "token": "string, 用户token",
      "userInfo": {
        "userId": "string, 用户ID",
        "nickname": "string, 用户昵称",
        "avatar": "string, 用户头像",
        "points": "number, 积分",
        "balance": "number, 余额",
        "couponCount": "number, 优惠券数量",
        "cardCount": "number, 卡券数量"
      }
    }
  }
  ```

#### 1.2 获取用户信息

- **接口名称**：获取用户信息
- **接口路径**：`/api/user/info`
- **请求方法**：GET
- **接口描述**：获取用户详细信息
- **请求参数**：无
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "userId": "string, 用户ID",
      "nickname": "string, 用户昵称",
      "realName": "string, 真实姓名",
      "avatar": "string, 用户头像",
      "gender": "string, 性别",
      "birthdate": "string, 出生日期",
      "phone": "string, 手机号码",
      "points": "number, 积分",
      "balance": "number, 余额",
      "memberLevel": "string, 会员等级",
      "addressCount": "number, 地址数量",
      "favoriteCount": "number, 收藏数量"
    }
  }
  ```

#### 1.3 更新用户信息

- **接口名称**：更新用户信息
- **接口路径**：`/api/user/update`
- **请求方法**：POST
- **接口描述**：更新用户个人资料
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | nickname | string | 昵称 |
  | realName | string | 真实姓名 |
  | gender | string | 性别 |
  | birthdate | string | 出生日期 |
  | avatar | string | 头像URL |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息"
  }
  ```

#### 1.4 退出登录

- **接口名称**：退出登录
- **接口路径**：`/api/user/logout`
- **请求方法**：POST
- **接口描述**：用户退出登录
- **请求参数**：无
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息"
  }
  ```

### 2. 订单管理

#### 2.1 获取订单列表

- **接口名称**：获取订单列表
- **接口路径**：`/api/orders/list`
- **请求方法**：GET
- **接口描述**：获取用户订单列表
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | status | string | 订单状态: all/pending/shipping/completed/aftersale |
  | page | number | 页码 |
  | pageSize | number | 每页数量 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "total": "number, 总条数",
      "list": [
        {
          "orderId": "string, 订单ID",
          "status": "string, 订单状态",
          "totalPrice": "number, 订单总价",
          "createTime": "string, 创建时间",
          "items": [
            {
              "itemId": "string, 项目ID",
              "name": "string, 项目名称",
              "price": "number, 价格",
              "count": "number, 数量",
              "image": "string, 图片URL"
            }
          ]
        }
      ]
    }
  }
  ```

#### 2.2 获取订单详情

- **接口名称**：获取订单详情
- **接口路径**：`/api/orders/detail`
- **请求方法**：GET
- **接口描述**：获取订单详细信息
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | orderId | string | 订单ID |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "orderId": "string, 订单ID",
      "status": "string, 订单状态",
      "totalPrice": "number, 订单总价",
      "createTime": "string, 创建时间",
      "payTime": "string, 支付时间",
      "serviceTime": "string, 服务时间",
      "address": "object, 服务地址信息",
      "technician": "object, 技师信息",
      "items": [
        {
          "itemId": "string, 项目ID",
          "name": "string, 项目名称",
          "price": "number, 价格",
          "count": "number, 数量",
          "image": "string, 图片URL",
          "duration": "string, 时长"
        }
      ],
      "remarks": "string, 备注"
    }
  }
  ```

#### 2.3 创建订单

- **接口名称**：创建订单
- **接口路径**：`/api/orders/create`
- **请求方法**：POST
- **接口描述**：创建新订单
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | items | array | 订单项目列表 |
  | serviceTime | string | 服务时间 |
  | addressId | string | 地址ID |
  | technicianId | string | 技师ID |
  | couponId | string | 优惠券ID |
  | remarks | string | 备注 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "orderId": "string, 订单ID",
      "totalPrice": "number, 订单总价",
      "payUrl": "string, 支付链接"
    }
  }
  ```

### 3. 资产管理

#### 3.1 获取积分明细

- **接口名称**：获取积分明细
- **接口路径**：`/api/assets/points/list`
- **请求方法**：GET
- **接口描述**：获取用户积分明细
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | type | string | 类型: all/income/expense |
  | page | number | 页码 |
  | pageSize | number | 每页数量 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "total": "number, 总条数",
      "points": "number, 当前积分",
      "list": [
        {
          "id": "string, 记录ID",
          "type": "string, 类型: income/expense",
          "amount": "number, 积分数量",
          "source": "string, 来源/去向",
          "createTime": "string, 时间"
        }
      ]
    }
  }
  ```

#### 3.2 获取余额记录

- **接口名称**：获取余额记录
- **接口路径**：`/api/assets/balance/list`
- **请求方法**：GET
- **接口描述**：获取用户余额记录
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | month | string | 月份格式: YYYY-MM |
  | page | number | 页码 |
  | pageSize | number | 每页数量 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "total": "number, 总条数",
      "balance": "number, 当前余额",
      "list": [
        {
          "id": "string, 记录ID",
          "type": "string, 类型: recharge/consume/withdraw",
          "amount": "number, 金额",
          "source": "string, 来源/去向",
          "createTime": "string, 时间"
        }
      ]
    }
  }
  ```

#### 3.3 余额充值

- **接口名称**：余额充值
- **接口路径**：`/api/assets/balance/recharge`
- **请求方法**：POST
- **接口描述**：用户余额充值
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | amount | number | 充值金额 |
  | paymentMethod | string | 支付方式 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "orderId": "string, 充值订单ID",
      "payUrl": "string, 支付链接"
    }
  }
  ```

#### 3.4 获取优惠券列表

- **接口名称**：获取优惠券列表
- **接口路径**：`/api/assets/coupons/list`
- **请求方法**：GET
- **接口描述**：获取用户优惠券列表
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | status | string | 状态: unused/used/expired |
  | page | number | 页码 |
  | pageSize | number | 每页数量 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "total": "number, 总条数",
      "list": [
        {
          "id": "string, 优惠券ID",
          "name": "string, 优惠券名称",
          "value": "number, 优惠金额",
          "minOrderAmount": "number, 最低消费金额",
          "expiryDate": "string, 过期日期",
          "status": "string, 状态"
        }
      ]
    }
  }
  ```

#### 3.5 获取卡券列表

- **接口名称**：获取卡券列表
- **接口路径**：`/api/assets/cards/list`
- **请求方法**：GET
- **接口描述**：获取用户卡券列表
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | status | string | 状态: unused/used/expired |
  | page | number | 页码 |
  | pageSize | number | 每页数量 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "total": "number, 总条数",
      "list": [
        {
          "id": "string, 卡券ID",
          "name": "string, 卡券名称",
          "type": "string, 卡券类型",
          "balance": "number, 余额/次数",
          "expiryDate": "string, 过期日期",
          "status": "string, 状态"
        }
      ]
    }
  }
  ```

### 4. 项目管理

#### 4.1 获取项目列表

- **接口名称**：获取项目列表
- **接口路径**：`/api/projects/list`
- **请求方法**：GET
- **接口描述**：获取服务项目列表
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | category | string | 项目分类 |
  | page | number | 页码 |
  | pageSize | number | 每页数量 |
  | search | string | 搜索关键词 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "total": "number, 总条数",
      "list": [
        {
          "id": "string, 项目ID",
          "name": "string, 项目名称",
          "description": "string, 项目描述",
          "price": "number, 价格",
          "image": "string, 项目图片",
          "duration": "string, 时长",
          "category": "string, 分类"
        }
      ]
    }
  }
  ```

#### 4.2 获取项目详情

- **接口名称**：获取项目详情
- **接口路径**：`/api/projects/detail`
- **请求方法**：GET
- **接口描述**：获取项目详细信息
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | projectId | string | 项目ID |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "id": "string, 项目ID",
      "name": "string, 项目名称",
      "description": "string, 项目描述",
      "price": "number, 价格",
      "images": "array, 项目图片列表",
      "duration": "string, 时长",
      "category": "string, 分类",
      "details": "string, 项目详情",
      "reviews": "array, 用户评价"
    }
  }
  ```

#### 4.3 获取项目分类列表

- **接口名称**：获取项目分类列表
- **接口路径**：`/api/projects/categories`
- **请求方法**：GET
- **接口描述**：获取项目分类列表
- **请求参数**：无
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "list": [
        {
          "id": "string, 分类ID",
          "name": "string, 分类名称",
          "icon": "string, 分类图标",
          "projectCount": "number, 项目数量"
        }
      ]
    }
  }
  ```

#### 4.4 获取热门项目列表

- **接口名称**：获取热门项目列表
- **接口路径**：`/api/projects/hot`
- **请求方法**：GET
- **接口描述**：获取热门推荐项目列表
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | page | number | 页码 |
  | pageSize | number | 每页数量 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "total": "number, 总条数",
      "list": [
        {
          "id": "string, 项目ID",
          "name": "string, 项目名称",
          "description": "string, 项目描述",
          "price": "number, 价格",
          "originalPrice": "number, 原价",
          "image": "string, 项目图片",
          "salesCount": "number, 销量",
          "rating": "number, 评分"
        }
      ]
    }
  }
  ```

#### 4.5 获取个性化推荐项目

- **接口名称**：获取个性化推荐项目
- **接口路径**：`/api/projects/recommend`
- **请求方法**：GET
- **接口描述**：获取基于用户偏好的个性化推荐项目
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | page | number | 页码 |
  | pageSize | number | 每页数量 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "total": "number, 总条数",
      "list": [
        {
          "id": "string, 项目ID",
          "name": "string, 项目名称",
          "description": "string, 项目描述",
          "price": "number, 价格",
          "image": "string, 项目图片",
          "reason": "string, 推荐理由"
        }
      ]
    }
  }
  ```

#### 4.6 收藏/取消收藏项目

- **接口名称**：收藏/取消收藏项目
- **接口路径**：`/api/projects/favorite`
- **请求方法**：POST
- **接口描述**：收藏或取消收藏服务项目
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | projectId | string | 项目ID |
  | action | string | 操作: add/remove |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "isFavorited": "boolean, 是否已收藏"
    }
  }
  ```

#### 4.7 获取用户收藏项目列表

- **接口名称**：获取用户收藏项目列表
- **接口路径**：`/api/projects/favorites`
- **请求方法**：GET
- **接口描述**：获取用户收藏的项目列表
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | page | number | 页码 |
  | pageSize | number | 每页数量 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "total": "number, 总条数",
      "list": [
        {
          "id": "string, 项目ID",
          "name": "string, 项目名称",
          "price": "number, 价格",
          "image": "string, 项目图片",
          "collectTime": "string, 收藏时间"
        }
      ]
    }
  }
  ```

#### 4.8 获取项目可用时间

- **接口名称**：获取项目可用时间
- **接口路径**：`/api/projects/available-time`
- **请求方法**：GET
- **接口描述**：获取指定项目和技师的可用预约时间
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | projectId | string | 项目ID |
  | technicianId | string | 技师ID |
  | date | string | 预约日期格式: YYYY-MM-DD |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "date": "string, 预约日期",
      "availableSlots": [
        {
          "time": "string, 时间段开始时间",
          "available": "boolean, 是否可用",
          "reason": "string, 不可用原因"
        }
      ]
    }
  }
  ```

#### 4.9 获取项目详情图片

- **接口名称**：获取项目详情图片
- **接口路径**：`/api/projects/detail-images`
- **请求方法**：GET
- **接口描述**：获取项目的详细图片列表
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | projectId | string | 项目ID |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "images": [
        {
          "id": "string, 图片ID",
          "url": "string, 图片URL",
          "description": "string, 图片描述"
        }
      ]
    }
  }
  ```

#### 4.10 获取项目评论详情

- **接口名称**：获取项目评论详情
- **接口路径**：`/api/projects/reviews/detail`
- **请求方法**：GET
- **接口描述**：获取单个项目评论的详细信息
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | reviewId | string | 评论ID |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "id": "string, 评论ID",
      "userId": "string, 用户ID",
      "userName": "string, 用户名称",
      "userAvatar": "string, 用户头像",
      "projectId": "string, 项目ID",
      "projectName": "string, 项目名称",
      "rating": "number, 评分",
      "content": "string, 评价内容",
      "createTime": "string, 创建时间",
      "images": "array, 图片列表",
      "reply": "object, 商家回复信息"
    }
  }
  ```

#### 4.11 提交项目评价

- **接口名称**：提交项目评价
- **接口路径**：`/api/projects/reviews/submit`
- **请求方法**：POST
- **接口描述**：提交项目服务评价
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | orderId | string | 订单ID |
  | projectId | string | 项目ID |
  | rating | number | 评分(1-5) |
  | content | string | 评价内容 |
  | images | array | 图片列表 |
  | technicianRating | number | 技师评分 |
  | environmentRating | number | 环境评分 |
  | serviceRating | number | 服务评分 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "reviewId": "string, 评论ID"
    }
  }
  ```

### 5. 技师管理

#### 5.1 获取技师列表

- **接口名称**：获取技师列表
- **接口路径**：`/api/technicians/list`
- **请求方法**：GET
- **接口描述**：获取技师列表
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | page | number | 页码 |
  | pageSize | number | 每页数量 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "total": "number, 总条数",
      "list": [
        {
          "id": "string, 技师ID",
          "name": "string, 技师名称",
          "avatar": "string, 技师头像",
          "experience": "string, 工作经验",
          "rating": "number, 评分",
          "services": "array, 擅长项目"
        }
      ]
    }
  }
  ```

### 6. 评价管理

#### 6.1 获取用户评价

- **接口名称**：获取用户评价
- **接口路径**：`/api/reviews/list`
- **请求方法**：GET
- **接口描述**：获取用户评价列表
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | page | number | 页码 |
  | pageSize | number | 每页数量 |
  | projectId | string | 可选，项目ID |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "total": "number, 总条数",
      "list": [
        {
          "id": "string, 评价ID",
          "userId": "string, 用户ID",
          "userName": "string, 用户名称",
          "userAvatar": "string, 用户头像",
          "projectId": "string, 项目ID",
          "projectName": "string, 项目名称",
          "rating": "number, 评分",
          "content": "string, 评价内容",
          "createTime": "string, 创建时间",
          "images": "array, 图片列表"
        }
      ]
    }
  }
  ```

### 7. 分销管理

#### 7.1 获取分销中心数据

- **接口名称**：获取分销中心数据
- **接口路径**：`/api/distribution/data`
- **请求方法**：GET
- **接口描述**：获取用户分销中心数据
- **请求参数**：无
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "totalCommission": "number, 总佣金",
      "availableCommission": "number, 可提现佣金",
      "teamCount": "number, 团队人数",
      "todayOrderCount": "number, 今日订单数"
    }
  }
  ```

#### 7.2 获取分销订单列表

- **接口名称**：获取分销订单列表
- **接口路径**：`/api/distribution/orders`
- **请求方法**：GET
- **接口描述**：获取分销订单列表
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | page | number | 页码 |
  | pageSize | number | 每页数量 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "total": "number, 总条数",
      "list": [
        {
          "id": "string, 分销订单ID",
          "orderId": "string, 订单ID",
          "customerName": "string, 客户名称",
          "commission": "number, 佣金金额",
          "status": "string, 状态",
          "createTime": "string, 创建时间"
        }
      ]
    }
  }
  ```

#### 7.3 获取提现记录

- **接口名称**：获取提现记录
- **接口路径**：`/api/distribution/withdrawals`
- **请求方法**：GET
- **接口描述**：获取提现记录列表
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | page | number | 页码 |
  | pageSize | number | 每页数量 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "total": "number, 总条数",
      "list": [
        {
          "id": "string, 提现记录ID",
          "amount": "number, 提现金额",
          "status": "string, 状态",
          "createTime": "string, 申请时间",
          "completeTime": "string, 完成时间"
        }
      ]
    }
  }
  ```

#### 7.4 申请提现

- **接口名称**：申请提现
- **接口路径**：`/api/distribution/applyWithdrawal`
- **请求方法**：POST
- **接口描述**：申请佣金提现
- **请求参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | amount | number | 提现金额 |
  | accountInfo | object | 提现账户信息 |
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "withdrawalId": "string, 提现记录ID"
    }
  }
  ```

### 8. 门店管理

#### 8.1 获取门店地址列表

- **接口名称**：获取门店地址列表
- **接口路径**：`/api/stores/list`
- **请求方法**：GET
- **接口描述**：获取门店地址列表
- **请求参数**：无
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "list": [
        {
          "id": "string, 门店ID",
          "name": "string, 门店名称",
          "address": "string, 门店地址",
          "phone": "string, 联系电话",
          "businessHours": "string, 营业时间",
          "latitude": "number, 纬度",
          "longitude": "number, 经度"
        }
      ]
    }
  }
  ```

### 9. 会员中心

#### 9.1 获取会员中心信息

- **接口名称**：获取会员中心信息
- **接口路径**：`/api/member/center`
- **请求方法**：GET
- **接口描述**：获取会员中心信息
- **请求参数**：无
- **响应格式**：
  ```json
  {
    "code": "number, 状态码",
    "message": "string, 提示信息",
    "data": {
      "level": "string, 会员等级",
      "points": "number, 当前积分",
      "nextLevelPoints": "number, 升级所需积分",
      "benefits": "array, 会员权益",
      "levelRules": "array, 等级规则"
    }
  }
  ```