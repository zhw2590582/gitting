const babel = require("rollup-plugin-babel");
const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");
const scss = require('rollup-plugin-scss');
const isProd = process.env.NODE_ENV === "production";

export default {
	input: "src/index.js",
	output: {
		name: "island-comment",
		file: isProd ? "dist/island-comment.js" : "docs/js/island-comment.js",
		format: "umd"
	},
	plugins: [
		scss({
			output: isProd ? "dist/island-comment.css" : "docs/css/island-comment.css"
		}),
		nodeResolve(),
		commonjs(),
		babel({
			plugins: ["external-helpers"]
		})
	]
};
