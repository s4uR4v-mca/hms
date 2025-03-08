<script setup lang="ts">
import { useHospitalStore } from '@/stores/hospitalStore';
import CommonModalHeader from './modals/CommonModalHeader.vue';
import CommonModalFooter from './modals/CommonModalFooter.vue';

const props = defineProps<{ id: string, name: string }>();
const emits = defineEmits(['onSuccess', 'onCancel']);
const hospitalStore = useHospitalStore();

const onClose = () => {
    emits('onCancel')
}

const onDelete = () => {
    if (!props.id) {
        return;
    }
    hospitalStore.deleteNode(props.id, (status: boolean) => {
        if (status) {
            emits('onSuccess');
        }
    });
}
</script>

<template>
    <Teleport to="body">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @click="onClose">
            <div class="absolute inset-0 bg-black opacity-50"></div>

            <div class="relative px-4 rounded-md py-4 z-10 w-full max-w-md bg-white shadow-2xl overflow-hidden mb-[12rem]"
                @click.stop>
                <CommonModalHeader title="Delete Hospital Group" @on-close="onClose" />

                <div class="flex flex-col my-8">
                    <p class="text-neutral-600 m-1">Do you want to delete <span
                            class="text-neutral-900 font-semibold">{{ props.name
                            }}</span>? Please confirm your choice</p>
                </div>
                <CommonModalFooter button-text="Delete" @on-confirm="onDelete" :is-delete="true" />
            </div>
        </div>
    </Teleport>
</template>