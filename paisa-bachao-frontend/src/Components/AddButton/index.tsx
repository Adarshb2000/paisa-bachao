import { FC } from 'react'
import { FaPlus } from 'react-icons/fa'
import './index.scss'
import { useLocation, useNavigate } from 'react-router-dom'

interface Props {
  children: React.ReactNode
}

const AddButton: FC<Props> = ({ children }) => {
  const navigate = useNavigate()
  const { hash } = useLocation()
  const contentVisible = hash === '#add-button'

  return (
    <div
      className={`addButton ${contentVisible ? 'active' : ''}`}
      onClick={() => {
        navigate('')
      }}
    >
      <div
        onClick={e => {
          e.stopPropagation()
        }}
      >
        {contentVisible && <div className='content'>{children}</div>}
        <button
          className={`btn-primary flex h-16 w-16 items-center justify-center rounded-full bg-primary hover:scale-125`}
          onClick={() => {
            navigate(contentVisible ? '' : '#add-button')
          }}
        >
          <FaPlus className='text-2xl text-dark group-hover:text-black' />
        </button>
      </div>
    </div>
  )
}

export default AddButton
