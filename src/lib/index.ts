import https from 'https'

import semver from 'semver'
import {
  abi,
  electronVersion,
  moduleInfos,
  nodeVersion,
  nwjsVersion,
  options,
  runtime,
  runtimeMatcher,
  target
} from '../models'

const runtimesMatcher: Record<runtime, runtimeMatcher> = {
  [runtime.ELECTRON]: {
    url: 'https://raw.githubusercontent.com/electron/releases/master/lite.json',
    matcher: (versions): moduleInfos[] => {
      return (versions as electronVersion[]).map(version => ({
        type: runtime.ELECTRON,
        target: version.version,
        abi: version.deps ? parseInt(version.deps.modules, 10) : 0
      }))
    }
  },
  [runtime.NODE]: {
    url: 'https://nodejs.org/dist/index.json',
    // TODO
    // @ts-ignore
    matcher: (versions): moduleInfos[] => {
      return (versions as nodeVersion[]).map(version => ({
        target: version.version.replace('v', ''),
        type: runtime.NODE,
        abi: parseInt(version.modules, 10)
      }))
    }
  },
  [runtime.NWJS]: {
    url: 'https://raw.githubusercontent.com/nwjs/website/master/src/versions.json',
    // @ts-ignore
    matcher: ({versions}: { versions: nwjsVersion[] }): moduleInfos[] => {
      return versions.map(version => {

        let abi: number
        if (version.components && version.components.chromium) {
          const chromiumVersion = version.components.chromium
          const coercedChromiumVersion = semver.coerce(chromiumVersion)
          if (coercedChromiumVersion) {
            const majorChromiumVersion = semver.major(coercedChromiumVersion)
            if (majorChromiumVersion) {
              abi = majorChromiumVersion
            } else {
              abi = 0
            }
          } else {
            abi = 0
          }
        } else {
          abi = 0
        }

        return ({
          target: version.version.replace('v', ''),
          type: runtime.NWJS,
          abi
        })
      })
    }
  }
}

export const runtimes = Object.keys(runtime)

function fetch(url: string): unknown {
  return new Promise((resolve, reject) => {
    https.get(url, resp => {
      let data = ''

      // A chunk of data has been received.
      resp.on('data', chunk => {
        data += chunk
      })

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(JSON.parse(data))
      })
    }).on('error', err => {
      reject(err)
    })
  })
}

const _filterBeta = (module: moduleInfos) => {
  return !module.target.includes('beta')
}

const _filterNightly = (module: moduleInfos) => {
  return !module.target.includes('nightly')
}

const _filterRC = (module: moduleInfos) => {
  return !module.target.includes('rc')
}

/**
 */
export const getAbi = async (target: target, runtime: runtime): Promise<number> => {
  const matchedRuntime = runtimesMatcher[runtime]

  const response = await fetch(matchedRuntime.url)
  const versions: moduleInfos[] = await matchedRuntime.matcher(response)
  const found = versions.find(v => v.target === target)
  if (found) {
    return found.abi
  }
  return 0
}

/**
 */
export const getTarget = async (abi: abi, runtime: runtime) => {
  const matchedRuntime = runtimesMatcher[runtime]

  const response = await fetch(matchedRuntime.url)
  const versions: moduleInfos[] = await matchedRuntime.matcher(response)
  const found = versions
    .filter(v => v.abi === abi)
    .sort((a, b) => semver.compare(b.target, a.target))

  if (found.length > 0) {
    return found[0].target
  } else {
    return null
  }
}

/**
 */
export const getRange = async (abi: abi, runtime: runtime, options: options = {}) => {
  const matchedRuntime = runtimesMatcher[runtime]

  const response = await fetch(matchedRuntime.url)
  const versions: moduleInfos[] = await matchedRuntime.matcher(response)

  let found = versions
    .filter(v => v.abi === abi)
    .sort((a, b) => semver.compare(a.target, b.target))


  if (!options.includeBeta) {
    found = found.filter(_filterBeta)
  }

  if (!options.includeNightly) {
    found = found.filter(_filterNightly)
  }

  if (!options.includeReleaseCandidates) {
    found = found.filter(_filterRC)
  }

  const mapped = found.map(f => f.target)

  if (options.includeIntermediates) {
    return mapped
  }


  return [mapped[0], mapped[mapped.length - 1]]
}

/**
 * Get all versions of all runtimes availables
 * todo support whitelist / ignore runtime
 */
export const getAll = async (
  {
    includeNightly = false,
    includeBeta = false,
    includeReleaseCandidates = false
  } = {}
): Promise<moduleInfos[]> => {
  const runtimesKeys: runtime[] = Object.keys(runtimesMatcher) as runtime[]

  let versions: moduleInfos[] = []
  for (const runtimeKey of runtimesKeys) {
    try {
      const runtime: runtimeMatcher = runtimesMatcher[runtimeKey]
      const response = await fetch(runtime.url)
      const matchedMersions = runtime.matcher(response)
      matchedMersions.forEach(e => e.type = runtimeKey)
      versions.push(...matchedMersions)
    } catch (e) {
      console.error(`Cannot fetch versions for ${runtimeKey}`)
    }
  }

  if (!includeBeta) {
    versions = versions.filter(_filterBeta)
  }

  if (!includeNightly) {
    versions = versions.filter(_filterNightly)
  }

  if (!includeReleaseCandidates) {
    versions = versions.filter(_filterRC)
  }

  return versions as moduleInfos[]
}

/**
 * Return all the runtimes associated with a version
 */
export const getRuntimesFromABI = async (abi: abi, raw = false) => {
  const versions = await getAll()

  if (raw) {
    return versions.filter(v => v.abi === abi)
  }

  return versions.filter(v => v.abi === abi).map(v => v.type)
}

export const getRuntimesFromTarget = async (target: target, raw = false) => {
  const versions = await getAll()

  if (raw) {
    return versions.filter(v => v.target === target)
  }

  return versions.filter(v => v.target === target).map(v => v.type)
}
