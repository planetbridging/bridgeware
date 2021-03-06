const http = require('http')
const https = require('https')
var express = require('express')
var cors = require('cors')
var uuid = require('uuid'),
  app = express(),
  server = require('http').createServer(app)
const axios = require('axios').default

const { encrypt, decrypt } = require('./helpers/crypto')

const obj = require('./objs')
const { sleep } = require('./helpers/mixed')

var port = 80

const httpServer = require('http').createServer()
const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

;(async () => {
  console.log('welcome to the bridgeware')

  /*var tk = uuid.v4()

  var secretKey = tk

  var txt_test = encrypt(secretKey, 'Hello from socket shannon')
  console.log(txt_test)*/
  startServer()
  console.log('setup complete')
})()

async function startServer () {
  io.on('connection', socket => {
    var tk = uuid.v4()
    var secretKey = tk
    var txt_test = encrypt(secretKey, 'Hello from socket shannon')
    socket.emit('setup', secretKey)
    socket.emit('connected', txt_test)

    var cpelookup = new obj.objCpelookup(socket, secretKey)
    //await cpelookup.searchCpe('a:apache:http_server:2')
    /*await sleep(1000)
     */
  })

  httpServer.listen(800)
}

app.use('/', express.static(__dirname + '/build/'))

server.listen(port, function () {
  console.log('listening on *:' + port)
})
