const abis = require('../index');

(async () => {
	const abi = await abis.getABI(abis.ELECTRON, '4.2.6');
	console.log('ABI for version 4.2.6: ' + abi);

	const version = await abis.getTarget(abis.ELECTRON, '64');
	console.log('Version for ABI 64: ' + version);
})();
