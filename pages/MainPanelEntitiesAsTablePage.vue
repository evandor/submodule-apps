<template>
  <div class="q-pa-md">
    <q-markup-table>
      <thead>
      <tr>
        <template v-for="field in entity?.fields.filter(f => f.name !== 'id' && f.name !== 'created' && f.name !== 'updated')">
          <th class="text-left">{{field.label}}</th>
        </template>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in entity?.items">
        <template v-for="field in Object.keys(item).filter(f => f !== 'id' && f !== 'created' && f !== 'updated')">
          <td class="text-left">{{ item[field as keyof object] }}</td>
        </template>
      </tr>
      </tbody>
    </q-markup-table>

  </div>
</template>
<script lang="ts" setup>

import {useRoute} from "vue-router";
import {ref, watchEffect} from "vue";
import {useEntitiesStore} from "src/apps/stores/entitiesStore";
import {Entity} from "src/apps/models/Entity";

const route = useRoute()

const entityId = ref<string | undefined>(undefined)
const entity = ref<Entity | undefined>(undefined)

//entityId.value = route.params.entityId.toString() || undefined
watchEffect(async () => {
  entityId.value = route.params.entityId.toString() || ''
  console.log("entityId", entityId.value)
  if (entityId.value && useEntitiesStore().updated) {
    entity.value = await useEntitiesStore().findById(entityId.value)
  }
})
</script>
