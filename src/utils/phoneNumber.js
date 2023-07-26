import { config } from '../config/config.js'

const prefixes = {
  BE: '+32',
  NL: '+31',
}

export const removePhoneNumberCountryPrefix = (phoneNumber, prefix = null) => {
  prefix ||= prefixes[config('country_code')]

  if (prefix) {
    phoneNumber = phoneNumber.replace(`${prefix}.`, '0')
  }

  return phoneNumber.replace('.', '')
}
