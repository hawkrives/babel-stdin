#!/usr/bin/env node
'use strict'

const USAGE = `
Usage: babel-stdin [...args] < file

Options:
  --[no-]compact: pass {compact: true} to babel. defaults to \`true\`
  --[no-]highlight-code: pass {highlightCode: true} to babel. defaults to \`false\`
`.trim()

const getStdin = require('get-stdin')
const babel = require('@babel/core')
const findUp = require('find-up')

function args() {
	if (process.argv.includes('--help') || process.argv.includes('-h')) {
		console.error(USAGE)
		process.exit(1)
	}

	// if we have --compact and no --no-compact
	let compact = process.argv.includes('--compact') || true
	if (process.argv.includes('--no-compact')) {
		compact = false
	}

	// if we have --highlight-code and no --no-highlight-code
	let highlight = process.argv.includes('--highlight-code') || false
	if (process.argv.includes('--no-highlight-code')) {
		highlight = false
	}

	return { compact, highlight }
}

function findConfig() {
	const nearestBabelConfig = findUp.sync(['babel.config.js', '.babelrc'])

	if (!nearestBabelConfig) {
		console.error('No .babelrc or babel.config.js found')
		process.exit(2)
	}

	return nearestBabelConfig
}

async function main() {
	const { compact, highlight } = args()
	const nearestBabelConfig = findConfig()

	try {
		let code = await getStdin()

		let result = babel.transform(code, {
			extends: nearestBabelConfig,
			compact: compact,
			highlightCode: highlight
		})
		console.log(result.code)
	} catch (error) {
		console.error(error)
		console.error(error.codeFrame)
	}
}

main()
