<script setup lang="ts">
import { useHospitalStore } from '@/stores/hospitalStore';
import { onBeforeMount, ref } from 'vue';
import CommonModalHeader from './modals/CommonModalHeader.vue';
import CommonModalFooter from './modals/CommonModalFooter.vue';
import useVuelidate from '@vuelidate/core';
import { useClinicianValidator } from '@/composables/useClinicianValidator';

const props = defineProps<{ id: string, name: string }>();
const emits = defineEmits(['onSuccess', 'onError', 'onCancel'])
const hospitalStore = useHospitalStore();
const updatedGroupName = ref<string>('');

const v$ = useVuelidate(
    useClinicianValidator().ruleEditHospitalGroup,
    {
        updatedGroupName,
    },
    { $autoDirty: true },
);

const onClose = () => {
    emits('onCancel')
}

const onConfirm = async () => {
    if (!props.id) {
        return;
    }

    const isValidData = await v$?.value.$validate();
    if (!isValidData) {
        return;
    }

    // Check for duplicate hospital group name
    const duplicateGroups = hospitalStore.hospitalGroupData.filter((x) => x.id !== props.id && x.label === updatedGroupName.value);
    if (duplicateGroups.length) {
        emits('onError', false, 'Another hospital group already exists with the same name')
        return;
    }

    hospitalStore.updateNode(props.id, { label: updatedGroupName.value }, (status: boolean) => {
        if (status) {
            emits('onSuccess')
        }
    });
}

onBeforeMount(() => {
    updatedGroupName.value = props.name;
})
</script>

<template>
    <Teleport to="body">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @click="onClose">
            <div class="absolute inset-0 bg-black opacity-50"></div>

            <div class="relative px-4 rounded-md py-4 z-10 w-full max-w-md bg-white shadow-2xl overflow-hidden mb-[12rem]"
                @click.stop>
                <CommonModalHeader title="Edit Hospital Group" @on-close="onClose" data-test="header" />

                <div class="flex flex-col my-8">
                    <p class="text-neutral-800 text-sm m-1">Enter new name for the group</p>
                    <input v-model="updatedGroupName" data-test="input"
                        class="px-4 py-2 border border-neutral-300  rounded-md focus:border-neutral-700 focus:outline-none"
                        placeholder="Enter Group Name" />
                    <span class="ml-2 block text-sm text-red-500">
                        {{ v$.updatedGroupName.$errors[0]?.$message }}
                    </span>
                </div>

                <CommonModalFooter button-text="Update" @on-confirm="onConfirm" data-test="footer" />

            </div>
        </div>
    </Teleport>
</template>