import { VueWrapper, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HmsTree from '../HmsTree.vue'
import { beforeEach } from 'vitest'
// import { createPinia, setActivePinia } from 'pinia'

describe('HmsTree', () => {
  const sample = [
    {
      id: '1',
      label: 'Hospital 1',
      children: [
        {
          id: '3',
          label: 'Hospital 3',
          children: [],
          isExpanded: false,
        },
      ],
      isExpanded: false,
    },
    {
      id: '2',
      label: 'Hospital 2',
      children: [],
      isExpanded: false,
    },
  ]
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(HmsTree, {
      props: {
        nodes: sample,
        indent: 6,
        level: 1,
      },
    })
  })

  it('renders first tree node element label', () => {
    expect(wrapper.text()).toContain(sample[0].label)
  })

  it('renders all the root nodes', () => {
    const roots = wrapper.findAll('[data-test="root"]')
    expect(roots.length).toBe(sample.length)
  })

  it('renders tree level expand-collapse toggles', () => {
    // This is for nodes having children
    // Asserting when no child is present the expand-collapse icons are not shown
    const toggles = wrapper.findAll('[data-test="toggle"]')
    expect(toggles.length).toBe(sample.filter((x) => x.children.length > 0).length)
  })

  it('renders collapsed icon for the first item', () => {
    // Asserting the first node of the tree should collapsed icon as per the sample input
    const collapsedIcons = wrapper.findAll('[data-test="icon-collapsed"]')
    expect(collapsedIcons.length).toBe(sample.filter((x) => x.children.length > 0).length)
  })

  it('fire expected emit on toggle click', async () => {
    const toggleElement = wrapper.find('[data-test="toggle"]')
    await toggleElement.trigger('click')
    expect(wrapper.emitted('nodeToggle')).toBeTruthy()
  })

  it('check the emitted params count on toggle click', async () => {
    const toggleElement = wrapper.find('[data-test="toggle"]')
    await toggleElement.trigger('click')
    expect(wrapper.emitted('nodeToggle')?.length).toBe(1)
  })

  it('check the emitted param value on toggle click', async () => {
    const toggleElement = wrapper.find('[data-test="toggle"]')
    await toggleElement.trigger('click')
    expect(wrapper.emitted('nodeToggle')?.[0][0]).toBe(sample[0].id)
  })

  it('fire expected emit on option click', async () => {
    const optionElement = wrapper.find('[data-test="option-icon"]')
    await optionElement.trigger('click')
    expect(wrapper.emitted('optionClick')).toBeTruthy()
  })

  it('check the emitted params count on option click', async () => {
    const optionElement = wrapper.find('[data-test="option-icon"]')
    await optionElement.trigger('click')
    expect(wrapper.emitted('optionClick')?.[0].length).toBe(2)
  })

  it('check the emitted param values on option click', async () => {
    const optionElement = wrapper.find('[data-test="option-icon"]')
    await optionElement.trigger('click')
    expect(wrapper.emitted('optionClick')?.[0][0]).toStrictEqual(sample[0])
  })
})
