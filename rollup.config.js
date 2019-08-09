import path from 'path';
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import { getPackages } from '@lerna/project';

async function main()
{
	const packages = await getPackages(__dirname);
	const results = [];

	console.log("PACKAGES: "+packages.length);
	packages.forEach((pkg) => {
		const pkgData = pkg.toJSON();
		console.log(pkg.toJSON());
		const basePath = path.relative(__dirname, pkg.location);
		const input = path.join(basePath, 'src/index.ts');
		const freeze = false;
		const sourceMap = true;
		const external = pkgData.standalone ? null : Object.keys(pkgData.dependencies || []);

		results.push({
			input: input,
			output: {
				file: path.join(basePath, pkgData.main),
				format: 'cjs',
				name: pkg.name
			},
			plugins: [
				typescript(),
				resolve({
					browser: true,
					preferBuiltins: true,
				}),
				commonjs()
			],
			external,
			treeshake: false
		});
	});

	return results;
}
// rollup.config.js
export default main();