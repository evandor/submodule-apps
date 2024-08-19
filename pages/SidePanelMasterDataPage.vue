<template>

  <q-page padding style="padding-top: 45px">

    <div class="q-ma-none">
      <div class="q-ma-none">
        <div class="row q-ma-none q-pa-none cursor-pointer" v-for="e in masterData">
          <div class="col-12 q-ma-none q-pa-none q-pt-lg">
            {{ e.name }}
            <span v-if="e.fields.length > 0">
              [<span @click="openEntityInMainPanel(e.id + '/items')">Add</span>]
            </span>
            [<span @click="openEntityInMainPanel(e.id)">Manage</span>]
<!--            [<span @click="openEntityTableInMainPanel(e.id)">Table</span>]-->
          </div>
          <div class="col-12">
            <ul v-if="e.items.length < 10">
              <li v-for="i in e.items"
                  @click="openItemInMainPanel(e.id,i.id)">{{ getLineFor(i, e) }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- place QPageSticky at end of page -->
    <q-page-sticky expand position="top" class="darkInDarkMode brightInBrightMode">
      <FirstToolbarHelper title="Master Data Manager">

        <template v-slot:iconsRight>

          <q-btn outline
                 label="New Master Data"
                 color="primary"
                 size="sm"
                 @click="openNewEntityDialog()"
                 class="q-ma-none q-px-sm q-py-none"
                 name="o_apps"/>

          <!--          <q-btn outline-->
          <!--                 label="New Formula"-->
          <!--                 color="primary"-->
          <!--                 size="sm"-->
          <!--                 @click="openNewFormulaDialog()"-->
          <!--                 class="q-ma-none q-px-sm q-py-none"-->
          <!--                 name="o_apps"/>-->

          <SidePanelToolbarButton
            icon="close"
            tooltip="Close this view"
            @click="useUiStore().sidePanelSetActiveView(SidePanelViews.MAIN)"
            color="black"/>
        </template>

      </FirstToolbarHelper>
    </q-page-sticky>

  </q-page>

</template>

<script lang="ts" setup>

import FirstToolbarHelper from "pages/sidepanel/helper/FirstToolbarHelper.vue";
import {useUiStore} from "src/ui/stores/uiStore";
import {onMounted, ref, watch, watchEffect} from "vue";
import Analytics from "src/utils/google-analytics";
import SidePanelToolbarButton from "components/buttons/SidePanelToolbarButton.vue";
import {openURL, useQuasar} from "quasar";
import NavigationService from "src/services/NavigationService";
import NewFormulaDialog from "src/apps/dialogues/NewFormulaDialog.vue";
import {SidePanelViews} from "src/models/SidePanelViews";
import {MasterData} from "src/apps/models/MasterData";
import {useMasterDataStore} from "src/apps/stores/masterDataStore";
import NewMasterDataDialog from "src/apps/dialogues/NewMasterDataDialog.vue";

onMounted(() => {
  Analytics.firePageViewEvent('SidePanelMasterDataManager', document.location.href);
})

const $q = useQuasar()

const masterData = ref<MasterData[]>([])

watch(() => {
}, (oldValue: any, newValue: any) => {
  console.log("old->new", oldValue, newValue)
})

watchEffect(() => {
  if (useMasterDataStore().updated) {
    masterData.value = useMasterDataStore().masterData
    console.log("***got masterData", masterData.value)
  }
})

chrome.runtime.onMessage.addListener((m: any, s: any, response: any) => {
  if (m.name === 'masterdata-changed') {
    useMasterDataStore().save(m.data)
      .then(() => {
        masterData.value = useMasterDataStore().masterData
        console.log("onMessage: hier", m, masterData.value)
        return true
      })
  } else if (m.name === 'reload-masterdata') {
    masterData.value = useMasterDataStore().masterData
    console.log("reloaded masterData", masterData.value)
    return true
  }
  return true
})

const openEntityInMainPanel = (path: string) =>
  NavigationService.openOrCreateTab([chrome.runtime.getURL("/www/index.html#/mainpanel/md/" + path)], undefined, [], true, true)

const openEntityTableInMainPanel = (path: string) =>
  NavigationService.openOrCreateTab([chrome.runtime.getURL("/www/index.html#/mainpanel/md/" + path + "/views/table")], undefined, [], true, true)

const openItemInMainPanel = (entityId: string, itemId: string) =>
  NavigationService.openOrCreateTab([chrome.runtime.getURL("/www/index.html#/mainpanel/md/" + entityId + "/items/" + itemId)], undefined, [], true, true)

const openNewEntityDialog = () => {
  $q.dialog({
    component: NewMasterDataDialog,
    componentProps: {}
  })
}

const getLineFor = (item: object, e: MasterData) => {
  //console.log("item, e", item, e)
  if (e.labelField) {
    // const field = _.find(e.fields, f => f.name === e.labelField)
    // if (field) {
    //   switch (field.type) {
    //     case 'substitute':
    //
    //     default:
    //   }
    // }
    return item[e.labelField as keyof object]
  }
  return e.name ? item[e.name as keyof object] : item[e.id as keyof object]
}

const openNewFormulaDialog = () => {
  $q.dialog({
    component: NewFormulaDialog,
    componentProps: {}
  })
}
</script>
