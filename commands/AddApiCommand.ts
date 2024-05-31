import Command from "src/core/domain/Command";
import {ExecutionResult} from "src/core/domain/ExecutionResult";
import {useApisStore} from "src/apps/stores/apisStore";

export class AddApiCommand implements Command<string> {

  constructor(
    public name: string) {
  }

  async execute(): Promise<ExecutionResult<string>> {
    try {
      const res =  await useApisStore().createApi(this.name)
      return new ExecutionResult<string>("","done")
    } catch (err) {
      return Promise.reject(err)
    }
  }


}

AddApiCommand.prototype.toString = function cmdToString() {
  return `AddApiCommand: {name=${this.name}}`;
};
