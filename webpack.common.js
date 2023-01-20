const resolve = require('path').resolve;
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin


// For env variables passing to the frontend code (webpack replaces occurences of process.env.var by their respective value)
// Can more simply use Dotenv plugin with .env filepath and safe: true param
// Otherwise, could also use below code
// ---
// const dotenv = require('dotenv');
// // call dotenv and it will return an Object with a parsed key 
// const env = dotenv.config().parsed;
// console.log(env)
// const envKeys = Object.keys(env).reduce((prev, next) => {
//   prev[`process.env.${next}`] = JSON.stringify(env[next]);
//   return prev;
// }, {});

const config = smp.wrap({

  entry: {
    app: resolve('./src/app')
  },

  output: {
    library: 'App'
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    fallback: {
      "stream": require.resolve('stream-browserify'),
      "crypto": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
    } 
  },

  module: {
    rules: [
      // The below rule does create sourcemaps for node_modules which do not have any like react-map-gl, ky, math-gl
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        test: /\.(ts|js)x?$/,
        include: [resolve('./src')],
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env', '@babel/react']
            }
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          }
        ]
      }
    ]
  },

  // Read environment variable. Recommended way is to simply use Dotenv with .env at root of project
  // https://webpack.js.org/plugins/environment-plugin/
  plugins: [
    new BundleAnalyzerPlugin(),
    new Dotenv({
      path: './.env', // Path to .env file (this is the default)
      safe: true,     // load .env.example (defaults to "false" which does not use dotenv-safe)
    })
    // Other methods for env variables read
    // new webpack.EnvironmentPlugin({
    //   MapboxAccessToken: '12345',
    //   MAPBOX_TOKEN: JSON.stringify(process.env.MAPBOX_TOKEN),
    // }), 
    // new webpack.DefinePlugin(envKeys), 
  ]
});

// Enables bundling against src in this repo rather than the installed version
module.exports = config