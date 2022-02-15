import axios from 'axios'

const instance = axios.create({
    baseURL: "http://localhost:9000",
    // headers: {
    //     'x-auth-token': localStorage.getItem('token')
    // }
})

instance.interceptors.request.use(config => {
    config.headers = {
        'x-auth-token': localStorage.getItem('token')
    }
    return config
})

export default instance