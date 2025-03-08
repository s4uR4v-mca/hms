<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ buttonText: string, isDelete?: boolean }>();
const emits = defineEmits(['onConfirm'])

const buttonStyle = computed(() => {
    return props.isDelete ? 'text-orange-800 hover:text-orange-900 hover:bg-orange-100' : 'text-sky-700 hover:text-sky-900 hover:bg-sky-100 '
})
</script>

<template>
    <div class="flex justify-end">
        <button @click="emits('onConfirm')" class="  font-medium py-2 px-4 rounded cursor-pointer" :class="buttonStyle">
            {{ props.buttonText }}
        </button>
    </div>
</template>