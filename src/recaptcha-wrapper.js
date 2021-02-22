import defer from './defer'

const ownProp = Object.prototype.hasOwnProperty

export function createRecaptcha() {
  const deferred = defer()
  let enterprise = false

  const getGrecaptchaObject = () => {
    if (enterprise) {
      return window.grecaptcha.enterprise
    }

    return window.grecaptcha
  }

  return {
    notify() {
      deferred.resolve()
    },

    wait() {
      return deferred.promise
    },

    setEnterprise(isEnterprise) {
      enterprise = isEnterprise
    },

    render(ele, options, cb) {
      this.wait().then(() => {
        cb(getGrecaptchaObject().render(ele, options))
      })
    },

    reset(widgetId) {
      if (typeof widgetId === 'undefined') {
        return
      }

      this.assertLoaded()
      this.wait().then(() => getGrecaptchaObject().reset(widgetId))
    },

    execute(widgetId) {
      if (typeof widgetId === 'undefined') {
        return
      }

      this.assertLoaded()
      this.wait().then(() => getGrecaptchaObject().execute(widgetId))
    },

    checkRecaptchaLoad() {
      if (ownProp.call(window, 'grecaptcha') && ownProp.call(getGrecaptchaObject(), 'render')) {
        this.notify()
      }
    },

    assertLoaded() {
      if (!deferred.resolved()) {
        throw new Error('ReCAPTCHA has not been loaded')
      }
    },
  }
}

const recaptcha = createRecaptcha()

if (typeof window !== 'undefined') {
  window.vueRecaptchaApiLoaded = recaptcha.notify
}

export default recaptcha
