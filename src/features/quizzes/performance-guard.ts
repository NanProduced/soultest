/**
 * SoulTest 性能红线监控体系
 * 依据 @.doc/quiz_ui_customization_inventory_and_spec.md 实施
 */

export const PERFORMANCE_RED_LINES = {
  BUNDLE_SIZE_MB: 1.0,      // 单题 JS 包体阈值
  IMAGE_SIZE_MB: 2.0,       // 静态图片总大小阈值
  RENDER_TIME_MS: 100,      // 首屏渲染时长阈值
};

/**
 * 性能助手 - 用于在开发环境监控自定义页面的健康状况
 */
export const performanceGuard = {
  /**
   * 检查当前页面的资源加载情况
   */
  auditResources: () => {
    if (process.env.NODE_ENV !== "development") return;

    if (typeof window === "undefined" || !window.performance) return;

    const resources = window.performance.getEntriesByType("resource");
    let totalImgSize = 0;
    let totalJsSize = 0;

    resources.forEach((resource: any) => {
      if (resource.initiatorType === "img") {
        totalImgSize += resource.transferSize || 0;
      }
      if (resource.initiatorType === "script") {
        totalJsSize += resource.transferSize || 0;
      }
    });

    const imgSizeMB = totalImgSize / (1024 * 1024);
    const jsSizeMB = totalJsSize / (1024 * 1024);

    if (imgSizeMB > PERFORMANCE_RED_LINES.IMAGE_SIZE_MB) {
      console.warn(`[Performance Red Line] 图片资源过大: ${imgSizeMB.toFixed(2)}MB. 建议压缩图片或使用 WebP.`);
    }

    if (jsSizeMB > PERFORMANCE_RED_LINES.BUNDLE_SIZE_MB) {
      console.warn(`[Performance Red Line] JS 资源过大: ${jsSizeMB.toFixed(2)}MB. 检查是否误引入了大型库.`);
    }
  },

  /**
   * 监控组件渲染时长
   */
  traceRender: (slug: string, startTime: number) => {
    if (process.env.NODE_ENV !== "development") return;
    
    const duration = performance.now() - startTime;
    if (duration > PERFORMANCE_RED_LINES.RENDER_TIME_MS) {
      console.warn(`[Performance Red Line] ${slug} 渲染耗时过长: ${duration.toFixed(2)}ms. 请检查动效和重图表逻辑.`);
    }
  }
};
