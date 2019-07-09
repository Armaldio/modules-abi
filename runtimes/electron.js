// https://raw.githubusercontent.com/electron/releases/master/lite.json

const IRuntime = require('./IRuntime');
const got = require('got');
const semver = require('semver');

/**
 * @class
 * @implements {IRuntime}
 * @type {module.ElectronRuntime}
 */
module.exports = class ElectronRuntime extends IRuntime {
	async getVersions() {
		const {body} = await got('https://raw.githubusercontent.com/electron/releases/master/lite.json', {json: true});
		return body;
	}

	async getABI(version) {
		const versions = await this.getVersions();
		const found = versions.find(v => v.version === version);
		return parseInt(found.deps.modules, 10);
	}

	async getTarget(abi) {
		const versions = await this.getVersions();
		const found = versions
			.filter(v => v.deps && parseInt(v.deps.modules, 10) === abi)
			.sort((a, b) => semver.compare(b.version, a.version));

		return found[0].version;
	}

	getRange(abi, inbcludeIntermediates = false) {
		return ['0', '1'];
	}
};
