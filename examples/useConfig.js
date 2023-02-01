import configuration, { config } from '../src/config/config'

const main = async () => {
  const appId = 'greety'
  const stationId = 'qmusic_be'

  await configuration.retrieveConfig(appId)
  configuration.setStation(stationId)

  console.log(config('app'))
}

main()
