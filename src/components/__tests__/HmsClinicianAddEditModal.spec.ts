import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { describe } from 'vitest'
import HmsClinicianAddEditModal from '../HmsClinicianAddEditModal.vue'
import { it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

describe('HmsClinicianAddEditModal', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let wrapper: VueWrapper
  let teleportTarget: HTMLElement
  const mockProp = {
    hospitalId: '1',
    hospitalName: 'Mock Hospital',
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
  }

  beforeEach(() => {
    setActivePinia(createPinia())

    wrapper = mount(HmsClinicianAddEditModal, {
      props: mockProp,
    })
    teleportTarget = document.createElement('div')
    teleportTarget.id = 'teleport-target'
    document.body.appendChild(teleportTarget)
  })

  it('renders the header', () => {
    const header = document.body.querySelector('[data-test="header"]')
    expect(header).toBeTruthy()
  })

  it('renders the footer', () => {
    const footer = document.body.querySelector('[data-test="footer"]')
    expect(footer).toBeTruthy()
  })

  it('assert first name input text as per the prop data', async () => {
    expect(
      (document.body.querySelector('[data-test="input-fname"]') as HTMLInputElement).value,
    ).toContain(mockProp.firstName)
  })

  it('assert last name input text as per the prop data', async () => {
    expect(
      (document.body.querySelector('[data-test="input-lname"]') as HTMLInputElement).value,
    ).toContain(mockProp.lastName)
  })
})
