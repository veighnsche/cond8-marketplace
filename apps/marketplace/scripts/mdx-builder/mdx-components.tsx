// scripts/mdx-builder/mdx-components.tsx

import { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
	h1: props => <h1 className="font-title text-5xl lg:text-6xl tracking-tight my-6 lg:my-10" {...props} />,
	h2: props => <h2 className="font-subtitle text-4xl lg:text-5xl tracking-tight mt-12 mb-6 border-b-4 border-accent pb-2" {...props} />,
	h3: props => <h3 className="text-2xl font-bold tracking-wide mt-16 mb-6 text-secondary" {...props} />,
	p: props => <p className="text-xl leading-7 font-light font-paragraph mt-6 text-foreground/90" {...props} />,
	a: props => (
		<a
			className="text-[var(--color-accent)] font-semibold underline underline-offset-4 hover:underline hover:opacity-80 transition-all duration-150 ease-out"
			{...props}
		/>
	),
	ol: props => <ol className="list-decimal pl-8 my-6 space-y-3 text-lg leading-7 marker:text-muted-foreground" {...props} />,
	ul: props => <ul className="list-disc pl-8 my-6 space-y-3 text-lg leading-7 marker:text-muted-foreground" {...props} />,
	li: props => <li className="pl-1 text-base tracking-wide text-foreground/90" {...props} />,
	code: props => <code className="bg-muted text-muted-foreground px-2 py-1 rounded-md font-mono text-sm tracking-tight" {...props} />,
	pre: props => (
		<pre
			className="bg-card border-[3px] border-muted text-muted-foreground p-6 lg:p-8 rounded-2xl my-12 overflow-x-auto text-sm font-mono shadow-inner leading-relaxed"
			{...props}
		/>
	),
	hr: () => <hr className="border-[2px] border-muted w-1/2 mx-auto my-20 opacity-40 border-dotted" />,
	strong: props => <strong className="font-extrabold text-foreground" {...props} />,
	em: props => <em className="italic text-muted-foreground/90" {...props} />,
};
