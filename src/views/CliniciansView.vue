<script setup lang="ts">
import HmsClinicianAddEditModal from '@/components/HmsClinicianAddEditModal.vue';
import HmsDeleteClinicianModal from '@/components/HmsDeleteClinicianModal.vue';
import type { Clinician } from '@/model/clinician.dto';
import type { HospitalGroupNode } from '@/model/hospital-group-node.dto';
import { RouteName } from '@/router/route-names';
import { useClinicianStore } from '@/stores/clinicianStore';
import { useHospitalStore } from '@/stores/hospitalStore';
import { PhMagnifyingGlass, PhPencil, PhPlus, PhTrash } from '@phosphor-icons/vue';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const tableCols = ['Full Name', 'Actions'];

const route = useRoute();

const hospitalId = ref<string>('');

const hospitalStore = useHospitalStore();
const hospitalGroup = ref<HospitalGroupNode | null>(null);

const clinicianStore = useClinicianStore();

const filter = ref<string>('');

const { clinicianData, filteredData } = storeToRefs(clinicianStore);

const onFilterClick = () => {
    clinicianStore.filterCliniciansForHospital(hospitalId.value, filter.value)
}

const activeClinician = ref<Clinician | null>(null);

const isShowAddModal = ref<boolean>(false);
const onAddClinician = () => {
    isShowAddModal.value = true;
}

const onEditClinician = (selectedClinician: Clinician) => {
    activeClinician.value = selectedClinician;
    isShowAddModal.value = true;
}

const onAddEditClinicianModalAction = (isSuccess: boolean = false) => {
    isShowAddModal.value = false;
    if (isSuccess) {
        clinicianStore.filterCliniciansForHospital(hospitalId.value, filter.value);
    }
    activeClinician.value = null;
}

const isShowDeleteModal = ref<boolean>(false)
const onDeleteClinician = (selectedClinician: Clinician) => {
    activeClinician.value = selectedClinician;
    isShowDeleteModal.value = true;
}

const onDeleteClinicianModalAction = (isSuccess: boolean = false) => {
    isShowDeleteModal.value = false;
    activeClinician.value = null;
    if (isSuccess) {
        clinicianStore.filterCliniciansForHospital(hospitalId.value, filter.value);
    }
}


const getTableRowColor = (index: number) => {
    return index % 2 === 0 ? 'bg-white' : 'bg-blue-50'
}

const titleText = computed(() => {
    return `Clinicians for \"${hospitalGroup.value?.label || ''}\"`
})

const showDataCountLabel = computed(() => {
    const totalCount = clinicianData.value.filter((val) => val.hospital_id === hospitalId.value).length;
    const filteredCount = filteredData.value.length;
    return `${filteredCount} of ${totalCount} record${filteredCount > 1 ? 's' : ''} displayed`;
})

watch(
    route,
    async (routeValue) => {
        const name = routeValue.name;
        if (name !== RouteName.CLINICIANS) {
            return;
        }

        hospitalId.value = route.query?.h_id as string;
        if (hospitalId.value) {
            hospitalGroup.value = hospitalStore.getNodeById(hospitalId.value);
            clinicianStore.filterCliniciansForHospital(hospitalId.value)
        }
    },
    { immediate: true },
);

</script>

<template>
    <div class="p-4 max-w-4xl mx-auto ">
        <div class="mb-2 flex space-x-2 justify-between place-items-center">
            <h1 class="text-blue-500 text-lg font-bold">{{ titleText }}</h1>
            <button @click="onAddClinician"
                class="border text-blue-500 font-semibold border-blue-500 hover:bg-blue-500 hover:text-white  px-3 py-1 rounded-sm cursor-pointer">
                <PhPlus class="inline mb-1" size="1rem" weight="bold" /> Add Clinician
            </button>
        </div>

        <div class="mb-2 flex space-x-2 justify-between place-items-center bg-blue-100 p-2">
            <span class="text-sm">{{ showDataCountLabel }}</span>
            <div
                class="flex place-items-center border border-gray-400 focus:border-blue-400 bg-blue-50 rounded-md w-xs justify-between">
                <input type="text" v-model="filter" class="px-4 py-1 text-sm focus:outline-none grow"
                    placeholder="Search" @keyup.enter="onFilterClick" />
                <PhMagnifyingGlass @click="onFilterClick"
                    class="bg-blue-200 p-2 text-blue-500 m-0.5 rounded-tr-sm rounded-br-sm cursor-pointer hover:bg-blue-300 hover:text-blue-100"
                    size="2rem" weight="bold" />
            </div>

        </div>

        <table class="w-full">
            <thead>
                <tr class="bg-blue-100">
                    <th v-for="(col, index) in tableCols" :key="index" class="text-left py-3 px-2 font-semibold">{{ col
                    }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(clinician, index) in filteredData" :key="clinician.id" class=" border border-blue-100"
                    :class="getTableRowColor(index)">
                    <td class="py-3 px-2">{{ `${clinician.first_name} ${clinician.last_name}` }}</td>
                    <td class="py-3 px-2">
                        <div class="flex">
                            <PhPencil @click="onEditClinician(clinician)"
                                class="text-blue-500 cursor-pointer hover:bg-blue-100 px-2 rounded" size="2.1rem" />
                            <PhTrash @click="onDeleteClinician(clinician)"
                                class="text-red-500 cursor-pointer hover:bg-red-100 px-2 rounded" size="2.1rem" />
                        </div>

                    </td>
                </tr>
            </tbody>
        </table>

    </div>

    <HmsClinicianAddEditModal v-if="isShowAddModal" :hospital-id="hospitalGroup?.id || ''"
        :hospital-name="hospitalGroup?.label || ''" :id="activeClinician?.id" :first-name="activeClinician?.first_name"
        :last-name="activeClinician?.last_name" @on-cancel="onAddEditClinicianModalAction"
        @on-success="onAddEditClinicianModalAction(true)" />

    <HmsDeleteClinicianModal v-if="isShowDeleteModal" :hospital-id="hospitalGroup?.id || ''"
        :id="activeClinician?.id || ''" :first-name="activeClinician?.first_name || ''"
        :last-name="activeClinician?.last_name || ''" @on-cancel="onDeleteClinicianModalAction"
        @on-success="onDeleteClinicianModalAction(true)" />
</template>