import axios from 'axios'

export default {
    server: null,

    configurarConexion(api_url, api_key, api_code){
        this.server = axios.create({
            baseURL: api_url,
            headers: {
                'X-ESTRATOS-API-KEY': api_key,
                'X-ESTRATOS-API-INSTANCE': api_code,
            }
        })
    },

    get(action, params){
        return this.server.request({
            method: 'get',
            url: action,
            params: params
        })
    },

    post(action, data, params){
        return this.server.request({
            method: 'post',
            url: action,
            data: data,
            params: params
        })
    }
}