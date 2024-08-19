<template>

  <q-toolbar>
    <div class="row fit">
      <q-toolbar-title>
        <div class="row justify-start items-baseline">
          <div class="col-10">MasterData Management</div>
          <div class="col-2 text-right">
            <q-btn label="delete masterData" @click="deleteMasterData()"/>
          </div>
        </div>
      </q-toolbar-title>
    </div>
  </q-toolbar>

  <div class="q-ma-md">

    <fieldset style="border:1px dotted grey; border-radius:5px;background-color:#efefef">
      <legend style="background-color:#efefef">{{ masterData?.name }}: Definition</legend>
      <div class="row items-center">

        <div class="col-2 q-pa-md">
          Description
        </div>
        <div class="col-5">
          <q-input v-model="description" label="Description"/>
        </div>
        <div class="col-5 q-pa-md text-grey">
          Provide a description for this masterData
        </div>

        <div class="col-2 q-pa-md">
          Source
        </div>
        <div class="col-5">
          <q-select v-model="source" :options="sourceOptions"/>
        </div>
        <div class="col-5 q-pa-md text-grey">
          The source for this masterData could be an API
        </div>

        <div class="col-2 q-pa-md">
          JsonPath
        </div>
        <div class="col-5">
          <q-input v-model="jsonPath" label="jsonPath"/>
        </div>
        <div class="col-5 q-pa-md text-grey">
          Select part of the result to be assigned to an masterData
        </div>

        <div class="col-2 q-pa-md">
          App(s)
        </div>
        <div class="col-5">
          <q-select
            label=""
            filled
            v-model="apps"
            use-input
            use-chips
            multiple
            hide-dropdown-icon
            input-debounce="0"
            new-value-mode="add-unique"/>
        </div>
        <div class="col-5 q-pa-md text-grey">
          Entities can be part of apps
        </div>

      </div>
      <br>
    </fieldset>

    <div class="col-3 q-my-sm"></div>
    <div class="col-9 q-my-sm">
      <q-btn label="Update / Submit" @click="saveEntity()"/>
    </div>

    <br><br>

    <fieldset style="border:1px dotted grey; border-radius:5px">
      <legend>{{ masterData?.name }}: Defined Fields</legend>

      <q-list class="q-my-md" bordered separator>
        <q-item clickable v-ripple v-for="(f,idx) in masterData?.fields" :key="idx">
          <q-item-section>
            <q-item-label>{{ f.label }}</q-item-label>
            <q-item-label caption>{{ f.id }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ f.type }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <span class="q-mr-md text-right">
<!--                <q-checkbox v-model="showInList[idx]" @update:modelValue="(val) => updateShowInList(idx)"/>-->
                <q-radio v-model="labelField" :val="f.name" label=""/>
              </span>
              <span class="q-mr-md text-right">
                <q-icon name="edit" color="primary" @click="editField(f)"/>
              </span>
              <span class="q-mr-md text-right">
                <q-icon name="delete" color="negative" @click="deleteField(f)"/>
              </span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </fieldset>

    <br><br>


    <form @submit.prevent.stop="addField">
      <fieldset style="border:1px dotted grey; border-radius:5px">

        <legend>{{ masterData?.name }}: Add Field</legend>

        <div class="row q-my-md">

          <div class="col-2 q-pa-md">Type</div>
          <div class="col-5">
            <q-select v-model="typeModel" :options="[
                          {value: FieldType.TEXT,label: 'Text'},
                          {value: FieldType.TEXTAREA,label: 'Textarea'},
                          {value: FieldType.EDITOR,label: 'Editor'},
                          {value: FieldType.NUMBER,label: 'Number'},
                          {value: FieldType.URL,label: 'URL'},
                          {value: FieldType.DATE,label: 'Date'},
                          {value: FieldType.REFERENCE,label: 'Reference'},
                          {value: FieldType.FORMULA,label: 'Formula'},
                          {value: FieldType.SUBSTITUTION,label: 'Text Substitution'}
                        ]" emit-value map-options label="Type"/>
          </div>
          <div class="col-5 q-pa-md text-grey">
            Choose a type for this field
          </div>

          <template v-if="typeModel === FieldType.REFERENCE">
            <div class="col-2 q-pa-md">Referenced MasterData</div>
            <div class="col-5 q-my-sm">
              <q-select v-model="reference" :options="entitiesAsReference" emit-value map-options label="Reference"/>
            </div>
            <div class="col-5 q-pa-md text-grey">
              Provide a name for this field
            </div>
          </template>

          <div class="col-2 q-pa-md">Name (*)</div>
          <div class="col-5">
            <q-input v-model="name" label="Name" :rules="[
              val => !!val || 'Name is required',
              val => /^[a-zA-Z]+[a-zA-Z0-9]*$/.test(val) || 'please use a valid variable name',
              val => val !== 'id' && val !== 'created' && val !== 'updated' || 'id, created and updated are reserved fields and will be added automatically'
            ]"/>
          </div>
          <div class="col-5 q-pa-md text-grey">
            Provide a single word name for this field
          </div>

          <div class="col-2 q-pa-md">Label</div>
          <div class="col-5">
            <q-input v-model="label" label="Label"/>
          </div>
          <div class="col-5 q-pa-md text-grey">
            Provide a name for this field
          </div>

          <div class="col-2 q-pa-md">Info</div>
          <div class="col-5">
            <q-input v-model="info" label="Info"/>
          </div>
          <div class="col-5 q-pa-md text-grey">
            Provide a name for this field
          </div>
        </div>
      </fieldset>

      <div class="row q-my-md">
        <div class="col-3 items-center"></div>
        <div class="col-9">
          <q-btn :label="submitButtonLabel" type="submit"/>
        </div>
      </div>
    </form>

    <!--        <SelectElement name="type" :native="false" label="Type" :can-deselect="false" :can-clear="false"-->
    <!--                       :default="'text'"-->
    <!--                       :items="[-->
    <!--                          {value: 'substitute',label: 'Text Substitution'}-->
    <!--                        ]"/>-->
    <!--        <SelectElement name="reference" :native="false" label="Referenced MasterData"-->
    <!--                       :conditions="[['type','in',['reference']]]"-->
    <!--                       :items="entitiesAsReference"/>-->
    <!--        <TextElement name="formula" label="Formula" placeholder="e.g. {a} * {b}"-->
    <!--                     :conditions="[['type','in',['formula']]]"/>-->
    <!--        <TextElement name="substitution" label="Text Substitution" placeholder="{a} ({b})"-->
    <!--                     :conditions="[['type','in',['substitute']]]"/>-->
    <!--        <TextElement name="name" label="Name" placeholder="the internal name" :rules="['required']"/>-->
    <!--        <TextElement name="label" label="Label" placeholder="The label shown in the UI" :rules="['required']"/>-->

  </div>
