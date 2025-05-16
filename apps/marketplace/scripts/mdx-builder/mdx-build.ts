// scripts/mdx-builder/mdx-build.ts
import dedent from 'dedent';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileMDXtoHTML } from './mdx-compiler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIRS = ['docs'];
const BASE_SOURCE = path.resolve(__dirname, '../../src/content');
const BASE_OUTPUT = path.resolve(__dirname, '../../public/dist/content');

async function buildAllMDX(): Promise<void> {
	await fs.mkdir(BASE_OUTPUT, { recursive: true });

	for (const dir of CONTENT_DIRS) {
		const dirPath = path.join(BASE_SOURCE, dir);
		const outputDir = path.join(BASE_OUTPUT, dir);
		await fs.mkdir(outputDir, { recursive: true });

		const files = await fs.readdir(dirPath);

		for (const file of files) {
			if (!file.endsWith('.mdx') || file.startsWith('.')) continue;

			const sourcePath = path.join(dirPath, file);
			const outputPath = path.join(outputDir, file.replace(/\.mdx$/, '.html'));

			const mdx = await fs.readFile(sourcePath, 'utf8');
			const html = await compileMDXtoHTML(mdx);

			const output = dedent`
        <!-- Generated from ${dir}/${file} -->
        ${html}
      `;

			await fs.writeFile(outputPath, output, 'utf8');
			console.log(`✅ Built: ${dir}/${file}`);
		}
	}
}

buildAllMDX().catch(err => {
	console.error('❌ MDX build failed:', err);
	process.exit(1);
});
