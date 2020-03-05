import {getAbi, getRange, getRuntimesFromTarget, getTarget} from '../lib'
import {runtime} from '../models'

(async () => {
  // Electron
  try {
    console.log('Electron: \n')
    const abi = await getAbi('4.2.6', runtime.ELECTRON)
    console.log('ABI for version 4.2.6: ' + abi)

    const version = await getTarget(64, runtime.ELECTRON)
    console.log('Version for ABI 64: ' + version)

    const range = await getRange(57, runtime.ELECTRON)
    console.log('Range of versions for ABI 57: ', range.join(', '))
  } catch (e) {
    console.log(e)
  }

  console.log('\n\n')

  // NW.js
  try {
    console.log('NW.js: \n')
    const abi = await getAbi('0.39.2', runtime.NWJS)
    console.log('ABI for version 0.39.2: ' + abi)

    const version = await getTarget(70, runtime.NWJS)
    console.log('Version for ABI 70: ' + version)

    const range = await getRange(57, runtime.NWJS)
    console.log('Range of versions for ABI 57: ', range.join(', '))
  } catch (e) {
    console.log(e)
  }

  console.log('\n\n')

  // Node.js
  try {
    console.log('Node.js: \n')
    const abi = await getAbi('4.2.6', runtime.NODE)
    console.log('ABI for version 4.2.6: ' + abi)

    const version = await getTarget(64, runtime.NODE)
    console.log('Version for ABI 64: ' + version)

    const range = await getRange(57, runtime.NODE)
    console.log('Range of versions for ABI 57: ', range.join(', '))
  } catch (e) {
    console.log(e)
  }

  console.log('\n\n')

  console.log('Runtimes using versions 4.0.0:', await getRuntimesFromTarget('4.0.0'))
})()
