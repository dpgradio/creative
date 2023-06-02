// eslint-disable-next-line import/no-unresolved -- TODO: Needs a rewrite to fetch
import axios from 'axios'
import ShareResult from './ShareResult.js'

export default class Shareable {
  constructor() {
    this.title = ''
    this.description = ''
    this.messageText = ''
    this.redirectUrl = ''
    this.domain = ''
  }

  withTitle(title) {
    this.title = title
    return this
  }

  withDescription(description) {
    this.description = description
    return this
  }

  withMessageText(messageText) {
    this.messageText = messageText
    return this
  }

  redirectTo(redirectUrl) {
    this.redirectUrl = redirectUrl
    return this
  }

  fromDomain(domain) {
    this.domain = domain
    return this
  }

  generateUsingImage(imageGeneratorProperties) {
    return new Promise((resolve, reject) => {
      axios({
        url: 'https://dba1du5ckc.execute-api.eu-west-3.amazonaws.com/prod/',
        method: 'post',
        data: {
          title: this.title,
          description: this.description,
          image_generator: imageGeneratorProperties.toJson(),
          redirect_url: this.redirectUrl,
          domain: this.domain,
        },
      })
        .then((response) => resolve(new ShareResult(this, response.data)))
        .catch(reject)
    })
  }
}
