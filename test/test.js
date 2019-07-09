import test from 'ava';
import abis from '../src';
import fixtures from './fixtures/fixtures';

test('import does not throw', t => {
	t.notThrows(() => {
		require('../src');
	});
});

for (const runtime of abis.runtimes) {
	// Get abi
	for (const [versionToCheck, result] of fixtures[runtime.name].abisCheck) {
		test(`check ${runtime.name} version v${versionToCheck}`, async t => {
			const abi = await abis.getABI(runtime.name, versionToCheck);
			t.deepEqual(abi, result, 'Abi are not the same');
		});
	}

	// Get target
	for (const [abiToCheck, result] of fixtures[runtime.name].versionsCheck) {
		test(`check ${runtime.name} abi ${abiToCheck}`, async t => {
			const abi = await abis.getTarget(runtime.name, abiToCheck);
			t.deepEqual(abi, result, 'Target are not the same');
		});
	}

	// Get range
	for (const [abiToCheck, result] of fixtures[runtime.name].rangeCheck) {
		test(`check ${runtime.name} range of abi ${abiToCheck}`, async t => {
			const abi = await abis.getRange(runtime.name, abiToCheck);
			t.deepEqual(abi, result, 'Target are not the same');
		});
	}
}
