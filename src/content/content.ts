import { exportConversation } from '../utils/core';

console.log('Content script loaded');

// 这里后续会添加转换为 Markdown 的逻辑
document.addEventListener('DOMContentLoaded', () => {
  // TODO: 实现转换功能
});

// 监听自定义事件
document.addEventListener('EXPORT_MARKDOWN', () => {
  console.log('Export markdown triggered');
  exportConversation();
}); 