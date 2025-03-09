<script setup lang="ts">
import { PhPencil, PhPlus, PhTrash, PhUser } from '@phosphor-icons/vue';


const emits = defineEmits(['onEditGroup', 'onCreateChildGroup', 'onAddRemoveClinician', 'onRemoveGroup'])
</script>

<template>
    <div class="absolute bg-neutral-50 rounded-md shadow-lg border border-neutral-200 py-1 z-50">
        <ul>
            <li @click="emits('onEditGroup')" data-test="edit-group"
                class="px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900  cursor-pointer flex items-center">
                <PhPencil /> <span class="p-2">Edit Group</span>
            </li>
            <li @click="emits('onCreateChildGroup')" data-test="create-child-group"
                class="px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900  cursor-pointer flex items-center">
                <PhPlus /> <span class="p-2">Create Child Group</span>
            </li>
            <li @click="emits('onAddRemoveClinician')" data-test="add-remove-clinicians"
                class="px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 cursor-pointer flex items-center">
                <PhUser /> <span class="p-2">Add/Remove Clinicians</span>
            </li>
            <li @click="emits('onRemoveGroup')" data-test="remove-group"
                class="px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 cursor-pointer flex items-center">
                <PhTrash /> <span class="p-2">Remove Group</span>
            </li>
        </ul>
    </div>
</template>