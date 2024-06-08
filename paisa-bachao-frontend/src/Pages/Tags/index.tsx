import AddButton from '../../Components/AddButton'
import TagForm from './Components/TagForm'

const Tags = () => {
  return (
    <div>
      <h1 className='main-heading'>Tags</h1>
      <AddButton>
        <div className='content'>
          <TagForm />
        </div>
      </AddButton>
    </div>
  )
}
export default Tags
