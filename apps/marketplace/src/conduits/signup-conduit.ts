// src/conduits/dashboard-conduit.ts
import { CoreRedprint, StrictObjectKVService } from '@cond8-ai/core';
import { Context } from 'hono';
import { createVHXActors } from '../actors/vhx';
import { VHXService } from '../services/vhx-service';

export interface SignupConduitProps {
	c: Context;
	email: string;
	password: string;
}

export class SignupConduit extends CoreRedprint<SignupConduitProps> {
	readonly locals = new StrictObjectKVService('locals');
	readonly vhx = new VHXService('vhx');

	constructor(props: SignupConduitProps) {
		super(props);
	}
}

export const SignupActors = {
	VHX: createVHXActors<SignupConduit>(),
};
