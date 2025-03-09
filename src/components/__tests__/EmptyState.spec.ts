import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { describe } from 'vitest'
import EmptyState from '../EmptyState.vue'
import { it } from 'vitest'

describe('EmptyState', () => {
  let wrapper: VueWrapper
  const mockProp = {
    header: 'No Data',
    msg: 'Something went wrong',
  }

  beforeEach(() => {
    wrapper = mount(EmptyState, {
      props: mockProp,
    })
  })

  it('renders the props header text', () => {
    const header = wrapper.find('[data-test="header"]')
    expect(header.text()).toContain(mockProp.header)
  })

  it('renders the props message text', () => {
    const message = wrapper.find('[data-test="message"]')
    expect(message.text()).toContain(mockProp.msg)
  })
})
