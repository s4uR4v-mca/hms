<script setup lang="ts">
import { useClinicianStore } from '@/stores/clinicianStore';
import { PhX } from '@phosphor-icons/vue';

const props = defineProps<{ hospitalId: string, id: string, firstName: string, lastName: string }>();
const emits = defineEmits(['onSuccess', 'onCancel']);

const clinicianStore = useClinicianStore();

const onDeleteClinician = () => {
    console.log('On delete')
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
                <div class="flex items-center justify-between ">
                    <h3 class="text-lg font-medium text-gray-900">Delete Clinician</h3>
                    <PhX weight="bold" @click="onClose" class="text-2xl cursor-pointer  hover:bg-gray-100 p-1" />
                </div>

                <div class="flex flex-col my-8">
                    <p class="text-gray-600 m-1">Do you want to delete this "{{ props.firstName + ' ' + props.lastName
                        }}"? Please confirm with
                        your choice</p>
                </div>

                <div class=" bg-gray-50 flex justify-end space-x-2">
                    <button @click="onClose"
                        class=" hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded cursor-pointer">
                        Cancel
                    </button>
                    <button @click="onDeleteClinician"
                        class=" hover:bg-red-100 font-semibold py-2 px-4 rounded text-red-800 cursor-pointer">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>