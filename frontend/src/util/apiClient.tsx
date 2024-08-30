import axios from 'axios';
import { useLocalStorage } from './localStorage';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_backendAPI_URL
})

apiClient.interceptors.request.use((config) => {
    const { getItem } = useLocalStorage<string>('access_token')
    const token = getItem()

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default apiClient