// scripts/mdx-builder/mdx-compiler.tsx
import { compile, run } from '@mdx-js/mdx';
import type { MDXComponents } from 'mdx/types';
import { Fragment, h } from 'preact';
import { render } from 'preact-render-to-string';
import { mdxComponents } from './mdx-components';

type Options = {
	baseUrl?: string;
	components?: MDXComponents;
};

export async function compileMDXtoHTML(mdxSource: string, options: Options = {}) {
	const compiled = await compile(mdxSource, {
		outputFormat: 'function-body',
		format: 'mdx',
		jsxImportSource: 'preact',
	});

	const { default: MDXContent } = await run(compiled, {
		baseUrl: new URL(options.baseUrl || '../../src/_stage/content/docs/', import.meta.url).href,
		Fragment,
		jsx: h,
		jsxs: h,
	});

	return render(
		<div className="prose prose-invert max-w-none">
			<MDXContent components={options.components || mdxComponents} />
		</div>,
	);
}
