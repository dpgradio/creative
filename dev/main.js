import { socket } from '@dpgradio/creative'

const output = document.getElementById('output')

function log(...args) {
  const timestamp = new Date().toLocaleTimeString()
  const message = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))).join(' ')

  output.textContent += `[${timestamp}] ${message}\n`
  output.scrollTop = output.scrollHeight
}

window.testSocket = function () {
  log('Connecting to Qmusic socket...')
  const connection = socket.connect('qmusic_be', 'https://socket.qmusic.be/api', {
    debug: true,
  })

  connection.subscribe('plays').on('play', log, { backlog: 1 })
}
