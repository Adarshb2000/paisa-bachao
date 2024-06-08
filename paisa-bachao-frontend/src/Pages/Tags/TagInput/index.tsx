import DataList from '../../../Components/DataList'

const TagInput = () => {
  return (
    <div>
      <DataList
        OptionDispaly={({ option }) => option?.name || ''}
        name='tag-search'
        onChange={(value: string) => console.log(value)}
        dataURL='/tags'
        id='tag-search'
        label='Tags'
        searchTag='name'
        getDisplayValue={(option?: { name: string }) => option?.name || ''}
      />
    </div>
  )
}

export default TagInput
