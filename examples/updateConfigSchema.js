import api from '../src/api/api'
import configuration from '../src/config/config'

const main = async () => {
  api.setApiKey('<api-token-here>')

  await configuration.replaceSchema('greety', [
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
}

main()
