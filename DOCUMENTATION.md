<a name="module_abis"></a>

## abis
A module that help you query ABI and target version for common runtimes


* [abis](#module_abis)
    * [.getAbi(version, runtime)](#module_abis.getAbi) ⇒ <code>Number</code>
    * [.getTarget(abi, runtime)](#module_abis.getTarget) ⇒ <code>String</code>
    * [.getRange(abi, runtime, includeIntermediates)](#module_abis.getRange) ⇒ <code>Array.&lt;String&gt;</code>
    * [.getAll()](#module_abis.getAll) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [.getRuntime(target, raw)](#module_abis.getRuntime) ⇒ <code>Array.&lt;(Object\|String)&gt;</code>

<a name="module_abis.getAbi"></a>

### abis.getAbi(version, runtime) ⇒ <code>Number</code>
**Kind**: static method of [<code>abis</code>](#module_abis)  
**Returns**: <code>Number</code> - - The ABI mathcing specified version  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>String</code> | The version you want to get the ABI |
| runtime | <code>String</code> | What runtime you want to get |

<a name="module_abis.getTarget"></a>

### abis.getTarget(abi, runtime) ⇒ <code>String</code>
**Kind**: static method of [<code>abis</code>](#module_abis)  
**Returns**: <code>String</code> - - The highest version matching specified ABI  

| Param | Type | Description |
| --- | --- | --- |
| abi | <code>Number</code> | The ABI you want the target version |
| runtime | <code>String</code> | What runtime you want to get |

<a name="module_abis.getRange"></a>

### abis.getRange(abi, runtime, includeIntermediates) ⇒ <code>Array.&lt;String&gt;</code>
**Kind**: static method of [<code>abis</code>](#module_abis)  
**Returns**: <code>Array.&lt;String&gt;</code> - - An array of version string that match an ABI  

| Param | Type | Description |
| --- | --- | --- |
| abi | <code>Number</code> | The ABI you want the target version |
| runtime | <code>String</code> | What runtime you want to get |
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

