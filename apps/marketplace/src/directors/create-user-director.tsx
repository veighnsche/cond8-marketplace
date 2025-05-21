import { createDirector } from '@cond8-ai/core';
import dedent from 'dedent';
import { createMimeMessage } from 'mimetext';
import { SignupActors as Actors, SignupConduit, SignupConduitProps } from '../conduits/signup-conduit';
import { canonicalEmail } from '../utils/canonical-email';

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

	/** Create the user record in D1 */
	async function MakeUser(c8: SignupConduit) {
		const email = canonicalEmail(c8.body.email);
		const hash = c8.var.string('password');
		try {
			await c8.body.c.env.DB.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').bind(email, hash).run();
		} catch (e: any) {
			// Only for rare race conditions or direct API calls
			if (e.message?.includes('UNIQUE')) {
				throw new Response('Email already registered', { status: 409 });
			}
			throw e;
		}
		return c8;
	},

	async function SendConfirmationEmail(c8: SignupConduit) {
		const email = canonicalEmail(c8.body.email);
		const enc = new TextEncoder();

		// 1 Create a random 32-byte token, base64-url encode it
		const raw = crypto.getRandomValues(new Uint8Array(32));
		const token = btoa(String.fromCharCode(...raw))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');

		// 2 Hash it for storage
		const hashBuf = await crypto.subtle.digest('SHA-256', enc.encode(token));
		const tokenHash = [...new Uint8Array(hashBuf)].map(b => b.toString(16).padStart(2, '0')).join('');

		// 3 Persist (24-h TTL)
		await c8.body.c.env.DB.prepare(
			`INSERT INTO email_verifications (token_hash, user_id, expires_at)
       VALUES (?, (SELECT id FROM users WHERE email = ?), strftime('%s','now') + 86400)`,
		)
			.bind(tokenHash, email)
			.run();

		// 4 Compose the message
		const verifyUrl = `${c8.body.c.env.APP_ORIGIN}/confirm?token=${token}`;
		const msg = createMimeMessage();
		msg.setSender({ name: 'Cond8 AI', addr: 'no-reply@cond8.dev' });
		msg.setRecipient(email);
		msg.setSubject('Confirm your e-mail address');
		msg.setMessage(
			'text/plain',
			dedent`
      Hey there!

      Click the link below to finish creating your account:

      ${verifyUrl}

      The link expires in 24 hours.

      If you did not sign up, just ignore this message.
    `,
		);

		// 5 Send via MailChannels
		const payload = {
			personalizations: [{ to: [{ email }] }],
			from: { email: 'no-reply@cond8.dev', name: 'Cond8 AI' },
			subject: 'Confirm your e-mail address',
			content: [{ type: 'text/plain', value: msg.asRaw() }],
		};

		const resp = await fetch('https://api.mailchannels.net/tx/v1/send', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payload),
		});

		if (!resp.ok) {
			console.warn('Mail send failed', await resp.text());
			// Decide whether to fail hard or continue and retry via a Queue
		}
		return c8;
	},

	Actors.VHX.Template(
		<div id="signup-wrapper" className="flex flex-col items-center gap-4 min-h-screen justify-center bg-background">
			<h1 className="text-3xl text-foreground">Success</h1>
			<p>Check your email for a confirmation link.</p>
		</div>,
	),
	Actors.VHX.Partialize.Set('html'),
);

export default CreateUserDirector.fin(c8 => c8.var.string('html'));
