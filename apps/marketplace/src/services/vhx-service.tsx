// src/services/vhx-service.tsx
import { StrictObjectKVService } from '@cond8-ai/core';
import { h, JSX, VNode } from 'preact';
import { render } from 'preact-render-to-string';

export class VHXService extends StrictObjectKVService<string, string | JSX.Element> {
	constructor(key: string, initial: Record<string, string | JSX.Element> = {}) {
		super(key, initial);
	}

	// -- Title ---------------------------------------------------------

	setTitle(title: string): void {
		this.set('title', title);
	}

	getTitle(): string {
		return this.get('title', new Error('VHX: No title has been set')) as string;
	}

	// -- Template ------------------------------------------------------

	setTemplate(template: JSX.Element): void {
		this.set('template', template);
	}

	getTemplate(): JSX.Element {
		return this.get('template', new Error('VHX: No template has been set')) as JSX.Element;
	}

	// -- Header --------------------------------------------------------

	setHeader(header: JSX.Element): void {
		this.set('header', header);
	}

	getHeader(): JSX.Element {
		return this.get('header', new Error('VHX: No header has been set')) as JSX.Element;
	}

	// -- Slot Content --------------------------------------------------

	setSlot(key: string, content: JSX.Element): void {
		this.set(`slot:${key}`, content);
	}

	setHtmlSlot(key: string, content: string): void {
		this.set(`slot:html:${key}`, content);
	}

	wrapWithHtml() {
		const title = this.getTitle();
		const header = this.getHeader();

		const replacedTemplate = this.replaceSlots();

		return render(
			<html lang="en">
				<head>
					<title>{title}</title>
					{header}
				</head>
				<body>{replacedTemplate}</body>
			</html>,
		);
	}

	partialHtml() {
		const replacedTemplate = this.replaceSlots();
		return render(<>{replacedTemplate}</>);
	}

	private replaceSlots(): VNode | VNode[] {
		const walk = (node: any): any => {
			if (node == null || typeof node !== 'object') return node;

			if (Array.isArray(node)) {
				return node.map(walk);
			}

			if (typeof node.type === 'string' && node.type.toLowerCase() === 'slot') {
				const name = node.props?.name;
				const dataProps = node.props?.['data-props'] ?? {};

				if (typeof name !== 'string') {
					throw new Error('VHX: <slot> must have a "name" attribute.');
				}

				const htmlSlot = this.optional(`slot:html:${name}`) as string;
				if (htmlSlot) {
					return h('div', { dangerouslySetInnerHTML: { __html: htmlSlot } });
				}

				const jsxSlot = this.optional(`slot:${name}`) as JSX.Element | ((dataProps: Record<string, any>) => JSX.Element);
				if (jsxSlot) {
					const jsxContent = typeof jsxSlot === 'function' ? jsxSlot(dataProps) : jsxSlot;
					if (!this.isValidVNode(jsxContent)) {
						throw new Error(`VHX: Slot "${name}" must be a VNode or a function that returns one.`);
					}
					return jsxContent;
				}

				return null;
			}

			const newChildren = walk(node.props?.children);
			return h(node.type, { ...node.props, children: newChildren });
		};

		return walk(this.getTemplate());
	}

	private isValidVNode(x: unknown): x is JSX.Element {
		return typeof x === 'object' && x !== null && 'type' in x && 'props' in x;
	}

	override get readonly() {
		const keys = Object.keys(super.readonly);
		return {
			title: typeof this.optional('title') === 'string' ? (this.optional('title') as string) : null,
			templateSet: this.has('template'),
			headerSet: this.has('header'),
			slots: Object.fromEntries(keys.filter(k => k.startsWith('slot:')).map(k => [k.slice(5), true])),
		} as Record<string, any>;
	}
}
