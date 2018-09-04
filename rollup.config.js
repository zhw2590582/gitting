const babel = require("rollup-plugin-babel");
const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require("rollup-plugin-replace");
const { uglify } = require("rollup-plugin-uglify");
const json = require('rollup-plugin-json');
const isProd = process.env.NODE_ENV === "production";

export default {
	input: "src/index.js",
	output: {
		name: "gitting",
		file: isProd ? "dist/gitting.js" : "docs/js/gitting.js",
		format: "umd"
	},
	plugins: [
		json(),
		postcss({
            plugins: [autoprefixer, cssnano],
            extract: isProd ? "dist/gitting.css" : "docs/css/gitting.css"
		}),
		nodeResolve(),
		commonjs(),
		babel({
			runtimeHelpers: true,
			exclude: 'node_modules/**',
			plugins: ["external-helpers", "transform-runtime"]
		}),
		replace({
			exclude: 'node_modules/**',
			ENV: JSON.stringify(process.env.NODE_ENV || 'development')
		}),
		(isProd && uglify())
	]
};
