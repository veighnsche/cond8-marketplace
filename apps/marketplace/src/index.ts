// src/index.ts
import { Hono } from 'hono';
import CheckSignupFormDirector from './directors/check-signup-form-director';
import CreateUserDirector from './directors/create-user-director';
import LandingPageDirector from './directors/landing-page-director';
import SignupDirector from './directors/signup-director';
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

app.get('/signup', async c => {
	const html = await SignupDirector(c);
	return c.html(html, 200, {
		'Content-Type': 'text/html; charset=utf-8',
	});
});

app.post('/signup', async c => {
	const [errorHtml, email, password] = await CheckSignupFormDirector(c);
	if (!email || !password) {
		return c.html(errorHtml, 200, {
			'Content-Type': 'text/html; charset=utf-8',
		});
	}
	const html = await CreateUserDirector({
		c,
		email,
		password,
	});
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
