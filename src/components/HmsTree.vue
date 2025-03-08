<script setup lang="ts">
import { computed } from 'vue';
import { PhMinusSquare, PhPlusSquare, PhDotsThreeVertical, PhHospital, PhFirstAidKit } from '@phosphor-icons/vue';
import type { HospitalGroupNode } from '@/models/hospital-group-node.dto';

const props = defineProps<{
    parentId?: string;
    nodes: HospitalGroupNode[];
    indent?: number;
    level?: number; // Track the nesting level
}>();

const emit = defineEmits(['node-toggle', 'option-click']);

const defaultIndent = 6; // Using Tailwind spacing units (6 = 1.5rem)
const indentation = computed(() => props.indent || defaultIndent);
const currentLevel = computed(() => props.level || 0);

function toggleNode(node: HospitalGroupNode) {
    emit('node-toggle', node.id);
}

// Check if a node has children
function hasChildren(node: HospitalGroupNode): boolean {
    return !!node.children && node.children.length > 0;
}

// Check if node is the last in its list
function isLastNode(index: number): boolean {
    return index === props.nodes.length - 1;
}

function onChildOptionClickReceived(item: HospitalGroupNode, event: MouseEvent) {
    emit('option-click', item, event);
}
</script>

<template>
    <ul class="list-none p-0 m-0">
        <li v-for="(node, index) in nodes" :key="node.id" class="relative">
            <!-- Vertical line from parent to this node (except for root level) -->
            <div v-if="currentLevel > 0" class="absolute border-l border-neutral-300"
                style="top: 0; bottom: 0; left: -1.25rem;"></div>

            <div class="relative my-1">
                <!-- Horizontal connector line -->
                <div v-if="currentLevel > 0" class="absolute border-t border-neutral-300 w-4"
                    style="top: 50%; left: -1.25rem;"></div>

                <!-- Node content -->
                <div class="flex items-center py-2 px-1 rounded hover:bg-neutral-100">
                    <div v-if="hasChildren(node)" class="inline-block w-4 text-center -ml-2 mr-3 text-xs z-10"
                        @click.stop="toggleNode(node)">
                        <PhMinusSquare class="text-lg font-bold text-sky-700" size="1.2rem" v-if="node.isExpanded" />
                        <PhPlusSquare class="text-lg font-bold text-orange-700" size="1.2rem" v-else />
                    </div>

                    <div class="mr-2 text-neutral-400 text-lg">
                        <PhFirstAidKit v-if="props.parentId" weight="regular" size="1.5rem" />
                        <PhHospital v-else weight="regular" size="1.5rem" />
                    </div>

                    <span class="text-md">{{ node.label }}</span>
                    <div>
                        <PhDotsThreeVertical class="text-lg ml-1 cursor-pointer" weight="bold"
                            @click="emit('option-click', node, $event)" />
                    </div>


                </div>

                <!-- Children container with vertical lines -->
                <div v-if="node.isExpanded && node.children" class="relative ml-6">
                    <!-- Vertical line from this node to last child -->
                    <div v-if="!isLastNode(index)" class="absolute border-l border-neutral-300"
                        style="top: 1rem; bottom: -0.5rem; left: -1.25rem;"></div>

                    <!-- Recursive component for children -->
                    <HmsTree :parent-id="node.id" :nodes="node.children" :indent="indentation" :level="currentLevel + 1"
                        @node-toggle="$emit('node-toggle', $event)" @option-click="onChildOptionClickReceived" />
                </div>
            </div>
        </li>
    </ul>
</template>