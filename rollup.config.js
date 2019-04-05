const babel = require("rollup-plugin-babel");
const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require("rollup-plugin-replace");
const {
  uglify
} = require("rollup-plugin-uglify");
const {
  version
} = require("./package.json");
const isProd = process.env.NODE_ENV === "production";

export default {
  input: "src/index.js",
  output: {
    name: "Gitting",
    file: isProd ? "dist/gitting.js" : "dist/gitting-uncompiled.js",
    format: "umd"
  },
  plugins: [
    postcss({
      plugins: [autoprefixer, cssnano],
      extract: isProd ? "dist/gitting.css" : "dist/gitting-uncompiled.css"
    }),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
      plugins: [
        ["@babel/plugin-transform-react-jsx", {
          "pragma": "h"
        }], "@babel/plugin-external-helpers", "@babel/plugin-transform-runtime"
      ]
	}),
	nodeResolve(),
    commonjs(),
    replace({
      __ENV__: JSON.stringify(process.env.NODE_ENV || 'development'),
      __VERSION__: JSON.stringify(version)
    }),
    (isProd && uglify())
  ]
};
