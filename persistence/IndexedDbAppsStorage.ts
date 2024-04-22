import {IDBPDatabase, openDB, deleteDB} from "idb";
import _ from "lodash";
import AppsPersistence from "src/apps/persistence/AppsPersistence";
import {Api} from "src/apps/models/Api";
import {Entity} from "src/apps/models/Entity";

class IndexedDbAppsStorage implements AppsPersistence {

  private STORE_IDENT = 'apps';

  private db: IDBPDatabase = null as unknown as IDBPDatabase

  getServiceName(): string {
    return "IndexedDbSpacesStorage";
  }

  async init() {
    console.log(" ...initializing spaces (IndexedDbSpacesStorage)" )
    this.db = await this.initDatabase()
    return Promise.resolve()
  }

  private async initDatabase(): Promise<IDBPDatabase> {
    console.debug(" about to initialize indexedDB")
    const ctx = this
    return await openDB("spacesDB", 1, {
      // upgrading see https://stackoverflow.com/questions/50193906/create-index-on-already-existing-objectstore
      upgrade(db) {
        if (!db.objectStoreNames.contains(ctx.STORE_IDENT)) {
          console.log("creating db " + ctx.STORE_IDENT)
          db.createObjectStore(ctx.STORE_IDENT);
        }
      }
    });
  }



  compactDb(): Promise<any> {
    return Promise.resolve(undefined);
  }

  deleteApi(apiId: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  deleteEntity(entityId: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  findApiById(id: string): Promise<Api> {
    return Promise.reject(undefined);
  }

  findEntityById(id: string): Promise<Entity> {
    return Promise.reject(undefined);
  }

  getApis(): Promise<Api[]> {
    return Promise.resolve([]);
  }

  getEntities(): Promise<Entity[]> {
    return Promise.resolve([]);
  }

  saveApi(api: Api): void {
  }

  saveEntity(entity: Entity): void {
  }


}

export default new IndexedDbAppsStorage()
