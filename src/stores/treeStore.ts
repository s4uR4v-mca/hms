// src/stores/treeStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
  isExpanded?: boolean
}

export const useTreeStore = defineStore('tree', () => {
  // State
  const treeData = ref<TreeNode[]>([
    {
      id: '1',
      label: 'Root',
      isExpanded: true,
      children: [
        {
          id: '1-1',
          label: 'Item 1',
          children: [
            { id: '1-1-1', label: 'Subitem 1' },
            { id: '1-1-2', label: 'Subitem 2' },
          ],
        },
        {
          id: '1-2',
          label: 'Item 2',
          children: [{ id: '1-2-1', label: 'Subitem 1' }],
        },
        { id: '1-3', label: 'Item 3' },
      ],
    },
    {
      id: '2',
      label: 'Another Root',
      children: [{ id: '2-1', label: 'Item 1' }],
    },
  ])

  // Actions
  function toggleNodeExpansion(nodeId: string) {
    const toggleNode = (nodes: TreeNode[]): boolean => {
      for (const node of nodes) {
        if (node.id === nodeId) {
          node.isExpanded = !node.isExpanded
          return true
        }

        if (node.children && toggleNode(node.children)) {
          return true
        }
      }
      return false
    }

    toggleNode(treeData.value)
  }

  function addNode(parentId: string | null, newNode: TreeNode) {
    if (!parentId) {
      // Add to root level
      treeData.value.push(newNode)
      return
    }

    const addToParent = (nodes: TreeNode[]): boolean => {
      for (const node of nodes) {
        if (node.id === parentId) {
          if (!node.children) {
            node.children = []
          }
          node.children.push(newNode)
          return true
        }

        if (node.children && addToParent(node.children)) {
          return true
        }
      }
      return false
    }

    addToParent(treeData.value)
  }

  function deleteNode(nodeId: string) {
    const deleteFromNodes = (nodes: TreeNode[]): boolean => {
      const index = nodes.findIndex((node) => node.id === nodeId)

      if (index !== -1) {
        nodes.splice(index, 1)
        return true
      }

      for (const node of nodes) {
        if (node.children && deleteFromNodes(node.children)) {
          return true
        }
      }

      return false
    }

    deleteFromNodes(treeData.value)
  }

  function updateNode(nodeId: string, updates: Partial<TreeNode>) {
    const updateInNodes = (nodes: TreeNode[]): boolean => {
      for (const node of nodes) {
        if (node.id === nodeId) {
          Object.assign(node, updates)
          return true
        }

        if (node.children && updateInNodes(node.children)) {
          return true
        }
      }

      return false
    }

    updateInNodes(treeData.value)
  }

  // Get a specific node by id
  function getNodeById(nodeId: string): TreeNode | null {
    const findNode = (nodes: TreeNode[]): TreeNode | null => {
      for (const node of nodes) {
        if (node.id === nodeId) {
          return node
        }

        if (node.children) {
          const found = findNode(node.children)
          if (found) return found
        }
      }

      return null
    }

    return findNode(treeData.value)
  }

  return {
    treeData,
    toggleNodeExpansion,
    addNode,
    deleteNode,
    updateNode,
    getNodeById,
  }
})
