import axios, {AxiosResponse} from 'axios'
import URL from './URL'

export interface IProblem {
    id: number,
    name: string,
    category_id: number
}

export default class Problem {
    static getAll(): Promise<AxiosResponse<Array<IProblem>>> {
        return axios.get(URL + 'problems')
    }
    
    static getByCategoryId(category_id: number): Promise<AxiosResponse<Array<IProblem>>> {
        return axios.get(URL + `problems/${category_id}`)
    }

    static create(name: string, category_id: number): Promise<AxiosResponse<any>> {
        return axios.post(URL + 'problems', {
                name: name,
                category_id: category_id
        })
    }

    static update(id: number, name: string, category_id: number): Promise<AxiosResponse<any>> {
        return axios.put(URL + 'problems', {
            id: id,
            name: name,
            category_id: category_id
        })
    }

    static delete(id: number): Promise<AxiosResponse<any>> {
        return axios.delete(URL + 'problems', {
            headers: {
                id: id
            }
        })
    }
}