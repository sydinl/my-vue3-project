import { ref } from 'vue';

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
   * 确认加入购物车
   * @param {Function} callback - 加入购物车后的回调函数
   */
  const confirmAddToCart = (callback) => {
    if (selectedItem.value) {
      uni.showToast({
        title: `${selectedItem.value.name}已加入购物车`, 
        icon: 'success'
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