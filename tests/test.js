import test from 'ava';
import abis from '../';

test('import does not throw', t => {
	t.notThrows(() => {
		require('../');
	});
});

for (const runtime of abis.runtimes) {
	for (const [versionToCheck, result] of [
		['3.1.6', 64],
		['4.0.0', 64],
		['4.2.6', 69],
		['5.0.6', 70],
		['6.0.0-beta.12', 73]
	]) {
		test(`check ${runtime.name} version v${versionToCheck}`, async t => {
			const abi = await abis.getABI(runtime.id, versionToCheck);
			t.deepEqual(abi, result, 'Abi are not the same');
		});
	}

	for (const [abiToCheck, result] of [
		[64, '4.0.3'],
		[69, '4.2.6'],
		[70, '5.0.6']
	]) {
		test(`check ${runtime.name} abi ${abiToCheck}`, async t => {
			const abi = await abis.getTarget(runtime.id, abiToCheck);
			t.deepEqual(abi, result, 'Target are not the same');
		});
	}
}
