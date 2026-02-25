const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 确保输出目录存在
const outputDir = 'src/static/items';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 创建分销中心图片 - 放大字体和图案
async function createDistributionCenterImage() {
  const width = 400;
  const height = 300;
  
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- 背景渐变 - 与页面center-entry背景一致 -->
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#F0F8F0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E8F5E8;stop-opacity:1" />
        </linearGradient>
        
        <!-- 主卡片渐变 - 更柔和的绿色 -->
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#66BB6A;stop-opacity:0.9" />
          <stop offset="50%" style="stop-color:#4CAF50;stop-opacity:0.95" />
          <stop offset="100%" style="stop-color:#2E7D32;stop-opacity:0.9" />
        </linearGradient>
        
        <!-- 图标背景渐变 -->
        <linearGradient id="iconBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.95" />
          <stop offset="100%" style="stop-color:#F1F8E9;stop-opacity:0.9" />
        </linearGradient>
        
        <!-- 阴影效果 - 与页面阴影一致 -->
        <filter id="cardShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#4CAF50" flood-opacity="0.15"/>
        </filter>
        
        <filter id="iconShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#4CAF50" flood-opacity="0.1"/>
        </filter>
      </defs>
      
      <!-- 背景 -->
      <rect width="${width}" height="${height}" rx="20" ry="20" fill="url(#bg)"/>
      
      <!-- 顶部装饰条 - 与页面center-entry::before一致 -->
      <rect x="0" y="0" width="${width}" height="4" rx="20" ry="20" 
            fill="url(#cardGradient)"/>
      
      <!-- 主卡片 -->
      <rect x="20" y="50" width="${width-40}" height="${height-100}" rx="16" ry="16" 
            fill="url(#cardGradient)" filter="url(#cardShadow)"/>
      
      <!-- 卡片内边框 -->
      <rect x="25" y="55" width="${width-50}" height="${height-110}" rx="12" ry="12" 
            fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      
      <!-- 分销网络图标 -->
      <g transform="translate(${width/2}, ${height/2-5})" filter="url(#iconShadow)">
        <!-- 图标背景圆 - 放大 -->
        <circle cx="0" cy="0" r="55" fill="url(#iconBg)"/>
        
        <!-- 网络节点 - 放大 -->
        <g fill="#4CAF50" stroke="#2E7D32" stroke-width="2">
          <!-- 中心节点 -->
          <circle cx="0" cy="0" r="8" fill="#2E7D32"/>
          <circle cx="0" cy="0" r="4" fill="#FFFFFF"/>
          
          <!-- 周围节点 - 放大 -->
          <circle cx="-35" cy="-18" r="7" fill="#4CAF50"/>
          <circle cx="35" cy="-18" r="7" fill="#4CAF50"/>
          <circle cx="-35" cy="18" r="7" fill="#4CAF50"/>
          <circle cx="35" cy="18" r="7" fill="#4CAF50"/>
          <circle cx="0" cy="-30" r="7" fill="#4CAF50"/>
          <circle cx="0" cy="30" r="7" fill="#4CAF50"/>
          
          <!-- 连接线 - 加粗 -->
          <line x1="0" y1="0" x2="-35" y2="-18" stroke="#4CAF50" stroke-width="3" opacity="0.6"/>
          <line x1="0" y1="0" x2="35" y2="-18" stroke="#4CAF50" stroke-width="3" opacity="0.6"/>
          <line x1="0" y1="0" x2="-35" y2="18" stroke="#4CAF50" stroke-width="3" opacity="0.6"/>
          <line x1="0" y1="0" x2="35" y2="18" stroke="#4CAF50" stroke-width="3" opacity="0.6"/>
          <line x1="0" y1="0" x2="0" y2="-30" stroke="#4CAF50" stroke-width="3" opacity="0.6"/>
          <line x1="0" y1="0" x2="0" y2="30" stroke="#4CAF50" stroke-width="3" opacity="0.6"/>
        </g>
        
        <!-- 文字 - 放大 -->
        <text x="0" y="85" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" 
              font-size="26" font-weight="600">分销中心</text>
        <text x="0" y="110" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" 
              font-size="14">Distribution Center</text>
      </g>
    </svg>
  `;
  
  await sharp(Buffer.from(svgContent))
    .png()
    .toFile(path.join(outputDir, 'distribution-certificate.png'));
  
  console.log('✅ 分销中心图片已生成');
}

// 创建会员中心图片 - 放大字体和图案
async function createMemberCenterImage() {
  const width = 400;
  const height = 300;
  
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- 背景渐变 - 与页面center-entry背景一致 -->
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#F0F8F0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E8F5E8;stop-opacity:1" />
        </linearGradient>
        
        <!-- 主卡片渐变 - 更柔和的绿色 -->
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#66BB6A;stop-opacity:0.9" />
          <stop offset="50%" style="stop-color:#4CAF50;stop-opacity:0.95" />
          <stop offset="100%" style="stop-color:#2E7D32;stop-opacity:0.9" />
        </linearGradient>
        
        <!-- 图标背景渐变 -->
        <linearGradient id="iconBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.95" />
          <stop offset="100%" style="stop-color:#F1F8E9;stop-opacity:0.9" />
        </linearGradient>
        
        <!-- 金色渐变 -->
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FFA000;stop-opacity:1" />
        </linearGradient>
        
        <!-- 阴影效果 - 与页面阴影一致 -->
        <filter id="cardShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#4CAF50" flood-opacity="0.15"/>
        </filter>
        
        <filter id="iconShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#4CAF50" flood-opacity="0.1"/>
        </filter>
      </defs>
      
      <!-- 背景 -->
      <rect width="${width}" height="${height}" rx="20" ry="20" fill="url(#bg)"/>
      
      <!-- 顶部装饰条 - 与页面center-entry::before一致 -->
      <rect x="0" y="0" width="${width}" height="4" rx="20" ry="20" 
            fill="url(#cardGradient)"/>
      
      <!-- 主卡片 -->
      <rect x="20" y="50" width="${width-40}" height="${height-100}" rx="16" ry="16" 
            fill="url(#cardGradient)" filter="url(#cardShadow)"/>
      
      <!-- 卡片内边框 -->
      <rect x="25" y="55" width="${width-50}" height="${height-110}" rx="12" ry="12" 
            fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      
      <!-- 会员中心图标 -->
      <g transform="translate(${width/2}, ${height/2-5})" filter="url(#iconShadow)">
        <!-- 图标背景圆 - 放大 -->
        <circle cx="0" cy="0" r="55" fill="url(#iconBg)"/>
        
        <!-- 会员图标 - 放大 -->
        <g>
          <!-- 皇冠 - 放大 -->
          <path d="M-22,-15 L-12,-25 L-4,-20 L4,-20 L12,-25 L22,-15 L18,-5 L-18,-5 Z" 
                fill="url(#goldGradient)" stroke="#FFA000" stroke-width="1.5"/>
          
          <!-- 会员卡片 - 放大 -->
          <rect x="-30" y="-5" width="60" height="35" rx="5" ry="5" 
                fill="rgba(76,175,80,0.1)" stroke="#4CAF50" stroke-width="2"/>
          
          <!-- 卡片内容 - 放大 -->
          <circle cx="-15" cy="8" r="3.5" fill="#4CAF50"/>
          <rect x="-8" y="5" width="20" height="2" fill="#4CAF50" rx="1"/>
          <rect x="-8" y="10" width="15" height="2" fill="#4CAF50" rx="1"/>
          <rect x="-8" y="15" width="12" height="2" fill="#4CAF50" rx="1"/>
          
          <!-- VIP标识 - 放大 -->
          <text x="0" y="25" text-anchor="middle" fill="#2E7D32" font-family="Arial, sans-serif" 
                font-size="9" font-weight="bold">VIP</text>
        </g>
        
        <!-- 文字 - 放大 -->
        <text x="0" y="85" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" 
              font-size="26" font-weight="600">会员中心</text>
        <text x="0" y="110" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" 
              font-size="14">Member Center</text>
      </g>
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
    console.log('🎨 开始生成放大字体和图案的中心入口图片...');
    await createDistributionCenterImage();
    await createMemberCenterImage();
    console.log('🎉 所有图片生成完成！');
  } catch (error) {
    console.error('❌ 生成图片时出错:', error);
  }
}

generateImages();
