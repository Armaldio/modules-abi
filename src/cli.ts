#!/usr/bin/env node

// TODO Add support for multiple values (runtime, target, abi, etc...)
// TODO Better error handling
// TODO Add test cases for error handling

import abis from '.';
import mri from 'mri';

const argv = process.argv.slice(2);

const showHelp = () => {
	console.log(`
modules-abi [options]

Options:
	--mode=[range, abi, target, runtime, all] : Select which mode to use
	--runtime=[electron, nw.js, node]         : Select which engine to use
	--abi=[Number]                            : Select the targeted abi
	--target=[Semver String]                  : Selected the targeted runtime version
	--include-intermediates                   : Whether to include intermediates version in "range" mode
	--include-nightly                         : Whether to include nighly versions
	--include-beta                            : Whether to include beta versions

- "range" mode must include "abi" and "runtime"
- "abi" mode must include "target" and "runtime"
- "target" mode must include "abi" and "runtime"
- "runtime" mode must include "target"
	`);
};

const args = mri(argv, {boolean: ['include-intermediates', 'include-rc', 'include-nightly', 'include-beta']});

(async () => {
	const abi = args.abi;
	const runtime = args.runtime;
	const target = args.target;
	const includeIntermediates = args['include-intermediates'];
	const includeNightly = args['include-nightly'];
	const includeBeta = args['include-beta'];
	const includeReleaseCandidates = args['include-rc'];

	switch (args.mode) {
		case 'range':
			// Ex: modules-abi --mode="range" --abi=73 --runtime="electron" --include-intermediates
			const _ranges = await abis.getRange(abi, runtime, {includeIntermediates, includeNightly, includeBeta, includeReleaseCandidates});
			console.log(_ranges.join('\n'));
			break;
		case 'abi':
			// Ex: modules-abi --mode=abi --target=7.0.0-nightly.20190615 --runtime=electron
			const _abi = await abis.getAbi(target, runtime);
			console.log(_abi);
			break;
		case 'target':
			// Ex: modules-abi --mode=target --abi=73 --runtime=electron
			const _target = await abis.getTarget(abi, runtime);
			console.log(_target);
			break;
		case 'runtime':
			// Ex: modules-abi --mode=runtime --target=4.0.4
			const _runtime = await abis.getRuntime(target);
			console.log(_runtime.join(', '));
			break;
		case 'all':
			const _all = await abis.getAll({includeIntermediates, includeNightly, includeBeta, includeReleaseCandidates});
			console.log(_all.map(v => `${v.runtime} - v${v.abi} - ${v.version}`).join('\n'));
			break;
		default:
			showHelp();
	}
})();
