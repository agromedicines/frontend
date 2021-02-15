import React, {
    useState, 
    useEffect,
    Dispatch,
    SetStateAction,
    ChangeEvent
} from 'react'
import {
    ThemeProvider
} from '@material-ui/core'
import Dialog from '../../../Dialog'
import Select from '../../../Select'
import MultipleSelect from '../../../MultipleSelect'

import { IPC } from '../../../../service/pc'
import { ICategory } from '../../../../service/category'
import { IProblem } from '../../../../service/problem'
import { ICulture } from '../../../../service/culture'
import { IMedicine } from '../../../../service/medicine'
import Treatment from '../../../../service/treatment'

import theme from '../../../theme'

export interface  UpdateTreatmentDialogProps {
    treatment_id: number,
    treatment_medicine: IMedicine | undefined,
    treatment_category_id: number,
    treatment_cultures: ICulture[],
    treatment_problems: IProblem[],
    categories: Array<ICategory>,
    cultures: Array<ICulture>,
    problems: Array<IProblem>,
    pcs: IPC[]
    medicines: Array<IMedicine>,
    open: boolean,
    onClose(): void,
    onSave(): void
}

export default function UpdateTreatmentDialog(props: UpdateTreatmentDialogProps) {
    const {
        categories,
        cultures,
        problems,
        pcs,
        medicines,
        open,
        onClose,
        onSave
    } = props

    useEffect(() => {
        setFilteredMedicines(medicines)
        setFilteredProblems(problems)
        setFilteredCultures(cultures)

        setCategoryValue(props.treatment_category_id)
        setFieldsDueToCategoryId(props.treatment_category_id)
        setProblemsForCultures(props.treatment_cultures, props.treatment_category_id)
        setCulturesForProblems(props.treatment_problems)

        setCulturesValue(props.treatment_cultures)
        setProblemsValue(props.treatment_problems)
        setMedicineValue(props.treatment_medicine)

    }, [cultures, 
        problems, 
        medicines, 
        props.treatment_category_id,
        props.treatment_cultures,
        props.treatment_problems,
        props.treatment_medicine
    ])

    const [categoryValue, setCategoryValue] = useState(0)
    const [culturesValue, setCulturesValue] = useState([] as ICulture[])
    const [problemsValue, setProblemsValue] = useState([] as IProblem[])
    const [medicineValue, setMedicineValue]: [IMedicine | undefined, Dispatch<SetStateAction<IMedicine | undefined>>] = useState()

    const [filteredCultures, setFilteredCultures] = useState([] as ICulture[])
    const [filteredProblems, setFilteredProblems] = useState([] as IProblem[])
    const [filteredMedicines, setFilteredMedicines] = useState([] as IMedicine[])





    const setProblemsForCultures = (c: ICulture[], category: number) => {
        const currentCulturesId = c.map((culture: ICulture) => culture.id)
        let problemsIdForCurrentCultures: number[][] = []

        for (let problem of currentCulturesId) {
            problemsIdForCurrentCultures.push([])
        }
                    
        pcs
            .filter((pc: IPC) => currentCulturesId.includes(pc.culture_id))
            .forEach((pc: IPC) => {
                problemsIdForCurrentCultures[currentCulturesId.indexOf(pc.culture_id)].push(pc.problem_id)
            })
                    
        let newFilteredProblems = problems.filter((problem: IProblem) => problemsIdForCurrentCultures.reduce((acc: boolean, curr: number[]) => acc && curr.includes(problem.id), true)) 
        if (category) newFilteredProblems = newFilteredProblems.filter((problem: IProblem) => problem.category_id === category)

        setFilteredProblems(newFilteredProblems)

        const newSelectedProblems: IProblem[] = []

        for (let problem of problemsValue) {
            if (newFilteredProblems.includes(problem)) {
                newSelectedProblems.push(problem)
            }
        }

        setProblemsValue(newSelectedProblems)
    }





    const setCulturesForProblems = (p: IProblem[]) => {
        const currentProblemsId = p.map((problem: IProblem) => problem.id)
        let culturesIdForCurrentProblems: number[][] = []

        for (let problem of currentProblemsId) {
            culturesIdForCurrentProblems.push([])
        }
                    
        pcs
            .filter((pc: IPC) => currentProblemsId.includes(pc.problem_id))
            .forEach((pc: IPC) => {
                culturesIdForCurrentProblems[currentProblemsId.indexOf(pc.problem_id)].push(pc.culture_id)
            })
                    
        let newFilteredCultures = cultures.filter((culture: ICulture) => culturesIdForCurrentProblems.reduce((acc: boolean, curr: number[]) => acc && curr.includes(culture.id), true)) 

        setFilteredCultures(newFilteredCultures)

        const newSelectedCultures: ICulture[] = []

        for (let culture of culturesValue) {
            if (newFilteredCultures.includes(culture)) {
                newSelectedCultures.push(culture)
            }
        }

        setCulturesValue(newSelectedCultures)
    }



    const setFieldsDueToCategoryId = (id: number) => {
        let newFilteredProblems = problems.filter((problem: IProblem) => problem.category_id === id)

            const newFilteredProblemsId = newFilteredProblems.map((problem: IProblem) => problem.id)

            const newFilteredCulturesId = pcs
                                            .filter((pc: IPC) => newFilteredProblemsId.includes(pc.problem_id))
                                            .map((pc: IPC) => pc.culture_id)

            let newFilteredCultures = cultures.filter((culture: ICulture) => newFilteredCulturesId.includes(culture.id))

            const newFilteredMedicines = medicines.filter((medicine: IMedicine) => medicine.category_id === id)



            if (problemsValue.length) {
                const newSelectedProblems: IProblem[] = []

                for (let problem of problemsValue) {
                    if (newFilteredProblems.includes(problem)) {
                        newSelectedProblems.push(problem)
                    }
                }

                setProblemsValue(newSelectedProblems)

                if (newSelectedProblems.length) {
                    const newSelectedProblemsId = newSelectedProblems.map((problem: IProblem) => problem.id)
                    let culturesIdForCurrentProblems: number[][] = []

                    for (let problem of newSelectedProblemsId) {
                        culturesIdForCurrentProblems.push([])
                    }
                    
                    pcs
                        .filter((pc: IPC) => newSelectedProblemsId.includes(pc.problem_id))
                        .forEach((pc: IPC) => {
                            culturesIdForCurrentProblems[newSelectedProblemsId.indexOf(pc.problem_id)].push(pc.culture_id)
                        })
                    
                    newFilteredCultures = newFilteredCultures.filter((culture: ICulture) => culturesIdForCurrentProblems.reduce((acc: boolean, curr: number[]) => acc && curr.includes(culture.id), true))                    
                }
            }

            if (culturesValue.length) {
                const newSelectedCultures: ICulture[] = []

                for (let culture of culturesValue) {
                    if (newFilteredCultures.includes(culture)) {
                        newSelectedCultures.push(culture)
                    }
                }

                setCulturesValue(newSelectedCultures)

                
                if (newSelectedCultures.length) {
                    const newSelectedCulturesId = newSelectedCultures.map((culture: ICulture) => culture.id)
                    let problemsIdForCurrentCultures: number[][] = []

                    for (let culture of newSelectedCulturesId) {
                        problemsIdForCurrentCultures.push([])
                    }
                    
                    pcs
                        .filter((pc: IPC) => newSelectedCulturesId.includes(pc.culture_id))
                        .forEach((pc: IPC) => {
                            problemsIdForCurrentCultures[newSelectedCulturesId.indexOf(pc.culture_id)].push(pc.problem_id)
                        })
                    
                    newFilteredProblems = newFilteredProblems.filter((problem: IProblem) => problemsIdForCurrentCultures.reduce((acc: boolean, curr: number[]) => acc && curr.includes(problem.id), true))                    
                }
            }
            
            if (medicineValue && !newFilteredMedicines.includes(medicineValue)) {
                setMedicineValue(undefined)
            }

            setFilteredProblems(newFilteredProblems)
            setFilteredCultures(newFilteredCultures)
            setFilteredMedicines(newFilteredMedicines) 
    }



    const handleCreateCategoryChange = (event: ChangeEvent<{value: unknown}>) => {
        const newCategoryValue = Number(event.target.value)

        setCategoryValue(newCategoryValue)

        if (newCategoryValue) {
            setFieldsDueToCategoryId(newCategoryValue)    
        } else {
            
            setFilteredCultures(cultures)

            if (culturesValue.length) {
                setProblemsForCultures(culturesValue, newCategoryValue)
            } else {
                setFilteredProblems(problems)
            }

            setFilteredMedicines(medicines)
        }     
    }

   

    const handleCreateCulturesConfirm = (checkedValue: Array<number>) => {
        const newCultures = filteredCultures.filter((culture: ICulture) => checkedValue.includes(culture.id))
        
        setCulturesValue(newCultures)

        if (newCultures.length) {
            setProblemsForCultures(newCultures, categoryValue)
        } else {
            setFilteredProblems(
                !!categoryValue ? problems.filter((problem: IProblem) => problem.category_id === categoryValue) : problems
            )
        }
    }

    const handleCreateProblemsConfirm = (checkedValue: Array<number>) => {
        const newProblems = filteredProblems.filter((problem: IProblem) => checkedValue.includes(problem.id))

        setProblemsValue(newProblems)

        setCulturesForProblems(newProblems)
    }



    const handleCreateMedicineChange = (event: React.ChangeEvent<{value: unknown}>) => {
        const newMedicineId = Number(event.target.value)
        const newMedicine = filteredMedicines.find((medicine: IMedicine) => medicine.id === newMedicineId)
        console.log(newMedicine)
        setMedicineValue(newMedicine)

        if (newMedicine) {

            if (!categoryValue) {
                const newCategoryValue = newMedicine.category_id

                setCategoryValue(newCategoryValue)
                setFilteredMedicines(medicines.filter((medicine: IMedicine) => medicine.category_id === newCategoryValue))

                let newFilteredProblems = problems.filter((problem: IProblem) => problem.category_id === newCategoryValue)
                setFilteredProblems(newFilteredProblems)

                const newFilteredProblemsId = newFilteredProblems.map((problem: IProblem) => problem.id)
                const newFilteredCulturesId = pcs
                                                .filter((pc: IPC) => newFilteredProblemsId.includes(pc.problem_id))
                                                .map((pc: IPC) => pc.culture_id)

                const newFilteredCultures = cultures.filter((culture: ICulture) => newFilteredCulturesId.includes(culture.id))

                if (problemsValue.length) {
                    const newSelectedProblems: IProblem[] = []

                    for (let problem of problemsValue) {
                        if (newFilteredProblems.includes(problem)) {
                            newSelectedProblems.push(problem)
                        }
                    }

                    setProblemsValue(newSelectedProblems)
                    
                    setCulturesForProblems(newSelectedProblems)
                    
                } else {
                    setFilteredCultures(newFilteredCultures)
                }
            }
        }
    }



    const clearForm = () => {
        setCategoryValue(0)
        setCulturesValue([])
        setProblemsValue([])
        setMedicineValue(undefined)

        setFilteredMedicines(medicines)
        setFilteredProblems(problems)
        setFilteredCultures(cultures)
    }

    const handleClose = () => {
        clearForm()
        onClose()
    }

    const handleUpdate = () => {
        if (!categoryValue) {
            return alert('Поле "Категорія" не може бути пустим')
        }

        if (!culturesValue.length) {
            return alert('Поле "Культури" не може бути пустим')
        }

        if (!problemsValue.length) {
            return alert('Поле "Проблеми" не може бути пустим') 
        }

        if (!medicineValue) {
            return alert('Поле "Препарат" не може бути пустим')
        }


        Treatment.update({
            id: props.treatment_id,
            medicine_id: medicineValue.id,
            cultures: culturesValue.map((culture: ICulture) => culture.id),
            problems: problemsValue.map((problem: IProblem) => problem.id)
        }).then(res => {
            clearForm()
            onSave()
        },
        err => {
            alert(`Помилка 😢:\n${err}`)
        })
    }

    return (
        <Dialog 
                title="Редагування запису" 
                buttonText="Редагувати"
                open={open} 
                onClose={handleClose}
                onSave={handleUpdate}
            >
                <div className="d-flex flex-column">
                    <ThemeProvider theme={theme}>
                        <Select
                            label="Категорія"
                            value={categoryValue ? categoryValue : ''}
                            onChange={handleCreateCategoryChange}
                            options={categories} />
                        <MultipleSelect
                            label="Культури"
                            selectedValue={culturesValue.map((culture: ICulture) => culture.name)}
                            options={filteredCultures} 
                            onConfirm={handleCreateCulturesConfirm} />
                            {!!categoryValue ?
                            <MultipleSelect
                            label="Проблеми"
                            selectedValue={problemsValue.map((problem: IProblem) => problem.name)}
                            options={filteredProblems}
                            onConfirm={handleCreateProblemsConfirm} />
                            : <div className="mt-4 mb-4">Виберіть категорію, щоб обрати проблеми</div>
                            }
                        
                        <Select 
                            label="Препарат"
                            value={medicineValue ? medicineValue.id : ''}
                            onChange={handleCreateMedicineChange}
                            options={filteredMedicines} />
                    </ThemeProvider>
                </div>
            </Dialog>
    )
}
