/**
 * @interface
 * @type {IRuntime}
 */
module.exports = class IRuntime {
	/**
	 * @param {String} version - The version you want to get the ABI
	 * @return {Number}
	 * @async
	 */
	// eslint-disable-next-line
	async getABI(version) {
		throw new Error('not implemented');
	}

	/**
	 * @param {Number} abi - The ABI you want the target version
	 * @return {String}
	 * @async
	 */
	// eslint-disable-next-line
	async getTarget(abi, { includeBeta = false, includeNightly = false }) {
		throw new Error('not implemented');
	}

	/**
	 * @param {String} abi - The ABI you want the range of versions
	 * @param {Boolean} inbcludeIntermediates - Wether or not to include intermediate versions
	 * @return {Array<String>}
	 * @async
	 */
	// eslint-disable-next-line
	async getRange(abi, inbcludeIntermediates = false) {
		throw new Error('not implemented');
	}
};
