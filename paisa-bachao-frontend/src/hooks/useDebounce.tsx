import { useEffect, useRef, useState } from 'react'

export default function useDebounce<T>(initialValue: T, delay: number = 500) {
  const [value, setValue] = useState<T>(initialValue)
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue)

  const timeout = useRef<NodeJS.Timeout | null>(null)

  const handleChange = (newValue: T) => {
    setValue(newValue)
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      setDebouncedValue(newValue)
    }, delay)
  }

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [])

  return [value, handleChange, debouncedValue] as const
}
