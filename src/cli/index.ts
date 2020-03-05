#!/usr/bin/env node

import {
  CommandLineAction,
  CommandLineChoiceParameter,
  CommandLineIntegerParameter,
  CommandLineParser, CommandLineStringParameter,
  ICommandLineChoiceDefinition,
  ICommandLineIntegerDefinition, ICommandLineStringDefinition
} from '@microsoft/ts-command-line'
import {getAbi, getRange, getRuntimesFromTarget, getTarget} from '../lib'
import {abi, runtime} from '../models'

const AbiParam: ICommandLineIntegerDefinition = {
  parameterLongName: '--abi',
  parameterShortName: '-a',
  description: 'The targeted ABI',
  required: true,
  argumentName: 'ABI'
}

const RuntimeParam: ICommandLineChoiceDefinition = {
  parameterLongName: '--runtime',
  parameterShortName: '-r',
  description: 'The targeted runtime',
  required: true,
  alternatives: Object.keys(runtime)
}

const TargetParam: ICommandLineStringDefinition = {
  parameterLongName: '--target',
  parameterShortName: '-t',
  description: 'The targeted version',
  argumentName: 'TARGET',
  required: true
}

class RangeMode extends CommandLineAction {
  private _abi!: CommandLineIntegerParameter
  private _runtime!: CommandLineChoiceParameter

  public constructor() {
    super({
      actionName: 'range',
      summary: 'Returns a range of versions matching an ABI and a runtime',
      documentation: 'Returns a range of versions matching an ABI and a runtime'
    })
  }

  protected async onExecute(): Promise<void> {
    if (this.abi && this.runtime) {
      const range = await getRange(this.abi, this.runtime)
      if (range) {
        if (range.length === 2) {
          console.log(`${range[0]} -> ${range[1]}`)
        } else if (range.length > 2) {
          console.log(range.join(', '))
        } else {
          throw new Error(`Invalid range for abi ${this.abi} and runtime ${this.runtime}`)
        }
        return Promise.resolve(undefined)
      } else {
        throw new Error(`No range found for abi ${this.abi} and runtime ${this.runtime}`)
      }
    } else {
      throw new Error('Unable to get range: abi or runtime not defined')
    }
  }

  get abi(): abi | null {
    return this._abi.value ?? null
  }

  get runtime(): runtime | null {
    return this._runtime.value as runtime ?? null
  }

  protected onDefineParameters(): void { // abstract
    this._abi = this.defineIntegerParameter(AbiParam)
    this._runtime = this.defineChoiceParameter(RuntimeParam)
  }
}

class AbiMode extends CommandLineAction {
  private _target!: CommandLineStringParameter
  private _runtime!: CommandLineChoiceParameter

  public constructor() {
    super({
      actionName: 'abi',
      summary: 'Returns an ABI matching a target and a runtime',
      documentation: 'Returns an ABI matching a target and a runtime'
    })
  }

  protected async onExecute(): Promise<void> {
    if (this.target && this.runtime) {
      const target = await getAbi(this.target, this.runtime)
      if (target) {
        console.log(target)
        return Promise.resolve(undefined)
      } else {
        throw new Error(`No abi found for target ${this.target} and runtime ${this.runtime}`)
      }
    } else {
      throw new Error('Unable to get abi: target or runtime not defined')
    }
  }

  get target(): string | null {
    return this._target.value ?? null
  }

  get runtime(): runtime | null {
    return this._runtime.value as runtime ?? null
  }

  protected onDefineParameters(): void {
    this._target = this.defineStringParameter(TargetParam)
    this._runtime = this.defineChoiceParameter(RuntimeParam)
  }
}

class TargetMode extends CommandLineAction {
  private _abi!: CommandLineIntegerParameter
  private _runtime!: CommandLineChoiceParameter

  public constructor() {
    super({
      actionName: 'target',
      summary: 'Returns the latest version matching an ABI and a runtime',
      documentation: 'Returns the latest version matching an ABI and a runtime'
    })
  }

  protected async onExecute(): Promise<void> {
    if (this.abi && this.runtime) {
      const target = await getTarget(this.abi, this.runtime)
      if (target) {
        console.log(target)
        return Promise.resolve(undefined)
      } else {
        throw new Error(`No target found for abi ${this.abi} and runtime ${this.runtime}`)
      }
    } else {
      throw new Error('Unable to get target: abi or runtime not defined')
    }
  }

  get abi(): abi | null {
    return this._abi.value ?? null
  }

  get runtime(): runtime | null {
    return this._runtime.value as runtime ?? null
  }

  protected onDefineParameters(): void {
    this._abi = this.defineIntegerParameter(AbiParam)
    this._runtime = this.defineChoiceParameter(RuntimeParam)
  }
}

class RuntimeMode extends CommandLineAction {
  private _target!: CommandLineStringParameter

  public constructor() {
    super({
      actionName: 'runtime',
      summary: 'Returns the runtimes matching a specific target',
      documentation: 'Returns the runtimes matching a specific target'
    })
  }

  protected async onExecute(): Promise<void> {
    if (this.target) {
      const runtime = await getRuntimesFromTarget(this.target)
      if (runtime) {
        console.log(runtime.join(', '))
        return Promise.resolve(undefined)
      } else {
        throw new Error(`No runtime found for target ${this.target}`)
      }
    } else {
      throw new Error('Unable to get runtime: target not defined')
    }
  }

  get target(): string | null {
    return this._target.value ?? null
  }

  protected onDefineParameters(): void { // abstract
    this._target = this.defineStringParameter(TargetParam)
  }
}

class ABICommandLine extends CommandLineParser {
  public constructor() {
    super({
      toolFilename: 'abi',
      toolDescription: 'The ABI command line interface.'
    })

    this.addAction(new RangeMode())
    this.addAction(new AbiMode())
    this.addAction(new TargetMode())
    this.addAction(new RuntimeMode())
  }

  protected onDefineParameters(): void {
  }

  protected onExecute(): Promise<void> {
    return super.onExecute()
  }
}

const commandLine: ABICommandLine = new ABICommandLine()
commandLine.execute()
