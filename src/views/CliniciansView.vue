<script setup lang="ts">
import EmptyState from '@/components/EmptyState.vue';
import HmsClinicianAddEditModal from '@/components/HmsClinicianAddEditModal.vue';
import HmsDeleteClinicianModal from '@/components/HmsDeleteClinicianModal.vue';
import type { Clinician } from '@/models/clinician.dto';
import type { HospitalGroupNode } from '@/models/hospital-group-node.dto';
import { RouteName } from '@/router/route-names';
import { useClinicianStore } from '@/stores/clinicianStore';
import { useHospitalStore } from '@/stores/hospitalStore';
import { PhCaretLeft, PhMagnifyingGlass, PhPencil, PhPlus, PhTrash } from '@phosphor-icons/vue';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const gotoHome = () => {
    router.push({
        name: RouteName.HOME,
    });
};

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
    return index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'
}

const countMetrics = computed(() => {
    const totalCount = clinicianData.value.filter((val) => val.hospital_id === hospitalId.value).length;
    const filteredCount = filteredData.value.length;
    // return `${filteredCount} of ${totalCount} record${filteredCount > 1 ? 's' : ''} displayed`;
    return { totalCount: totalCount, filteredCount: filteredCount, suffix: `record${filteredCount > 1 ? 's' : ''} displayed` };
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
            <div class="flex place-items-center">
                <button @click="gotoHome"
                    class="text-neutral-900 font-bold  hover:bg-neutral-200  hover:text-neutral-800 py-2 px-2 mr-2 rounded-sm cursor-pointer">
                    <PhCaretLeft class="inline mb-1" size="1rem" weight="bold" />
                </button>
                <h1 class="text-neutral-800 text-lg font-bold">Clinicians for: <span
                        class="text-neutral-900 font-extrabold">{{
                            hospitalGroup?.label
                            || ''
                        }}</span>
                </h1>
            </div>
            <button @click="onAddClinician"
                class="text-neutral-700 font-semibold  hover:bg-neutral-200  hover:text-neutral-800  px-3 py-2 rounded-sm cursor-pointer">
                <PhPlus class="inline mb-1" size="1rem" weight="bold" /> Add Clinician
            </button>
        </div>

        <div class="mb-2 flex space-x-2 justify-between place-items-center bg-neutral-100 p-2">
            <p class="text-sm text-neutral-600"><span class="font-semibold text-neutral-900">{{
                countMetrics.filteredCount }}</span> of
                <span class="font-semibold text-neutral-900">{{
                    countMetrics.totalCount
                }}</span> {{ countMetrics.suffix }}
            </p>
            <div class="flex place-items-center border border-neutral-400 bg-white rounded-md w-xs justify-between">
                <input type="text" v-model="filter" class="px-4 py-1 text-sm focus:outline-none grow"
                    placeholder="Search" @keyup.enter="onFilterClick" />
                <PhMagnifyingGlass @click="onFilterClick"
                    class="bg-neutral-200 p-2 text-neutral-600 m-0.5 rounded-tr-sm rounded-br-sm cursor-pointer hover:bg-neutral-300 hover:text-neutral-800"
                    size="2rem" weight="bold" />
            </div>

        </div>

        <table class="w-full" v-if="filteredData.length">
            <thead>
                <tr class="bg-neutral-100 border border-neutral-200">
                    <th v-for="(col, index) in tableCols" :key="index"
                        class="text-left py-3 px-2 font-medium text-neutral-900">{{ col
                        }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(clinician, index) in filteredData" :key="clinician.id" class=" border border-neutral-200"
                    :class="getTableRowColor(index)">
                    <td class="text-neutral-700 py-3 px-2">{{ `${clinician.first_name} ${clinician.last_name}` }}</td>
                    <td class="py-3 px-2">
                        <div class="flex">
                            <PhPencil @click="onEditClinician(clinician)"
                                class="text-sky-700 cursor-pointer hover:bg-sky-100 px-2 rounded" size="2.1rem" />
                            <PhTrash @click="onDeleteClinician(clinician)"
                                class="text-orange-800 cursor-pointer hover:bg-orange-100 px-2 rounded" size="2.1rem" />
                        </div>

                    </td>
                </tr>
            </tbody>
        </table>
        <EmptyState v-else header="No Clinicians Found"
            :msg="`Oops.. No clinicians found for ${hospitalGroup?.label} ${filter ? ` with filter: ${filter}` : ''}`" />
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