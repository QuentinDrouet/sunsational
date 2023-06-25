<template>
  <div class="flex items-center justify-between bg-primary rounded-xl px-5 py-4">
    <div class="flex items-center gap-2 justify-start">
      <div class="relative bg-secondary rounded-lg w-10 h-10 flex items-center justify-center">
        <i :class="iconClass" class="text-lg text-purple-400"></i>
      </div>
      <p>{{ label }}</p>
    </div>
    <p>{{ value }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    iconClass: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    }
  }
});
</script>
