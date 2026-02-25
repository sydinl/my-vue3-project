const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 确保输出目录存在
const outputDir = 'src/static/items';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 创建分销中心图片 - 按照原始SVG样式，改为青草绿色调
async function createDistributionCenterImage() {
  const width = 400;
  const height = 300;
  
  const svgContent = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- 背景渐变 - 青草绿色调 -->
        <linearGradient id="distBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F0F8F0" />
          <stop offset="100%" stop-color="#E8F5E8" />
        </linearGradient>
        <!-- 边框渐变 - 青草绿色调 -->
        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4CAF50" />
          <stop offset="100%" stop-color="#2E7D32" />
        </linearGradient>
        <!-- 按钮渐变 - 青草绿色调 -->
        <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#66BB6A" />
          <stop offset="100%" stop-color="#4CAF50" />
        </linearGradient>
        <!-- 月亮形状 -->
        <clipPath id="moonClip">
          <circle cx="${width*0.7}" cy="${height*0.25}" r="${width*0.15}" />
        </clipPath>
        <!-- 阴影效果 -->
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#4CAF50" flood-opacity="0.2"/>
        </filter>
      </defs>
      
      <!-- 主背景 -->
      <rect x="20" y="20" width="${width-40}" height="${height-40}" rx="20" ry="20" fill="url(#distBg)" filter="url(#shadow)"/>
      
      <!-- 装饰边框 -->
      <path d="M20,20 L${width-20},20 L${width-20},${height-20} L20,${height-20} Z M25,25 L${width-25},25 L${width-25},${height-25} L25,${height-25} Z" 
            fill="none" stroke="url(#borderGrad)" stroke-width="3" />
      
      <!-- 装饰角 -->
      <path d="M20,20 L50,20 L50,50 L20,50 Z" fill="url(#borderGrad)" />
      <path d="M${width-20},20 L${width-50},20 L${width-50},50 L${width-20},50 Z" fill="url(#borderGrad)" />
      <path d="M20,${height-20} L50,${height-20} L50,${height-50} L20,${height-50} Z" fill="url(#borderGrad)" />
      <path d="M${width-20},${height-20} L${width-50},${height-20} L${width-50},${height-50} L${width-20},${height-50} Z" fill="url(#borderGrad)" />
      
      <!-- 月亮装饰 -->
      <circle cx="${width*0.7}" cy="${height*0.25}" r="${width*0.15}" fill="#F1F8E9" opacity="0.8" />
      
      <!-- 分销网络图标 -->
      <g transform="translate(${width*0.3}, ${height*0.4})">
        <g fill="#4CAF50" stroke="#2E7D32" stroke-width="2">
          <!-- 中心节点 -->
          <circle cx="0" cy="0" r="8" fill="#2E7D32"/>
          <circle cx="0" cy="0" r="4" fill="#FFFFFF"/>
          
          <!-- 周围节点 -->
          <circle cx="-25" cy="-12" r="6" fill="#4CAF50"/>
          <circle cx="25" cy="-12" r="6" fill="#4CAF50"/>
          <circle cx="-25" cy="12" r="6" fill="#4CAF50"/>
          <circle cx="25" cy="12" r="6" fill="#4CAF50"/>
          <circle cx="0" cy="-20" r="6" fill="#4CAF50"/>
          <circle cx="0" cy="20" r="6" fill="#4CAF50"/>
          
          <!-- 连接线 -->
          <line x1="0" y1="0" x2="-25" y2="-12" stroke="#4CAF50" stroke-width="2" opacity="0.7"/>
          <line x1="0" y1="0" x2="25" y2="-12" stroke="#4CAF50" stroke-width="2" opacity="0.7"/>
          <line x1="0" y1="0" x2="-25" y2="12" stroke="#4CAF50" stroke-width="2" opacity="0.7"/>
          <line x1="0" y1="0" x2="25" y2="12" stroke="#4CAF50" stroke-width="2" opacity="0.7"/>
          <line x1="0" y1="0" x2="0" y2="-20" stroke="#4CAF50" stroke-width="2" opacity="0.7"/>
          <line x1="0" y1="0" x2="0" y2="20" stroke="#4CAF50" stroke-width="2" opacity="0.7"/>
        </g>
      </g>
      
      <!-- 文字 -->
      <text x="${width/2}" y="${height*0.6}" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#2E7D32" text-anchor="middle">分销中心</text>
      <text x="${width/2}" y="${height*0.7}" font-family="Arial, sans-serif" font-size="18" fill="#4CAF50" text-anchor="middle">一键分销 坐拥分红</text>
      
      <!-- 按钮 -->
      <rect x="${width*0.2}" y="${height*0.8}" width="${width*0.6}" height="50" rx="25" ry="25" fill="url(#btnGrad)" filter="url(#shadow)"/>
      <text x="${width/2}" y="${height*0.8 + 32}" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF" text-anchor="middle">点击加入分销</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svgContent))
    .png()
    .toFile(path.join(outputDir, 'distribution-certificate.png'));
  
  console.log('✅ 分销中心图片已生成');
}

