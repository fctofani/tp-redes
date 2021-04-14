import net from 'net'

const server = net.createServer()

const port = 7070
const host = '127.0.0.1'

const sockets = []

server.listen(port, host, _ => {
  console.log(`servidor iniciado na porta ${port}.`)
})

server.on('connection', socket => {
  console.log(`\n-> Nova conexão \n endereço: ${socket.remoteAddress} \n port: ${socket.remotePort} \n`)
  sockets.push(socket)

  socket.on('data', data => {
    console.log(`-> Dados recebidos de ${socket.remotePort}: \n ${data} \n`)
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
