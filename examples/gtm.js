import { configuration, dataLayer, privacy } from '../src/index.js'

async function testGTMAndPrivacy() {
  const stationId = 'qmusic_be'
  await configuration.retrieveConfigForStation(stationId)
  console.log('Configuration retrieved:', configuration.config())

  // Generate a random nonce (in a real scenario, this should be generated server-side)
  // const nonce = Math.random().toString(36).substring(2, 15);
  const nonce = 'abcd1234'
  // Initialize dataLayer with the nonce
  dataLayer.initialize({ nonce: nonce })

  // Push a custom event to test
  dataLayer.pushEvent('test_event', { message: 'Hello, GTM!' })

  console.log('GTM initialized with nonce:', nonce)

  // Initialize privacy settings with default values and nonce
  privacy.initialize(undefined, undefined, undefined, { nonce: nonce })

  console.log('Privacy settings initialized')
}

testGTMAndPrivacy()
