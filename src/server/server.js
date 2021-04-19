import net from 'net'
import dataParser from '../utils/parsers.js'

const server = net.createServer()

const port = 7070
const host = '127.0.0.1'

const sockets = []
const connections = []

server.listen(port, host, _ => {
  console.log(`servidor iniciado na porta ${port}.`)
})

server.on('connection', socket => {
  console.log(`\n-> Nova conexão \n endereço: ${socket.remoteAddress} \n port: ${socket.remotePort} \n`)
  sockets.push(socket)

  if (sockets.length === 4) sockets[0].write('start')

  socket.on('data', async data => {
    const sentValue = data.toString()
    if (dataParser.dataType(sentValue) === 'word') {
      let receiver
      do {
        receiver = sockets[Math.floor(Math.random() * sockets.length)]
      } while (receiver.remotePort === socket.remotePort)

      const conn = {
        sender: socket,
        sentMsg: sentValue,
        receiver: receiver
      }
      console.log('--------------')
      console.log(conn.sender.remotePort)
      console.log(conn.receiver.remotePort)
      console.log('===============')
      connections.push(conn)
      await receiver.write(sentValue)
      console.log('WORD: ', sentValue)
    } else if (dataParser.dataType(sentValue) === 'response') {
      const index = connections.findIndex(conn => conn.receiver === socket)
      const sender = connections[index].sender
      connections.splice(index, 1)
      await sender.write(sentValue)
      console.log('RESPONSE: ', sentValue)
    }
  })

  socket.on('close', _ => {
    const index = sockets.findIndex((i) => i.remotePort === socket.remotePort && i.remoteAddress === socket.remoteAddress)
    if (index !== -1) sockets.splice(index, 1)
    console.log(`\n-> conexão com ${socket.remotePort} fechada!`)
  })

  socket.on('error', err => {
    console.log(`erro no client ${socket.remotePort}: ${err.message} \n`)
  })
})
