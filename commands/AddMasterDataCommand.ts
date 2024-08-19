import Command from "src/core/domain/Command";
import {ExecutionResult} from "src/core/domain/ExecutionResult";
import {useEntitiesStore} from "src/apps/stores/entitiesStore";
import {useMasterDataStore} from "src/apps/stores/masterDataStore";

export class AddMasterDataCommand implements Command<string> {

  public merge: boolean = true

  constructor(
    public name: string) {
  }

  async execute(): Promise<ExecutionResult<string>> {
    try {
      const res =  await useMasterDataStore().createMasterData(this.name)
      return new ExecutionResult<string>("","done")
    } catch (err) {
      return Promise.reject(err)
    }
  }


}

AddMasterDataCommand.prototype.toString = function cmdToString() {
  return `AddMasterDataCommand: {name=${this.name}}`;
};
