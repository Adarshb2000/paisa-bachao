import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

export const navLinkClass = ({
  isActive,
  isPending,
  isTransitioning,
}: {
  isActive: boolean
  isPending: boolean
  isTransitioning: boolean
}) => {
  switch (true) {
    case isActive:
      return 'active'
    case isPending:
      return 'pending'
    case isTransitioning:
      return 'transitioning'
  }
}

export const formatCurrency = (number: string) => {
  const formattedNumber = number
    .replace(/^0*(?=0\.|[^0.])/, '')
    .replace(/[^\d..-]/g, '')

  let [integerPart, decimalPart = ''] = formattedNumber.split('.')
  decimalPart = decimalPart.slice(0, 2)

  integerPart = integerPart.replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')

  return integerPart + (number.indexOf('.') !== -1 ? '.' + decimalPart : '')
}

export const objectCompare = (obj1: object, obj2: object) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

export const getRelativeDateString = (date: Date) => {
  dayjs.extend(relativeTime)
  return dayjs(date).fromNow()
}

export const getDateString = (date: Date) => {
  const today = new Date()
  if (dayjs(date).isSame(today, 'day')) {
    return 'Today'
  }
  if (dayjs(date).isSame(today, 'week')) {
    return dayjs(date).format('ddd')
  }

  if (dayjs(date).isSame(today, 'year')) {
    return dayjs(date).format('MMM D')
  }

  return dayjs(date).format('MMM D, YYYY')
}
