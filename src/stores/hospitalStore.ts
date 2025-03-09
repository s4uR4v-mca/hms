import type { HospitalGroupNode } from '@/models/hospital-group-node.dto'
import type { ICallback } from '@/types/callback.type'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useHospitalStore = defineStore('hospital', () => {
  const hospitalGroupData = useStorage<HospitalGroupNode[]>('hospital-groups', [])

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

    toggleNode(hospitalGroupData.value)
  }

  function addNode(parentId: string | null, newNode: HospitalGroupNode, callback: ICallback) {
    if (!parentId) {
      // Add to root level
      hospitalGroupData.value.push(newNode)

      if (
        hospitalGroupData.value.length > 0 &&
        hospitalGroupData.value[hospitalGroupData.value.length - 1].id === newNode.id
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

    const result = addToParent(hospitalGroupData.value)
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

    const result = deleteFromNodes(hospitalGroupData.value)
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

    const result = updateInNodes(hospitalGroupData.value)
    callback(result)
  }

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

    return findNode(hospitalGroupData.value)
  }

  return {
    hospitalGroupData,
    toggleNodeExpansion,
    addNode,
    deleteNode,
    updateNode,
    getNodeById,
  }
})
