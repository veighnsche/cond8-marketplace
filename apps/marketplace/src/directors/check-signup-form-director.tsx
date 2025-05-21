import { createDirector } from '@cond8-ai/core';
import { Context } from 'hono';
import { DashboardConduit } from '../conduits/dashboard-conduit';
import signupDirector from './signup-director';

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
			c8.var.string('email', email);
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

	signupDirector.AsActor,
);

export default CheckSignupFormDirector.fin<[string, string, string]>(c8 => [c8.var.string('html'), c8.var('email'), c8.var('password')]);
