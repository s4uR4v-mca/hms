import { VueWrapper, mount } from '@vue/test-utils'
import { beforeEach, expect, it } from 'vitest'
import { describe } from 'vitest'
import HomeView from '@/views/HomeView.vue'
import { createPinia, setActivePinia } from 'pinia'
import HmsNewGroupModal from '../HmsAddGroupModal.vue'

describe('HomeView', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(HomeView)
  })

  it('renders the empty state initially', () => {
    const tree = wrapper.find('[data-test="empty-state"]')
    expect(tree.exists()).toBe(true)
  })

  it('renders add hospital group button', async () => {
    const addRootNodeBtn = wrapper.find('[data-test="add-root-btn"]')
    expect(addRootNodeBtn.exists()).toBe(true)
  })

  it('check add group button click', async () => {
    const addRootNodeBtn = wrapper.find('[data-test="add-root-btn"]')
    await addRootNodeBtn.trigger('click')
    const hmsNewGroupModal = wrapper.findComponent(HmsNewGroupModal)

    expect(hmsNewGroupModal.exists()).toBe(true)
  })
})
