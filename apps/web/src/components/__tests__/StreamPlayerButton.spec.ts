import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { FunctionalComponent } from 'vue'

import StreamPlayerButton from '../StreamPlayerButton.vue'

const MockIcon: FunctionalComponent = () => 'Mock Icon'

describe('StreamPlayerButton', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(StreamPlayerButton, {
      props: {
        icon: MockIcon,
        onClick: vi.fn(),
      },
    })

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.html()).toContain('Mock Icon')
  })

  it('applies active class when isActive is true', () => {
    const wrapper = mount(StreamPlayerButton, {
      props: {
        isActive: true,
        icon: MockIcon,
        onClick: vi.fn(),
      },
    })
    expect(wrapper.find('button').classes()).toContain('bg-neutral-800')
  })

  it('calls onClick when button is clicked', async () => {
    const onClickMock = vi.fn()
    const wrapper = mount(StreamPlayerButton, {
      props: {
        icon: MockIcon,
        onClick: onClickMock,
      },
    })
    await wrapper.find('button').trigger('click')
    expect(onClickMock).toHaveBeenCalled()
  })
})
