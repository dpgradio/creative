import { config } from '../config/config'

export const removeCountryPrefix = (mobile, localPhoneNumberPrefix = config('phone_number_prefix')) => {
  if (localPhoneNumberPrefix) {
    mobile = mobile.replace(`${localPhoneNumberPrefix}.`, '0')
  }
  mobile = mobile.mobile.replace('.', '')

  return mobile
}
