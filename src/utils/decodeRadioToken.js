import jwtDecode from 'jwt-decode'

export default function decodeRadioToken(token) {
  return jwtDecode(token)
}
