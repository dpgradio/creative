import api from '../src/api/api'
import configuration from '../src/config/config'

const main = async () => {
  const appId = 'greety'
  const stationId = 'qmusic_be'

  await configuration.retrieveConfig(appId)
  configuration.setStation(stationId)

  const channels = await api.channels.all()

  console.log(channels)

  const token = '<radio-token-here>'
  const profile = await api.setRadioToken(token).members.me()

  console.log(profile)
}

main()
