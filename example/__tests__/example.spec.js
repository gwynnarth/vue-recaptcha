import VueRecaptcha from '../../src'
import { mount } from '@vue/test-utils'

const WIDGET_ID = 'widgetId'

function createMock() {
  return {
    render: jest.fn(function (ele, options) {
      // Save the callback
      this._verify = options.callback
      this._expire = options['expired-callback']
      return WIDGET_ID
    }),
    execute: jest.fn(function () {
      this._verify()
    }),
    reset: jest.fn(),
  }
}

describe.each([[false], [true]])('Example spec', isEnterprise => {
  let wrapper
  let verify
  let expired
  let mockedGrecaptcha
  beforeEach(() => {
    if (isEnterprise) {
      mockedGrecaptcha = window.grecaptcha.enterprise = createMock()
    } else {
      mockedGrecaptcha = window.grecaptcha = createMock()
    }

    verify = jest.fn()
    expired = jest.fn()
    wrapper = mount(VueRecaptcha, {
      propsData: { sitekey: 'sitekey', enterprise: isEnterprise },
    })
    wrapper.vm.$on('verify', verify)
    wrapper.vm.$on('expired', expired)
  })

  it('Should render recaptcha', () => {
    expect(mockedGrecaptcha.render).toBeCalled()
    expect(wrapper.vm.$widgetId).toBe(WIDGET_ID)
  })

  it('Should call execute', () => {
    wrapper.vm.execute()
    expect(mockedGrecaptcha.execute).toBeCalledWith(WIDGET_ID)
  })

  it('Should call reset', () => {
    wrapper.vm.reset()
    expect(mockedGrecaptcha.reset).toBeCalledWith(WIDGET_ID)
  })

  it('Should emit verify', () => {
    mockedGrecaptcha._verify()
    expect(verify).toBeCalled()
  })

  it('Should emit expired', () => {
    mockedGrecaptcha._expire()
    expect(expired).toBeCalled()
  })
})
