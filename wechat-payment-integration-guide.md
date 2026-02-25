# 微信支付集成指南

## 1. 微信支付配置

### 1.1 商户平台配置
1. 登录微信商户平台 (pay.weixin.qq.com)
2. 获取商户号 (mch_id)
3. 配置API密钥 (API Key)
4. 配置支付回调地址

### 1.2 小程序配置
1. 在小程序后台配置支付域名
2. 获取小程序AppID
3. 配置支付权限

## 2. 后端实现示例

### 2.1 订单创建接口
```python
from flask import Flask, request, jsonify
import uuid
import time
from datetime import datetime, timedelta

@app.route('/api/orders/create', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        
        # 验证参数
        if not data.get('items') or not data.get('totalAmount'):
            return jsonify({
                'code': 1001,
                'message': '参数错误',
                'data': None
            }), 400
        
        # 生成订单号
        order_no = f"ORDER{int(time.time() * 1000)}{uuid.uuid4().hex[:8]}"
        
        # 创建订单
        order = {
            'orderId': f"order_{uuid.uuid4().hex}",
            'orderNo': order_no,
            'status': 'pending',
            'totalAmount': data['totalAmount'],
            'items': data['items'],
            'paymentMethod': data.get('paymentMethod', 'wechat'),
            'source': data.get('source', 'cart'),
            'createTime': datetime.now().isoformat(),
            'expireTime': (datetime.now() + timedelta(minutes=30)).isoformat()
        }
        
        # 保存到数据库
        # save_order_to_db(order)
        
        return jsonify({
            'code': 0,
            'message': '订单创建成功',
            'data': order
        })
        
    except Exception as e:
        return jsonify({
            'code': 3001,
            'message': f'系统错误: {str(e)}',
            'data': None
        }), 500
```

### 2.2 微信支付参数生成
```python
import hashlib
import xml.etree.ElementTree as ET
import requests

def generate_wechat_pay_params(order_id, total_amount):
    """生成微信支付参数"""
    
    # 微信支付配置
    appid = "your_appid"
    mch_id = "your_mch_id"
    api_key = "your_api_key"
    notify_url = "https://yourdomain.com/api/payment/callback"
    
    # 构建统一下单参数
    params = {
        'appid': appid,
        'mch_id': mch_id,
        'nonce_str': generate_nonce_str(),
        'body': 'SPA项目支付',
        'out_trade_no': order_id,
        'total_fee': int(total_amount * 100),  # 转换为分
        'spbill_create_ip': get_client_ip(),
        'notify_url': notify_url,
        'trade_type': 'JSAPI'
    }
    
    # 生成签名
    params['sign'] = generate_sign(params, api_key)
    
    # 调用统一下单接口
    xml_data = dict_to_xml(params)
    response = requests.post(
        'https://api.mch.weixin.qq.com/pay/unifiedorder',
        data=xml_data,
        headers={'Content-Type': 'application/xml'}
    )
    
    # 解析响应
    result = xml_to_dict(response.text)
    
    if result['return_code'] == 'SUCCESS' and result['result_code'] == 'SUCCESS':
        # 生成小程序支付参数
        prepay_id = result['prepay_id']
        
        pay_params = {
            'timeStamp': str(int(time.time())),
            'nonceStr': generate_nonce_str(),
            'package': f'prepay_id={prepay_id}',
            'signType': 'MD5'
        }
        
        # 生成支付签名
        pay_params['paySign'] = generate_pay_sign(pay_params, api_key)
        
        return {
            'code': 0,
            'message': 'success',
            'data': pay_params
        }
    else:
        return {
            'code': 1004,
            'message': '支付参数生成失败',
            'data': None
        }

def generate_sign(params, api_key):
    """生成签名"""
    # 排序参数
    sorted_params = sorted(params.items())
    
    # 拼接字符串
    string_a = '&'.join([f'{k}={v}' for k, v in sorted_params if v])
    string_sign_temp = f'{string_a}&key={api_key}'
    
    # MD5签名
    return hashlib.md5(string_sign_temp.encode('utf-8')).hexdigest().upper()

def generate_pay_sign(params, api_key):
    """生成支付签名"""
    pay_params = {
        'appId': 'your_appid',
        'timeStamp': params['timeStamp'],
        'nonceStr': params['nonceStr'],
        'package': params['package'],
        'signType': params['signType']
    }
    
    return generate_sign(pay_params, api_key)
```

### 2.3 支付回调处理
```python
from flask import request
import xml.etree.ElementTree as ET

@app.route('/api/payment/callback', methods=['POST'])
def payment_callback():
    """微信支付回调处理"""
    try:
        # 获取回调数据
        xml_data = request.get_data()
        root = ET.fromstring(xml_data)
        
        # 解析回调参数
        callback_data = {}
        for child in root:
            callback_data[child.tag] = child.text
        
        # 验证签名
        if not verify_callback_sign(callback_data):
            return '<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[签名验证失败]]></return_msg></xml>'
        
        # 处理支付结果
        if callback_data['return_code'] == 'SUCCESS' and callback_data['result_code'] == 'SUCCESS':
            # 支付成功，更新订单状态
            order_id = callback_data['out_trade_no']
            transaction_id = callback_data['transaction_id']
            
            # 更新订单状态
            update_order_status(order_id, 'paid', transaction_id)
            
            return '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>'
        else:
            # 支付失败
            return '<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[支付失败]]></return_msg></xml>'
            
    except Exception as e:
        return '<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[系统错误]]></return_msg></xml>'

def verify_callback_sign(callback_data):
    """验证回调签名"""
    sign = callback_data.pop('sign', '')
    calculated_sign = generate_sign(callback_data, api_key)
    return sign == calculated_sign
```

## 3. 数据库设计

### 3.1 订单表 (orders)
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(64) UNIQUE NOT NULL,
    order_no VARCHAR(32) UNIQUE NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    source VARCHAR(20) NOT NULL,
    create_time DATETIME NOT NULL,
    pay_time DATETIME NULL,
    expire_time DATETIME NOT NULL,
    transaction_id VARCHAR(64) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3.2 订单项目表 (order_items)
```sql
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(64) NOT NULL,
    project_id VARCHAR(64) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    duration VARCHAR(50) NULL,
    technician_id VARCHAR(64) NULL,
    time_slot VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
```

## 4. 部署配置

### 4.1 环境变量
```bash
# 微信支付配置
WECHAT_APPID=your_appid
WECHAT_MCH_ID=your_mch_id
WECHAT_API_KEY=your_api_key
WECHAT_NOTIFY_URL=https://yourdomain.com/api/payment/callback

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=spa_db
DB_USER=root
DB_PASSWORD=password

# Redis配置（可选）
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### 4.2 Nginx配置
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location /api/payment/callback {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 5. 测试验证

### 5.1 沙箱环境测试
1. 使用微信支付沙箱环境
2. 配置沙箱商户号
3. 使用沙箱测试工具

### 5.2 生产环境验证
1. 验证支付回调地址
2. 测试支付流程
3. 验证订单状态更新
4. 测试异常情况处理

## 6. 监控告警

### 6.1 关键指标
- 支付成功率
- 支付失败率
- 订单创建量
- 支付回调响应时间

### 6.2 告警规则
- 支付成功率低于95%
- 支付回调失败率高于1%
- 订单创建异常
- 系统响应时间过长




