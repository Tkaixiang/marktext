<template>
  <div class="pref-experimental">
    <h4>{{ t('preferences.experimental.title') }}</h4>
    <compound>
      <template #head>
        <h6 class="title">{{ t('preferences.experimental.fileHandling.title') }}</h6>
      </template>
      <template #children>
        <bool
          :description="t('preferences.experimental.fileHandling.autoReloadUnmodified')"
          :bool="autoReloadUnmodifiedFiles"
          :on-change="(value) => onSelectChange('autoReloadUnmodifiedFiles', value)"
        ></bool>
      </template>
    </compound>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { usePreferencesStore } from '@/store/preferences'
import Compound from '../common/compound/index.vue'
import Bool from '../common/bool/index.vue'

const { t } = useI18n()
const preferenceStore = usePreferencesStore()

const { autoReloadUnmodifiedFiles } = storeToRefs(preferenceStore)

const onSelectChange = (type, value) => {
  preferenceStore.SET_SINGLE_PREFERENCE({ type, value })
}
</script>

<style scoped>
.pref-experimental {
  /* Styles can be added here if needed */
}
</style>
