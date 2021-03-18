const ForkTSCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
module.exports = {
  module: {
    rules: [
      {
        test: /\.(less)$/i,
        use: [
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: {
                modifyVars: {},
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader',
        type: 'json',
      }
    ],
  },
  resolve: {
    alias: {
      '@': 'src',
    },
    extensions: ['.css'],
  },
  plugins: [new ForkTSCheckerWebpackPlugin()],
};
