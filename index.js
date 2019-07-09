const ElectronRuntime = require('./runtimes/electron');
/**
 * @typedef {number} Runtime
 **/

/** @enum {Runtime} */
const runtimes = [
	{
		name: 'electron',
		id: 0
	},
	{
		name: 'node',
		id: 1
	},
	{
		name: 'nw.js',
		id: 2
	}
];

const getRuntime = runtime => {
	switch (runtime) {
		case runtimes[0].id:
			return new ElectronRuntime();
		case runtimes[1].id:
			break;
		case runtimes[2].id:
			break;
		default:
			console.log('Unsupported runtime ' + runtime);
	}
};

module.exports = {

	/**
	 * @param {Runtime} runtime
	 * @param {String} version
	 */
	getABI(runtime, version) {
		return getRuntime(runtime).getABI(version);
	},
	/**
	 * @param {Runtime} runtime
	 * @param {String} abi
	 */
	getTarget(runtime, abi) {
		return getRuntime(runtime).getTarget(abi);
	},
	/**
	 * @param {Runtime} runtime
	 * @param {String} abi
	 * @param {Boolean} inbcludeIntermediates
	 */
	getRange(runtime, abi, inbcludeIntermediates = false) {
		return getRuntime(runtime).getRange(abi, inbcludeIntermediates);
	},
	runtimes
};

module.exports.ELECTRON = runtimes[0].id;
module.exports.NODE = runtimes[1].id;
module.exports.NWJS = runtimes[2].id;
