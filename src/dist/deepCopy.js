function deepCopy (obj) {
  const res = Array.isArray(obj) ? [] : {}
  for (const prop in obj) {
    if (obj[prop] instanceof Object) {
      res[prop] = deepCopy(obj[prop])
    } else {
      res[prop] = obj[prop]
    }
  }
  return res
}

export default deepCopy
