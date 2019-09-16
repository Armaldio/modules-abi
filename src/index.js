const semver = require('semver');
const https = require('https');

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
		url: 'https://raw.githubusercontent.com/nwjs/website/master/src/versions.json',
		matcher: versions => {
			return versions.versions.map(version => ({
				version: version.version.replace('v', ''),
				abi: (version.components &&
					version.components.chromium) ? parseInt(semver.major(semver.coerce(version.components.chromium)), 10) : 0
			}));
		}
	}
];

function fetch(url) {
	return new Promise((resolve, reject) => {
		https.get(url, resp => {
			let data = '';

			// A chunk of data has been received.
			resp.on('data', chunk => {
				data += chunk;
			});

			// The whole response has been received. Print out the result.
			resp.on('end', () => {
				resolve(JSON.parse(data));
			});
		}).on('error', err => {
			reject(err);
		});
	});
}

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
		const json = await res;
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

	_filterBeta(_elem) {
		let elem = _elem;
		if (_elem.version) {
			elem = _elem.version;
		}

		return !elem.includes('beta');
	},

	_filterNightly(_elem) {
		let elem = _elem;
		if (_elem.version) {
			elem = _elem.version;
		}

		return !elem.includes('nightly');
	},

	_filterRC(_elem) {
		let elem = _elem;
		if (_elem.version) {
			elem = _elem.version;
		}

		return !elem.includes('rc');
	},

	/**
	 * @param {String} version - The version you want to get the ABI
	 * @param {String} runtime - What runtime you want to get
	 * @return {Number} - The ABI mathcing specified version
	 * @async
	 */
	async getAbi(version, runtime) {
		const matchedRuntime = this._findRuntime(runtime);

		const versions = await matchedRuntime.matcher(await this._getVersions(matchedRuntime.url));
		const found = versions.find(v => v.version === version);
		return found.abi;
	},

	/**
	 * @param {Number} abi - The ABI you want the target version
	 * @param {String} runtime - What runtime you want to get
	 * @return {String} - The highest version matching specified ABI
	 * @async
	 */
	async getTarget(abi, runtime) {
		const matchedRuntime = this._findRuntime(runtime);

		const versions = await matchedRuntime.matcher(await this._getVersions(matchedRuntime.url));
		const found = versions
			.filter(v => v.abi === abi)
			.sort((a, b) => semver.compare(b.version, a.version));

		return found[0].version;
	},

	/**
	 * @param {Number} abi - The ABI you want the target version
	 * @param {String} runtime - What runtime you want to get
	 * @param {Object} options - Properties to filter results
	 * @return {Array<String>} - An array of version string that match an ABI
	 * @async
	 */
	async getRange(abi, runtime, {
		includeIntermediates = false,
		includeNightly = false,
		includeBeta = false,
		includeReleaseCandidates = false
	} = {}) {
		const matchedRuntime = this._findRuntime(runtime);

		const versions = await matchedRuntime.matcher(await this._getVersions(matchedRuntime.url));
		const found = versions
			.filter(v => v.abi === abi)
			.sort((a, b) => semver.compare(a.version, b.version));

		let mapped = found.map(f => f.version);

		if (!includeBeta) {
			mapped = mapped.filter(this._filterBeta);
		}

		if (!includeNightly) {
			mapped = mapped.filter(this._filterNightly);
		}

		if (!includeReleaseCandidates) {
			mapped = mapped.filter(this._filterRC);
		}

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
	async getAll({includeNightly = false, includeBeta = false, includeReleaseCandidates = false} = {}) {
		let versions = [];
		for (let runtime of runtimes) {
			const matchedRuntime = this._findRuntime(runtime.name);

			// eslint-disable-next-line
			const vs = await matchedRuntime.matcher(await this._getVersions(matchedRuntime.url));
			// eslint-disable-next-line
			vs.forEach(e => e.runtime = runtime.name);
			versions.push(...vs);
		}

		if (!includeBeta) {
			versions = versions.filter(this._filterBeta);
		}

		if (!includeNightly) {
			versions = versions.filter(this._filterNightly);
		}

		if (!includeReleaseCandidates) {
			versions = versions.filter(this._filterRC);
		}

		return versions;
	},

	/**
	 * Return all the runtimes associated with a version
	 * @param {String} target - The desired target
	 * @param {Boolean} raw - Return a version object containing all infos about the version instead of just the runtime
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
