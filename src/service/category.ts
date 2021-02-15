import axios, {AxiosResponse} from 'axios'
import URL from './URL'

export interface ICategory {
    id: number,
    name: string
}

export default class Category {
    static getAll(): Promise<AxiosResponse<Array<ICategory>>> {
        return axios.get(URL + 'categories')
    }
}