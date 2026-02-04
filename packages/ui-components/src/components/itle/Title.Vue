<template>
  <component :is="tag" :class="['base-styles', customStyles]">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  customStyles?: string;
}

const props = withDefaults(defineProps<Props>(), {
  tag: "h1",
  customStyles: "",
});
</script>
