const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const lowerCaseCharacters = 'abcdefghijklmnopqrstuvwxyz'

export const randomNumber = (LIMIT: number = 1000000) => {
  return Math.floor(Math.random() * LIMIT)
}

export const randomCharacter = () => {
  return lowerCaseCharacters[randomNumber(lowerCaseCharacters.length)]
}

export const randomWord = (length: number = 10) => {
  return Array.from({ length }, randomCharacter).join('')
}

export const randomLine = (length: number = 10) => {
  return new Array(length)
    .fill(0)
    .map(() => randomWord())
    .join(' ')
}

export const choice = (arr: any[]) => arr[randomNumber(arr.length)]
