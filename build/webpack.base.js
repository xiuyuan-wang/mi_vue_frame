const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin }=require("vue-loader")
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const path = require("path");
const resolve = (dir) => path.resolve(__dirname, dir);
module.exports = {
  entry: "./src/main.ts", //配置入口文件
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      //生成入口HTML文件
      template: "./index.html",
      filename: "index.html",
    }),
    new MiniCssExtractPlugin({
      //提取css到单独的文件中
      filename: "[name].css",
      chunkFilename: "css/chunk.[name].css",
      ignoreOrder: true,
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  optimization: {
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      new CssMinimizerPlugin(),
      new TerserPlugin({ // 压缩js
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"] // 删除console.log
          }
        }
      })
    ],
    splitChunks: {
      minChunks: 2,  //模块至少使用次数
      cacheGroups: {
          vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              chunks: 'all',
              priority: 2,  //2>0  nodulesmodules里的模块将优先打包进vendor
              minChunks: 1, // 只要使用一次就提取出来
              minSize: 0, // 提取代码体积大于0就提取出来
          },
          commons: {
              name: "commons",   //async异步代码分割 initial同步代码分割 all同步异步分割都开启
              chunks: "all",
              minSize: 30000,         //字节 引入的文件大于30kb才进行分割    
              priority: 0,   //优先级，先打包到哪个组里面，值越大，优先级越高
              minChunks: 2, // 只要使用两次就提取出来
              minSize: 0, // 提取代码体积大于0就提取出来
          }
      }
    }
  },
  module: {
    rules: [
        // {
        //     //解析器的执行顺序是从下往上(先css-loader再style-loader)
        //     test: /\.css$/i,
        //     use: [
        //       "style-loader",
        //       {
        //         loader: "css-loader",
        //         options: {
        //           esModule: false,
        //           modules: {
        //             auto: false, //modules 开关,移动端多页面模式关闭class hash命名
        //             localIdentName: "[local]_[hash:base64:8]", // 自定义生成的类名
        //           },
        //         },
        //       },
        //     ],
        //   },

        // sass-css处理
        // {
        //     test: /.s[ac]ss$/i,
        //     use: [
        //       // 将 JS 字符串生成为 style 节点
        //       'style-loader',
        //       // 将 CSS 转化成 CommonJS 模块
        //       'css-loader',
        //       // 将 Sass 编译成 CSS
        //       'sass-loader',
        //     ],
        //   },

        // less-css处理
        // {
        //     test: /\.less$/i,
        //     use: [
        //       // compiles Less to CSS
        //       "style-loader",
        //       "css-loader",
        //       "less-loader",
        //     ],
        // },

      //处理css 文件
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      //处理less文件
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      //处理vue文件
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              cssModules: {
                localIdentName: "[path][name]---[local]---[hash:base64:5]",
                camelCase: true,
              },
            },
          },
        ],
      },
      //处理ts,tsx,js文件
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /(node_modules|scripts[\\/]libs|geojson[\\/]new|share[\\/]libs|scripts\\i18n\\index)/,
        use: [
            "thread-loader",
            {
              loader: "babel-loader",
              options: {
                rootMode: "upward",
                cacheDirectory: true,
              }
            },
        ],
      },
    //   {
    //     test: /\.(t|j)s$/,
    //     exclude: /node_modules/,
    //     use: [
    //       {
    //         loader: 'ts-loader',
    //         options: {
    //           // 指定特定的ts编译配置，为了区分脚本的ts配置
    //           configFile: path.resolve(__dirname, '../tsconfig.loader.json'),
    //           // 对应文件添加个.ts或.tsx后缀
    //           appendTsSuffixTo: [/\.vue$/],
    //           transpileOnly: true, // ? 关闭类型检查，即只进行转译
    //         },
    //       },
    //     ],
    //   },
      //处理html
    //   {
    //     test: /\.html$/,
    //     use: [{ loader: "text-loader" }],
    //   },
      //处理图片
//       资源模块比如png svg jpg等图片或者txt等,webpack5之前都是用file-loader或者url-loader来处理.
// webpack5现在会自动处理,不用再手动配置.小于8kb的资源视为inline资源处理,否则视为resource处理.
// 比如如果我们想规定小于6kb的图片才内联inline处理,否则就resource 引入.
// webpack.common.js里
        {
            test: /\.(png|svg|jpg|gif)$/,
            type: 'asset',
            parser: {
            dataUrlCondition: {
                maxSize: 6 * 1024,//小于6kb的图片内联处理
            }
            }
        },
    //   {
    //     test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/i,
    //     use: [
    //       {
    //         loader: "url-loader",
    //         options: {
    //           name: "[path][name].[ext]",
    //           limit: 64,
    //           outputPath: "images",
    //         },
    //       },
    //     ],
    //   },
    //   //处理其他文件
    //   {
    //     test: /\.(woff2?|eot|ttf|otf|mtl|obj)(\?.*)?$/i,
    //     use: [
    //       {
    //         loader: "file-loader",
    //         options: {
    //           name: "[path][name].[ext]",
    //           outputPath: "font",
    //         },
    //       },
    //     ],
    //   },
    ],
  },
  resolve: {
    alias: {
      //别名配置
      "@": resolve("../src"),
      src: resolve("../src"),
      components: resolve("../src/components"),
      router: resolve("../src/router"),
      store: resolve("../src/stores"),
      views: resolve("../src/views"),
      apis: resolve("../src/apis"),
    },
    extensions: [".tsx", ".ts", ".wasm", ".mjs", ".js", ".json"],
  },
};