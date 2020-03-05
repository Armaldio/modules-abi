import test from 'ava'
import {lt} from 'semver'
import {runtime} from '../models'
import fixtures from '../tests/fixtures/fixtures'
import {getAbi, getAll, getRange, getTarget, runtimes} from './'

const nodeAbi = require('node-abi')

for (const _runtime of runtimes) {
  const runtime: runtime = _runtime as runtime

  // Get abi
  for (const [versionToCheck, result] of fixtures[runtime].abisCheck) {
    test(`check ${runtime} version v${versionToCheck}`, async t => {
      const abi = await getAbi(versionToCheck, runtime)
      t.deepEqual(abi, result, 'Abi are not the same')
    })
  }

  // Get target
  for (const [abiToCheck, result] of fixtures[runtime].versionsCheck) {
    test(`check ${runtime} abi ${abiToCheck}`, async t => {
      const abi = await getTarget(abiToCheck, runtime)
      t.deepEqual(abi, result, 'Target are not the same')
    })
  }

  // Get range
  for (const [abiToCheck, result] of fixtures[runtime].rangeCheck) {
    test(`check ${runtime} range of abi ${abiToCheck}`, async t => {
      const abi = await getRange(abiToCheck, runtime)
      t.deepEqual(abi, result, 'Target are not the same')
    })
  }
}

test('check node-abi vs modules-abi - 7.2.0 - node', async t => {
  const _7_2_0_node = await nodeAbi.getAbi('7.2.0', 'node')
  const _7_2_0_nodeMA = await getAbi('7.2.0', runtime.NODE)
  t.deepEqual(parseInt(_7_2_0_node), _7_2_0_nodeMA)
})

test('check node-abi vs modules-abi - 1.4.10 - electron', async t => {
  const _1_4_10_electron = await nodeAbi.getAbi('1.4.10', 'electron')
  const _1_4_10_electronMA = await getAbi('1.4.10', runtime.ELECTRON)
  t.deepEqual(parseInt(_1_4_10_electron), _1_4_10_electronMA)
})

test('check node-abi < modules-abi - v48 - node', async t => {
  const _48_node = await nodeAbi.getTarget('48', 'node')
  const _48_nodeMA = await getTarget(48, runtime.NODE)
  if (_48_nodeMA) {
    t.true(lt(_48_node, _48_nodeMA))
  } else {
    t.fail('Cannot find target')
  }
})

test('check node-abi < modules-abi - v50 - electron', async t => {
  const _50_electron = await nodeAbi.getTarget('50', 'electron')
  const _50_electronMA = await getTarget(50, runtime.ELECTRON)
  if (_50_electronMA) {
    t.true(lt(_50_electron, _50_electronMA))
  } else {
    t.fail('Cannot find target')
  }
})

test('check getAll', async t => {
  let all = await getAll()
  all = all.filter(el => el.type === runtime.ELECTRON)
  all = all.filter(el => el.abi === 64)
  t.deepEqual(all.length, 35)
})

test('check getAll including beta', async t => {
  let all = await getAll({
    includeBeta: true,
    includeNightly: true
  })
  all = all.filter(el => el.type === runtime.ELECTRON)
  all = all.filter(el => el.abi === 64)
  t.deepEqual(all.length, 74)
})
