<a name="module_abis"></a>

## abis
A module that help you query ABI and target version for common runtimes


* [abis](#module_abis)
    * [.getABI(runtime, version)](#module_abis.getABI) ⇒ <code>Number</code>
    * [.getTarget(runtime, abi)](#module_abis.getTarget) ⇒ <code>String</code>
    * [.getRange(runtime, abi, includeIntermediates)](#module_abis.getRange) ⇒ <code>Array.&lt;String&gt;</code>
    * [.getAll()](#module_abis.getAll) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [.getRuntime(target, raw)](#module_abis.getRuntime) ⇒ <code>Array.&lt;(Object\|String)&gt;</code>

<a name="module_abis.getABI"></a>

### abis.getABI(runtime, version) ⇒ <code>Number</code>
**Kind**: static method of [<code>abis</code>](#module_abis)  
**Returns**: <code>Number</code> - - The ABI mathcing specified version  

| Param | Type | Description |
| --- | --- | --- |
| runtime | <code>String</code> | What runtime you want to get |
| version | <code>String</code> | The version you want to get the ABI |

<a name="module_abis.getTarget"></a>

### abis.getTarget(runtime, abi) ⇒ <code>String</code>
**Kind**: static method of [<code>abis</code>](#module_abis)  
**Returns**: <code>String</code> - - The highest version matching specified ABI  

| Param | Type | Description |
| --- | --- | --- |
| runtime | <code>String</code> | What runtime you want to get |
| abi | <code>Number</code> | The ABI you want the target version |

<a name="module_abis.getRange"></a>

### abis.getRange(runtime, abi, includeIntermediates) ⇒ <code>Array.&lt;String&gt;</code>
**Kind**: static method of [<code>abis</code>](#module_abis)  
**Returns**: <code>Array.&lt;String&gt;</code> - - An array of version string that match an ABI  

| Param | Type | Description |
| --- | --- | --- |
| runtime | <code>String</code> | What runtime you want to get |
| abi | <code>Number</code> | The ABI you want the target version |
| includeIntermediates | <code>Boolean</code> | Wether or not to include intermediate versions |

<a name="module_abis.getAll"></a>

### abis.getAll() ⇒ <code>Promise.&lt;Array&gt;</code>
Get all versions of all runtimes availables

**Kind**: static method of [<code>abis</code>](#module_abis)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - - An array of all the versions availaables  
<a name="module_abis.getRuntime"></a>

### abis.getRuntime(target, raw) ⇒ <code>Array.&lt;(Object\|String)&gt;</code>
Return all the runtimes associated with a version

**Kind**: static method of [<code>abis</code>](#module_abis)  
**Returns**: <code>Array.&lt;(Object\|String)&gt;</code> - - All the runtimes associated with the version  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>String</code> | The desired target |
| raw | <code>Boolean</code> | Return a version object containing al infos about the version instead of just the runtime |

