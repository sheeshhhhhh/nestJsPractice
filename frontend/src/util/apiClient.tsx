import axios from 'axios';
import { useLocalStorage } from './localStorage';

const apiClient = axios.create({
    baseURL: '/api',
})
// i don't know why it's giving me 4000 when it's supposed to be 3000

apiClient.interceptors.request.use((config) => {
    const { getItem } = useLocalStorage<string>('access_token')
    const token = getItem()

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
        config.validateStatus = () => true
    }

    return config
})

export default apiClient