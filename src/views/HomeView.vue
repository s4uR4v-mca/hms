<script setup lang="ts">
import { useHospitalStore } from '@/stores/hospitalStore';
import HmsTree from '@/components/HmsTree.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import HmsOptionMenu from '@/components/HmsOptionMenu.vue';
import HmsEditGroupModal from '@/components/HmsEditGroupModal.vue'
import HmsNewGroupModal from '@/components/HmsNewGroupModal.vue';
import HmsDeleteGroupModal from '@/components/HmsDeleteGroupModal.vue';
import type { HospitalGroupNode } from '@/models/hospital-group-node.dto';
import { PhPlus } from '@phosphor-icons/vue';
import { useRouter } from 'vue-router';
import { RouteName } from '@/router/route-names';
import type { IQueryParam } from '@/router/query.type';
import EmptyState from '@/components/EmptyState.vue';
const router = useRouter();


// Use the tree store
const hospitalStore = useHospitalStore();

const handleNodeToggle = (nodeId: string) => {
    hospitalStore.toggleNodeExpansion(nodeId);
}

const isShowContextMenu = ref<boolean>(false);
const position = ref<{ x: number, y: number }>({ x: 0, y: 0 });
const contextMenuRef = ref<HTMLDivElement | null>(null);
const divRefs = ref<HTMLElement[]>([]);
const activeNode = ref<HospitalGroupNode | null>(null);


const showContextMenu = (item: HospitalGroupNode, e: MouseEvent): void => {
    hideContextMenu(e);
    // Set the active item
    activeNode.value = item;

    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    // Position the menu next to the button
    position.value.x = rect.x + 5; // Position to the right with a small gap
    position.value.y = rect.y;

    // Ensure the menu doesn't go off-screen
    const rightEdge = position.value.x + 192; // w-48 = 12rem = 192px
    if (rightEdge > window.innerWidth) {
        // If would go off-screen to the right, position to the left of the button instead
        position.value.x = rect.left - 197; // 192px + 5px gap
    }

    // Also check vertical positioning
    const bottomEdge = position.value.y + 10 * 4; // Approximate height
    if (bottomEdge > window.innerHeight) {
        position.value.y = window.innerHeight - (10 * 4) - 10;
    }

    // Show the menu
    isShowContextMenu.value = true;

    // Prevent event propagation
    e.stopPropagation();
};

const hideContextMenu = (e: MouseEvent): void => {
    // Don't hide if clicking within the menu
    if (contextMenuRef.value && contextMenuRef.value.contains(e.target as HTMLUListElement)) {
        return;
    }

    // Don't hide if clicking one of the trigger buttons (we handle that in showContextMenu)
    const isButton = divRefs.value.some(btn => btn && btn.contains(e.target as Node));
    if (isButton) {
        return;
    }

    isShowContextMenu.value = false;
};


const isShowEditModal = ref<boolean>(false);
const onEditGroupModalAction = (isSuccess: boolean = false) => {
    isShowEditModal.value = false;
    activeNode.value = null;
    if (isSuccess) {
        // Perform action on success
    }
}

const onEditGroup = () => {
    isShowEditModal.value = true;
}

const isShowCreateGroupModal = ref<boolean>(false);
const onCreateGroup = () => {
    isShowCreateGroupModal.value = true;
}

const onCreateGroupModalAction = (isSuccess: boolean = false) => {
    isShowCreateGroupModal.value = false;
    activeNode.value = null;
    if (isSuccess) {
        // Perform action on success
    }
}

const onAddRemoveClinician = () => {
    if (activeNode.value) {
        const queryParam = {
            h_id: activeNode.value?.id
        } as IQueryParam;
        router.push({
            name: RouteName.CLINICIANS,
            query: { ...queryParam },
        });
    }
}

const isShowDeleteGroupModal = ref<boolean>(false);
const onRemoveGroup = () => {
    isShowDeleteGroupModal.value = true;
}

const onRemoveGroupModalAction = (isSuccess: boolean = false) => {
    isShowDeleteGroupModal.value = false;
    activeNode.value = null;
    if (isSuccess) {
        // Perform action on success
    }
}

onMounted((): void => {
    document.addEventListener('click', hideContextMenu);
});

onBeforeUnmount((): void => {
    document.removeEventListener('click', hideContextMenu);
});
</script>

<template>
    <div class="p-4 max-w-4xl mx-auto ">
        <div class="mb-1 flex space-x-2 justify-between place-items-center ">
            <h1 class="text-neutral-800 text-lg font-bold">Hospital Hierarchy</h1>
            <button @click="onCreateGroup"
                class=" text-neutral-700 font-semibold  hover:bg-neutral-200  hover:text-neutral-800  px-3 py-2 rounded-sm cursor-pointer">
                <PhPlus class="inline mb-1" size="1rem" weight="bold" /> Add Hospital
            </button>
        </div>

        <!-- TreeView component with vertical lines -->
        <div class="border border-neutral-200 rounded p-4 bg-white shadow-sm">
            <div class="font-sans select-none" v-if="hospitalStore.treeData.length">
                <HmsTree :nodes="hospitalStore.treeData" @node-toggle="handleNodeToggle"
                    @option-click="showContextMenu" />
            </div>

            <EmptyState header="No Hospital Found" msg="Start building the tree by adding hospitals" v-else />
        </div>
    </div>

    <HmsOptionMenu v-if="isShowContextMenu" @on-edit-group="onEditGroup" @on-add-remove-clinician="onAddRemoveClinician"
        @on-create-child-group="onCreateGroup" @on-remove-group="onRemoveGroup"
        :style="{ top: position.y + 'px', left: position.x + 'px' }" />

    <HmsEditGroupModal v-if="isShowEditModal && activeNode" :id="activeNode.id || ''" :name="activeNode.label || ''"
        @on-cancel="onEditGroupModalAction" @on-success="onEditGroupModalAction(true)" />

    <HmsNewGroupModal v-if="isShowCreateGroupModal" :parent-id="activeNode?.id || null"
        :is-root="activeNode ? false : true" @on-cancel="onCreateGroupModalAction"
        @on-success="onCreateGroupModalAction(true)" />

    <HmsDeleteGroupModal v-if="isShowDeleteGroupModal && activeNode" :id="activeNode.id" :name="activeNode.label"
        @on-cancel="onRemoveGroupModalAction" @on-success="onRemoveGroupModalAction(true)" />
</template>