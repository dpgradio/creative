import api from '../src/api/api.js'
import configuration from '../src/config/config.js'

const appId = 'greety'
const stationId = 'qmusic_be'

await configuration.retrieveConfig(appId, stationId)

const channels = await api.channels.all()

console.log(channels)

const token = '<radio-token-here>'
const profile = await api.setRadioToken(token).members.me()

console.log(profile)
