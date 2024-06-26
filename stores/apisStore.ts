import {defineStore} from "pinia";
import {computed, ref} from "vue";
import PersistenceService from "src/services/PersistenceService";
import {uid} from "quasar";
import {useUtils} from "src/core/services/Utils";
import {Api} from "src/apps/models/Api";
import AppsPersistence from "src/apps/persistence/AppsPersistence";

export const useApisStore = defineStore('apis', () => {

  /**
   * the (internal) storage for this store to use
   */
  let storage: AppsPersistence = null as unknown as AppsPersistence

  const apis = ref<Api[]>([])
  const updated = ref<number>(new Date().getTime())

  /**
   * initialize store with
   *
   * @param ps a storage
   */
  async function initialize(ps: AppsPersistence) {
    console.log(` ...initializing apisStore (${ps?.getServiceName()})`)
    storage = ps
    apis.value = await storage.getApis()
    updated.value = new Date().getTime()
  }

  async function createApi(name: string) {
    storage.saveApi(new Api(uid(), name))
    apis.value = await storage.getApis()
    updated.value = new Date().getTime()
  }

  async function save(e: Api) {
    console.log("saving", e)
    await storage.saveApi(JSON.parse(JSON.stringify(e)))
    // await storage.saveApi(e)
    apis.value = await storage.getApis()
    console.log("apis set to after save", apis.value)
    updated.value = new Date().getTime()
    //sendMsg('Api-changed', {})
  }

  async function deleteApi(apiId: string) {
    console.log("deleting api", apiId)
    await storage.deleteEntity(apiId)
    updated.value = new Date().getTime()
  }

  async function findById(id: string):Promise<Api | undefined> {
    console.log("findbyid", id, storage)
    if (storage) {
      return await storage.findApiById(id)
    }
    return Promise.resolve(undefined)
  }

  return {
    initialize,
    createApi,
    save,
    findById,
    updated,
    apis: apis,
    deleteApi
  }
})


