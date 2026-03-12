const plugins = [];

if (process.env.NODE_ENV === "development") {
  plugins.push("react-refresh/babel");
}

const config = {
  presets: [
    "@babel/preset-env",
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins,
};

export default config;
