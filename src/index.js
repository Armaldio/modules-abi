const fetch = require('node-fetch');
const semver = require('semver');

const runtimes = [
	{
		name: 'electron',
		url: 'https://raw.githubusercontent.com/electron/releases/master/lite.json',
		matcher: versions => {
			return versions.map(version => ({
				version: version.version,
				abi: version.deps ? parseInt(version.deps.modules, 10) : 0
			}));
		}
	},
	{
		name: 'node',
		url: 'https://nodejs.org/dist/index.json',
		matcher: versions => {
			return versions.map(version => ({
				version: version.version.replace('v', ''),
				abi: parseInt(version.modules, 10)
			}));
		}
	},
	{
		name: 'nw.js',
		url: 'https://nwjs.io/versions.json',
		matcher: versions => {
			return versions.versions.map(version => ({
				version: version.version.replace('v', ''),
				abi: (version.components &&
									version.components.chromium) ? parseInt(semver.major(semver.coerce(version.components.chromium)), 10) : 0
			}));
		}
	}
];

/**
 * A module that help you query ABI and target version for common runtimes
 * @module abis
 */
module.exports = {
	/**
	 * Get versions for remtote URL
	 * @param {String} url - Url to fetch to get the releases
	 * @return {JSON} - The list of releases for the runtime
	 * @async
	 * @private
	 */
	async _getVersions(url) {
		const res = await fetch(url);
		const json = await res.json();
		return json;
	},

	/**
	 * Find runtime from its name
	 * @param {String} runtime - The runtime to find
	 * @return {*}
	 * @private
	 * @return { Object } - An enhanced representation of the runtime
	 */
	_findRuntime(runtime) {
		return runtimes.find(r => r.name === runtime);
	},

	/**
	 * @param {String} runtime - What runtime you want to get
	 * @param {String} version - The version you want to get the ABI
	 * @return {Number} - The ABI mathcing specified version
	 * @async
	 */
	async getABI(runtime, version) {
		const matchedRuntime = this._findRuntime(runtime);

		const versions = await matchedRuntime.matcher(await this._getVersions(matchedRuntime.url));
		const found = versions.find(v => v.version === version);
		return found.abi;
	},

	/**
	 * @param {String} runtime - What runtime you want to get
	 * @param {Number} abi - The ABI you want the target version
	 * @return {String} - The highest version matching specified ABI
	 * @async
	 */
	async getTarget(runtime, abi) {
		const matchedRuntime = this._findRuntime(runtime);

		const versions = await matchedRuntime.matcher(await this._getVersions(matchedRuntime.url));
		const found = versions
			.filter(v => v.abi === abi)
			.sort((a, b) => semver.compare(b.version, a.version));

		return found[0].version;
	},

	/**
	 * @param {String} runtime - What runtime you want to get
	 * @param {Number} abi - The ABI you want the target version
	 * @param {Boolean} includeIntermediates - Wether or not to include intermediate versions
	 * @return {Array<String>} - An array of version string that match an ABI
	 * @async
	 */
	async getRange(runtime, abi, includeIntermediates = false) {
		const matchedRuntime = this._findRuntime(runtime);

		const versions = await matchedRuntime.matcher(await this._getVersions(matchedRuntime.url));
		const found = versions
			.filter(v => v.abi === abi)
			.sort((a, b) => semver.compare(a.version, b.version));

		const mapped = found.map(f => f.version);

		if (includeIntermediates) {
			return mapped;
		}

		return [mapped[0], mapped[mapped.length - 1]];
	},

	/**
	 * Get all versions of all runtimes availables
	 * @return {Promise<Array>} - An array of all the versions availaables
	 * @async
	 * todo support whitelist / ignore runtime
	 */
	async getAll() {
		const versions = [];
		for (let runtime of runtimes) {
			const matchedRuntime = this._findRuntime(runtime.name);

			// eslint-disable-next-line
			const vs = await matchedRuntime.matcher(await this._getVersions(matchedRuntime.url));
			// eslint-disable-next-line
			vs.forEach(e => e.runtime = runtime.name);
			versions.push(...vs);
		}

		return versions;
	},

	/**
	 * Return all the runtimes associated with a version
	 * @param {String} target - The desired target
	 * @param {Boolean} raw - Return a version object containing al infos about the version instead of just the runtime
	 * @return {Array<Object|String>} - All the runtimes associated with the version
	 * @async
	 */
	async getRuntime(target, raw = false) {
		const versions = await this.getAll();

		if (raw) {
			return versions.filter(v => v.version === target);
		}

		return versions.filter(v => v.version === target).map(v => v.runtime);
	},
	runtimes
};
