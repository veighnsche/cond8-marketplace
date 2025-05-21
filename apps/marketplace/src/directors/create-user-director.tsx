import { createDirector } from '@cond8-ai/core';
import { Context } from 'hono';
import { DashboardConduit } from '../conduits/dashboard-conduit';

const CreateUserDirector = createDirector<DashboardConduit>('CreateUser').init<{
  c: Context;
  email: string;
  password: string;
}>(c => ({
	conduit: new DashboardConduit(c),
}));

CreateUserDirector();

export default CreateUserDirector.fin(c8 => c8.var.string('html'));
