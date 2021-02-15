import axios, {AxiosResponse} from 'axios'
import URL from './URL'

export interface ITreatment {
    id: number,
    medicine_id: number,
    medicine_name: string,
    category_id: number,
    category_name: string,
    cultures: number[],
    problems: number[]
}

export default class Treatment {
    static getAll(): Promise<AxiosResponse<ITreatment[]>> {
        return axios.get(URL + 'treatments').then(res => {

            return {
                ...res,
                data: res.data.map((item: any) => {
                            return {
                                ...item, 
                                cultures: JSON.parse(item.cultures),
                                problems: JSON.parse(item.problems)
                            }
                        })
            }
        })
    }
    
    static create(treatment: {medicine_id: number, cultures: number[], problems: number[]}): Promise<AxiosResponse<any>> {
        return axios.post(URL + 'treatments', {
            medicine_id: treatment.medicine_id,
            cultures: JSON.stringify(treatment.cultures),
            problems: JSON.stringify(treatment.problems)
        })
    }

    static update(treatment: {
        id: number,
        medicine_id: number,
        cultures: number[],
        problems: number[],
    }): Promise<AxiosResponse<unknown>> {
        return axios.put(URL + 'treatments', {
            id: treatment.id,
            medicine_id: treatment.medicine_id,
            cultures: JSON.stringify(treatment.cultures),
            problems: JSON.stringify(treatment.problems)
        })
    }

    static delete(id: number) {
        return axios.delete(URL + 'treatments', {
            headers: {
                id: id
            }
        })
    }
}