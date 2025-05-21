import { createDirector } from '@cond8-ai/core';
import { SignupConduit, SignupConduitProps } from '../conduits/signup-conduit';

const CreateUserDirector = createDirector<SignupConduit>('CreateUser').init<SignupConduitProps>(props => ({
	conduit: new SignupConduit(props),
}));

CreateUserDirector(
	/** Derive a strong, salted hash from the plaintext password */
	async function hashPassword(c8: SignupConduit) {
		const salt = crypto.getRandomValues(new Uint8Array(16)); // 128-bit salt
		const enc = new TextEncoder();

		// Tune so the slowest client stays <100 ms and the Worker <35 ms CPU.
		const iterations = 300_000;

		const keyMat = await crypto.subtle.importKey('raw', enc.encode(c8.body.password), 'PBKDF2', false, ['deriveBits']);
		const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, keyMat, 256);

		// Best-effort scrub
		enc.encode(c8.body.password).fill(0);

		const toB64url = (arr: Uint8Array) =>
			btoa(String.fromCharCode(...arr))
				.replace(/\+/g, '-')
				.replace(/\//g, '_')
				.replace(/=+$/, '');

		c8.var.string('password', `v1$pbkdf2-sha256$${iterations}$${toB64url(salt)}$${toB64url(new Uint8Array(bits))}`);

		return c8;
	},

	/** Create the user record (not shown here) */
	async function MakeUser(c8: SignupConduit) {
		const email = c8.body.email;
		const password = c8.var.string('password');

		return c8;
	},
);

export default CreateUserDirector.fin(c8 => c8.var.string('html'));
