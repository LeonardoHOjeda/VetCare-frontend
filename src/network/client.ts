import axios, { AxiosError } from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json'
  }
})

axiosClient.interceptors.request.use(
  (request: any) => {
    const token = localStorage.getItem('token')

    if (token) {
      request.headers.Authorization = `Bearer ${token}`
    }
    return request
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any, any>) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    console.error(error)
    return Promise.reject(error)
  }
)

export default axiosClient
