import semver from 'semver';
import https from 'https';
import isOnlineCheck from 'is-online';
import { writeFile, readFile } from 'node:fs/promises'
import { join } from 'node:path'

function fetch(url: string) {
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

type Filters = {
	// Wether to include Nightly inside the list
	includeNightly?: boolean
	// Wether to include Beta inside the list
	includeBeta?: boolean
	// Wether to include Release Candidates inside the list
	includeReleaseCandidates?: boolean
	// Wether to include intermediate versions (only valid for the "range" method)
	includeIntermediates?: boolean
}

// const tempPath = (name: string) => join(__dirname, `temp-${name}.json`)

abstract class RuntimeBase<T> {
	abstract name: 'node' | 'nw.js' | 'electron'
	abstract url: string
	cache: T | null = null
	abstract matcher(): Promise<Version[]>

	protected async getVersions(): Promise<NonNullable<this['cache']>> {
		if (this.cache) {
			return this.cache;
		}

		const isOnline = await isOnlineCheck()

		if (isOnline) {
			const res = await fetch(this.url);
			const json = (await res) as NonNullable<this['cache']>;
			// await writeFile(tempPath(this.name), JSON.stringify(json), 'utf-8')
			this.cache = json;
			return json;
		} else {
			// const jsonRAW = await readFile(tempPath(this.name), 'utf-8')
			// const json = JSON.parse(jsonRAW) as NonNullable<this['cache']>

			// this.cache = json;
			// return json;
			throw new Error("Internet connection unavailable. Please try again later");
		}
	}
}

export interface ElectronJSONItem {
	node_id: string
	tag_name: string
	name: string
	prerelease: boolean
	published_at: string
	version: string
	npm_package_name?: string
	deps?: {
		node: string
		apm?: string
		v8: string
		uv: string
		zlib: string
		openssl: string
		modules: string
		chrome: string
	}
	npm_dist_tags: string[]
	total_downloads: number
}

type ElectronJSON = ElectronJSONItem[]
class ElectronRuntime extends RuntimeBase<ElectronJSON> {
	name: RuntimeBase<any>['name'] = 'electron'
	url = 'https://raw.githubusercontent.com/electron/releases/master/lite.json'
	async matcher() {
		const versions = await this.getVersions()

		const result = versions.map(version => {
			const v: Version = {
				version: version.version,
				abi: version.deps ? parseInt(version.deps.modules, 10) : 0
			}
			return v;
		});

		return result
	}

}

export interface NWJSJSONItem {
	latest: string
	stable: string
	lts: string
	versions: {
		version: string
		date: string
		files: string[]
		flavors: string[]
		components: {
			node: string
			chromium: string
		}
	}[]
}

type NWJSJSON = NWJSJSONItem
class NWJSRuntime extends RuntimeBase<NWJSJSON> {
	name: RuntimeBase<any>['name'] = 'nw.js'
	url = 'https://raw.githubusercontent.com/nwjs/website/master/src/versions.json'
	async matcher() {
		const versions = await this.getVersions()
		const finalVersions = [];

		for (const version of versions.versions) {
			const nodeVersion = version.components.node;

			try {
				// eslint-disable-next-line no-await-in-loop
				const nodeAbi = await getAbi(nodeVersion, 'node');

				if (nodeAbi) {
					const val: Version = {
						version: version.version.replace('v', ''),
						abi: nodeAbi
					};

					finalVersions.push(val);
				}
			} catch (e) {
				// console.error('aaaa')
			}
		}

		return finalVersions;
	}
}

export interface NodeJSONItem {
	version: string
	date: string
	files: string[]
	npm?: string
	v8: string
	uv?: string
	zlib?: string
	openssl?: string
	modules?: string
	lts: any
	security: boolean
}

type NodeJSON = NodeJSONItem[]
class NodeRuntime extends RuntimeBase<NodeJSON> {
	name: RuntimeBase<any>['name'] = 'node'
	url = 'https://nodejs.org/dist/index.json'
	async matcher() {
		const versions = await this.getVersions()
		return versions.map(version => {
			return ({
				version: version.version.replace('v', ''),
				abi: parseInt(version.modules ?? '0', 10)
			});
		});
	}

}

type Version = {
	version: string
	abi: number
}

type Runtime = ElectronRuntime | NodeRuntime | NWJSRuntime

export const runtimes: [ElectronRuntime, NodeRuntime, NWJSRuntime] = [
	new ElectronRuntime(),
	new NodeRuntime(),
	new NWJSRuntime(),
]

const _findRuntime = (runtime: Runtime['name']) => {
	return runtimes.find(r => r.name === runtime);
}

const _filterBeta = (elem: Version) => {
	return !elem.version.includes('beta');
}

const _filterNightly = (elem: Version) => {
	return !elem.version.includes('nightly');
}

const _filterRC = (elem: Version) => {
	return !elem.version.includes('rc');
}

export const getAbi = async (version: string, runtime: Runtime['name']): Promise<number> => {
	const matchedRuntime = _findRuntime(runtime);

	if (!matchedRuntime) {
		throw new Error('Runtime not found')
	}

	const versions = await matchedRuntime.matcher();
	const found = versions.find(v => v.version === version);

	if (found) {
		return found.abi;
	}
	throw new Error(`Version ${runtime}@${version} not found`)
}

export const getTarget = async (abi: number, runtime: Runtime['name']) => {
	const matchedRuntime = _findRuntime(runtime);

	if (!matchedRuntime) {
		throw new Error('Runtime not found')
	}

	const versions = await matchedRuntime.matcher();
	const found = versions
		.filter(v => v.abi === abi)
		.sort((a, b) => semver.compare(b.version, a.version));

	const firstElement = found[0]

	if (firstElement) {
		return found[0].version;
	}
	throw new Error('Target not found')
}

export const getRange = async (
	abi: number,
	runtime: Runtime['name'],
	filters?: Filters
) => {
	const {
		includeNightly = false,
		includeBeta = false,
		includeReleaseCandidates = false,
		includeIntermediates = false,
	} = filters ?? {}

	const matchedRuntime = _findRuntime(runtime);

	if (!matchedRuntime) {
		throw new Error('Runtime not found')
	}

	const versions = await matchedRuntime.matcher();
	let found = versions
		.filter(v => v.abi === abi)
		.sort((a, b) => semver.compare(a.version, b.version));

	if (!includeBeta) {
		found = found.filter(_filterBeta);
	}

	if (!includeNightly) {
		found = found.filter(_filterNightly);
	}

	if (!includeReleaseCandidates) {
		found = found.filter(_filterRC);
	}

	if (includeIntermediates) {
		return found.map(x => x.version);
	}

	if (found.length === 0) {
		throw new Error('Range not found')
	}

	const firstElement = found[0]
	const lastElement = found[found.length - 1]

	if (firstElement && lastElement) {
		return [firstElement.version, lastElement.version];
	}
	throw new Error('Range not found')
}

type FinalVersions = (Version & { runtime: Runtime['name'] })[]

export const getAll = async (filters?: Filters) => {
	const {
		includeNightly = false,
		includeBeta = false,
		includeReleaseCandidates = false
	} = filters ?? {}

	let versions: FinalVersions = [];
	for (let runtime of runtimes) {
		const matchedRuntime = _findRuntime(runtime.name);

		if (!matchedRuntime) {
			throw new Error('Runtime not found')
		}

		const vs = await matchedRuntime.matcher();
		vs.forEach(e => {
			versions.push({
				abi: e.abi,
				runtime: runtime.name,
				version: e.version,
			})
		});
	}

	if (!includeBeta) {
		versions = versions.filter(_filterBeta);
	}

	if (!includeNightly) {
		versions = versions.filter(_filterNightly);
	}

	if (!includeReleaseCandidates) {
		versions = versions.filter(_filterRC);
	}

	return versions;
}

/**
 * Return all the runtimes associated with a version
 */
export async function getRuntime(
	target: string,
	raw: true
): Promise<FinalVersions>
export async function getRuntime(
	target: string,
	raw: false
): Promise<Runtime['name'][]>
export async function getRuntime(
	target: string,
	raw: boolean
): Promise<FinalVersions | Runtime['name'][]> {
	const versions = await getAll();

	if (raw) {
		return versions.filter(v => v.version === target);
	}

	return versions.filter(v => v.version === target).map(v => v.runtime);
}
