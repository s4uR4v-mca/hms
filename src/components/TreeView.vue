<script setup lang="ts">
import { computed } from 'vue';
import { type TreeNode } from '../stores/treeStore';

const props = defineProps<{
    nodes: TreeNode[];
    indent?: number;
    level?: number; // Track the nesting level
}>();

const emit = defineEmits<{
    (e: 'node-click', node: TreeNode): void;
    (e: 'node-toggle', nodeId: string): void;
}>();

const defaultIndent = 6; // Using Tailwind spacing units (6 = 1.5rem)
const indentation = computed(() => props.indent || defaultIndent);
const currentLevel = computed(() => props.level || 0);

function toggleNode(node: TreeNode) {
    emit('node-toggle', node.id);
}

function handleNodeClick(node: TreeNode) {
    emit('node-click', node);
}

// Check if a node has children
function hasChildren(node: TreeNode): boolean {
    return !!node.children && node.children.length > 0;
}

// Check if node is the last in its list
function isLastNode(index: number): boolean {
    return index === props.nodes.length - 1;
}
</script>

<template>
    <ul class="list-none p-0 m-0">
        <li v-for="(node, index) in nodes" :key="node.id" class="relative">
            <!-- Vertical line from parent to this node (except for root level) -->
            <div v-if="currentLevel > 0" class="absolute border-l border-gray-300"
                style="top: 0; bottom: 0; left: -1.25rem;"></div>

            <div class="relative my-1">
                <!-- Horizontal connector line -->
                <div v-if="currentLevel > 0" class="absolute border-t border-gray-300 w-4"
                    style="top: 50%; left: -1.25rem;"></div>

                <!-- Node content -->
                <div class="flex items-center cursor-pointer p-1 rounded hover:bg-gray-100"
                    @click="handleNodeClick(node)">
                    <span v-if="hasChildren(node)" class="inline-block w-4 text-center mr-1 text-xs z-10"
                        @click.stop="toggleNode(node)">
                        {{ node.isExpanded ? '▼' : '►' }}
                    </span>
                    <span v-else class="inline-block w-4 mr-1 invisible z-10">•</span>
                    <span class="text-sm">{{ node.label }}</span>
                </div>

                <!-- Children container with vertical lines -->
                <div v-if="node.isExpanded && node.children" class="relative ml-6">
                    <!-- Vertical line from this node to last child -->
                    <div v-if="!isLastNode(index)" class="absolute border-l border-gray-300"
                        style="top: 1rem; bottom: -0.5rem; left: -1.25rem;"></div>

                    <!-- Recursive component for children -->
                    <TreeView :nodes="node.children" :indent="indentation" :level="currentLevel + 1"
                        @node-click="$emit('node-click', $event)" @node-toggle="$emit('node-toggle', $event)" />
                </div>
            </div>
        </li>
    </ul>
</template>