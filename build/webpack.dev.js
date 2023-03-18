const common = require("./webpack.base");
const { merge } = require("webpack-merge");
const path = require("path");
module.exports = merge(common, {
  devtool: "eval-cheap-module-source-map", //控制台调试代码
  mode: "development", //开发环境webpack内置优化
//   output: {
//     path: path.resolve(__dirname, 'dist'), // 输出到哪个文件夹
//     filename: '[name].js' // 输出的文件名
// },
  devServer: {
    client: {
      progress: true,
    },
    compress: true, //gzip压缩
    hot: true, //热更新
    // open: true, //自动打开默认浏览器
    open: {
      app: {
        name: "goole-chrome", //走动打开chrome
        arguments: ["--incognito", "--new-window"], //无痕，新的窗口
      },
    },
    port: 8081, //监听端口
    proxy: {
        "/api": {
          target: "http://www.xxx.com:8080/api",
          secure: true, // 如果是https接口，需要配置这个参数
          changeOrigin: true,
          pathRewrite: { "^/finchinaAPP": "" },
        }
    }
  },
  //选择配置   cache缓存生成的webpack模块和chunk,主要用来提升构建速度.
  // 只在开发模式能用,默认是memory既缓存到内存中.
  // 如果想自定义缓存策略,需要把cache的type值由memory改成filesystem.
  // 比如修改默认缓存目录
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '.temp_cache'),
  },
});