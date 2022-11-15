import { getAbi, getRange, getRuntime, getTarget } from '../src';

(async () => {
	// Electron
	try {
		console.log('Electron: \n');
		const abi = await getAbi('4.2.6', 'electron');
		console.log('ABI for version 4.2.6: ' + abi);

		const version = await getTarget(64, 'electron');
		console.log('Version for ABI 64: ' + version);

		const range = await getRange(57, 'electron');
		console.log('Range of versions for ABI 57: ', range.join(', '));
	} catch (e) {
		console.log(e);
	}

	console.log('\n\n');

	// NW.js
	try {
		console.log('NW.js: \n');
		const abi = await getAbi('0.39.2', 'nw.js');
		console.log('ABI for version 0.39.2: ' + abi);

		const version = await getTarget(70, 'nw.js');
		console.log('Version for ABI 70: ' + version);

		const range = await getRange(57, 'nw.js');
		console.log('Range of versions for ABI 57: ', range.join(', '));
	} catch (e) {
		console.log(e);
	}

	console.log('\n\n');

	// Node.js
	try {
		console.log('Node.js: \n');
		const abi = await getAbi('4.2.6', 'node');
		console.log('ABI for version 4.2.6: ' + abi);

		const version = await getTarget(64, 'node');
		console.log('Version for ABI 64: ' + version);

		const range = await getRange(57, 'node');
		console.log('Range of versions for ABI 57: ', range.join(', '));
	} catch (e) {
		console.log(e);
	}

	console.log('\n\n');

	console.log('Runtimes using versions 4.0.0:', await getRuntime('4.0.0'));
})();
