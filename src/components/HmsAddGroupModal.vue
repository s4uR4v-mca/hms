<script setup lang="ts">
import type { HospitalGroupNode } from '@/models/hospital-group-node.dto';
import { useHospitalStore } from '@/stores/hospitalStore';
import { computed, ref } from 'vue';
import CommonModalHeader from './modals/CommonModalHeader.vue';
import CommonModalFooter from './modals/CommonModalFooter.vue';
import useVuelidate from '@vuelidate/core';
import { useClinicianValidator } from '@/composables/useClinicianValidator';

const { parentId, isRoot = false } = defineProps<{ parentId?: string | null, isRoot?: boolean }>();

const emits = defineEmits(['onSuccess', 'onError', 'onCancel'])

const hospitalStore = useHospitalStore();
const newGroupName = ref<string>('');

const v$ = useVuelidate(
    useClinicianValidator().ruleNewHospitalGroup,
    {
        newGroupName,
    },
    { $autoDirty: true },
);


const onClose = () => {
    emits('onCancel')
}

const onConfirm = async () => {
    const isValidData = await v$?.value.$validate();
    if (!isValidData) {
        return;
    }

    // Check for duplicate hospital group name
    const duplicateGroups = hospitalStore.hospitalGroupData.filter((x) => x.label === newGroupName.value);
    if (duplicateGroups.length) {
        emits('onError', false, 'Another hospital group already exists with the same name')
        return;
    }

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
                <CommonModalHeader title="Create Group" @on-close="onClose" />

                <div class="flex flex-col my-8">
                    <p class="text-neutral-800 text-sm m-1">{{ inputMsg }}</p>
                    <input v-model="newGroupName" data-test="input-new-group"
                        class="px-4 py-2 border border-neutral-300 rounded-md focus:border-neutral-700 focus:outline-none"
                        placeholder="Enter Group Name" />
                    <span class="ml-2 block text-sm text-red-500">
                        {{ v$.newGroupName.$errors[0]?.$message }}
                    </span>
                </div>

                <CommonModalFooter button-text="Create" @on-confirm="onConfirm" />
            </div>
        </div>
    </Teleport>
</template>