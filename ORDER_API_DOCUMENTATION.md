# 订单接口文档

## 概述

本文档描述了订单管理相关的API接口，包括订单创建、查询、状态更新、支付等功能。

## 基础信息

- **API基础路径**: `/api/order`
- **请求方式**: `POST` / `GET` / `PUT`
- **数据格式**: `JSON`
- **字符编码**: `UTF-8`

## 通用响应格式

```json
{
  "code": 200,           // 状态码：200-成功，其他-失败
  "message": "success",  // 响应消息
  "data": {},            // 响应数据
  "timestamp": 1640995200000 // 时间戳
}
```

## 1. 订单管理接口

### 1.1 创建订单（简单方式）

**接口地址**: `POST /api/order`

**请求参数**:
```json
{
  "userId": "user-uuid-string",
  "status": "pending",
  "totalPrice": 159.00,
  "paymentMethod": "wechat",
  "orderNo": "ORDER16409952000001234",
  "source": "app",
  "addressId": "address-uuid-string",
  "technicianId": "technician-uuid-string",
  "couponId": "coupon-uuid-string",
  "remarks": "订单备注",
  "items": [
    {
      "projectId": "project-uuid-string",
      "projectName": "唐足道",
      "price": 159.00,
      "quantity": 1,
      "duration": "100分钟",
      "technicianId": "technician-uuid-string",
      "timeSlot": "14:00-15:00"
    }
  ]
}
```

**响应数据**:
```json
{
  "orderId": "order-uuid-string",
  "userId": "user-uuid-string",
  "status": "pending",
  "totalPrice": 159.00,
  "paymentMethod": "wechat",
  "orderNo": "ORDER16409952000001234",
  "source": "app",
  "createTime": "2024-01-01T10:00:00.000Z",
  "payTime": null,
  "serviceTime": null,
  "expireTime": "2024-01-01T10:30:00.000Z",
  "addressId": "address-uuid-string",
  "technicianId": "technician-uuid-string",
  "couponId": "coupon-uuid-string",
  "remarks": "订单备注",
  "wechatTransactionId": null,
  "wechatPrepayId": null,
  "items": [...]
}
```

### 1.2 创建订单（支付方式）

**接口地址**: `POST /api/order/create`

**请求参数**:
```json
{
  "items": [
    {
      "projectId": "9c5fe36d-91e2-4969-a1bb-c16ba5229120",
      "projectName": "唐足道",
      "price": 159,
      "quantity": 1,
      "duration": "100分钟",
      "technicianId": "",
      "timeSlot": ""
    }
  ],
  "totalAmount": 159,
  "paymentMethod": "wechat",
  "source": "app"
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": "order-uuid-string",
    "orderNo": "ORDER16409952000001234",
    "status": "pending",
    "totalAmount": 159,
    "paymentMethod": "wechat",
    "createTime": "2024-01-01T10:00:00.000Z",
    "expireTime": "2024-01-01T10:30:00.000Z"
  }
}
```

### 1.3 获取订单详情

**接口地址**: `GET /api/order/detail`

**请求参数**:
```
orderId: string (必填) - 订单ID
```

**响应数据**:
```json
{
  "orderId": "order-uuid-string",
  "userId": "user-uuid-string",
  "status": "pending",
  "totalPrice": 159.00,
  "paymentMethod": "wechat",
  "orderNo": "ORDER16409952000001234",
  "source": "app",
  "createTime": "2024-01-01T10:00:00.000Z",
  "payTime": null,
  "serviceTime": null,
  "expireTime": "2024-01-01T10:30:00.000Z",
  "addressId": "address-uuid-string",
  "technicianId": "technician-uuid-string",
  "couponId": "coupon-uuid-string",
  "remarks": "订单备注",
  "wechatTransactionId": null,
  "wechatPrepayId": null,
  "items": [...]
}
```

### 1.4 获取用户订单列表

**接口地址**: `GET /api/order/list`

**请求参数**:
```
userId: string (必填) - 用户ID
page: int (可选) - 页码，默认0
size: int (可选) - 每页大小，默认10
```

**响应数据**:
```json
{
  "content": [...], // 订单列表
  "totalElements": 100,
  "totalPages": 10,
  "size": 10,
  "number": 0
}
```

### 1.5 按状态获取用户订单列表

**接口地址**: `GET /api/order/listByStatus`

**请求参数**:
```
userId: string (必填) - 用户ID
status: string (必填) - 订单状态
page: int (可选) - 页码，默认0
size: int (可选) - 每页大小，默认10
```

**响应数据**:
```json
{
  "content": [...], // 订单列表
  "totalElements": 50,
  "totalPages": 5,
  "size": 10,
  "number": 0
}
```

### 1.6 更新订单状态

**接口地址**: `PUT /api/order/status`

**请求参数**:
```
orderId: string (必填) - 订单ID
status: string (必填) - 新状态
```

**响应数据**:
```json
{
  "orderId": "order-uuid-string",
  "status": "shipping",
  "updateTime": "2024-01-01T10:05:00.000Z"
}
```

## 2. 支付相关接口

### 2.1 获取微信支付参数

**接口地址**: `POST /api/order/payment/wechat/params`

**请求参数**:
```json
{
  "orderId": "order-uuid-string"
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "timeStamp": "1640995200",
    "nonceStr": "random-string",
    "packageValue": "prepay_id=wx123456789",
    "signType": "MD5",
    "paySign": "signature-string"
  }
}
```

### 2.2 查询支付状态

**接口地址**: `GET /api/order/payment/status`

**请求参数**:
```
orderId: string (必填) - 订单ID
```

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": "order-uuid-string",
    "status": "paid",
    "payTime": "2024-01-01T10:05:00.000Z",
    "transactionId": "wx123456789"
  }
}
```

### 2.3 支付回调处理

**接口地址**: `POST /api/order/payment/callback`

**请求参数**:
```json
{
  "callbackData": "微信支付回调数据"
}
```

**响应数据**:
```json
{
  "code": 0,
  "message": "success"
}