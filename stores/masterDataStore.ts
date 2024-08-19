import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {uid} from "quasar";
import {useUtils} from "src/core/services/Utils";
import AppsPersistence from "src/apps/persistence/AppsPersistence";
import {MasterData} from "src/apps/models/MasterData";

export const useMasterDataStore = defineStore('md', () => {

  const {sendMsg} = useUtils()

  /**
   * the (internal) storage for this store to use
   */
  let storage: AppsPersistence = null as unknown as AppsPersistence

  const masterData = ref<MasterData[]>([])
  const updated = ref<number>(new Date().getTime())

  /**
   * initialize store with
   *
   * @param ps a storage
   */
  async function initialize(ps: AppsPersistence) {
    console.log(` ...initializing masterData (${ps?.getServiceName()})`)
    storage = ps
    await storage.init()
    masterData.value = await storage.getMasterData()
    updated.value = new Date().getTime()
  }

  async function createMasterData(name: string) {
    const newMasterData = new MasterData(uid(), name)
    storage.saveMasterData(newMasterData)
    masterData.value = await storage.getMasterData()
    updated.value = new Date().getTime()
    console.log("new master data", newMasterData)
    return Promise.resolve(newMasterData)
  }

  async function save(e: MasterData) {
    console.log("saving", e)
    await storage.saveMasterData(JSON.parse(JSON.stringify(e)))
    // await storage.saveMasterData(e)
    masterData.value = await storage.getMasterData()
    console.log("md set to after save", masterData.value)
    updated.value = new Date().getTime()
  }

  async function deleteMasterData(mdId: string) {
    console.log("deleting master data", mdId)
    await storage.deleteMasterData(mdId)
    updated.value = new Date().getTime()
  }

  async function findById(id: string): Promise<MasterData | undefined> {
    console.log("findbyid", id, storage)
    if (storage) {
      return await storage.findMasterDataById(id)
    }
    return Promise.resolve(undefined)
  }

  return {
    initialize,
    createMasterData,
    save,
    findById,
    updated,
    masterData,
    deleteMasterData
  }
})


