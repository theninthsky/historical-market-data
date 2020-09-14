String.prototype.toTitleCase = function () {
  return this.toLowerCase()
    .split(' ')
    .map(([first, ...rest]) => `${first.toUpperCase()}${rest.join('')}`)
    .join(' ')
}
