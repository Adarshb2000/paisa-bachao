import { useState } from 'react'

interface Tag {
  name: string
  colour: string
}

const TagForm = ({
  defaultValue = {
    name: '',
    colour: '',
  },
}: {
  defaultValue?: Tag
}) => {
  const [tag, setTag] = useState<Tag>(defaultValue)
  return (
    <div>
      <label className='input'>
        <span className='label'>Tag Name</span>
        <input
          type='text'
          value={tag.name}
          onChange={e => {
            setTag({
              ...tag,
              name: e.target.value,
            })
          }}
        />
      </label>
      <label htmlFor='color'>
        <span className='label'>Tag Color</span>
        <input type='color' placeholder='Colour' />
      </label>

      <button type='submit' className='submit'>
        Create Tag
      </button>
    </div>
  )
}

export default TagForm
