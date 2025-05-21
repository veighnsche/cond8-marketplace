import { createDirector } from '@cond8-ai/core';
import { Context } from 'hono';
import { DashboardActors as Actors, DashboardConduit } from '../conduits/dashboard-conduit';
import { canonicalEmail } from '../utils/canonical-email';
import { SignupTemplate } from './signup-director';

const CheckSignupFormDirector = createDirector<DashboardConduit>('CheckSignupForm').init<Context>(c => ({
	conduit: new DashboardConduit(c),
}));

CheckSignupFormDirector(
	async function IsValidEmail(c8: DashboardConduit) {
		const body = await (c8.body as Context).req.parseBody();
		const email = body.email as string;
		if (!email) {
			c8.var.string('email-error', 'Email is required');
		} else if (!email.includes('@')) {
			c8.var.string('email-error', 'Email is invalid');
		} else {
			const db = (c8.body as Context).env?.DB;
			if (!db) {
				c8.var.string('email-error', 'Database not found');
			} else {
				const result = await db.prepare('SELECT id FROM users WHERE email = ?').bind(canonicalEmail(email)).first();
				if (result) {
					c8.var.string('email-error', 'Email already registered');
				} else {
					c8.var.string('email', canonicalEmail(email));
				}
			}
		}
		return c8;
	},

	async function IsValidPassword(c8: DashboardConduit) {
		// At least 8 characters, one number, one uppercase letter
		const body = await (c8.body as Context).req.parseBody();
		const password = body.password as string;
		if (!password) {
			c8.var.string('password-error', 'Password is required');
		} else if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
			c8.var.string('password-error', 'Password must be at least 8 characters long, contain at least one uppercase letter and one number');
		} else {
			c8.var.string('password', password);
		}
		return c8;
	},

	SignupTemplate,
	Actors.VHX.Partialize.Set('html'),
);

export default CheckSignupFormDirector.fin<[string, string | undefined, string | undefined]>(c8 => [
	c8.var.string('html'),
	c8.var.optional('email'),
	c8.var.optional('password'),
]);
