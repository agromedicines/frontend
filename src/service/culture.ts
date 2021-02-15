import axios, {AxiosResponse} from 'axios'
import URL from './URL'

export interface ICulture {
    id: number,
    name: string
}

export default class Culture {
    static getAll(): Promise<AxiosResponse<Array<ICulture>>> {
        return axios.get(URL + 'cultures')
    }

    static create(name: string): Promise<AxiosResponse<any>> {
        return axios.post(URL + 'cultures', {
            name: name
        })
    }

    static update(id: number, name: string): Promise<AxiosResponse<any>> {
        return axios.put(URL + 'cultures', {
            id: id,
            name: name
        })
    }

    static delete(id: number): Promise<AxiosResponse<any>> {
        return axios.delete(URL + 'cultures', {
            headers: {
                id: id
            }
        })
    }
}