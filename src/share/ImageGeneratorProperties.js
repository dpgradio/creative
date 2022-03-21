export default class ImageGeneratorProperties {
  constructor(url) {
    this.url = url
    this.width = 800
    this.height = 800
    this.payload = {}
  }

  withDimensions(width, height) {
    this.width = width
    this.height = height
    return this
  }

  withPayload(payload) {
    this.payload = payload
    return this
  }

  toJson() {
    return {
      url: this.url,
      width: this.width,
      height: this.height,
      payload: this.payload,
    }
  }
}
