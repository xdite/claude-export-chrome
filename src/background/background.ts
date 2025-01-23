// 监听扩展安装
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// 监听扩展图标点击
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  
  try {
    // 检查是否在 claude.ai 的聊天页面
    if (tab.url?.includes('claude.ai/chat/')) {
      // 执行内容脚本
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // 触发自定义事件
          document.dispatchEvent(new CustomEvent('EXPORT_MARKDOWN'));
        }
      });
    } else {
      console.log('Not in a Claude chat page');
    }
  } catch (error) {
    console.error('Error executing script:', error);
  }
});

// 当标签页更新时检查是否应该启用按钮
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url?.includes('claude.ai/chat/')) {
    chrome.action.enable(tabId);
  } else {
    chrome.action.disable(tabId);
  }
}); 