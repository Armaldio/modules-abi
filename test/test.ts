import { test, suite } from 'uvu';
import { equal } from 'uvu/assert';
import { runtimes, getAbi, getAll, getRange, getRuntime, getTarget } from '../src';
import fixtures from './fixtures/fixtures';

import nodeAbi from 'node-abi';

// test('import does not throw', t => {
// 	t.notThrows(() => {
// 		const a = import('../src/index');
// 	});
// });

for (const runtime of runtimes) {
	// Get abi
	for (const [ versionToCheck, result ] of fixtures[ runtime.name ].abisCheck) {
		test(`check ${runtime.name} version v${versionToCheck}`, async t => {
			const abi = await getAbi(versionToCheck, runtime.name);
			equal(abi, result, 'Abi are not the same');
		});
	}

	// Get target
	for (const [ abiToCheck, result ] of fixtures[ runtime.name ].versionsCheck) {
		test(`check ${runtime.name} abi ${abiToCheck}`, async t => {
			const abi = await getTarget(abiToCheck, runtime.name);
			equal(abi, result, 'Target are not the same');
		});
	}

	// Get range
	for (const [ abiToCheck, result ] of fixtures[ runtime.name ].rangeCheck) {
		test(`check ${runtime.name} range of abi ${abiToCheck}`, async t => {
			const abi = await getRange(abiToCheck, runtime.name);
			equal(abi, result, 'Target are not the same');
		});
	}
}

test('check node-abi vs modules-abi - 7.2.0 - node', async t => {
	const _7_2_0_node   = await nodeAbi.getAbi('7.2.0', 'node');
	const _7_2_0_nodeMA = await getAbi('7.2.0', 'node');
	equal(parseInt(_7_2_0_node), _7_2_0_nodeMA);
});

test('check node-abi vs modules-abi - 1.4.10 - electron', async t => {
	const _1_4_10_electron   = await nodeAbi.getAbi('1.4.10', 'electron');
	const _1_4_10_electronMA = await getAbi('1.4.10', 'electron');
	equal(parseInt(_1_4_10_electron), _1_4_10_electronMA);
});

test('check node-abi vs modules-abi - v51 - node', async t => {
	const _51_node   = await nodeAbi.getTarget('51', 'node');
	const _51_nodeMA = await getTarget(51, 'node');
	equal(parseInt(_51_node), parseInt(_51_nodeMA));
});

test('check node-abi vs modules-abi - v50 - electron', async t => {
	const _50_electron   = await nodeAbi.getTarget('50', 'electron');
	const _50_electronMA = await getTarget(50, 'electron');
	equal(parseInt(_50_electron), parseInt(_50_electronMA));
});

test('check getAll', async t => {
	let all = await getAll();
	all = all.filter(el => el.runtime === 'electron');
	all = all.filter(el => el.abi === 64);
	equal(all.length, 35);
});

test('check getAll including beta', async t => {
	let all = await getAll({
		includeBeta: true,
		includeNightly: true,
	});
	all = all.filter(el => el.runtime === 'electron');
	all = all.filter(el => el.abi === 64);
	equal(all.length, 74);
});

test.run();
