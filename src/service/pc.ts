import axios, {AxiosResponse} from 'axios'
import URL from './URL'

export interface IPC {
    problem_id: number,
    culture_id: number
}

export default class PC {
    static getAll(): Promise<AxiosResponse<IPC[]>> {
        return axios.get(URL + 'pc')
    }

    static getCulturesByProblemId(problem_id: number): Promise<AxiosResponse<Array<number>>> {
        return axios.get(`${URL}pc/culture/${problem_id}`)
    }

    static getProblemsByCultureId(culture_id: number): Promise<AxiosResponse<Array<number>>> {
        return axios.get(URL + 'pc/problem/' + culture_id)
    }

    static getCulturesWithSingleProblemById(problem_id: number): Promise<AxiosResponse<number[]>> {
        return axios.get(`${URL}pc/culture/single/${problem_id}`)
    }

    static create(culture_id: number, problem_id: number,): Promise<AxiosResponse<any>> {
        return axios.post(URL + 'pc', {}, {
            headers: {
                problem_id: problem_id,
                culture_id: culture_id
            }
        })
    }

    static delete(culture_id: number, problem_id: number): Promise<AxiosResponse<any>> {
        return axios.delete(URL + 'pc', {
            headers: {
                culture_id: culture_id,
                problem_id: problem_id
            }
        })
    }
}