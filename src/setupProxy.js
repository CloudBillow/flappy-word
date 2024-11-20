const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
      '/api',
      createProxyMiddleware({
        target: 'http://117.72.53.38', // 目标服务器地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': '', // 去除 `/api` 前缀
        },
      })
  );
};
