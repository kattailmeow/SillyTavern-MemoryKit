// apps/st-frontend-extension/src/index.tsx
// 最小注入钩子：页面加载时挂个全局，证明 bundle 被执行了
(function () {
  // @ts-ignore
  window.__MEMORYKIT_LOADED__ = true;
  console.log('[MemoryKit] frontend extension loaded');
})();