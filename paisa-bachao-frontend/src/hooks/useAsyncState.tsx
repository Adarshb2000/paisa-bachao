import { useCallback, useEffect, useRef, useState } from 'react'

export default function useAsyncState<T>(
  defaultValue: T,
): [T, (newState: T) => Promise<T>] {
  const [state, setState] = useState(defaultValue)
  const resolveState = useRef<((data: T) => void) | null>(null)
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    resolveState.current?.(state)
  }, [state])

  const setAsyncState = useCallback(
    (newState: T) =>
      new Promise<T>(resolve => {
        resolveState.current = resolve
        setState(newState)
      }),
    [],
  )

  return [state, setAsyncState]
}
