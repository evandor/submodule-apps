import {IDBPDatabase, openDB, deleteDB} from "idb";
import _ from "lodash";
import AppsPersistence from "src/apps/persistence/AppsPersistence";
import {Api} from "src/apps/models/Api";
import {Entity} from "src/apps/models/Entity";

class IndexedDbAppsStorage implements AppsPersistence {

  private STORE_IDENT = 'apps';

  private db: IDBPDatabase = null as unknown as IDBPDatabase

  getServiceName(): string {
    return this.constructor.name
  }

  async init() {
    console.log(" ...initializing apps (IndexedDbAppsStorage)" )
    this.db = await this.initDatabase()
    return Promise.resolve()
  }

  private async initDatabase(): Promise<IDBPDatabase> {
    console.debug(" about to initialize indexedDB")
    const ctx = this
    return await openDB("appsDB", 1, {
      // upgrading see https://stackoverflow.com/questions/50193906/create-index-on-already-existing-objectstore
      upgrade(db) {
        if (!db.objectStoreNames.contains('entities')) {
          console.log("creating db entities")
          db.createObjectStore('entities');
        }
        if (!db.objectStoreNames.contains('apis')) {
          console.log("creating db apis")
          db.createObjectStore('apis');
        }
      }
    });
  }



  compactDb(): Promise<any> {
    return Promise.resolve(undefined);
  }

  deleteApi(apiId: string): Promise<void> {
    return this.db.delete('apis', apiId)
  }

  deleteEntity(entityId: string): Promise<void> {
    return this.db.delete('entities', entityId)
  }

  async findApiById(id: string): Promise<Api> {
    return await this.db.get('apis', id)
  }

  async findEntityById(id: string): Promise<Entity> {
    return await this.db.get('entities', id)
  }

  async getApis(): Promise<Api[]> {
    return await this.db.getAll('apis')
  }

  async getEntities(): Promise<Entity[]> {
    return await this.db.getAll('entities')
  }

  saveApi(api: Api): void {
    this.db.put('apis', api, api.id)
  }

  saveEntity(entity: Entity): void {
    this.db.put('entities', entity, entity.id)
  }


}

export default new IndexedDbAppsStorage()
