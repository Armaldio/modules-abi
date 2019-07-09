// https://nwjs.io/versions.json

const IRuntime = require('./IRuntime');
const got = require('got');
const semver = require('semver');

/**
 * @class
 * @implements {IRuntime}
 * @type {module.ElectronRuntime}
 */
module.exports = class NWjsRuntime extends IRuntime {
	async getVersions() {
		const {body} = await got('https://nwjs.io/versions.json', {json: true});
		return body.versions;
	}

	async getABI(version) {
		const versions = await this.getVersions();
		const found = versions.find(v => v.version === `v${version}`);
		return parseInt(semver.ltr(found.components.chromium), 10);
	}

	async getTarget(abi) {
		const versions = await this.getVersions();
		const found = versions
			.filter(v => v.components && v.components.chromium && parseInt(semver.ltr(found.components.chromium), 10) === abi)
			.sort((a, b) => semver.compare(b.version, a.version));

		return found[0].version;
	}

	getRange(abi, inbcludeIntermediates = false) {
		return ['0', '1'];
	}
};
