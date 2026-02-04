<script setup lang="ts"></script>

<template>
  <div class="auth-layout">
    <div class="auth-container">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@store-system/ui-theme";
.auth-layout {
  @include ui-theme.flex-center;
}
</style>
