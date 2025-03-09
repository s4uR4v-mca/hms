<script setup lang="ts">
import { PhFileX } from '@phosphor-icons/vue';
const { header = 'No Data Found', msg = "Oops.. No data found for the current selection" } = defineProps<{ header?: string, msg?: string }>()

</script>

<template>
    <div class="flex w-full h-48 bg-neutral-100 place-items-center justify-center">
        <div class="flex-col text-neutral-400 place-items-center ">
            <PhFileX size="2.5rem" />
            <p class="text-neutral-400 font-semibold" data-test="header">{{ header }}</p>
            <span class="text-neutral-400 font-medium text-sm" data-test="message">{{ msg }}</span>
        </div>
    </div>
</template>