// src/index.ts
import { Hono } from 'hono';
import LandingPageDirector from './directors/landing-page-director';
import { LiveReloadServer } from './utils/live-reload-server';

type Env = {};

const app = new Hono<{ Bindings: Env }>();

app.get('/live-reload', LiveReloadServer);

app.get('/', async c => {
	const html = await LandingPageDirector(c);
	return c.html(html, 200, {
		'Content-Type': 'text/html; charset=utf-8',
	});
});

app.notFound(c =>
	c.html('Not Found', 404, {
		'Content-Type': 'text/html; charset=utf-8',
	}),
);

export default app;
