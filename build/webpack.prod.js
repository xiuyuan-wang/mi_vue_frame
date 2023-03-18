const common = require("./webpack.base");
const { merge } = require("webpack-merge");
const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin  = require('compression-webpack-plugin')
module.exports = (env) => {
  let pro_config = {
    mode: "production",
    //  devtool:'source-map',//开启将会生成map文件
    output: {
      //出口
      path: path.resolve(__dirname, "../dist"), //输出路径
      clean: true, //清空打包文件
      filename: "js/[name].[chunkhash].js", //输出文件名
      chunkFilename: "js/[name].[chunkhash].js", //输出异步文件文件名 //动态导入 分离bundle 比如lodashjs配合注释import(/* webpackChunkName: "lodash" */ 'lodash') 会打包成lodash.bundle.js
    },
    plugins:[
      new CompressionPlugin({
        test: /.(js|css)$/, // 只生成css,js压缩文件
        filename: '[path][base].gz', // 文件命名
        algorithm: 'gzip', // 压缩格式,默认是gzip
        test: /.(js|css)$/, // 只生成css,js压缩文件
        threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
        minRatio: 0.8 // 压缩率,默认值是 0.8
      })
    ],
    // performance: {
    //   hints:false
    // }
	    //或者
	    // 警告 webpack 的性能提示
	    performance: {
	    	hints:'warning',
	    	//入口起点的最大体积
	    	maxEntrypointSize: 50000000,
	    	//生成文件的最大体积
	    	maxAssetSize: 30000000,
	    	//只给出 js 文件的性能提示
	    	assetFilter: function(assetFilename) {
	    		return assetFilename.endsWith('.js');
	    	}
	    }
  }
  console.log(env,2222,env.analyzer)
  if(env && env.analyzer){
    // pro_config.plugins.push(new BundleAnalyzerPlugin())
  }
  return merge(common, pro_config);
}