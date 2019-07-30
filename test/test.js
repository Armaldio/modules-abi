import test from 'ava';
import abis from '../src';
import fixtures from './fixtures/fixtures';

const nodeAbi = require('node-abi');

test('import does not throw', t => {
	t.notThrows(() => {
		require('../src');
	});
});

for (const runtime of abis.runtimes) {
	// Get abi
	for (const [ versionToCheck, result ] of fixtures[ runtime.name ].abisCheck) {
		test(`check ${runtime.name} version v${versionToCheck}`, async t => {
			const abi = await abis.getAbi(versionToCheck, runtime.name);
			t.deepEqual(abi, result, 'Abi are not the same');
		});
	}

	// Get target
	for (const [ abiToCheck, result ] of fixtures[ runtime.name ].versionsCheck) {
		test(`check ${runtime.name} abi ${abiToCheck}`, async t => {
			const abi = await abis.getTarget(abiToCheck, runtime.name);
			t.deepEqual(abi, result, 'Target are not the same');
		});
	}

	// Get range
	for (const [ abiToCheck, result ] of fixtures[ runtime.name ].rangeCheck) {
		test(`check ${runtime.name} range of abi ${abiToCheck}`, async t => {
			const abi = await abis.getRange(abiToCheck, runtime.name);
			t.deepEqual(abi, result, 'Target are not the same');
		});
	}
}

test('check node-abi vs modules-abi - 7.2.0 - node', async t => {
	const _7_2_0_node   = await nodeAbi.getAbi('7.2.0', 'node');
	const _7_2_0_nodeMA = await abis.getAbi('7.2.0', 'node');
	t.deepEqual(parseInt(_7_2_0_node), parseInt(_7_2_0_nodeMA));
});

test('check node-abi vs modules-abi - 1.4.10 - electron', async t => {
	const _1_4_10_electron   = await nodeAbi.getAbi('1.4.10', 'electron');
	const _1_4_10_electronMA = await abis.getAbi('1.4.10', 'electron');
	t.deepEqual(parseInt(_1_4_10_electron), parseInt(_1_4_10_electronMA));
});

test('check node-abi vs modules-abi - v51 - node', async t => {
	const _51_node   = await nodeAbi.getTarget('51', 'node');
	const _51_nodeMA = await abis.getTarget(51, 'node');
	t.deepEqual(parseInt(_51_node), parseInt(_51_nodeMA));
});

test('check node-abi vs modules-abi - v50 - electron', async t => {
	const _50_electron   = await nodeAbi.getTarget('50', 'electron');
	const _50_electronMA = await abis.getTarget(50, 'electron');
	t.deepEqual(parseInt(_50_electron), parseInt(_50_electronMA));
});
