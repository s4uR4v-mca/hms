<script setup lang="ts">
import type { HospitalGroupNode } from '@/model/hospital-group-node.dto';
import { useHospitalStore } from '@/stores/hospitalStore';
import { PhX } from '@phosphor-icons/vue';
import { computed, ref } from 'vue';

const { parentId, isRoot = false } = defineProps<{ parentId?: string | null, isRoot?: boolean }>();

const emits = defineEmits(['onSuccess', 'onCancel'])

const hospitalStore = useHospitalStore();
const newGroupName = ref<string>('');

const onClose = () => {
    emits('onCancel')
}

const onConfirm = () => {
    if (newGroupName.value.trim()) {
        const newNode: HospitalGroupNode = {
            id: Date.now().toString(), // Creating unique id using the current timestamp
            label: newGroupName.value.trim()
        };

        hospitalStore.addNode(parentId || null, newNode, (status: boolean) => {
            if (status) {
                emits('onSuccess')
            }
        });
    }
}

const inputMsg = computed(() => {
    return isRoot ? 'Enter the root group name' : 'Enter new child group name';
})
</script>

<template>
    <Teleport to="body">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @click="onClose">
            <div class="absolute inset-0 bg-black opacity-50"></div>

            <div class="relative px-4 rounded-md py-4 z-10 w-full max-w-md bg-white shadow-2xl overflow-hidden mb-[12rem]"
                @click.stop>
                <div class="flex items-center justify-between ">
                    <h3 class="text-lg font-medium text-gray-900">Create Group</h3>
                    <PhX weight="bold" @click="onClose" class="text-2xl cursor-pointer  hover:bg-gray-100 p-1" />
                </div>

                <div class="flex flex-col my-8">
                    <p class="text-gray-600 text-sm m-1">{{ inputMsg }}</p>
                    <input v-model="newGroupName"
                        class="px-4 py-2 border border-gray-400  rounded-md focus:border-green-600 focus:outline-none"
                        placeholder="Enter Group Name" />
                </div>

                <div class=" bg-gray-50 flex justify-end space-x-2">
                    <button @click="onClose"
                        class=" hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded cursor-pointer">
                        Cancel
                    </button>
                    <button @click="onConfirm"
                        class=" hover:bg-blue-100 font-semibold py-2 px-4 rounded text-blue-800 cursor-pointer">
                        Create
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>