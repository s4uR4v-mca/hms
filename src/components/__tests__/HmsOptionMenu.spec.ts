import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { describe } from 'vitest'
import HmsOptionMenu from '../HmsOptionMenu.vue'
import { it } from 'vitest'

describe('HmsOptionMenu', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(HmsOptionMenu)
  })

  it('check the emit edit group option click', async () => {
    const listItem = wrapper.find('[data-test="edit-group"]')
    await listItem.trigger('click')
    expect(wrapper.emitted('onEditGroup')).toBeTruthy()
  })

  it('check the emit create child group option click', async () => {
    const listItem = wrapper.find('[data-test="create-child-group"]')
    await listItem.trigger('click')
    expect(wrapper.emitted('onCreateChildGroup')).toBeTruthy()
  })

  it('check the emit add/remove clinician option click', async () => {
    const listItem = wrapper.find('[data-test="add-remove-clinicians"]')
    await listItem.trigger('click')
    expect(wrapper.emitted('onAddRemoveClinician')).toBeTruthy()
  })

  it('check the emit remove group option click', async () => {
    const listItem = wrapper.find('[data-test="remove-group"]')
    await listItem.trigger('click')
    expect(wrapper.emitted('onRemoveGroup')).toBeTruthy()
  })
})
