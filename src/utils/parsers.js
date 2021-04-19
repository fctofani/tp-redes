const dataParser = {
  parseResponse (response) {
    return `C=${response.C};V=${response.V};N=${response.N};`
  },
  dataType (data) {
    const regex = /^C=\d+;V=\d+;N=\d+;/
    const firstRegex = /^start/
    const types = ['first', 'response', 'word']

    if (data.match(firstRegex)) return types[0]
    else if (data.match(regex)) return types[1]
    else return types[2]
  }
}

export default dataParser
