import path from "node:path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mode = "development";

if (process.env.NODE_ENV === "production") {
  mode = "production";
}

const plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "index.html"),
    filename: "index.html",
    publicPath: "/",
  }),
  new ForkTsCheckerWebpackPlugin(),
  new MiniCssExtractPlugin(),
];

if (mode === "development") {
  plugins.push(new ReactRefreshWebpackPlugin());
}

const config = {
  mode,
  entry: "./src/main.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
    clean: true,
  },
  devtool: "source-map",
  devServer: {
    hot: true,
    port: 8080,
    historyApiFallback: true,
    static: false,
    open: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      { test: /\.(html)$/, use: ["html-loader"] },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.module\.css$/i,
        use: [
          process.env.NODE_ENV === "development"
            ? "style-loader"
            : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                namedExport: false,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        exclude: /\.module\.css$/,
        use: [
          process.env.NODE_ENV === "development"
            ? "style-loader"
            : MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
    ],
  },
  plugins,
};

export default config;
