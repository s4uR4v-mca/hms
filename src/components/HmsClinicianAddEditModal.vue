<script setup lang="ts">
import type { Clinician } from '@/models/clinician.dto';
import { useClinicianStore } from '@/stores/clinicianStore';
import useVuelidate from '@vuelidate/core';
import { computed, onBeforeMount, ref } from 'vue';
import { useClinicianValidator } from '@/composables/useClinicianValidator';
import CommonModalHeader from './modals/CommonModalHeader.vue';
import CommonModalFooter from './modals/CommonModalFooter.vue';


const props = defineProps<{ hospitalId: string, hospitalName: string, id?: string, firstName?: string, lastName?: string }>();

const emits = defineEmits(['onSuccess', 'onError', 'onCancel'])

const clinicianStore = useClinicianStore();

const newFirstName = ref<string>('');
const newLastName = ref<string>('');

const v$ = useVuelidate(
    useClinicianValidator().ruleAddEditClinician,
    {
        newFirstName,
    },
    { $autoDirty: true },
);

const onClose = () => {
    emits('onCancel')
}

const onConfirm = async () => {
    if (!props.hospitalId) {
        return;
    }

    const isValidData = await v$?.value.$validate();
    if (!isValidData) {
        return;
    }

    // Check for duplicate clinician name
    const duplicateClinicians = clinicianStore.clinicianData.filter((x) => x.hospital_id === props.hospitalId && x.id !== props.id && x.first_name === newFirstName.value && x.last_name === newLastName.value);
    if (duplicateClinicians.length) {
        emits('onError', false, 'Clinicians exists with same name for this hospital group');
        return;
    }

    if (props.id) {
        clinicianStore.updateClinician(props.id, props.hospitalId, { first_name: newFirstName.value, last_name: newLastName.value }, (status: boolean) => {
            if (status) {
                emits('onSuccess')
            }
        })
    } else {
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
    return props.id ? "Edit clinician for " : "Add clinician for ";
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
                <CommonModalHeader :title="titleText" @on-close="onClose" />

                <div class="flex flex-col my-8">
                    <p class="text-neutral-800 text-sm m-1">{{ msg }}<span class="text-neutral-800 font-semibold">{{
                        props.hospitalName }}</span></p>
                    <input v-model="newFirstName"
                        class="px-4 py-2 border border-neutral-300  rounded-md focus:border-neutral-700 focus:outline-none mb-3"
                        placeholder="Enter First Name" />
                    <span class="ml-2 block text-sm text-red-500">
                        {{ v$.newFirstName.$errors[0]?.$message }}
                    </span>
                    <input v-model="newLastName"
                        class="px-4 py-2 border border-neutral-300  rounded-md focus:border-neutral-700 focus:outline-none"
                        placeholder="Enter Last Name" />
                </div>

                <CommonModalFooter :button-text="buttonText" @on-confirm="onConfirm" />
            </div>
        </div>
    </Teleport>
</template>