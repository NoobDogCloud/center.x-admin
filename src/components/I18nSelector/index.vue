<template>
    <el-dropdown v-if="settingsStore.topbar.enableI18n" class="language-container" size="default" @command="languageCommand">
        <slot />
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item v-for="(item, index) in locales" :key="index" :disabled="settingsStore.app.defaultLang === item.name" :command="item.name">{{ item.labelName }}</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup>
import { getElementLocales } from '@/locales'

import { useSettingsStore } from '@/store/modules/settings'
const settingsStore = useSettingsStore()

import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const locales = computed(() => getElementLocales())

function languageCommand(command) {
    locale.value = command
    settingsStore.setDefaultLang(command)
}
</script>

<style lang="scss" scoped>
// scss
</style>
