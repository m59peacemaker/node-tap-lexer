const fs     = require('fs')
const path   = require('path')

const getFixture = name => {
  return fs.readFileSync(path.join(__dirname, '../', 'fixtures', name), 'utf8')
}

module.exports = getFixture
