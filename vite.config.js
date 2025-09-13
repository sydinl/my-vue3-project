import { defineConfig } from 'vite'
import path from 'path'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni({
      vueOptions: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('uni-')
        }
      }
    }),
  ],
  // 静态资源处理配置
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.svg'],
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@static': path.resolve(__dirname, 'src/static')
    }
  },
  // 服务器配置
  server: {
    // 允许跨域
    cors: true,
    // 配置静态资源处理
    static: {
      // 指定静态资源目录
      directory: path.join(__dirname, 'src/static'),
      // 设置静态资源的访问前缀
      publicPath: '/static',
      // 启用gzip压缩
      gzip: true,
      // 缓存控制
      headers: {
        'Cache-Control': 'max-age=31536000'
      }
    },
    // 配置代理处理跨域问题
    // proxy: {
    //   '/api': {
    //     target: 'https://iousxaoupndv.sealoshzh.site',
    //     changeOrigin: true,
    //     secure: true, // 允许https
    //     rewrite: (path) => path.replace(/^\/api/, '/api')
    //   }
    // }
  },
  // 构建配置
  build: {
    // 静态资源处理
    assetsDir: 'static',
    rollupOptions: {
      output: {
        // 保持静态资源文件名不变
        assetFileNames: '[name].[ext]'
      }
    }
  }
})
