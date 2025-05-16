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
	Actors.VHX.Template(<h1 className="text-3xl text-foreground">Hello World!</h1>),
	Actors.VHX.Finalize.Set('html'),
);

export default LandingPageDirector.fin(c8 => c8.var.string('html'));
