export const state = () => ({
  aside: {
    minimize: false,
    on: false
  },
  timezoneOffset: 0
})

export const mutations = {
  setAsideMinimize(state, minimize) {
    state.aside.minimize = minimize
  },
  setAsideOn(state, value) {
    state.aside.on = value
  },
  setTimezoneOffset(state, value) {
    state.timezoneOffset = value
  }
}

export const getters = {
  getTimezoneOffset(state) {
    return state.timezoneOffset
  }
}
