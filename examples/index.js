const abis = require('../lib');

(async () => {
	// Electron
	try {
		console.log('Electron: \n');
		const abi = await abis.getABI('electron', '4.2.6');
		console.log('ABI for version 4.2.6: ' + abi);

		const version = await abis.getTarget('electron', 64);
		console.log('Version for ABI 64: ' + version);

		const range = await abis.getRange('electron', 57);
		console.log('Range of versions for ABI 57: ', range.join(', '));
	} catch (e) {
		console.log(e);
	}

	console.log('\n\n');

	// NW.js
	try {
		console.log('NW.js: \n');
		const abi = await abis.getABI('nw.js', '0.39.2');
		console.log('ABI for version 0.39.2: ' + abi);

		const version = await abis.getTarget('nw.js', 70);
		console.log('Version for ABI 70: ' + version);

		const range = await abis.getRange('nw.js', 57);
		console.log('Range of versions for ABI 57: ', range.join(', '));
	} catch (e) {
		console.log(e);
	}

	console.log('\n\n');

	// Node.js
	try {
		console.log('Node.js: \n');
		const abi = await abis.getABI('node', '4.2.6');
		console.log('ABI for version 4.2.6: ' + abi);

		const version = await abis.getTarget('node', 64);
		console.log('Version for ABI 64: ' + version);

		const range = await abis.getRange('node', 57);
		console.log('Range of versions for ABI 57: ', range.join(', '));
	} catch (e) {
		console.log(e);
	}

	console.log('\n\n');

	console.log(await abis.getRuntime('4.0.0'));
})();
