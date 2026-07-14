// Generated file based on list.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Element {
	// Next and previous pointers in the doubly-linked list of elements.
	// To simplify the implementation, internally a list l is implemented
	// as a ring, such that &l.root is both the next element of the last
	// list element (l.Back()) and the previous element of the first list
	// element (l.Front()).
	public get next(): Element | $.VarRef<Element> | null {
		return this._fields.next.value
	}
	public set next(value: Element | $.VarRef<Element> | null) {
		this._fields.next.value = value
	}

	// Next and previous pointers in the doubly-linked list of elements.
	// To simplify the implementation, internally a list l is implemented
	// as a ring, such that &l.root is both the next element of the last
	// list element (l.Back()) and the previous element of the first list
	// element (l.Front()).
	public get prev(): Element | $.VarRef<Element> | null {
		return this._fields.prev.value
	}
	public set prev(value: Element | $.VarRef<Element> | null) {
		this._fields.prev.value = value
	}

	// The list to which this element belongs.
	public get list(): List | $.VarRef<List> | null {
		return this._fields.list.value
	}
	public set list(value: List | $.VarRef<List> | null) {
		this._fields.list.value = value
	}

	// The value stored with this element.
	public get Value(): any {
		return this._fields.Value.value
	}
	public set Value(value: any) {
		this._fields.Value.value = value
	}

	public _fields: {
		next: $.VarRef<Element | $.VarRef<Element> | null>
		prev: $.VarRef<Element | $.VarRef<Element> | null>
		list: $.VarRef<List | $.VarRef<List> | null>
		Value: $.VarRef<any>
	}

	constructor(init?: Partial<{next?: Element | $.VarRef<Element> | null, prev?: Element | $.VarRef<Element> | null, list?: List | $.VarRef<List> | null, Value?: any}>) {
		this._fields = {
			next: $.varRef(init?.next ?? (null as Element | $.VarRef<Element> | null)),
			prev: $.varRef(init?.prev ?? (null as Element | $.VarRef<Element> | null)),
			list: $.varRef(init?.list ?? (null as List | $.VarRef<List> | null)),
			Value: $.varRef(init?.Value ?? (null as any))
		}
	}

	public clone(): Element {
		const cloned = new Element()
		cloned._fields = {
			next: $.varRef(this._fields.next.value),
			prev: $.varRef(this._fields.prev.value),
			list: $.varRef(this._fields.list.value),
			Value: $.varRef(this._fields.Value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Next(): Element | $.VarRef<Element> | null {
		const e: Element | $.VarRef<Element> | null = this
		{
			let p: Element | $.VarRef<Element> | null = $.pointerValue<Element>(e).next
			if (($.pointerValue<Element>(e).list != null) && (!$.pointerEqual(p, $.pointerValue<List>($.pointerValue<Element>(e).list)._fields.root))) {
				return p
			}
		}
		return null
	}

	public Prev(): Element | $.VarRef<Element> | null {
		const e: Element | $.VarRef<Element> | null = this
		{
			let p: Element | $.VarRef<Element> | null = $.pointerValue<Element>(e).prev
			if (($.pointerValue<Element>(e).list != null) && (!$.pointerEqual(p, $.pointerValue<List>($.pointerValue<Element>(e).list)._fields.root))) {
				return p
			}
		}
		return null
	}

	static __typeInfo = $.registerStructType(
		"list.Element",
		() => new Element(),
		[{ name: "Next", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "list.Element" } }] }, { name: "Prev", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "list.Element" } }] }],
		Element,
		[{ name: "next", key: "next", type: { kind: $.TypeKind.Pointer, elemType: "list.Element" } }, { name: "prev", key: "prev", type: { kind: $.TypeKind.Pointer, elemType: "list.Element" } }, { name: "list", key: "list", type: { kind: $.TypeKind.Pointer, elemType: "list.List" } }, { name: "Value", key: "Value", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class List {
	public get root(): Element {
		return this._fields.root.value
	}
	public set root(value: Element) {
		this._fields.root.value = value
	}

	public get len(): number {
		return this._fields.len.value
	}
	public set len(value: number) {
		this._fields.len.value = value
	}

	public _fields: {
		root: $.VarRef<Element>
		len: $.VarRef<number>
	}

	constructor(init?: Partial<{root?: Element, len?: number}>) {
		this._fields = {
			root: $.varRef(init?.root ? $.markAsStructValue($.cloneStructValue(init.root)) : $.markAsStructValue(new Element())),
			len: $.varRef(init?.len ?? (0 as number))
		}
	}

	public clone(): List {
		const cloned = new List()
		cloned._fields = {
			root: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.root.value))),
			len: $.varRef(this._fields.len.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Back(): Element | $.VarRef<Element> | null {
		const l: List | $.VarRef<List> | null = this
		if ($.pointerValue<List>(l).len == 0) {
			return null
		}
		return $.pointerValue<List>(l).root.prev
	}

	public Front(): Element | $.VarRef<Element> | null {
		const l: List | $.VarRef<List> | null = this
		if ($.pointerValue<List>(l).len == 0) {
			return null
		}
		return $.pointerValue<List>(l).root.next
	}

	public Init(): List | $.VarRef<List> | null {
		let l: List | $.VarRef<List> | null = this
		$.pointerValue<List>(l).root.next = $.pointerValue<List>(l)._fields.root
		$.pointerValue<List>(l).root.prev = $.pointerValue<List>(l)._fields.root
		$.pointerValue<List>(l).len = 0
		return l
	}

	public InsertAfter(v: any, mark: Element | $.VarRef<Element> | null): Element | $.VarRef<Element> | null {
		const l: List | $.VarRef<List> | null = this
		if (!$.pointerEqual($.pointerValue<Element>(mark).list, l)) {
			return null
		}
		// see comment in List.Remove about initialization of l
		return List.prototype.insertValue.call(l, v, mark)
	}

	public InsertBefore(v: any, mark: Element | $.VarRef<Element> | null): Element | $.VarRef<Element> | null {
		const l: List | $.VarRef<List> | null = this
		if (!$.pointerEqual($.pointerValue<Element>(mark).list, l)) {
			return null
		}
		// see comment in List.Remove about initialization of l
		return List.prototype.insertValue.call(l, v, $.pointerValue<Element>(mark).prev)
	}

	public Len(): number {
		const l: List | $.VarRef<List> | null = this
		return $.pointerValue<List>(l).len
	}

	public MoveAfter(e: Element | $.VarRef<Element> | null, mark: Element | $.VarRef<Element> | null): void {
		const l: List | $.VarRef<List> | null = this
		if (((!$.pointerEqual($.pointerValue<Element>(e).list, l)) || ($.pointerEqual(e, mark))) || (!$.pointerEqual($.pointerValue<Element>(mark).list, l))) {
			return
		}
		List.prototype.move.call(l, e, mark)
	}

	public MoveBefore(e: Element | $.VarRef<Element> | null, mark: Element | $.VarRef<Element> | null): void {
		const l: List | $.VarRef<List> | null = this
		if (((!$.pointerEqual($.pointerValue<Element>(e).list, l)) || ($.pointerEqual(e, mark))) || (!$.pointerEqual($.pointerValue<Element>(mark).list, l))) {
			return
		}
		List.prototype.move.call(l, e, $.pointerValue<Element>(mark).prev)
	}

	public MoveToBack(e: Element | $.VarRef<Element> | null): void {
		const l: List | $.VarRef<List> | null = this
		if ((!$.pointerEqual($.pointerValue<Element>(e).list, l)) || ($.pointerEqual($.pointerValue<List>(l).root.prev, e))) {
			return
		}
		// see comment in List.Remove about initialization of l
		List.prototype.move.call(l, e, $.pointerValue<List>(l).root.prev)
	}

	public MoveToFront(e: Element | $.VarRef<Element> | null): void {
		const l: List | $.VarRef<List> | null = this
		if ((!$.pointerEqual($.pointerValue<Element>(e).list, l)) || ($.pointerEqual($.pointerValue<List>(l).root.next, e))) {
			return
		}
		// see comment in List.Remove about initialization of l
		List.prototype.move.call(l, e, $.pointerValue<List>(l)._fields.root)
	}

	public PushBack(v: any): Element | $.VarRef<Element> | null {
		const l: List | $.VarRef<List> | null = this
		List.prototype.lazyInit.call(l)
		return List.prototype.insertValue.call(l, v, $.pointerValue<List>(l).root.prev)
	}

	public PushBackList(other: List | $.VarRef<List> | null): void {
		const l: List | $.VarRef<List> | null = this
		List.prototype.lazyInit.call(l)
		for (let i = List.prototype.Len.call(other), e = List.prototype.Front.call(other); i > 0; [i, e] = [i - 1, Element.prototype.Next.call(e)]) {
			List.prototype.insertValue.call(l, $.pointerValue<Element>(e).Value, $.pointerValue<List>(l).root.prev)
		}
	}

	public PushFront(v: any): Element | $.VarRef<Element> | null {
		const l: List | $.VarRef<List> | null = this
		List.prototype.lazyInit.call(l)
		return List.prototype.insertValue.call(l, v, $.pointerValue<List>(l)._fields.root)
	}

	public PushFrontList(other: List | $.VarRef<List> | null): void {
		const l: List | $.VarRef<List> | null = this
		List.prototype.lazyInit.call(l)
		for (let i = List.prototype.Len.call(other), e = List.prototype.Back.call(other); i > 0; [i, e] = [i - 1, Element.prototype.Prev.call(e)]) {
			List.prototype.insertValue.call(l, $.pointerValue<Element>(e).Value, $.pointerValue<List>(l)._fields.root)
		}
	}

	public Remove(e: Element | $.VarRef<Element> | null): any {
		const l: List | $.VarRef<List> | null = this
		if ($.pointerEqual($.pointerValue<Element>(e).list, l)) {
			// if e.list == l, l must have been initialized when e was inserted
			// in l or l == nil (e is a zero Element) and l.remove will crash
			List.prototype.remove.call(l, e)
		}
		return $.pointerValue<Element>(e).Value
	}

	public insert(e: Element | $.VarRef<Element> | null, at: Element | $.VarRef<Element> | null): Element | $.VarRef<Element> | null {
		let l: List | $.VarRef<List> | null = this
		$.pointerValue<Element>(e).prev = at
		$.pointerValue<Element>(e).next = $.pointerValue<Element>(at).next
		$.pointerValue<Element>($.pointerValue<Element>(e).prev).next = e
		$.pointerValue<Element>($.pointerValue<Element>(e).next).prev = e
		$.pointerValue<Element>(e).list = l
		$.pointerValue<List>(l).len++
		return e
	}

	public insertValue(v: any, at: Element | $.VarRef<Element> | null): Element | $.VarRef<Element> | null {
		const l: List | $.VarRef<List> | null = this
		return List.prototype.insert.call(l, new Element({Value: v}), at)
	}

	public lazyInit(): void {
		const l: List | $.VarRef<List> | null = this
		if ($.pointerValue<List>(l).root.next == null) {
			List.prototype.Init.call(l)
		}
	}

	public move(e: Element | $.VarRef<Element> | null, at: Element | $.VarRef<Element> | null): void {
		const l: List | $.VarRef<List> | null = this
		if ($.pointerEqual(e, at)) {
			return
		}
		$.pointerValue<Element>($.pointerValue<Element>(e).prev).next = $.pointerValue<Element>(e).next
		$.pointerValue<Element>($.pointerValue<Element>(e).next).prev = $.pointerValue<Element>(e).prev

		$.pointerValue<Element>(e).prev = at
		$.pointerValue<Element>(e).next = $.pointerValue<Element>(at).next
		$.pointerValue<Element>($.pointerValue<Element>(e).prev).next = e
		$.pointerValue<Element>($.pointerValue<Element>(e).next).prev = e
	}

	public remove(e: Element | $.VarRef<Element> | null): void {
		let l: List | $.VarRef<List> | null = this
		$.pointerValue<Element>($.pointerValue<Element>(e).prev).next = $.pointerValue<Element>(e).next
		$.pointerValue<Element>($.pointerValue<Element>(e).next).prev = $.pointerValue<Element>(e).prev
		$.pointerValue<Element>(e).next = null
		$.pointerValue<Element>(e).prev = null
		$.pointerValue<Element>(e).list = null
		$.pointerValue<List>(l).len--
	}

	static __typeInfo = $.registerStructType(
		"list.List",
		() => new List(),
		[{ name: "Back", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "list.Element" } }] }, { name: "Front", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "list.Element" } }] }, { name: "Init", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "list.List" } }] }, { name: "InsertAfter", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "list.Element" } }] }, { name: "InsertBefore", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "list.Element" } }] }, { name: "Len", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "MoveAfter", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "MoveBefore", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "MoveToBack", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "MoveToFront", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "PushBack", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "list.Element" } }] }, { name: "PushBackList", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "PushFront", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "list.Element" } }] }, { name: "PushFrontList", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "Remove", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "insert", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "list.Element" } }] }, { name: "insertValue", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "list.Element" } }] }, { name: "lazyInit", args: [], returns: [] }, { name: "move", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "remove", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		List,
		[{ name: "root", key: "root", type: "list.Element" }, { name: "len", key: "len", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export function New(): List | $.VarRef<List> | null {
	return List.prototype.Init.call(new List())
}
