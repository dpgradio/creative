import api from '../src/api/api.js'
import configuration from '../src/config/config.js'

// To add support for node <17.5, install node-fetch and include the following line
// global.fetch = await import('node-fetch').then((module) => module.default)

// Make sure you have set the DARIO_API_KEY environment variable
// Add the following to your .bashrc or .zshrc: `export DARIO_API_KEY=your-api-key`
// eslint-disable-next-line no-undef
api.setApiKey(process.env.DARIO_API_KEY)

configuration.replaceSchema('greety', [
  {
    name: 'display_language',
    type: 'options',
    default: 'dutch',
    options: ['dutch', 'english'],
  },
  {
    name: 'author_name',
    type: 'string',
  },
  {
    name: 'author_email',
    type: 'string',
  },
])
