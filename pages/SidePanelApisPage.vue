<template>

  <q-page padding style="padding-top: 45px">

    <div class="q-ma-none">
      <div class="q-ma-none">
        <div class="row q-ma-none q-pa-none cursor-pointer" v-for="e in apis">
          <div class="col-6 q-ma-none q-pa-none q-pt-lg">
            <b>{{ e.name }}</b>
          </div>
          <div class="col-6 q-ma-none q-pa-none q-pt-lg text-right">
<!--          [<span @click="openEndpointInMainPanel(e.id ,'')">Add Endpoint</span>]-->
            <q-icon name="hub" color="primary" @click="openEndpointInMainPanel(e.id,'')">
              <q-tooltip>Add Endpoint</q-tooltip>
            </q-icon>
            <q-icon name="o_settings" class="q-ml-md" color="primary" @click="openApiInMainPanel(e.id)">
              <q-tooltip>Manage</q-tooltip>
            </q-icon>
          </div>
          <div class="col-12">
            <ul>
              <li v-for="i in e.endpoints"
                  @click="openEndpointInMainPanel(e.id,i.id)">{{ i.path }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- place QPageSticky at end of page -->
    <q-page-sticky expand position="top" class="darkInDarkMode brightInBrightMode">
      <FirstToolbarHelper title="APIs Manager">

        <template v-slot:iconsRight>

          <q-btn outline
                 label="New API"
                 color="primary"
                 size="sm"
                 @click="openNewApiDialog()"
                 class="q-ma-none q-px-sm q-py-none"
                 name="o_apps"/>

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
import {Api} from "src/apps/models/Api";
import {useApisStore} from "src/apps/stores/apisStore";
import NewApiDialog from "src/apps/dialogues/NewApiDialog.vue";
import {Entity} from "src/apps/models/Entity";
import {SidePanelViews} from "src/models/SidePanelViews";

onMounted(() => {
  Analytics.firePageViewEvent('SidePanelApisManager', document.location.href);
})

const $q = useQuasar()

const apis = ref<Api[]>([])

watch(() => {
}, (oldValue: any, newValue: any) => {
  console.log("old->new", oldValue, newValue)
})

watchEffect(() => {
  if (useApisStore().updated) {
    apis.value = useApisStore().apis
  }
})

chrome.runtime.onMessage.addListener((m: any, s: any, response: any) => {
  if (m.name === 'api-changed') {
    return useApisStore().save(m.data)
      .then(() => {
        apis.value = useApisStore().apis
        console.log("onMessage: hier", m, apis.value)
        return true
      })
  }
  return true
})

const openApiInMainPanel = (path: string) =>
  NavigationService.openOrCreateTab([chrome.runtime.getURL("/www/index.html#/mainpanel/apis/" + path)], undefined, [], true, true)

const openEndpointInMainPanel = (apiId: string, endpointId: string) =>
  NavigationService.openOrCreateTab([chrome.runtime.getURL("/www/index.html#/mainpanel/apis/" + apiId + "/endpoints/" + endpointId)], undefined, [], true, true)

const openNewApiDialog = () => {
  $q.dialog({
    component: NewApiDialog,
    componentProps: {}
  })
}

const getLineFor = (item: object, e: Entity) => {
  console.log("item, e", item, e)
  if (e.labelField) {
    return item[e.labelField as keyof object]
  }
  return e.name ? item[e.name as keyof object] : item[e.id as keyof object]
}

</script>
