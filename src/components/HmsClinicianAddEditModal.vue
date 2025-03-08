<script setup lang="ts">
import type { Clinician } from '@/model/clinician.dto';
import { useClinicianStore } from '@/stores/clinicianStore';
import { PhX } from '@phosphor-icons/vue';
import { computed, onBeforeMount, ref } from 'vue';

const props = defineProps<{ hospitalId: string, hospitalName: string, id?: string, firstName?: string, lastName?: string }>();

const emits = defineEmits(['onSuccess', 'onCancel'])

const clinicianStore = useClinicianStore();

const newFirstName = ref<string>('');
const newLastName = ref<string>('');

const onClose = () => {
    emits('onCancel')
}

const onConfirm = () => {
    if (!props.hospitalId) {
        return;
    }
    if (props.id) {
        // Perform update action
        clinicianStore.updateClinician(props.id, props.hospitalId, { first_name: newFirstName.value, last_name: newLastName.value }, (status: boolean) => {
            if (status) {
                emits('onSuccess')
            }
        })
    } else {
        // Perform add action
        const newClinician = {
            id: Date.now().toString(), // Creating the id from the current timestamp
            first_name: newFirstName.value,
            last_name: newLastName.value,
            hospital_id: props.hospitalId
        } as Clinician

        clinicianStore.addClinician(newClinician, (status: boolean) => {
            if (status) {
                emits('onSuccess')
            }
        })
    }
}

const titleText = computed(() => {
    return props.id ? 'Edit Clinician' : 'Add Clinician';
})

const msg = computed(() => {
    return props.id ? `Edit clinician for \"${props.hospitalName || ''}\"` : `Add clinician for \"${props.hospitalName || ''}\"`;
})

const buttonText = computed(() => {
    return props.id ? 'Update' : 'Create';
})

onBeforeMount(() => {
    newFirstName.value = props.firstName || '';
    newLastName.value = props.lastName || '';
})
</script>

<template>
    <Teleport to="body">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @click="onClose">
            <div class="absolute inset-0 bg-black opacity-50"></div>

            <div class="relative px-4 rounded-md py-4 z-10 w-full max-w-md bg-white shadow-2xl overflow-hidden mb-[12rem]"
                @click.stop>
                <div class="flex items-center justify-between ">
                    <h3 class="text-lg font-medium text-gray-900">{{ titleText }}</h3>
                    <PhX weight="bold" @click="onClose" class="text-2xl cursor-pointer  hover:bg-gray-100 p-1" />
                </div>

                <div class="flex flex-col my-8">
                    <p class="text-gray-600 text-sm m-1">{{ msg }}</p>
                    <input v-model="newFirstName"
                        class="px-4 py-2 border border-gray-400  rounded-md focus:border-green-600 focus:outline-none"
                        placeholder="Enter First Name" />
                    <input v-model="newLastName"
                        class="px-4 py-2 mt-4 border border-gray-400  rounded-md focus:border-green-600 focus:outline-none"
                        placeholder="Enter Last Name" />
                </div>

                <div class=" bg-gray-50 flex justify-end space-x-2">
                    <button @click="onClose"
                        class=" hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded cursor-pointer">
                        Cancel
                    </button>
                    <button @click="onConfirm"
                        class=" hover:bg-blue-100 font-semibold py-2 px-4 rounded text-blue-800 cursor-pointer">
                        {{ buttonText }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>