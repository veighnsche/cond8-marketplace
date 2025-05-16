// src/component/default-headers.tsx
import { JSX } from 'preact';

export interface DefaultAppHeadersProps {
	children?: JSX.Element[];
}

export const DefaultHeaders = ({ children }: DefaultAppHeadersProps) => (
	<>
		<meta charSet="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="icon" href="/favicon/favicon.ico" type="image/x-icon" />
		<link rel="stylesheet" href="/dist/styles.css" />
		{children}
		<script src="/cond8-dev.js"></script>
		<script src="/live-reload-client.js"></script>
		<script src="https://unpkg.com/htmx.org@2.0.4"></script>
	</>
);
