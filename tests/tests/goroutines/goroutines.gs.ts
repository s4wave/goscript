// Generated file based on goroutines.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Message {
	public declare priority: number

	public declare text: string

	constructor(__goscriptValue?: boolean, priority$?: number, text$?: string) {
		this.priority = priority$ ?? 0
		this.text = text$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Message {
		return new Message(true, this.priority, this.text)
	}

	public __goscriptAssign(source: Message): this {
		this.priority = source.priority
		this.text = source.text
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Message",
		() => new Message(),
		() => [],
		Message,
		() => [{ name: "priority", key: "priority", type: /* @__PURE__ */ $.basicType("int") }, { name: "text", key: "text", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export const totalMessages: number = 8

export let messages: $.Channel<Message> | null = $.makeChannel<Message>(0, new Message(true), "both")

export function __goscript_set_messages(__goscriptValue: $.Channel<Message> | null): void {
	messages = __goscriptValue
}

export async function worker(id: number): globalThis.Promise<void> {
	// Send worker starting message
	await $.chanSend(messages, new Message(true, 10 + id, "Worker " + $.runeToString($.int(48 + id, 32)) + " starting"))

	// Send worker done message
	await $.chanSend(messages, new Message(true, 20 + id, "Worker " + $.runeToString($.int(48 + id, 32)) + " done"))
}

export async function anotherWorker(name: string): globalThis.Promise<void> {
	await $.chanSend(messages, new Message(true, 40, "Another worker: " + name))
}

export async function main(): globalThis.Promise<void> {
	// Create a slice to collect all messages
	let allMessages: $.Slice<Message> = $.makeSlice<Message>(0, 8 + 3, undefined, () => new Message(true))

	// Add initial message
	allMessages = $.appendOne(allMessages, new Message(true, 0, "Main: Starting workers"))

	// Start 3 worker goroutines
	for (let i = 0; i < 3; i++) {
		const __goscriptDeferArg0 = i
		$.go(async () => { await worker(__goscriptDeferArg0) })
	}

	// Start another worker goroutine
	$.go(async () => { await anotherWorker("test") })

	// Start an anonymous function worker
	$.go(async () => {
		await $.chanSend(messages, new Message(true, 50, "Anonymous function worker"))
	})

	// Add status message
	allMessages = $.appendOne(allMessages, new Message(true, 1, "Main: Workers started"))

	// Collect all messages from goroutines
	for (let __rangeIndex = 0; __rangeIndex < 8; __rangeIndex++) {
		allMessages = $.appendOne(allMessages, (await $.chanRecv(messages)).clone())
	}

	// Add final message
	allMessages = $.appendOne(allMessages, new Message(true, 100, "Main: All workers completed"))

	// Sort messages by priority for deterministic order
	for (let __goscriptRangeTarget0 = allMessages, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), i = 0; i < __goscriptRangeWindow0.length; i++) {
		for (let j = i + 1; j < __goscriptRangeWindow0.length; j++) {
			if (((__goscriptRangeWindow0.backing as any[])[__goscriptRangeWindow0.offset + i] as Message).priority > ((__goscriptRangeWindow0.backing as any[])[$.windowSlot(__goscriptRangeWindow0, j)] as Message).priority) {
				let __goscriptAssign0_0: Message = (((__goscriptRangeWindow0.backing as any[])[$.windowSlot(__goscriptRangeWindow0, j)] as Message)).clone()
				let __goscriptAssign0_1: Message = (((__goscriptRangeWindow0.backing as any[])[__goscriptRangeWindow0.offset + i] as Message)).clone();
				;(__goscriptRangeWindow0.backing as any[])[__goscriptRangeWindow0.offset + i].__goscriptAssign(__goscriptAssign0_0);
				;(__goscriptRangeWindow0.backing as any[])[$.windowSlot(__goscriptRangeWindow0, j)].__goscriptAssign(__goscriptAssign0_1)
			}
		}
	}

	// Print all messages in deterministic order
	for (let __goscriptRangeTarget1 = allMessages, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
		let msg = ((__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as Message)).clone()
		await $.println(msg.priority, msg.text)
	}
	await $.println("done")
}

if ($.isMainScript(import.meta)) {
	await main()
}
