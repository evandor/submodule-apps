<template>

  <q-toolbar>
    <div class="row fit">
      <q-toolbar-title>
        <div class="row justify-start items-baseline">
          <div class="col-12">Entity Management</div>
        </div>
      </q-toolbar-title>
    </div>
  </q-toolbar>


  <div class="q-ma-md">

    <template v-if="api?.setup">
      <fieldset style="border:1px dotted grey; border-radius:5px">
        <legend>{{ entity?.name }}: Add from API</legend>
        <div class="row q-my-md" v-for="p in inputParams">
          <div class="col-3 items-center">{{ p.name }}</div>
          <div class="col-9">
            <q-input v-model="p.default" :label="p.name"/>
          </div>
        </div>
      </fieldset>

      <div class="row q-my-md">
        <div class="col-3 items-center"></div>
        <div class="col-9">
          <q-btn label="Load" @click="loadFromApi()"/>
        </div>
      </div>
    </template>

    <fieldset style="border:1px dotted grey; border-radius:5px">
      <legend>{{ entity?.name }}: Add</legend>
      <div class="row q-my-md" v-for="f in fields">

        <template v-if="f.type === FieldType.TEXT">
          <div class="col-3 items-center">{{ f.label }}</div>
          <div class="col-9">
            <q-input v-model="item[f.name as keyof object]" :label="f.label"/>
          </div>
        </template>
        <template v-else-if="f.type === FieldType.NUMBER">
          <div class="col-3 items-center">{{ f.label }}</div>
          <div class="col-9">
            <q-input v-model="item[f.name as keyof object]" :label="f.label"/>
          </div>
        </template>
        <template v-else-if="f.type === FieldType.DATE">
          <div class="col-3 items-center">{{ f.label }}</div>
          <div class="col-9">
            <q-input type="date" v-model="f.value" :label="f.label"/>
          </div>
        </template>
        <template v-else-if="f.type === FieldType.REFERENCE">
          <div class="col-3 items-center">{{ f.label }}</div>
          <div class="col-9">
            <q-select v-model="f.value" :options="referencedItems.get(f.reference!)" emit-value map-options />
          </div>
        </template>
        <template v-else-if="f.type === FieldType.MASTERDATA">
          <div class="col-3 items-center">{{ f.label }}</div>
          <div class="col-9">
            <q-select v-model="f.value" :options="referencedMdItems.get(f.masterdataRef!)" emit-value map-options />
          </div>
        </template>
        <template v-else-if="f.type === FieldType.TEXTAREA">
          <div class="col-3 items-center">{{ f.label }}</div>
          <div class="col-9">
            <q-input type="textarea" v-model="f.value" :label="f.label"/>
          </div>
        </template>
        <template v-else>
          <div class="col-3 items-center">{{ f.label }}(?)</div>
          <div class="col-9">
            <q-input v-model="f.value" :label="f.label"/>
          </div>
        </template>
      </div>

    </fieldset>

    <div class="row q-my-md">
      <div class="col-3 items-center"></div>
      <div class="col-9">
        <q-btn label="Save" @click="save()"/>
      </div>
    </div>

    <div class="q-ma-md">
      <q-btn v-if="itemId" class="q-ml-md" size="xs" label="Delete" @click="deleteItem()"/>
    </div>

  </div>
</template>

<script lang="ts" setup>

import {onMounted, ref, watchEffect} from "vue";
import Analytics from "src/utils/google-analytics";
import {useRoute, useRouter} from "vue-router";
import _ from "lodash"
import {uid} from "quasar";
import {useUtils} from "src/core/services/Utils";
import {create, all} from 'mathjs'
import {useCommandExecutor} from "src/core/services/CommandExecutor";
// @ts-ignore
import {JSONPath} from '../../../node_modules/jsonpath-plus/dist/index-browser-esm.js';
import {ExecutionResult} from "src/core/domain/ExecutionResult";
import {ExecuteApiCommand} from "src/apps/commands/ExecuteApiCommand";
import {Api, ApiResponse, Endpoint, ParamDefinition} from "src/apps/models/Api";
import {Entity, Field, FieldType} from "src/apps/models/Entity";
import {useEntitiesStore} from "src/apps/stores/entitiesStore";
import {useApisStore} from "src/apps/stores/apisStore";
import {useMasterDataStore} from "src/apps/stores/masterDataStore";

const config = {}
const math = create(all, config)

const {sendMsg} = useUtils()

const route = useRoute()
const router = useRouter()

