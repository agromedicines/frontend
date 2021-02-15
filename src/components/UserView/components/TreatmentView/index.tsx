import React, {
    useEffect, 
    useState,
    ChangeEvent,
    Dispatch,
    SetStateAction
} from 'react'
import {
    ThemeProvider,
    Button,
    IconButton
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Create'
import { red } from '@material-ui/core/colors'

import {
    DataGrid, 
    ColDef,
    RowSelectedParams,
    CellParams,
    ColParams,
    RowModel
} from '@material-ui/data-grid'

import ControlPanel from '../../../ControlPanel'
import Select from '../../../Select'
import NoRowsOverlay from '../../../NoRowsOverlay'

import theme from '../../../theme'

import {IPC} from '../../../../service/pc'
import {IMedicine} from '../../../../service/medicine'
import {ICategory} from '../../../../service/category'
import {IProblem} from '../../../../service/problem'
import {ICulture} from '../../../../service/culture'
import Treatment, {ITreatment} from '../../../../service/treatment'

export interface TreatmentViewProps {
    categories: ICategory[],
    treatments: ITreatment[],
    medicines: IMedicine[],
    cultures: ICulture[],
    problems: IProblem[],
    pcs: IPC[],
    onCreateDialogOpen(): void,
    onUpdateDialogOpen(id: number, category: number, tcultures: ICulture[], tproblems: IProblem[], medicine: IMedicine): void,
    onUpdate(): void
}

export default function TreatmentView(props: TreatmentViewProps) {

    const {
        categories,
        treatments,
        medicines,
        cultures,
        problems,
        pcs
    } = props

    useEffect(() => {
        setFilteredTreatments(treatments)   
        setFilteredMedicines(medicines) 
        setFilteredProblems(problems)   
        setFilteredCultures(cultures)   
    }, [treatments, medicines, cultures, problems, pcs])

    const [filteredCultures, setFilteredCultures]  = useState([] as ICulture[])
    const [filteredProblems, setFilteredProblems] = useState([] as IProblem[])
    const [filteredTreatments, setFilteredTreatments] = useState([] as ITreatment[])
    const [filteredMedicines, setFilteredMedicines] = useState([] as IMedicine[])

    const [categoryValue, setCategoryValue] = useState(0)
    const [cultureValue, setCultureValue]: [ICulture | undefined, Dispatch<SetStateAction<ICulture | undefined>>] = useState()
    const [problemValue, setProblemValue]: [IProblem | undefined, Dispatch<SetStateAction<IProblem | undefined>>] = useState()
    const [medicineValue, setMedicineValue]: [IMedicine | undefined, Dispatch<SetStateAction<IMedicine | undefined>>] = useState()



    const setProblemsForCulture = (culture: ICulture, category: number) => {
        const problemsIdForCurrentCulture = pcs
                                                .filter((pc: IPC) => pc.culture_id === culture.id)
                                                .map((pc: IPC) => pc.problem_id)
        
        let newFilteredProblems = problems.filter((problem: IProblem) => problemsIdForCurrentCulture.includes(problem.id))                    

        if (category) newFilteredProblems = newFilteredProblems.filter((problem: IProblem) => problem.category_id === category)

        setFilteredProblems(newFilteredProblems)
    }

    const setCulturesForProblem = (problem: IProblem) => {
        const culturesIdForCurrentProblem = pcs
                                                .filter((pc: IPC) => pc.problem_id === problem.id)
                                                .map((pc: IPC) => pc.culture_id)

        const newFilteredCultures = cultures.filter((culture: ICulture) => culturesIdForCurrentProblem.includes(culture.id))

        setFilteredCultures(newFilteredCultures)
    }


    const handleCategoryChange = (event: ChangeEvent<{value: unknown}>) => {
        const newCategoryValue = Number(event.target.value)

        setCategoryValue(newCategoryValue)

        if (!!newCategoryValue) {
            let newFilteredProblems = problems.filter((problem: IProblem) => problem.category_id === newCategoryValue)

            const newFilteredProblemsId = newFilteredProblems.map((problem: IProblem) => problem.id)

            const newFilteredCulturesId = pcs
                                .filter((pc: IPC) => newFilteredProblemsId.includes(pc.problem_id))
                                .map((pc: IPC) => pc.culture_id)

            let newFilteredCultures = cultures.filter((culture: ICulture) => newFilteredCulturesId.includes(culture.id))

            const newFilteredMedicines = medicines.filter((medicine: IMedicine) => medicine.category_id === newCategoryValue)



            if (!!problemValue) {
                if (!newFilteredProblems.includes(problemValue)) {
                    setProblemValue(undefined)
                } else {
                    const culturesIdForCurrentProblem = pcs
                                                            .filter((pc: IPC) => pc.problem_id === problemValue.id)
                                                            .map((pc: IPC) => pc.culture_id)

                    newFilteredCultures = newFilteredCultures.filter((culture: ICulture) => culturesIdForCurrentProblem.includes(culture.id))
                }
            }

            if (!!cultureValue) {
                if (!newFilteredCultures.includes(cultureValue)) {
                    setCultureValue(undefined)
                } else {
                    const problemsIdForCurrentCulture = pcs
                                                            .filter((pc: IPC) => pc.culture_id === cultureValue.id)
                                                            .map((pc: IPC) => pc.problem_id)

                    newFilteredProblems = newFilteredProblems.filter((problem: IProblem) => problemsIdForCurrentCulture.includes(problem.id))
                }
            }
            
            if (!!medicineValue && !newFilteredMedicines.includes(medicineValue)) {
                setMedicineValue(undefined)
            }

            setFilteredProblems(newFilteredProblems)
            setFilteredCultures(newFilteredCultures)
            setFilteredMedicines(newFilteredMedicines)     
        } else {
            
            if (!!problemValue) {
                setCulturesForProblem(problemValue)
            } else {
                setFilteredCultures(cultures)
            }

            if (!!cultureValue) {
                setProblemsForCulture(cultureValue, newCategoryValue)
            } else {
                setFilteredProblems(problems)
            }

            setFilteredMedicines(medicines)
        }
    }



    const handleCultureChange = (event: ChangeEvent<{value: unknown}>) => {
        const newCultureId = Number(event.target.value)
        const newCulture = filteredCultures.find((culture: ICulture) => culture.id === newCultureId)
        
        setCultureValue(newCulture)

        if (!!newCulture) {
            setProblemsForCulture(newCulture, categoryValue)
        } else {
            setFilteredProblems(
                !!categoryValue ? problems.filter((problem: IProblem) => problem.category_id === categoryValue) : problems
            )
        }
    }



    const handleProblemChange = (event: ChangeEvent<{value: unknown}>) => {
        const newProblemId = Number(event.target.value)
        const newProblem = filteredProblems.find((problem: IProblem) => problem.id === newProblemId)

        setProblemValue(newProblem)

        if (!!newProblem) {
            

            if (!categoryValue) {
                const newCategoryValue = newProblem.category_id

                setCategoryValue(newCategoryValue)
                
                let newFilteredProblems = problems.filter((problem: IProblem) => problem.category_id === newCategoryValue)

                if (cultureValue) {
                    newFilteredProblems = newFilteredProblems.filter((problem: IProblem) => filteredProblems.includes(problem))
                }

                setFilteredProblems(newFilteredProblems)
                setFilteredMedicines(medicines.filter((medicine: IMedicine) => medicine.category_id === newCategoryValue))
            }

            setCulturesForProblem(newProblem)
        } else {
            const filteredProblemsId = filteredProblems.map((problem: IProblem) => problem.id)
            const newFilteredCulturesId = pcs
                                            .filter((pc: IPC) => filteredProblemsId.includes(pc.problem_id))
                                            .map((pc: IPC) => pc.culture_id)
            const newFilteredCultures = cultures.filter((culture: ICulture) => newFilteredCulturesId.includes(culture.id))
            setFilteredCultures(newFilteredCultures)
        }
    }

    const handleMedicineChange = (event: ChangeEvent<{value: unknown}>) => {
        const newMedicineId = Number(event.target.value)
        const newMedicine = filteredMedicines.find((medicine: IMedicine) => medicine.id === newMedicineId)

        setMedicineValue(newMedicine)

        if (newMedicine) {

            if (!categoryValue) {
                const newCategoryValue = newMedicine.category_id

                setCategoryValue(newCategoryValue)
                setFilteredMedicines(medicines.filter((medicine: IMedicine) => medicine.category_id === newCategoryValue))

                let newFilteredProblems = (cultureValue ? filteredProblems : problems).filter((problem: IProblem) => problem.category_id === newCategoryValue)
                setFilteredProblems(newFilteredProblems)

                const newFilteredProblemsId = newFilteredProblems.map((problem: IProblem) => problem.id)
                const newFilteredCulturesId = pcs
                                                .filter((pc: IPC) => newFilteredProblemsId.includes(pc.problem_id))
                                                .map((pc: IPC) => pc.culture_id)

                const newFilteredCultures = cultures.filter((culture: ICulture) => newFilteredCulturesId.includes(culture.id))

                if (problemValue) {
                    if (problemValue.category_id !== newCategoryValue) {
                        setProblemValue(undefined)
                        
                        setFilteredCultures(newFilteredCultures)

                        if (cultureValue && !newFilteredCultures.includes(cultureValue)) {
                            setCultureValue(undefined)
                        }
                    }
                } else {
                    setFilteredCultures(newFilteredCultures)
                }
            }

        } else {
            if (cultureValue) {
                setProblemsForCulture(cultureValue, categoryValue)
            } else {
                setFilteredProblems(categoryValue ? problems.filter(problem => problem.category_id === Number(categoryValue)) : problems)
            }
        }
    }



    const handleSearch = () => {
        setFilteredTreatments(treatments.filter((treatment: ITreatment) => {
             const isCategory = categoryValue ? treatment.category_id === Number(categoryValue) : true
             const isCulture = cultureValue ? treatment.cultures.includes(cultureValue.id) : true
             const isProblem = problemValue ? treatment.problems.includes(problemValue.id): true
             const isMedicine = medicineValue ? treatment.medicine_id === medicineValue.id : true

             return isCategory && isCulture && isProblem && isMedicine
        }))
    }



    const handleCancel = () => {
        setCategoryValue(0)
        setCultureValue(undefined)
        setProblemValue(undefined)
        setMedicineValue(undefined)
        setFilteredTreatments(treatments)
        setFilteredCultures(cultures)
        setFilteredProblems(problems)
        setFilteredMedicines(medicines)
    }



    const handleDialogOpen = () => {
        handleCancel()
        props.onCreateDialogOpen()
    }



    const [selectedRow, setSelectedRow] = useState(0)

    const handleSelectedRow = (row: RowSelectedParams) => {
        setSelectedRow(row.data.id as number)
    }

    const handleUpdateTreatment = (id: number) => {
        const treatment = treatments.find((t: ITreatment) => t.id === id)
        

        if (treatment) {
            const medicine = medicines.find((m: IMedicine) => m.id === treatment.medicine_id)
            const tcultures = cultures.filter((c: ICulture) => treatment.cultures.includes(c.id))
            const tproblems = problems.filter((p: IProblem) => treatment.problems.includes(p.id))

            if (medicine && tcultures.length && tproblems.length) {
                props.onUpdateDialogOpen(
                    treatment.id,
                    treatment.category_id,
                    tcultures,
                    tproblems,
                    medicine
                )
            } else {
                alert('Не вдалося знайти всіх потрібних даних')
                console.error('Some data is missing')
                console.log(medicine)
                console.log(tcultures)
                console.log(tproblems)
            }
        } else {
            alert('Не вдалося знайти потрібний запис')
            console.error('treatment is missing')
            console.log(treatment)
        }
    }


    const handleDelete = (treatment: RowModel) => {
        const answer = window.confirm(
            'Ви впевнені, що хочете видалити даний запис:\n\n' +
            `Категорія: ${treatment.category}\n` +
            `Культури: ${treatment.cultures}\n` +
            `Проблеми: ${treatment.problems}\n` +
            `Препарат: ${treatment.medicine}\n`)
        
        if (answer) {
            Treatment.delete(treatment.id as number).then(
            data => {
                alert('Запис видалено 😁')
                props.onUpdate()
            },
            err => {
                alert(`Виникла помилка 😢:\n${err}`)
            })
        }
    }



    const columns: Array<ColDef> = [
        {field: 'category', flex: 0.1,  renderHeader: (par: ColParams) => <strong>Категорія</strong>},
        {field: 'cultures', flex: 0.2, renderHeader: (par: ColParams) => <strong>Культури</strong>},
        {field: 'problems', flex: 0.5, renderHeader: (par: ColParams) => <strong>Проблеми</strong>},
        {field: 'medicine', flex: 0.1, renderHeader: (par: ColParams) => <strong>Препарат</strong>},
        {
            field: '', 
            headerName: '',
            sortable: false,
            disableColumnMenu: true,
            flex: 0.1,
            renderCell: (params: CellParams) => 
                 (
                    <>
                       {selectedRow === params.row.id && (
                       <div className="d-flex justify-content-end" style={{width:'100%'}}>
                           <ThemeProvider theme={theme}>
                                <IconButton
                                    title="Редагувати"
                                    color="primary"
                                    onClick={() => {handleUpdateTreatment(params.row.id as number)}}
                                ><EditIcon /></IconButton>
                               <IconButton 
                                    title="Видалити"
                                   style={{color: red[700]}}
                                   onClick={() => {handleDelete(params.row)}}
                               ><DeleteIcon /></IconButton>
                           </ThemeProvider>
                       </div>)}
                    </>
                )
        }
    ]



    return (
        <>
             <ControlPanel>
                <div className="d-flex align-items-center">
                    <ThemeProvider theme={theme}>
                        <Select
                            className="m-2"
                            label="Категорія" 
                            value={!!categoryValue ? categoryValue : ''}
                            onChange={handleCategoryChange} 
                            options={categories} />
                        <Select
                            className="m-2"
                            label="Культура"
                            value={!!cultureValue ? cultureValue.id : ''}
                            onChange={handleCultureChange}
                            options={filteredCultures} />
                        <Select
                            className="m-2"
                            label="Проблема"
                            value={!!problemValue ? problemValue.id : ''}
                            onChange={handleProblemChange}
                            options={filteredProblems} />
                        <Select
                            className="m-2"
                            label="Препарат"
                            value={!!medicineValue ? medicineValue.id : ''}
                            onChange={handleMedicineChange}
                            options={filteredMedicines} />
                        <Button
                            variant="contained" 
                            color="primary" 
                            className="ml-3"
                            onClick={() => {handleSearch()}}
                        >Знайти</Button>

                        <Button 
                            variant="contained" 
                            color="primary" 
                            className="ml-3"
                            onClick={() => {handleCancel()}}
                        >Скасувати</Button>
                    </ThemeProvider>
                </div>
                <ThemeProvider theme={theme}>
                    <Button variant="contained" color="primary" onClick={handleDialogOpen}>Створити</Button>
                </ThemeProvider>
            </ControlPanel>
            <div style={{width: '100%', height: 'calc(100% - var(--width))'}}>
                <DataGrid
                    components={{
                        noRowsOverlay: NoRowsOverlay
                    }}
                    sortModel={[
                        {
                            field: 'medicine',
                            sort: 'asc'
                        }
                    ]}
                    columns={columns}
                    rows={filteredTreatments.length ? filteredTreatments.map((treatment: ITreatment) => ({
                        id: treatment.id,
                        category: treatment.category_name,
                        medicine: treatment.medicine_name,
                        problems: problems.filter((problem: IProblem) => treatment.problems.includes(problem.id)).map((problem: IProblem) => problem.name).join(', '),
                        cultures: cultures.filter((culture: ICulture) => treatment.cultures.includes(culture.id)).map((culture: ICulture) => culture.name).join(', ')
                    })) : [] } 
                    onRowSelected={handleSelectedRow}/>
            </div>
        </>
    )
}