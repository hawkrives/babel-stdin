# babel-stdin(1) -- apply a .babelrc to babel's stdin

## SYNOPSIS
	<file> | babel-stdin [--compact] [--highlight-code]

## DESCRIPTION
A babel wrapper that applies the nearest `.babelrc` to code received via stdin.

## OPTIONS
    --[no-]compact: pass {compact: true} to babel. defaults to `true`
    --[no-]highlight-code: pass {highlightCode: true} to babel. defaults to `false`
