import fs from 'fs'

const wordManager = {
  generateWordArray () {
    const fileContent = fs.readFileSync('src/client/entrada.txt', 'utf-8')
    const wordArray = fileContent.split(/\r?\n/)
    return wordArray
  },
  fileWr (number, arr) {
    fs.writeFileSync(`src/outputs/${number}.txt`, arr.join('\n'))
  }
}

export default wordManager