</template>

<script lang="ts" setup>

import {onMounted, ref, watch, watchEffect} from "vue";
import Analytics from "src/utils/google-analytics";
import {useRoute} from "vue-router";
import _ from "lodash"
import {uid} from "quasar";
import {useUtils} from "src/core/services/Utils";
import {MasterData} from "src/apps/models/MasterData";
import {useApisStore} from "src/apps/stores/apisStore";
import {Field, FieldType} from "src/apps/models/Entity";
import {useMasterDataStore} from "src/apps/stores/masterDataStore";

const {sendMsg} = useUtils()
const route = useRoute()

const apps = ref<string[]>([])
const mdId = ref<string | undefined>(undefined)
const masterData = ref<MasterData | undefined>(undefined)
const entitiesAsReference = ref<object[]>([])
const labelField = ref<string | undefined>(undefined)
const submitButtonLabel = ref('Add')
const description = ref('')
const name = ref('')
const label = ref('')
const info = ref('')
const jsonPath = ref<string | undefined>('$')
const source = ref<string>('manual')
const reference = ref<any>()

const sourceOptions = ref<object[]>([])

const typeModel = ref<FieldType>(FieldType.TEXT)

onMounted(() => {
  Analytics.firePageViewEvent('MainPanelEntitiesPage', document.location.href);
})

watch(() => labelField.value, async (currentValue, oldValue) => {
  console.log("changed labelField", currentValue, oldValue)
  if (masterData.value) {
    masterData.value.labelField = currentValue
    await useMasterDataStore().save(masterData.value)
  }
})

watchEffect(() => {
  sourceOptions.value = [{label: 'Manual', value: 'manual'}]
  const apis = useApisStore().apis
  for (const a of apis) {
    for (const e of a.endpoints) {
      sourceOptions.value.push({
        label: a.name + " -> " + e.path,
        value: e.id
      })
    }
  }

})

watchEffect(async () => {
  mdId.value = route.params.mdId.toString() || ''
  if (mdId.value && useMasterDataStore().updated) {
    masterData.value = await useMasterDataStore().findById(mdId.value)
    labelField.value = masterData.value?.labelField
    description.value = masterData.value?.description || ''
    jsonPath.value = masterData.value?.jsonPath || ''
    apps.value = masterData.value?.apps || []
    source.value = masterData.value?.source || 'manual'
  }
})

watchEffect(() => {
  entitiesAsReference.value = _.map(useMasterDataStore().masterData, (e: MasterData) => {
    return {
      value: e.id,
      label: e.name
    }
  })
})

watchEffect(() => {
  console.log ("==>", name.value, label.value)
  if (name.value && (label.value === '' || name.value.toLowerCase().startsWith(label.value.toLowerCase()))) {
    label.value = name.value.substring(0,1).toUpperCase() + name.value.substring(1)
  }
})

const addField = () => {
  console.log("adding field", masterData.value)
  console.log("adding ref",reference.value)
  if (masterData.value) {
    const newField = new Field(uid(), name.value, typeModel.value, label.value, "", info.value, reference.value)
    console.log("adding", newField)
    masterData.value.fields.push(newField)
    sendMsg('masterdata-changed', masterData.value)
  }
}

const deleteField = async (f: Field) => {
  console.log("deleting", f)
  if (masterData.value) {
    masterData.value.fields = _.filter(masterData.value.fields, (field: Field) => field.id !== f.id)
    await useMasterDataStore().save(masterData.value)
  }
}

const saveEntity = async () => {
  if (masterData.value) {
    console.log("apps.value", apps.value)
    masterData.value.description = description.value
    masterData.value.source = "api|" + source.value['value' as keyof object]
    masterData.value.jsonPath = jsonPath.value
    masterData.value.apps = apps.value
    console.log("saving", masterData.value, source.value)
    await useMasterDataStore().save(masterData.value)
  }
}

const deleteMasterData = () => {
  if (masterData.value) {
    useMasterDataStore().deleteMasterData(masterData.value.id)
    sendMsg('reload-masterdata')
    window.close()
  }
}

</script>

<style>

legend {
  border: 1px solid grey;
  border-radius: 3px;
  padding: 2px 5px 2px 5px;
}

</style>
