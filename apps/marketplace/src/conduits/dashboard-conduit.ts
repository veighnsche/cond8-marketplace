// src/conduits/dashboard-conduit.ts
import { CoreRedprint, StrictObjectKVService } from '@cond8-ai/core';
import { Context } from 'hono';
import { createVHXActors } from '../actors/vhx';
import { VHXService } from '../services/vhx-service';

export class DashboardConduit extends CoreRedprint<Context> {
	readonly locals = new StrictObjectKVService('locals');
	readonly vhx = new VHXService('vhx');

	constructor(c: Context) {
		super(c);
	}
}

export const DashboardActors = {
	VHX: createVHXActors<DashboardConduit>(),
};
