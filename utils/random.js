export const makeId = (length) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return 'tag-selection-' + result
}

export const generateUniqueId = () => {
  const randomPart = Math.random()
    .toString(36)
    .substr(2, 8)
  const timestampPart = Date.now().toString(36)
  const uniqueId = randomPart + timestampPart
  return uniqueId
}
