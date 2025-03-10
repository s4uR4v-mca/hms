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

import { useHmsNotification } from '@/composables/useHmsNotification';
import { HmsNotificationEnum } from '@/types/notification.type';
import { watchDebounced } from '@vueuse/core';
const { addNotification } = useHmsNotification();

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

// filter method for filtering clinician data
const onFilterWithDebounce = (filter: string) => {
    clinicianStore.filterCliniciansForHospital(hospitalId.value, filter)
}

const activeClinician = ref<Clinician | null>(null);

const isShowAddModal = ref<boolean>(false);
// click add clinician handled
const onAddClinician = () => {
    isShowAddModal.value = true;
}

// click edit clinician handled
const onEditClinician = (selectedClinician: Clinician) => {
    activeClinician.value = selectedClinician;
    isShowAddModal.value = true;
}

// handling emit from add/edit modal
const onAddEditClinicianModalAction = (isSuccess: boolean = false, errMsg: string = '') => {
    isShowAddModal.value = false;

    if (isSuccess) {
        clinicianStore.filterCliniciansForHospital(hospitalId.value, filter.value);

        if (activeClinician.value?.id) {
            notifyUser(HmsNotificationEnum.SUCCESS, 'Update Success', 'Successfully update clinician details')
        } else {
            notifyUser(HmsNotificationEnum.SUCCESS, 'Add Success', 'Successfully added clinician details')
        }
    } else {
        if (activeClinician.value?.id) {
            notifyUser(HmsNotificationEnum.ERROR, 'Update Failure', errMsg || 'Failed to update clinician details')
        } else {
            notifyUser(HmsNotificationEnum.ERROR, 'Add Failure', errMsg || 'Failed to add clinician details')
        }
    }
    activeClinician.value = null;
}


const isShowDeleteModal = ref<boolean>(false)
// click delete clinician handled
const onDeleteClinician = (selectedClinician: Clinician) => {
    activeClinician.value = selectedClinician;
    isShowDeleteModal.value = true;
}

// handling delete clinician emit from delete modal
const onDeleteClinicianModalAction = (isSuccess: boolean = false) => {
    isShowDeleteModal.value = false;
    activeClinician.value = null;
    if (isSuccess) {
    }

    if (isSuccess) {
        clinicianStore.filterCliniciansForHospital(hospitalId.value, filter.value);
        notifyUser(HmsNotificationEnum.SUCCESS, 'Delete Success', 'Successfully deleted clinician details')
    } else {
        notifyUser(HmsNotificationEnum.ERROR, 'Delete Failure', 'Failed to delete clinician details')
    }
}

// table row color dynamic class for coloring alternative row background
const getTableRowColor = (index: number) => {
    return index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'
}

// finding available vs filtered clinician count and exposing the data to the template through a computed variable
const countMetrics = computed(() => {
    const totalCount = clinicianData.value.filter((val) => val.hospital_id === hospitalId.value).length;
    const filteredCount = filteredData.value.length;
    return { totalCount: totalCount, filteredCount: filteredCount, suffix: `record${filteredCount > 1 ? 's' : ''} displayed` };
})

// custom notification for success/failure actions
const notifyUser = (type: HmsNotificationEnum, title: string, msg: string, duration?: number) => {
    addNotification(
        {
            type: type,
            title: title,
            message: msg,
            duration: duration
        }
    )
}

// Debounce watcher for watching the search input data
watchDebounced(
    filter,
    (newValue) => {
        onFilterWithDebounce(newValue)
    },
    { debounce: 500, maxWait: 5000 }
)

// Route watcher to pick hospital id from the query param
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
            <button @click="onAddClinician" data-test="add-clinician-btn"
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
                <PhMagnifyingGlass class="py-2 text-neutral-800 m-0.5 rounded-tl-sm rounded-bl-sm " size="2rem"
                    weight="bold" />
                <input type="text" v-model="filter" class="pr-4 py-1 text-sm focus:outline-none grow"
                    placeholder="Search" />

            </div>

        </div>
        <!-- Creating table to show the clinicians for hospital group -->
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
        <EmptyState v-else header="No Clinicians Found" data-test="empty-state"
            :msg="`Oops.. No clinicians found for ${hospitalGroup?.label} ${filter ? ` with filter: ${filter}` : ''}`" />
    </div>

    <!-- Modal Component for add/edit actions -->
    <HmsClinicianAddEditModal v-if="isShowAddModal" :hospital-id="hospitalGroup?.id || ''"
        :hospital-name="hospitalGroup?.label || ''" :id="activeClinician?.id" :first-name="activeClinician?.first_name"
        :last-name="activeClinician?.last_name" @on-cancel="isShowAddModal = false"
        @on-success="onAddEditClinicianModalAction(true)" @on-error="onAddEditClinicianModalAction" />
    <!-- Modal Component for deleting clinicians -->
    <HmsDeleteClinicianModal v-if="isShowDeleteModal" :hospital-id="hospitalGroup?.id || ''"
        :id="activeClinician?.id || ''" :first-name="activeClinician?.first_name || ''"
        :last-name="activeClinician?.last_name || ''" @on-cancel="isShowDeleteModal = false"
        @on-success="onDeleteClinicianModalAction(true)" />
</template>