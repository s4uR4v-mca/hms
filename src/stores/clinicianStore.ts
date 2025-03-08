import type { Clinician } from '@/models/clinician.dto'
import type { ICallback } from '@/types/callback.type'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

export const useClinicianStore = defineStore('clinician', () => {
  const clinicianData = useStorage<Clinician[]>('clinicians', [])

  const filteredData = ref<Clinician[]>([])

  function filterCliniciansForHospital(hospital_id: string, filter: string = '') {
    const findClinicians = (clinicians: Clinician[]) => {
      if (!clinicians.length) {
        filteredData.value = []
      }
      if (!filter) {
        filteredData.value = clinicians.filter((x) => x.hospital_id === hospital_id)
      }
      filteredData.value = clinicians.filter(
        (x) =>
          x.hospital_id === hospital_id &&
          (x.first_name.toLowerCase().includes(filter.toLowerCase()) ||
            x.last_name.toLowerCase().includes(filter.toLowerCase()) ||
            (x.first_name.toLowerCase() + ' ' + x.last_name.toLowerCase()).includes(
              filter.toLowerCase(),
            )),
      )
    }
    findClinicians(clinicianData.value)
  }

  function getClinicianById(nodeId: string): Clinician | null {
    const findNode = (clinicians: Clinician[]): Clinician | null => {
      for (const clinician of clinicians) {
        if (clinician.id === nodeId) {
          return clinician
        }
      }
      return null
    }
    return findNode(clinicianData.value)
  }

  function addClinician(newClinician: Clinician, callback: ICallback) {
    const addClinicianForHospital = (clinicians: Clinician[]): boolean => {
      clinicians.push(newClinician)
      return (
        clinicians.findIndex(
          (val) => val.id === newClinician.id && val.hospital_id === newClinician.hospital_id,
        ) > -1
      )
    }

    const result = addClinicianForHospital(clinicianData.value)
    callback(result)
  }

  function updateClinician(
    id: string,
    hospitalId: string,
    updates: Partial<Clinician>,
    callback: ICallback,
  ) {
    const updateClinicianForHospital = (clinicians: Clinician[]): boolean => {
      for (const clinician of clinicians) {
        if (clinician.id === id && clinician.hospital_id === hospitalId) {
          Object.assign(clinician, updates)
          return true
        }
      }
      return false
    }

    const result = updateClinicianForHospital(clinicianData.value)
    callback(result)
  }

  function deleteClinician(hospitalId: string, clinicianId: string, callback: ICallback) {
    if (!hospitalId) {
      return false
    }
    const deleteClinicianFromHospital = (clinicians: Clinician[]): boolean => {
      if (!clinicians.length) {
        return false
      }
      const index = clinicians.findIndex(
        (val) => val.id === clinicianId && val.hospital_id === hospitalId,
      )

      if (index !== -1) {
        clinicians.splice(index, 1)
        return true
      }

      return false
    }

    const result = deleteClinicianFromHospital(clinicianData.value)
    callback(result)
  }

  return {
    clinicianData,
    filteredData,
    filterCliniciansForHospital,
    getClinicianById,
    addClinician,
    updateClinician,
    deleteClinician,
  }
})
