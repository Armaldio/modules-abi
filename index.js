const got = require('got');
const semver = require('semver');

/**
 * @typedef {number} Runtime
 **/

/** @enum {Runtime} */
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

module.exports = {
	/**
	 * @param {String} url - Url to fetch to get the releases
	 * @return {JSON} - The list of releases for the runtime
	 * @async
	 */
	async getVersions(url) {
		const {body} = await got(url, {json: true});
		return body;
	},

	getRuntime(runtime) {
		return runtimes.find(r => r.name === runtime);
	},

	/**
	 * @param {String} runtime - What runtime you want to get
	 * @param {String} version - The version you want to get the ABI
	 * @return {Number} - The ABI mathcing specified version
	 * @async
	 */
	async getABI(runtime, version) {
		const matchedRuntime = this.getRuntime(runtime);

		const versions = await matchedRuntime.matcher(await this.getVersions(matchedRuntime.url));
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
		const matchedRuntime = this.getRuntime(runtime);

		const versions = await matchedRuntime.matcher(await this.getVersions(matchedRuntime.url));
		const found = versions
			.filter(v => v.abi === abi)
			.sort((a, b) => semver.compare(b.version, a.version));

		return found[0].version;
	},

	/**
	 * @param {String} runtime - What runtime you want to get
	 * @param {Number} abi - The ABI you want the target version
	 * @param {Boolean} inbcludeIntermediates - Wether or not to include intermediate versions
	 * @return {Array<String>} - An array of version string that match an ABI
	 * @async
	 */
	async getRange(runtime, abi, inbcludeIntermediates = false) {
		const matchedRuntime = this.getRuntime(runtime);

		const versions = await matchedRuntime.matcher(await this.getVersions(matchedRuntime.url));
		const found = versions
			.filter(v => v.abi === abi)
			.sort((a, b) => semver.compare(b.version, a.version));

		return found.map(f => f.version);
	},
	runtimes
};
