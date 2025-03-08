// src/stores/treeStore.ts
import type { HospitalGroupNode } from '@/model/hospital-group-node.dto'
import type { ICallback } from '@/types/callback.type'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHospitalStore = defineStore('hospital', () => {
  // State
  const treeData = ref<HospitalGroupNode[]>([
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
    const toggleNode = (nodes: HospitalGroupNode[]): boolean => {
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

  function addNode(parentId: string | null, newNode: HospitalGroupNode, callback: ICallback) {
    if (!parentId) {
      // Add to root level
      treeData.value.push(newNode)

      if (
        treeData.value.length > 0 &&
        treeData.value[treeData.value.length - 1].id === newNode.id
      ) {
        callback(true)
      } else {
        callback(false)
      }
    }

    const addToParent = (nodes: HospitalGroupNode[]): boolean => {
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

    const result = addToParent(treeData.value)
    callback(result)
  }

  function deleteNode(nodeId: string, callback: ICallback) {
    const deleteFromNodes = (nodes: HospitalGroupNode[]): boolean => {
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

    const result = deleteFromNodes(treeData.value)
    callback(result)
  }

  function updateNode(nodeId: string, updates: Partial<HospitalGroupNode>, callback: ICallback) {
    const updateInNodes = (nodes: HospitalGroupNode[]): boolean => {
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

    const result = updateInNodes(treeData.value)
    callback(result)
  }

  // Get a specific node by id
  function getNodeById(nodeId: string): HospitalGroupNode | null {
    const findNode = (nodes: HospitalGroupNode[]): HospitalGroupNode | null => {
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
