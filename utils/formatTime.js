import moment from 'moment'
// import { getters } from '~/store/layoutConfig'

export const formatTimeNormal = (time) => {
  return time ? moment(time, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : ''
}

export const formatDateTime = (time) => {
  return moment(time, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
}

export const formatDateTimeNormal = (time) => {
  return moment(time).format('DD/MM/YYYY HH:mm')
}

export const formatDate = (time) => {
  return moment(time).format('DD/MM/YYYY')
}

// từ timezone đã chọn đổi ra giờ hiện tại(timezone hiện tại của trình duyệt)
export const convertToNewTimezone = (time) => {
  const currentTz =
    window.$nuxt.$store.getters['layoutConfig/getTimezoneOffset']
  const newTz = 0 - new Date().getTimezoneOffset() / 60

  const diffHourTz = newTz - currentTz
  return moment(time)
    .add(diffHourTz, 'hours')
    .toISOString()
}
