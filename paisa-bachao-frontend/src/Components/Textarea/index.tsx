import { useRef, useState } from 'react'
import useAwaitState from '../../hooks/useAsyncState'

const Textarea = ({
  label,
  id,
  value,
  onChange,
  minHeight = 60,
  ...rest
}: {
  label?: string
  id?: string
  value: string
  onChange: (value: string) => void
  minHeight?: number
  rest?: { [key: string]: string }
}) => {
  const [input, setInput] = useState(value)
  const [height, setHeight] = useAwaitState<number>(minHeight)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <label className={`input textarea`}>
      {label ? <span>{label}</span> : null}
      <textarea
        style={{ height: `${height}px`, minHeight: `${minHeight}px` }}
        ref={textareaRef}
        id={id}
        value={input}
        onChange={async e => {
          onChange(e.target.value)
          setInput(e.target.value)
          await setHeight(0)
          setHeight(Math.max(textareaRef.current!.scrollHeight + 10, minHeight))
        }}
        {...rest}
      ></textarea>
    </label>
  )
}

export default Textarea
