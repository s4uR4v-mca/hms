<script setup lang="ts">
import { useTreeStore, type TreeNode } from '@/stores/treeStore';
import TreeView from '@/components/TreeView.vue';
import { ref } from 'vue';

// Use the tree store
const treeStore = useTreeStore();

// Node editing functionality
const isEditing = ref(false);
const editingNode = ref<{ id: string; label: string } | null>(null);
const newNodeParentId = ref<string | null>(null);
const newNodeLabel = ref('');

// Event handlers
function handleNodeClick(node: TreeNode) {
    // Set the node for editing
    editingNode.value = { id: node.id, label: node.label };
    isEditing.value = true;
    newNodeParentId.value = null;
}

function handleNodeToggle(nodeId: string) {
    treeStore.toggleNodeExpansion(nodeId);
}

function updateNodeLabel() {
    if (editingNode.value) {
        treeStore.updateNode(editingNode.value.id, { label: editingNode.value.label });
        isEditing.value = false;
        editingNode.value = null;
    }
}

function addNewNode() {
    if (newNodeLabel.value.trim()) {
        const newNode: TreeNode = {
            id: `node-${Date.now()}`, // Generate a unique ID
            label: newNodeLabel.value
        };

        treeStore.addNode(newNodeParentId.value, newNode);
        newNodeLabel.value = '';
        newNodeParentId.value = null;
    }
}

function prepareAddNode(parentId: string | null) {
    newNodeParentId.value = parentId;
    isEditing.value = false;
    editingNode.value = null;
}

function deleteCurrentNode() {
    if (editingNode.value) {
        treeStore.deleteNode(editingNode.value.id);
        isEditing.value = false;
        editingNode.value = null;
    }
}
</script>

<template>
    <div class="p-4 max-w-md mx-auto">
        <h1 class="text-2xl font-bold mb-4">Tree View with Vertical Lines</h1>

        <div class="mb-4 flex space-x-2">
            <button @click="prepareAddNode(null)" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                Add Root Node
            </button>
        </div>

        <!-- Node editing form -->
        <div v-if="isEditing" class="mb-4 p-3 border rounded bg-gray-50">
            <h3 class="font-bold mb-2">Edit Node</h3>
            <input v-model="editingNode.label" class="border p-1 w-full mb-2 rounded" v-if="editingNode" />
            <div class="flex space-x-2">
                <button @click="updateNodeLabel" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                    Update
                </button>
                <button @click="deleteCurrentNode" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    Delete
                </button>
                <button @click="prepareAddNode(editingNode?.id ?? null)"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                    Add Child
                </button>
            </div>
        </div>

        <!-- New node form -->
        <div v-if="newNodeParentId !== null" class="mb-4 p-3 border rounded bg-gray-50">
            <h3 class="font-bold mb-2">
                Add {{ newNodeParentId ? 'Child' : 'Root' }} Node
            </h3>
            <input v-model="newNodeLabel" placeholder="Node name" class="border p-1 w-full mb-2 rounded" />
            <div class="flex space-x-2">
                <button @click="addNewNode" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                    Add
                </button>
                <button @click="newNodeParentId = null"
                    class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded">
                    Cancel
                </button>
            </div>
        </div>

        <!-- TreeView component with vertical lines -->
        <div class="border rounded p-4 bg-white shadow-sm">
            <div class="font-sans select-none">
                <TreeView :nodes="treeStore.treeData" @node-click="handleNodeClick" @node-toggle="handleNodeToggle" />
            </div>
        </div>
    </div>
</template>