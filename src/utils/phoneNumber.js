import { config } from '../config/config'

const prefixes = {
  BE: '+32',
  NL: '+31',
}

export const removeCountryPrefix = (phoneNumber, prefix = null) => {
  prefix ||= prefixes[config('country_code')]

  if (prefix) {
    phoneNumber = phoneNumber.replace(`${prefix}.`, '0')
  }

  return phoneNumber.replace('.', '')
}
