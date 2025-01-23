const manifest = {
  manifest_version: 3,
  name: "Claude to Markdown",
  version: "1.0.0",
  description: "Convert Claude conversations to Markdown format",
  permissions: ["activeTab"],
  // 暂时注释掉图标配置
  // icons: {
  //   "16": "icons/icon-16.png",
  //   "48": "icons/icon-48.png",
  //   "128": "icons/icon-128.png"
  // },
  background: {
    service_worker: "background.js"
  },
  content_scripts: [
    {
      matches: ["https://claude.ai/*"],
      js: ["content.js"]
    }
  ]
};

export default manifest; 