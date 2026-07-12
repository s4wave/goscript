// Generated file based on rand_js.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export const maxGetRandomRead: number = 65536

export function getRandomValues(r: $.Slice<number>): void {
}

export function read(b: $.Slice<number>): $.GoError {
	while ($.len(b) > 0) {
		let size = $.len(b)
		if (size > 65536) {
			size = 65536
		}
		getRandomValues($.goSlice(b, undefined, size))
		b = $.goSlice(b, size, undefined)
	}
	return null
}
