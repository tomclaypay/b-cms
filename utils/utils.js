export function removeCSSClass(ele, cls) {
  const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
  ele.className = ele.className.replace(reg, ' ')
}

export function addCSSClass(ele, cls) {
  ele.classList.add(cls)
}

export const toAbsoluteUrl = (pathname) => process.env.PUBLIC_URL + pathname

export function setupAxios(axios, store) {
  axios.interceptors.request.use(
    (config) => {
      const {
        auth: { authToken }
      } = store.getState()

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`
      }

      return config
    },
    (err) => Promise.reject(err)
  )
}

/*  removeStorage: removes a key from localStorage and its sibling expiracy key
    params:
        key <string>     : localStorage key to remove
    returns:
        <boolean> : telling if operation succeeded
 */
export function removeStorage(key) {
  try {
    localStorage.setItem(key, '')
    localStorage.setItem(key + '_expiresIn', '')
  } catch (e) {
    return false
  }
  return true
}

/*  getStorage: retrieves a key from localStorage previously set with setStorage().
    params:
        key <string> : localStorage key
    returns:
        <string> : value of localStorage key
        null : in case of expired key or failure
 */
export function getStorage(key) {
  const now = Date.now() // epoch time, lets deal only with integer
  // set expiration for storage
  let expiresIn = localStorage.getItem(key + '_expiresIn')
  if (expiresIn === undefined || expiresIn === null) {
    expiresIn = 0
  }

  expiresIn = Math.abs(expiresIn)
  if (expiresIn < now) {
    // Expired
    removeStorage(key)
    return null
  } else {
    try {
      const value = localStorage.getItem(key)
      return value
    } catch (e) {
      return null
    }
  }
}
/*  setStorage: writes a key into localStorage setting a expire time
    params:
        key <string>     : localStorage key
        value <string>   : localStorage value
        expires <number> : number of seconds from now to expire the key
    returns:
        <boolean> : telling if operation succeeded
 */
export function setStorage(key, value, expires) {
  if (expires === undefined || expires === null) {
    expires = 24 * 60 * 60 // default: seconds for 1 day
  }

  const now = Date.now() // millisecs since epoch time, lets deal only with integer
  const schedule = now + expires * 1000
  try {
    localStorage.setItem(key, value)
    localStorage.setItem(key + '_expiresIn', schedule)
  } catch (e) {
    return false
  }
  return true
}

export function setSession(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    return false
  }
  return true
}

export function getSession(key) {
  try {
    const value = sessionStorage.getItem(key)
    return JSON.parse(value)
  } catch (e) {
    return null
  }
}

export const getServerErrors = (errors) => {
  let errorMessage = 'Có lỗi xảy ra vui lòng thử lại sau!'
  if (errors?.response) {
    const error = errors.response.data.message
    console.log(error)
    if (Array.isArray(error)) {
      errorMessage = error[0]
    } else {
      errorMessage = error
    }
  }
  return errorMessage
}

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

export const generateRandomString = (length) => {
  const charSet =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let randomString = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = getRandomInt(0, charSet.length)
    randomString += charSet[randomIndex]
  }
  return randomString
}
