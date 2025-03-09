import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { describe } from 'vitest'
import HmsAddGroupModal from '../HmsAddGroupModal.vue'
import { it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

describe('HmsAddGroupModal', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let wrapper: VueWrapper
  let teleportTarget: HTMLElement
  const mockProp = {
    parentId: null,
    isRoot: true,
  }

  beforeEach(() => {
    setActivePinia(createPinia())

    wrapper = mount(HmsAddGroupModal, {
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

  it('render label text for parent', () => {
    expect(
      (document.body.querySelector('[data-test="label"]') as HTMLParagraphElement)?.textContent,
    ).toBe('Enter the patent group name')
  })
})
