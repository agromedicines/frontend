import axios, { AxiosResponse } from 'axios'
import URL from './URL'

export interface IMedicine {
    id: number,
    name: string,
    vendor_id: number,
    category_id: number
}

export default class Medicine {
    static getAll(): Promise<AxiosResponse<Array<IMedicine>>> {
        return axios.get(URL + 'medicines')
    }

    static update(id: number, name: string, category_id: number): Promise<AxiosResponse<any>> {
        return axios.put(URL + 'medicines', {
            id: id,
            name: name,
            category_id: category_id
        })
    }

    static create(name: string, category_id: number): Promise<AxiosResponse<any>> {
        return axios.post(URL + 'medicines', {
                name: name,
                category_id: category_id
        })
    }

    static delete(id: number): Promise<AxiosResponse<any>> {
        return axios.delete(URL + 'medicines', {
            headers: {
                id: id
            }
        })
    }
}