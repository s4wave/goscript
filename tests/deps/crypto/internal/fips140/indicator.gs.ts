// Generated file based on indicator.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import "@goscript/unsafe/index.js"

export const indicatorUnset: number = 0

export const indicatorFalse: number = 1

export const indicatorTrue: number = 2

export function getIndicator(): number {
	return 0
}

export function setIndicator(_p0: number): void {
}

export function ResetServiceIndicator(): void {
	setIndicator($.uint(0, 8))
}

export function ServiceIndicator(): boolean {
	return $.uint(getIndicator(), 8) == $.uint(2, 8)
}

export function RecordApproved(): void {
	if ($.uint(getIndicator(), 8) == $.uint(0, 8)) {
		setIndicator($.uint(2, 8))
	}
}

export function RecordNonApproved(): void {
	setIndicator($.uint(1, 8))
}
