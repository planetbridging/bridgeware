require('dotenv').config()

const { encrypt, decrypt } = require('./crypto')
var uuid = require('uuid')

const httpServer = require('http').createServer()
const io = require('socket.io')(httpServer, {
  // ...
})

async function startServer (mongoServer) {
  io.on('connection', socket => {
    var tk = uuid.v4()
    var secretKey = tk
    var txt_test = encrypt(secretKey, 'Hello from socket shannon')
    socket.emit('setup', secretKey)
    socket.emit('connected', txt_test)
    console.log('client connected')
    socket.on('cpeSearch', async data => {
      var de = decrypt(secretKey, data)
      var j = JSON.parse(de)
      var keys = Object.keys(j)
      if (keys.includes('cpe')) {
        var lst = await mongoServer.cpeSearch(j['cpe'])

        var enData = encrypt(secretKey, JSON.stringify({ lst: lst }))
        socket.emit('cpeSearch', enData)
      }
    })

    socket.on('lstCpeCollections', async data => {
      var lst = await mongoServer.listCollections('cpeSearch')

      var enData = encrypt(secretKey, JSON.stringify({ lst: lst }))
      socket.emit('lstCpeCollections', enData)
    })

    //listCollections
  })

  httpServer.listen(8123)
}

module.exports = {
  startServer
}
