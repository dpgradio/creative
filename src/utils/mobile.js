import { config } from '../config/config'

export const removeCountryPrefix = (mobile, prefix) => {
  if (!prefix) {
    switch (config('country_code')) {
      case 'BE':
        prefix = '+32'
        break
      case 'NL':
        prefix = '+31'
        break
    }
  }
  if (prefix) {
    mobile = mobile.replace(`${prefix}.`, '0')
  }
  mobile = mobile.replace('.', '')

  return mobile
}
