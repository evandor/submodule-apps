<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">

      <q-card class="q-dialog-plugin" style="max-width:100%">
        <q-card-section>
          <div class="text-h6">Add Master Data</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-body">Name:</div>
          <q-input v-model="newEntityName"
                   class="q-mb-md q-pb-none"
                   dense autofocus
                   data-testid="newEntityName">
            <template v-slot:hint>

            </template>
          </q-input>


        </q-card-section>



        <q-card-actions align="right">
          <DialogButton label="Cancel" color="primary" v-close-popup/>
          <DialogButton label="Add"
                        type="submit"
                        @click="createNewEntity()"
                        v-close-popup/>
        </q-card-actions>

      </q-card>


    </q-dialog>
</template>

<script lang="ts" setup>

import {useDialogPluginComponent} from "quasar";
import DialogButton from "src/core/dialog/buttons/DialogButton.vue";
import {ref} from "vue";
import {useCommandExecutor} from "src/core/services/CommandExecutor";
import {AddMasterDataCommand} from "src/apps/commands/AddMasterDataCommand";

defineEmits([
  ...useDialogPluginComponent.emits
])

const props = defineProps({
  name: {type: String, default: ""}
})

const {dialogRef, onDialogHide} = useDialogPluginComponent()

const newEntityName = ref(props.name)

const createNewEntity = () => {
  console.log("new entity", newEntityName.value)
  useCommandExecutor().executeFromUi(new AddMasterDataCommand(newEntityName.value))
}
</script>
