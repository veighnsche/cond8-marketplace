// scripts/dev.mjs
import concurrently from 'concurrently';
import { execSync } from 'node:child_process';

// Step 1: Run the build once before watching
console.log('🔧 Prebuilding CSS and MDX...');
execSync('pnpm build', { stdio: 'inherit' });

// Step 2: Start dev watchers
const processes = [
	{
		name: 'tailwind',
		command: 'pnpm dev:css',
		prefixColor: 'blue',
	},
	{
		name: 'mdx',
		command: 'pnpm dev:mdx',
		prefixColor: 'magenta',
	},
	{
		name: 'cf-worker',
		command: 'wrangler dev --local',
		prefixColor: 'yellow',
	},
];

const options = {
	prefix: 'name',
	killOthers: ['failure'],
};

console.log('🚀 Starting local development environment...\n');

concurrently(processes, options).result.catch(() => {
	console.error('💥 One of the dev processes failed. Exiting.');
	process.exit(1);
});
