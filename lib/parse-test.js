const isOk = (part) => {
  const regex = /^((not )?ok)/
  const matches = part.match(regex)
  return matches[1] === 'ok'
}

const getPoint = (part) => {
  const regex = /^(not )?ok (\d+) ?/
  const matches = part.match(regex)
  if (matches && matches[2]) {
    return Number(matches[2])
  }
}

const getDescription = (part) => {
  part = part.split(/ # \w+/)[0]
  const regex = /^(not )?ok( \d+)?( (.+))?/
  const matches = part.match(regex)
  if (matches) {
    return matches[4]
  }
}

const getDirective = part => {
  const matches = part.match(/ # (\w+)( (.+))?/)
  return !matches ? matches : {
    name: matches[1].toLowerCase(),
    message: matches[3]
  }
}

const parseTest = part => {
  const result = {
    ok: false,
    point: undefined,
    description: undefined,
    skip: undefined,
    todo: undefined
  }
  result.ok = isOk(part)
  result.point = getPoint(part)
  result.description = getDescription(part)
  const directive = getDirective(part)
  if (directive) {
    result[directive.name] = directive.message || true
  }
  return result
}

module.exports = parseTest
