<script setup lang="ts">
import { computed } from 'vue';
import { type TreeNode } from '@/stores/treeStore';

const props = defineProps<{
    nodes: TreeNode[];
    indent?: number;
}>();

const emit = defineEmits<{
    (e: 'node-click', node: TreeNode): void;
    (e: 'node-toggle', nodeId: string): void;
}>();

const defaultIndent = 4; // Using Tailwind spacing units (4 = 1rem)
const indentation = computed(() => props.indent || defaultIndent);

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
</script>

<template>
    <div class="font-sans select-none">
        <ul class="list-none p-0 m-0">
            <li v-for="node in nodes" :key="node.id" class="my-1">
                <div class="flex items-center cursor-pointer p-1 rounded hover:bg-gray-100"
                    @click="handleNodeClick(node)">
                    <span v-if="hasChildren(node)" class="inline-block w-4 text-center mr-1 text-xs"
                        @click.stop="toggleNode(node)">
                        {{ node.isExpanded ? '▼' : '►' }}
                    </span>
                    <span v-else class="inline-block w-4 mr-1 invisible">•</span>
                    <span class="text-sm">{{ node.label }}</span>
                </div>

                <div v-if="node.isExpanded && node.children" :class="`pl-${indentation}`">
                    <!-- Recursive component for children -->
                    <TreeView :nodes="node.children" :indent="indentation" @node-click="$emit('node-click', $event)"
                        @node-toggle="$emit('node-toggle', $event)" />
                </div>
            </li>
        </ul>
    </div>
</template>