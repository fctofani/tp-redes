import net from 'net'

const client = new net.Socket()

const port = 7070
const host = '127.0.0.1'

client.connect(port, host, _ => {
  console.log('conectado')
  client.write(`oi de ${client.address().port}`)

  client.on('data', data => console.log(`servidor disse: ${data}`))

  client.on('close', _ => console.log('conexão encerrada'))

  client.on('error', err => console.log(`erro no server: ${err.message}`))
})