// 创建会员中心图片 - 按照原始SVG样式，改为青草绿色调
async function createMemberCenterImage() {
  const width = 400;
  const height = 300;
  
  const svgContent = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- 背景渐变 - 青草绿色调 -->
        <linearGradient id="memberBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F0F8F0" />
          <stop offset="100%" stop-color="#E8F5E8" />
        </linearGradient>
        <!-- 边框渐变 - 青草绿色调 -->
        <linearGradient id="memberBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4CAF50" />
          <stop offset="100%" stop-color="#2E7D32" />
        </linearGradient>
        <!-- 按钮渐变 - 青草绿色调 -->
        <linearGradient id="memberBtnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#66BB6A" />
          <stop offset="100%" stop-color="#4CAF50" />
        </linearGradient>
        <!-- 金色渐变 -->
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFD700" />
          <stop offset="100%" stop-color="#FFA000" />
        </linearGradient>
        <!-- 阴影效果 -->
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#4CAF50" flood-opacity="0.2"/>
        </filter>
      </defs>
      
      <!-- 主背景 -->
      <rect x="20" y="20" width="${width-40}" height="${height-40}" rx="20" ry="20" fill="url(#memberBg)" filter="url(#shadow)"/>
      
      <!-- 装饰边框 -->
      <path d="M20,20 L${width-20},20 L${width-20},${height-20} L20,${height-20} Z M25,25 L${width-25},25 L${width-25},${height-25} L25,${height-25} Z" 
            fill="none" stroke="url(#memberBorderGrad)" stroke-width="3" />
      
      <!-- 装饰角 -->
      <path d="M20,20 L50,20 L50,50 L20,50 Z" fill="url(#memberBorderGrad)" />
      <path d="M${width-20},20 L${width-50},20 L${width-50},50 L${width-20},50 Z" fill="url(#memberBorderGrad)" />
      <path d="M20,${height-20} L50,${height-20} L50,${height-50} L20,${height-50} Z" fill="url(#memberBorderGrad)" />
      <path d="M${width-20},${height-20} L${width-50},${height-20} L${width-50},${height-50} L${width-20},${height-50} Z" fill="url(#memberBorderGrad)" />
      
      <!-- 会员图标 -->
      <g transform="translate(${width*0.3}, ${height*0.4})">
        <!-- 皇冠 -->
        <path d="M-20,-15 L-10,-25 L-3,-20 L3,-20 L10,-25 L20,-15 L15,-5 L-15,-5 Z" 
              fill="url(#goldGradient)" stroke="#FFA000" stroke-width="2"/>
        
        <!-- 会员卡片 -->
        <rect x="-25" y="-5" width="50" height="30" rx="5" ry="5" 
              fill="rgba(76,175,80,0.1)" stroke="#4CAF50" stroke-width="2"/>
        
        <!-- 卡片内容 -->
        <circle cx="-12" cy="8" r="3" fill="#4CAF50"/>
        <rect x="-6" y="5" width="16" height="2" fill="#4CAF50" rx="1"/>
        <rect x="-6" y="10" width="12" height="2" fill="#4CAF50" rx="1"/>
        <rect x="-6" y="15" width="10" height="2" fill="#4CAF50" rx="1"/>
        
        <!-- VIP标识 -->
        <text x="0" y="22" text-anchor="middle" fill="#2E7D32" font-family="Arial, sans-serif" 
              font-size="8" font-weight="bold">VIP</text>
      </g>
      
      <!-- 文字 -->
      <text x="${width/2}" y="${height*0.6}" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#2E7D32" text-anchor="middle">会员中心</text>
      <text x="${width/2}" y="${height*0.7}" font-family="Arial, sans-serif" font-size="18" fill="#4CAF50" text-anchor="middle">会员专享优惠</text>
      
      <!-- 按钮 -->
      <rect x="${width*0.2}" y="${height*0.8}" width="${width*0.6}" height="50" rx="25" ry="25" fill="url(#memberBtnGrad)" filter="url(#shadow)"/>
      <text x="${width/2}" y="${height*0.8 + 32}" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF" text-anchor="middle">点击加入会员</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svgContent))
    .png()
    .toFile(path.join(outputDir, 'member-certificate.png'));
  
  console.log('✅ 会员中心图片已生成');
}

// 执行生成
async function generateImages() {
  try {
    console.log('🎨 开始按照原始SVG样式生成青草绿色调的证书图片...');
    await createDistributionCenterImage();
    await createMemberCenterImage();
    console.log('🎉 所有图片生成完成！');
  } catch (error) {
    console.error('❌ 生成图片时出错:', error);
  }
}

generateImages();
