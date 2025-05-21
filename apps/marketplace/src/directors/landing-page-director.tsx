// src/directors/landing-page-director.tsx
import { createDirector } from '@cond8-ai/core';
import { Context } from 'hono';
import { DefaultHeaders } from '../component/default-headers';
import { DashboardActors as Actors, DashboardConduit } from '../conduits/dashboard-conduit';

const LandingPageDirector = createDirector<DashboardConduit>('LandingPage').init<Context>(c => ({
	conduit: new DashboardConduit(c),
}));

LandingPageDirector(
	Actors.VHX.Title('Hello World!'),
	Actors.VHX.Header(<DefaultHeaders />),
	Actors.VHX.Template(
		<div className="flex flex-col items-center gap-4">
			<h1 className="text-3xl text-foreground">Hello World!</h1>
			<div className="flex gap-2">
				<a
					href="/login"
					className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-center no-underline"
					role="button"
				>
					Login
				</a>
				<a
					href="/signup"
					className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition text-center no-underline"
					role="button"
				>
					Register
				</a>
			</div>
		</div>
	),
	Actors.VHX.Finalize.Set('html'),
);

export default LandingPageDirector.fin(c8 => c8.var.string('html'));
