import {Entity} from "src/apps/models/Entity";
import {Api} from "src/apps/models/Api";

interface AppsPersistence {

  getServiceName(): string

  init(): Promise<any>

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
