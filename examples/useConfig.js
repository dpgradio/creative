import configuration, { config } from '../src/config/config.js'

const appId = 'greety'
const stationIdA = 'qmusic_be'
const stationIdB = 'qmusic_nl'

await configuration.retrieveConfig(appId, stationIdA, stationIdB)

console.log(config('app')) // greety config of qmusic_be

configuration.setStation(stationIdB)

console.log(config('app')) // greety config of qmusic_nl
