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
