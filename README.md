# modules-abi

![](https://badgen.net/github/release/armaldio/modules-abi/stable)
![](https://badgen.net/github/last-commit/armaldio/modules-abi)
![](https://badgen.net/github/dependents-repo/armaldio/modules-abi/)
![](https://badgen.net/npm/dw/modules-abi/)
![](https://badgen.net/npm/license/modules-abi/)
![](https://badgen.net/travis/armaldio/modules-abi/)
![](https://badgen.net/dependabot/dependabot/dependabot-core/?icon=dependabot)

> Easily query abi and target versions of common desktop runtimes (electron, nw.js, node)

## Install

```
$ npm install modules-abi
$ yarn add modules-abi
```

## Usage

```js
const abis = require('modules-abi');
```

To view detailled informations about the API, please see the [documentation](/DOCUMENTATION.md)

## Comparison to node-abi
`node-abi` is: 
- hand-written (require pull requests to update, slow updates) 
- it's not always up to date
- it's missing a lot of versions
- it's missing nw.js versions
