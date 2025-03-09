import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { describe } from 'vitest'
import HmsEditGroupModal from '../HmsEditGroupModal.vue'
import { it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

describe('HmsEditGroupModal', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let wrapper: VueWrapper
  let teleportTarget: HTMLElement
  const mockProp = {
    id: '1',
    name: 'Mock Hospital',
  }

  beforeEach(() => {
    setActivePinia(createPinia())

    wrapper = mount(HmsEditGroupModal, {
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

  it('asserting input text as per the prop data', async () => {
    expect(
      (document.body.querySelector('[data-test="input"]') as HTMLInputElement).value,
    ).toContain(mockProp.name)
  })
})
