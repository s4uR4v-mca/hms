<script setup lang="ts">
import { PhX } from '@phosphor-icons/vue';

const props = defineProps<{ title: string }>();
const emits = defineEmits(['onClose']);
</script>

<template>
    <div class="flex items-center justify-between ">
        <h3 class="text-lg font-medium text-neutral-800">{{ props.title }}</h3>
        <PhX weight="bold" @click="emits('onClose')" data-test="btn-close"
            class="text-2xl cursor-pointer text-neutral-800  hover:bg-neutral-200 p-1" />
    </div>
</template>