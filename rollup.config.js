import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify'

export default {
	entry: "src/main.js",
	format: "umd",
	moduleName: "simpleintl",
	plugins: [
		json(),
		commonjs(),
		resolve(),
		uglify(), // does not work with format: "es"
	],
	globals: {
		'intl-messageformat': 'IntlMessageFormat',
		'intl-relativeformat': 'IntlRelativeFormat',
	},
	external: ['intl-messageformat', 'intl-relativeformat'],
	dest: "dist/simple-intl.min.js"
}
