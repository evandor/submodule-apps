import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {uid} from "quasar";
import {useUtils} from "src/core/services/Utils";
import AppsPersistence from "src/apps/persistence/AppsPersistence";
import {Entity} from "src/apps/models/Entity";

export const useEntitiesStore = defineStore('entities', () => {

  const {sendMsg} = useUtils()

  /**
   * the (internal) storage for this store to use
   */
  let storage: AppsPersistence = null as unknown as AppsPersistence

  const entities = ref<Entity[]>([])
  const updated = ref<number>(new Date().getTime())

  /**
   * initialize store with
   *
   * @param ps a storage
   */
  async function initialize(ps: AppsPersistence) {
    console.log(` ...initializing entitiesStore (${ps?.getServiceName()})`)
    storage = ps
    await storage.init()
    entities.value = await storage.getEntities()
    updated.value = new Date().getTime()
  }

  async function createEntity(name: string) {
    const newEntity = new Entity(uid(), name)
    storage.saveEntity(newEntity)
    entities.value = await storage.getEntities()
    updated.value = new Date().getTime()
    console.log("new entity", newEntity)
    return Promise.resolve(newEntity)
  }

  async function save(e: Entity) {
    console.log("saving", e)
    await storage.saveEntity(JSON.parse(JSON.stringify(e)))
    // await storage.saveEntity(e)
    entities.value = await storage.getEntities()
    console.log("entities set to after save", entities.value)
    updated.value = new Date().getTime()
    //sendMsg('entity-changed', {})
  }

  async function deleteEntity(entityId: string) {
    console.log("deleting entity", entityId)
    await storage.deleteEntity(entityId)
    updated.value = new Date().getTime()
  }

  async function findById(id: string): Promise<Entity | undefined> {
    console.log("findbyid", id, storage)
    if (storage) {
      return await storage.findEntityById(id)
    }
    return Promise.resolve(undefined)
  }

  //const getEntities = computed(() => entities.value)

  return {
    initialize,
    createEntity,
    save,
    //getEntities,
    findById,
    updated,
    entities,
    deleteEntity
  }
})


