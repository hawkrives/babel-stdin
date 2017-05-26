#!/usr/bin/env node
'use strict'

const getStdin = require('get-stdin')
const babel = require('babel-core')
const findUp = require('find-up')

function args() {
	if (process.argv.indexOf('--help') >= 0 || process.argv.indexOf('-h') >= 0) {
		console.error('Usage: <file> | babel-stdin [--compact] [--highlight-code]')
		console.error()
		console.error('Options:')
		console.error('  --[no-]compact: pass {compact: true} to babel. defaults to `true`')
		console.error('  --[no-]highlight-code: pass {highlightCode: true} to babel. defaults to `false`')
	}

	// if we have --compact and no --no-compact
	let compact = process.argv.indexOf('--compact') >= 0 || true
	if (process.argv.indexOf('--no-compact') >= 0)
		compact = false

	// if we have --highlight-code and no --no-highlight-code
	let highlight = process.argv.indexOf('--highlight-code') >= 0 || false
	if (process.argv.indexOf('--no-highlight-code') >= 0)
		highlight = false

	return {compact, highlight}
}

function findConfig() {
	const nearestBabelConfig = findUp.sync('.babelrc')
	const nearestBabelJsConfig = findUp.sync('.babelrc.js')

	if (!nearestBabelConfig && !nearestBabelJsConfig) {
		console.error('No .babelrc found.')
		process.exit(1)
	}

	return nearestBabelConfig || nearestBabelJsConfig
}

function main() {
	const nearestBabelConfig = findConfig()
	const {compact, highlight} = args()

	return getStdin()
		.then(code => {
			const result = babel.transform(code, {
				extends: nearestBabelConfig,
				compact: compact,
				highlightCode: highlight,
			})
			console.log(result.code)
		})
		.catch(err => {
			console.error(err)
			console.error(err.codeFrame)
		})
}

main()
