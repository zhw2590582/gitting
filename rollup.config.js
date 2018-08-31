const babel = require("rollup-plugin-babel");
const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require("rollup-plugin-replace");
const isProd = process.env.NODE_ENV === "production";

export default {
	input: "src/index.js",
	output: {
		name: "island-comment",
		file: isProd ? "dist/island-comment.js" : "docs/js/island-comment.js",
		format: "umd"
	},
	plugins: [
		postcss({
            plugins: [autoprefixer, cssnano],
            extract: isProd ? "dist/island-comment.css" : "docs/css/island-comment.css"
        }),
		nodeResolve(),
		commonjs(),
		babel({
			plugins: ["external-helpers"]
		}),
		replace({
			isProd: JSON.stringify(isProd),
        })
	]
};
