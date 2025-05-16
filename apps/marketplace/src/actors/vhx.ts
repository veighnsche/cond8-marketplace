// src/actors/vhx.ts
import { C8RO, CoreRedprint } from '@cond8-ai/core';
import { JSX } from 'preact';
import { VHXService } from '../services/vhx-service';

export type VHXRedprint<T extends object = object> = CoreRedprint<T> & {
	vhx: VHXService;
};

type JSXElementOrFn<T = JSX.Element> = T | ((c8: C8RO<VHXRedprint>) => T);

export const createVHXActors = <C8 extends VHXRedprint>() => {
	const StaticTitle = (title: string) => (c8: C8) => {
		c8.vhx.setTitle(title);
		return c8;
	};

	const Title = Object.assign(StaticTitle, {
		From: (getKey: string, transform?: (value: string) => string) => (c8: C8) => {
			let title = c8.var(getKey);
			if (typeof title !== 'string') {
				throw new Error(`VHX: Title must be a string: ${getKey}`);
			}
			if (transform !== undefined) {
				title = transform(title);
			}
			c8.vhx.setTitle(title as string);
			return c8;
		},
	});

	const Header = (elementOrFn: JSXElementOrFn) => (c8: C8) => {
		const header = typeof elementOrFn === 'function' ? elementOrFn(c8.utils.readonly) : elementOrFn;
		c8.vhx.setHeader(header);
		return c8;
	};

	const Template = (elementOrFn: JSXElementOrFn) => (c8: C8) => {
		const template = typeof elementOrFn === 'function' ? elementOrFn(c8.utils.readonly) : elementOrFn;
		c8.vhx.setTemplate(template);
		return c8;
	};

	const SetSlot = (name: string, elementOrFn: JSXElementOrFn) => (c8: C8) => {
		const element = typeof elementOrFn === 'function' ? elementOrFn(c8.utils.readonly) : elementOrFn;
		c8.vhx.setSlot(name, element);
		return c8;
	};

	const HtmlPartial = {
		Get: (getKey: string) => ({
			SetSlot: (slotName: string) => (c8: C8) => {
				const value = c8.var.string(getKey);
				c8.vhx.setHtmlSlot(slotName, value);
				return c8;
			},
		}),
	};

	const Finalize = {
		Set: (setKey: string) => (c8: C8) => {
			const result = c8.vhx.wrapWithHtml();

			c8.var(setKey, `<!DOCTYPE html>${result}`);
			return c8;
		},
	};

	const Partialize = {
		Set: (setKey: string) => (c8: C8) => {
			const result = c8.vhx.partialHtml();

			c8.var(setKey, result);
			return c8;
		},
	};

	return {
		Title,
		Header,
		Template,
		SetSlot,
		HtmlPartial,
		Finalize,
		Partialize,
	};
};
