import { createDirector } from '@cond8-ai/core';
import { Context } from 'hono';
import { cn } from '../cn';
import { DefaultHeaders } from '../component/default-headers';
import { DashboardActors as Actors, DashboardConduit } from '../conduits/dashboard-conduit';

const SignupDirector = createDirector<DashboardConduit>('Signup').init<Context>(c => ({
	conduit: new DashboardConduit(c),
}));

export const SignupTemplate = Actors.VHX.Template(c8 => (
	<div id="signup-wrapper" className="flex flex-col items-center gap-4 min-h-screen justify-center bg-background">
		<h1 className="text-3xl text-foreground">Signup</h1>
		<form
			hx-post="/signup"
			hx-swap="outerHTML"
			hx-target="#signup-wrapper"
			className="flex flex-col gap-4 bg-white p-8 rounded shadow-md w-full max-w-sm"
		>
			<label className="flex flex-col gap-1">
				<span className={cn('text-sm font-medium text-gray-700', c8.var.has('email-error') && 'text-red-600')}>Email</span>
				<input
					type="email"
					name="email"
					placeholder="Enter your email"
					className="border rounded px-3 py-2 bg-white text-gray-900"
					value={c8.var.optional('email')}
					required
				/>
				{c8.var.has('email-error') && <span className="text-red-600">{c8.var.string('email-error')}</span>}
			</label>
			<label className="flex flex-col gap-1">
				<span className={cn('text-sm font-medium text-gray-700', c8.var.has('password-error') && 'text-red-600')}>Password</span>
				<span className={cn('text-xs text-gray-500 mb-1', c8.var.has('password-error') && 'text-red-600')}>
					At least 8 characters, one number, one uppercase letter
				</span>
				<input
					type="password"
					name="password"
					placeholder="Create a password"
					className="border rounded px-3 py-2 bg-white text-gray-900"
					value={c8.var.optional('password')}
					required
				/>
				{c8.var.has('password-error') && <span className="text-red-600">{c8.var.string('password-error')}</span>}
			</label>
			<button type="submit" className="mt-4 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition">
				Create Account
			</button>
			<div id="signup-form-msg" className="text-center text-sm text-red-600 mt-2"></div>
		</form>
	</div>
));

SignupDirector(
	c8 => {
		if (!c8.var.has('email')) {
			c8.var.string('email', 'test@test.com');
		}
		if (!c8.var.has('password')) {
			c8.var.string('password', 'Test1234');
		}
		return c8;
	},
	Actors.VHX.Title('Signup'),
	Actors.VHX.Header(<DefaultHeaders />),
	SignupTemplate,
	Actors.VHX.Finalize.Set('html'),
);

export default SignupDirector.fin(c8 => c8.var.string('html'));
