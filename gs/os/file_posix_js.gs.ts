import * as $ from "@goscript/builtin/index.js";
import * as time from "@goscript/time/index.js"
import { ErrUnimplemented } from "./error.gs.js";
import { getDeno, getNodeFS, newHostError } from "./types_js.gs.js";

export function syscallMode(i: number): number {
	return 0
}

export function ignoringEINTR(fn: () => $.GoError): $.GoError {
	return fn()
}

export function ignoringEINTR2(fn: () => [string, $.GoError]): [string, $.GoError] {
	return fn()
}

export function Chmod(name: string, mode: number): $.GoError {
	const denoObj = getDeno()
	if (denoObj?.chmodSync) {
		try {
			denoObj.chmodSync(name, mode)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	const nodeFS = getNodeFS()
	if (nodeFS?.chmodSync) {
		try {
			nodeFS.chmodSync(name, mode)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	return ErrUnimplemented
}

export function Chown(name: string, uid: number, gid: number): $.GoError {
	const denoObj = getDeno()
	if (denoObj?.chownSync) {
		try {
			denoObj.chownSync(name, uid, gid)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	const nodeFS = getNodeFS()
	if (nodeFS?.chownSync) {
		try {
			nodeFS.chownSync(name, uid, gid)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	return ErrUnimplemented
}

export function Lchown(name: string, uid: number, gid: number): $.GoError {
	const nodeFS = getNodeFS()
	if (nodeFS?.lchownSync) {
		try {
			nodeFS.lchownSync(name, uid, gid)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	return ErrUnimplemented
}

// Chtimes changes the access and modification times of the named file.
// A zero time.Time leaves that file time unchanged, so the host's current
// time is read back and passed through.
export function Chtimes(name: string, atime: time.Time, mtime: time.Time): $.GoError {
	const denoObj = getDeno()
	const nodeFS = getNodeFS()
	let stat: () => any
	let utimes: (at: Date, mt: Date) => void
	if (denoObj?.utimeSync) {
		stat = () => denoObj.statSync(name)
		utimes = (at, mt) => denoObj.utimeSync(name, at, mt)
	} else if (nodeFS?.utimesSync && nodeFS.statSync) {
		const { statSync, utimesSync } = nodeFS
		stat = () => statSync(name)
		utimes = (at, mt) => utimesSync(name, at, mt)
	} else {
		return ErrUnimplemented
	}
	try {
		const current = atime.IsZero() || mtime.IsZero() ? stat() : null
		utimes(fileTime(atime, current?.atime), fileTime(mtime, current?.mtime))
		return null
	} catch (err) {
		return newHostError(err)
	}
}

// fileTime converts t to a host Date, keeping current when t is zero.
function fileTime(t: time.Time, current: Date | null | undefined): Date {
	return t.IsZero() && current ? current : new Date(Number(t.UnixMilli()))
}
