export default {
  getValue (k) {
    return this[k]
  },
  setValue (k, v) {
    this[k] = v
  }
}
