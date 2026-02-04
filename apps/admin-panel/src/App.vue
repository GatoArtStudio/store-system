<script setup lang="ts">
import { useAuthStore } from "./stores/auth";

const authStore = useAuthStore();
</script>

<template>
  <router-view />
</template>

<style lang="scss">
@use "@store-system/ui-theme";
</style>
