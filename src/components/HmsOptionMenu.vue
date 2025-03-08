<script setup lang="ts">
import { PhPencil, PhPlus, PhTrash } from '@phosphor-icons/vue';


const emits = defineEmits(['onEditGroup', 'onCreateChildGroup', 'onAddRemoveChildren', 'onRemoveGroup'])
</script>

<template>
    <div class="absolute bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
        <ul>
            <li @click="emits('onEditGroup')"
                class="px-3 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer flex items-center">
                <PhPencil /> <span class="p-2">Edit Group</span>
            </li>
            <li @click="emits('onCreateChildGroup')"
                class="px-3 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer flex items-center">
                <PhPlus /> <span class="p-2">Create Child Group</span>
            </li>
            <li @click="emits('onAddRemoveChildren')"
                class="px-3 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer flex items-center">
                <PhPlus /> <span class="p-2">Add/Remove Clinicians</span>
            </li>
            <li @click="emits('onRemoveGroup')"
                class="px-3 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer flex items-center">
                <PhTrash /> <span class="p-2">Remove Group</span>
            </li>
        </ul>
    </div>
</template>