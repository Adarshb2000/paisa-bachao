import axios from 'axios'

export const getDataListOptions = async ({
  queryKey,
}: {
  queryKey: [string, string, { search?: string }]
}) => {
  const [, url, params] = queryKey
  const response = await axios.get(url, {
    params: {
      ...params,
      pageSize: 5,
    },
  })
  console.log(response.data)
  return response.data.data
}
