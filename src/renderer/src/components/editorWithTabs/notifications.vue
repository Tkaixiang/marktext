<template>
  <div
    v-if="currentNotification"
    class="editor-notifications"
    :class="currentNotification.style"
    :style="{ 'max-width': showSideBar ? `calc(100vw - ${sideBarWidth}px` : '100vw' }"
  >
    <div class="msg">
      {{ currentNotification.msg }}
      <span v-if="currentNotification.showCountdown && countdown > 0" class="countdown">
        ({{ countdown }}s)
      </span>
    </div>
    <div class="controls">
      <div>
        <span
          v-if="currentNotification.showConfirm"
          class="inline-button"
          @click.stop="handleClick(true)"
        >
          {{ t('common.ok') }}
        </span>
        <span class="inline-button" @click.stop="handleClick(false)">
          <svg class="close-icon icon" aria-hidden="true">
            <use id="default-close-icon" xlink:href="#icon-close-small"></use>
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onUnmounted, ref } from 'vue'
import { useEditorStore } from '@/store/editor'
import { useLayoutStore } from '@/store/layout'
import { storeToRefs } from 'pinia'
import { t } from '../../i18n'

const editorStore = useEditorStore()
const layoutStore = useLayoutStore()

const { currentFile } = storeToRefs(editorStore)
const { showSideBar, sideBarWidth } = storeToRefs(layoutStore)

let autoHideTimer = null
let countdownInterval = null
const countdown = ref(0)

const currentNotification = computed(() => {
  const notifications = currentFile.value.notifications
  if (!notifications || notifications.length === 0) {
    return null
  }
  return notifications[0]
})

const handleClick = (status) => {
  const notifications = currentFile.value.notifications
  if (!notifications || notifications.length === 0) {
    console.error(t('editor.notifications.notificationNotFound'))
    return
  }

  if (autoHideTimer) {
    clearTimeout(autoHideTimer)
    autoHideTimer = null
  }

  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }

  countdown.value = 0

  const item = notifications.shift()
  const action = item.action
  if (action) {
    action(status)
  }
}

// Watch for notifications with autoHide enabled
watch(currentNotification, (newNotification, oldNotification) => {
  if (autoHideTimer) {
    clearTimeout(autoHideTimer)
    autoHideTimer = null
  }

  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }

  countdown.value = 0

  if (newNotification && newNotification.autoHide) {
    const duration = newNotification.autoHideDuration || 3000

    // Set up countdown if requested
    if (newNotification.showCountdown) {
      countdown.value = Math.ceil(duration / 1000)
      countdownInterval = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(countdownInterval)
          countdownInterval = null
        }
      }, 1000)
    }

    autoHideTimer = setTimeout(() => {
      handleClick(false)
      autoHideTimer = null
    }, duration)
  }
}, { deep: true })

onUnmounted(() => {
  if (autoHideTimer) {
    clearTimeout(autoHideTimer)
    autoHideTimer = null
  }
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
})
</script>

<style scoped>
.editor-notifications {
  position: relative;
  display: flex;
  flex-direction: row;
  max-height: 100px;
  margin-top: 4px;
  background: var(--notificationPrimaryBg);
  color: var(--notificationPrimaryColor);
  padding: 8px 10px;
  user-select: none;
  overflow: hidden;
  &.warn {
    background: var(--notificationWarningBg);
    color: var(--notificationWarningColor);
  }
  &.crit {
    background: var(--notificationErrorBg);
    color: var(--notificationErrorColor);
  }
  &.success {
    background: #4caf50;
    color: #ffffff;
  }
}
.msg {
  font-size: 13px;
  flex: 1;
  & .countdown {
    margin-left: 8px;
    opacity: 0.8;
    font-weight: 600;
  }
}
.controls {
  display: flex;
  flex-direction: column;
  justify-content: center;
  & > div {
    display: flex;
    flex-direction: row;
  }
  & .inline-button:not(:last-child) {
    margin-right: 3px;
  }
  & .inline-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  & .inline-button:hover {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.6);
  }
}
</style>
