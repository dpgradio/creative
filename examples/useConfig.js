import configuration, { config } from '../src/config/config.js'

global.window = { location: { hostname: 'qmusic.nl', search: '' } }

const appId = 'player'
const stationIdA = 'qmusic_be'
const stationIdB = 'qmusic_nl'

await configuration.retrieveConfigForDetectedStation()
console.log(config()) // global config

await configuration.retrieveConfigForDetectedStation(appId)
console.log(config('app')) // player config of qmusic_be

await configuration.retrieveConfigForStations([stationIdA, stationIdB], appId)
configuration.setStation(stationIdB)
console.log(config('app')) // player config of qmusic_nl
