import axios, { AxiosError } from 'axios'
import { client } from '../hooks/useAuth'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function apiCall<T>({
  url,
  method = 'GET',
  data,
}: APICALLPROPS): Promise<T | undefined> {
  try {
    const response = await apiClient.request({
      url,
      method,
      data,
      params: method === 'GET' ? data : undefined,
    })
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data.message ?? error.message)
    }
  }
}

apiClient.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${client.token}`
  return config
})

export default apiClient

interface APICALLPROPS {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
}
