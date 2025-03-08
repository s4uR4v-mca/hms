<script setup lang="ts">
import { useClinicianStore } from '@/stores/clinicianStore';
import CommonModalHeader from './modals/CommonModalHeader.vue';
import CommonModalFooter from './modals/CommonModalFooter.vue';

const props = defineProps<{ hospitalId: string, id: string, firstName: string, lastName: string }>();
const emits = defineEmits(['onSuccess', 'onCancel']);

const clinicianStore = useClinicianStore();

const onDelete = () => {
    if (props.hospitalId && props.id)
        clinicianStore.deleteClinician(props.hospitalId, props.id, (success: boolean) => {
            if (success) {
                onSuccess();
            }
        })
}

const onClose = () => {
    emits('onCancel');
}

const onSuccess = () => {
    emits('onSuccess');
}
</script>

<template>
    <Teleport to="body">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @click="onClose">
            <div class="absolute inset-0 bg-black opacity-50"></div>

            <div class="relative px-4 rounded-md py-4 z-10 w-full max-w-md bg-white shadow-2xl overflow-hidden mb-[12rem]"
                @click.stop>
                <CommonModalHeader title="Delete Clinician" @on-close="onClose" />

                <div class="flex flex-col my-8">
                    <p class="text-neutral-600 m-1">Do you want to delete <span
                            class="text-neutral-900 font-semibold">{{ props.firstName + ' ' + props.lastName
                            }}</span>? Please confirm your choice</p>
                </div>

                <CommonModalFooter button-text="Delete" @on-confirm="onDelete" :is-delete="true" />
            </div>
        </div>
    </Teleport>
</template>