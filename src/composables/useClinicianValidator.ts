import { helpers, required } from '@vuelidate/validators'

export const useClinicianValidator = () => {
  const ruleAddEditClinician = {
    newFirstName: {
      required: helpers.withMessage('First name can not be empty', required),
    },
  }

  const ruleEditHospitalGroup = {
    updatedGroupName: {
      required: helpers.withMessage('Hospital group name can not be empty', required),
    },
  }

  const ruleNewHospitalGroup = {
    newGroupName: {
      required: helpers.withMessage('Hospital group name can not be empty', required),
    },
  }

  return {
    ruleAddEditClinician,
    ruleEditHospitalGroup,
    ruleNewHospitalGroup,
  }
}
