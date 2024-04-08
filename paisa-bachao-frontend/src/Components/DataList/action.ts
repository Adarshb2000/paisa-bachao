import axios from 'axios'

export const getDataListOptions = async ({
  queryKey,
}: {
  queryKey: [string, string, { search?: string; pageSize: number }]
}) => {
  const [, url, params] = queryKey
  const response = await axios.get(url, {
    params: {
      ...params,
      pageSize: params.pageSize,
    },
  })
  return response.data.data
}
