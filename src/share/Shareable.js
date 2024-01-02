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

  async generateUsingImage(imageGeneratorProperties) {
    const response = await fetch('https://dba1du5ckc.execute-api.eu-west-3.amazonaws.com/prod/', {
      method: 'post',
      body: JSON.stringify({
        title: this.title,
        description: this.description,
        image_generator: imageGeneratorProperties.toJson(),
        redirect_url: this.redirectUrl,
        domain: this.domain,
      }),
    })
    const data = await response.json()
    return new ShareResult(this, data)
  }
}
