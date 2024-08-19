import {Entity} from "src/apps/models/Entity";
import {Api} from "src/apps/models/Api";
import {MasterData} from "src/apps/models/MasterData";

interface AppsPersistence {

  getServiceName(): string

  init(): Promise<any>

  saveMasterData(md: MasterData): void
  getMasterData(): Promise<MasterData[]>
  findMasterDataById(id: string): Promise<MasterData>
  deleteMasterData(mdId: string): Promise<void>;

  saveEntity(entity: Entity): void
  getEntities(): Promise<Entity[]>
  findEntityById(id: string): Promise<Entity>
  deleteEntity(entityId: string): Promise<void>;

  saveApi(api: Api): void
  getApis(): Promise<Api[]>
  findApiById(id: string): Promise<Api>
  deleteApi(apiId: string): Promise<void>;

  compactDb(): Promise<any>

}

export default AppsPersistence
