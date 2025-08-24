import { ref } from 'vue';

// 购物车存储键名
const CART_STORAGE_KEY = 'spa_cart_items';

/**
 * 添加购物车功能的组合式函数
 * @param {Object} options - 配置选项
 * @param {Array} options.durations - 可选时长列表
 * @param {number} options.defaultDurationIndex - 默认选中的时长索引
 * @param {number} options.stockCount - 库存数量
 * @returns {Object} 包含状态和方法的对象
 */
export function useAddToCart(options = {}) {
  // 解构选项，设置默认值
  const { 
    durations = ['60分钟', '90分钟', '120分钟'],
    defaultDurationIndex = 0,
    stockCount = 1881
  } = options;

  // 底部弹出框相关状态
  const showBottomSheet = ref(false);
  const selectedItem = ref(null);
  const durationOptions = ref(durations);
  const selectedDuration = ref(durations[defaultDurationIndex]);
  const quantity = ref(1);
  const itemStockCount = ref(stockCount);

  /**
   * 打开底部弹出框
   * @param {Object} item - 选中的项目对象
   */
  const openBottomSheet = (item) => {
    selectedItem.value = item;
    selectedDuration.value = durations[defaultDurationIndex];
    quantity.value = 1;
    showBottomSheet.value = true;
  };

  /**
   * 关闭底部弹出框
   */
  const closeBottomSheet = () => {
    showBottomSheet.value = false;
  };

  /**
   * 选择时长
   * @param {string} duration - 选中的时长
   */
  const selectDuration = (duration) => {
    selectedDuration.value = duration;
  };

  /**
   * 增加数量
   */
  const increaseQuantity = () => {
    if (quantity.value < itemStockCount.value) {
      quantity.value++;
    } else {
      uni.showToast({ title: '已达到最大库存', icon: 'none' });
    }
  };

  /**
   * 减少数量
   */
  const decreaseQuantity = () => {
    if (quantity.value > 1) {
      quantity.value--;
    }
  };

  /**
   * 获取购物车数据
   * @returns {Array} 购物车项目数组
   */
  const getCartItems = () => {
    try {
      const cartItems = uni.getStorageSync(CART_STORAGE_KEY);
      return cartItems ? JSON.parse(cartItems) : [];
    } catch (e) {
      console.error('获取购物车数据失败:', e);
      return [];
    }
  };

  /**
   * 保存购物车数据
   * @param {Array} cartItems - 购物车项目数组
   */
  const saveCartItems = (cartItems) => {
    try {
      uni.setStorageSync(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('保存购物车数据失败:', e);
    }
  };

  /**
   * 确认加入购物车
   * @param {Function} callback - 加入购物车后的回调函数
   */
  const confirmAddToCart = (callback) => {
    if (selectedItem.value) {
      // 获取当前购物车数据
      const cartItems = getCartItems();
      
      // 创建要添加的购物车项目
      const cartItem = {
        id: selectedItem.value.id,
        name: selectedItem.value.name,
        price: selectedItem.value.price,
        originalPrice: selectedItem.value.originalPrice || selectedItem.value.price,
        quantity: quantity.value,
        duration: selectedDuration.value,
        img: selectedItem.value.img
      };
      
      // 检查购物车中是否已存在相同的项目
      const existingIndex = cartItems.findIndex(item => 
        item.id === cartItem.id && item.duration === cartItem.duration
      );
      
      // 如果存在则更新数量，否则添加新项目
      if (existingIndex >= 0) {
        cartItems[existingIndex].quantity += cartItem.quantity;
      } else {
        cartItems.push(cartItem);
      }
      
      // 保存更新后的购物车数据
      saveCartItems(cartItems);
      
      // 显示成功提示
      uni.showToast({
        title: `${selectedItem.value.name}已加入购物车`, 
        icon: 'success',
        duration: 2000
      });
      
      // 如果提供了回调函数，则调用它
      if (typeof callback === 'function') {
        callback({
          item: selectedItem.value,
          duration: selectedDuration.value,
          quantity: quantity.value
        });
      }
      
      // 关闭底部弹出框
      setTimeout(() => {
        closeBottomSheet();
      }, 1500);
    }
  };

  /**
   * 立即购买
   * @param {Function} callback - 立即购买后的回调函数
   */
  const buyNow = (callback) => {
    if (selectedItem.value) {
      uni.showToast({
        title: '即将跳转到订单确认页', 
        icon: 'none'
      });
      
      // 如果提供了回调函数，则调用它
      if (typeof callback === 'function') {
        callback({
          item: selectedItem.value,
          duration: selectedDuration.value,
          quantity: quantity.value
        });
      }
      
      closeBottomSheet();
    }
  };

  // 返回状态和方法
  return {
    // 状态
    showBottomSheet,
    selectedItem,
    durationOptions,
    selectedDuration,
    quantity,
    itemStockCount,
    
    // 方法
    openBottomSheet,
    closeBottomSheet,
    selectDuration,
    increaseQuantity,
    decreaseQuantity,
    confirmAddToCart,
    buyNow
  };
}