const api = ref<Api | undefined>(undefined)
const endpoint = ref<Endpoint | undefined>(undefined)
const entityId = ref<string | undefined>(undefined)
const itemId = ref<string | undefined>(undefined)
const item = ref<object>({})
const entity = ref<Entity | undefined>(undefined)
const referencedItems = ref<Map<string, object>>(new Map())
const referencedMdItems = ref<Map<string, object>>(new Map())
const fields = ref<Field[]>([])
const inputParams = ref<ParamDefinition[]>([])

onMounted(() => {
  Analytics.firePageViewEvent('MainPanelEntitiesPage', document.location.href);
})

watchEffect(() => {
  if (useEntitiesStore().updated) {
    const entities = useEntitiesStore().entities
    console.log("got entities", entities)
    for (const entity of entities) {
      const items = entity.items
      const valueMap = _.map(items, i => {
        console.log("chcking", i)
        return {
          value: i.id,
          label: i[entity.labelField as keyof object] || i.name || i.id
        }
      })
      console.log("setting referencesItems", entity.id, valueMap)
      referencedItems.value.set(entity.id, valueMap)
    }
    console.log("refrenceItems", referencedItems.value)
  }
})

watchEffect(() => {
  if (useMasterDataStore().updated) {
    const md = useMasterDataStore().masterData
    console.log("got md", md)
    for (const data of md) {
      const items = data.items
      const valueMap = _.map(items, i => {
        console.log("chcking", i)
        return {
          value: i.id,
          label: i[data.labelField as keyof object] || i.name || i.id
        }
      })
      console.log("setting referencesMdItems", data.id, valueMap)
      referencedMdItems.value.set(data.id, valueMap)
    }
    console.log("refrenceMdItems", referencedMdItems.value)
  }
})

entityId.value = route.params.entityId.toString() || undefined
itemId.value = route.params.itemId?.toString() || undefined

watchEffect(async () => {
  if (entityId.value && useEntitiesStore().updated) {
    entity.value = await useEntitiesStore().findById(entityId.value)

    const apiId = entity.value?.source?.split("|")[1]
    if (apiId) {
      api.value = await useApisStore().findById(apiId)
    }
    const endpointId = entity.value?.source?.split("|")[2]
    if (endpointId && api.value) {
      endpoint.value = _.find(api.value.endpoints, {id: endpointId}) as Endpoint || new Endpoint("", "", [])
    }

    if (entity.value) {
      item.value = itemId.value ? _.find(entity.value!.items, (i: object) => i['id' as keyof object] === itemId.value) : {}
      console.log("hier", item)
      console.log("entity", entity.value)

      fields.value = entity.value.fields
      // inputParams.value = entity.value.

    }

    if (api.value) {
      inputParams.value = api.value.setup?.params || []
    }

  }
})

const save = () => {
  if (entity.value) {
    const data: Record<string, any> = {}
    data.updated = new Date().getTime()
    if (itemId.value) {
      data.id = itemId.value
      //data.created =
      const removed = _.remove(entity.value.items as object[], {
        id: itemId.value
      });
      if (removed && removed[0]) {
        data.created = removed[0]['created']
      }
    } else {
      data.id = uid()
      data.created = new Date().getTime()
    }
    for (const f of entity.value.fields) {
      data[f.name] = item.value[f.name]
    }
    entity.value.items.push(data)
    sendMsg('entity-changed', entity.value)
    if (!itemId.value) {
      router.push(`/mainpanel/entities/${entity.value.id}/items/${data.id}`)
    }
  }
}

const deleteItem = () => {
  if (entity.value) {
    console.log("deleting item id", itemId.value)
    _.remove(entity.value.items, {
      id: itemId.value
    });
    //entity.value.items = removed
    console.log("got", entity.value)
    sendMsg('entity-changed', entity.value)
    window.close()
  }
}

const loadFromApi = async () => {
  console.log("loading from api", entity.value)
  if (entity.value?.source?.startsWith("api|")) {

    if (api.value && endpoint.value) {
      for (const p of inputParams.value) {
        console.log("setting params: ", p.name, p.default)
        endpoint.value.params.push(new ParamDefinition(uid(), p.name, p.default))
      }
      const res: ExecutionResult<ApiResponse> = await useCommandExecutor().executeFromUi(new ExecuteApiCommand(api.value, endpoint.value))
      console.log("res", res)
      let data = res.result.data
      if (entity.value.jsonPath) {
        data = JSONPath({path: entity.value.jsonPath, json: data});
      }
      console.log("data", typeof data, data)
      const fromResult = data[0]
      console.log("fromResult", fromResult)
      for (const [key, value] of Object.entries(fromResult)) {
        // console.log(`${key}: ${value}`);
        for (const f of fields.value) {
          if (f.name === key) {
            console.log("setting ", key, value)
            f.value = value
          }
        }
      }
    }
  }
}

</script>


