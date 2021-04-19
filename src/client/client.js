import net from 'net'
import dataParser from '../utils/parsers.js'
import wordManager from './words.js'

const port = 7070
const host = '127.0.0.1'

// const min = 5
// const max = 10
let qtdWrites = 10 // Math.floor(Math.random() * (max - min)) + min

const words = wordManager.generateWordArray()
const writewords = []
const responses = []

const clientMethods = {
  countChars (word) {
    const vowelsRegex = /[aeiou]/gi
    const consonantsRegex = /[bcdfghjklmnpqrstvwxyz]/gi
    const numberRegex = /\d/g

    const arrVowels = word.match(vowelsRegex)
    const arrConsonants = word.match(consonantsRegex)
    const arrNumbers = word.match(numberRegex)

    const vowels = arrVowels === null ? 0 : arrVowels.length
    const consonants = arrConsonants === null ? 0 : arrConsonants.length
    const numbers = arrNumbers === null ? 0 : arrNumbers.length

    return { C: consonants, V: vowels, N: numbers }
  }
}

const client = net.createConnection(port, host, _ => {
  console.log('conectado')
  for (let index = 0; index < qtdWrites; index++) {
    const word = words[Math.floor(Math.random() * words.length)]
    writewords.push(word)
  }
  client.setTimeout(Math.floor(Math.random() * (12000 - 8000) + 8000))
  console.log(writewords)
})

client.on('data', resp => {
  const data = resp.toString()
  switch (dataParser.dataType(data)) {
    case 'first':
      client.write(writewords[0], writewords.splice(0, 1))
      qtdWrites--
      break
    case 'word':
      console.log(data)
      client.write(dataParser.parseResponse(clientMethods.countChars(data)))
      break
    case 'response':
      console.log(data)
      responses.push(data)
      if (qtdWrites > 0) {
        client.write(writewords[0], writewords.splice(0, 1))
        qtdWrites--
      }
      break
    default:
      console.log('err')
      break
  }
})

client.on('timeout', _ => {
  if (qtdWrites > 0) {
    client.write(writewords[0], writewords.splice(0, 1))
    qtdWrites--
  }
})

client.on('close', _ => wordManager.fileWr(String(Math.floor(Math.random() * 10000)), responses))

client.on('error', err => console.log(`erro no server: ${err.message}`))
