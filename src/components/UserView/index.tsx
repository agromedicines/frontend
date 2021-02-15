import React, { useEffect, useState } from 'react'

import {
    ThemeProvider,
    Backdrop,
    CircularProgress
} from '@material-ui/core'

import theme from '../theme'

import TreatmentView from './components/TreatmentView'
import CreateTreatmentDialog from './components/CreateTreatmentDialog'
import UpdateTreatmentDialog from './components/UpdateTreatmentDialog'

import Medicine, {IMedicine} from '../../service/medicine'
import Category, {ICategory} from '../../service/category'
import Problem, {IProblem} from '../../service/problem'
import Culture, {ICulture} from '../../service/culture'
import PC, {IPC} from '../../service/pc'
import Treatment, {ITreatment} from '../../service/treatment'



export default function UserView(props:any) {
    // Table
    const [mounted, setMounted]: [boolean, any] = useState(true)
    const [progress, setProgress] = useState(0)
    const [open, setOpen] = useState(false)
    const [updateOpen, setUpdateOpen] = useState(false)

    const [medicines, setMedicines] = useState([] as IMedicine[])
    const [categories, setCategories] = useState([] as ICategory[])
    const [problems, setProblems] = useState([] as IProblem[])
    const [cultures, setCultures] = useState([] as ICulture[])
    const [treatments, setTreatments] = useState([] as ITreatment[])
    const [pcs, setPCs] = useState([] as IPC[])

    const [treatmentId, setTreatmentId] = useState(0)
    const [treatmentCategory, setTreatmentCategory] = useState(0)
    const [treatmentCultures, setTreatmentCultures] = useState([] as ICulture[])
    const [treatmentProblems, setTreatmentProblems] = useState([] as IProblem[])
    const [treatmentMedicine, setTreatmentMedicine]: [IMedicine | undefined, React.Dispatch<React.SetStateAction<IMedicine | undefined>>] = useState()

    const handleDialogOpen = () => {
        setOpen(true)
    }

    const handleDialogClose = () => {
        setOpen(false)
    }

    // Create Dialog
   
    const handleUpdate = () => {
        getTreatments()
    }

    const handleCreate = () => {
        handleUpdate()
        handleDialogClose()
    }

    const handleUpdateDialogOpen = (id: number, category: number, tcultures: ICulture[], tproblems: IProblem[], medicine: IMedicine) => {
            setTreatmentId(id)
            setTreatmentCategory(category)
            setTreatmentCultures(tcultures)
            setTreatmentProblems(tproblems)
            setTreatmentMedicine(medicine)
            setUpdateOpen(true)
        }

    const handleUpdateDialogClose = () => {
        setUpdateOpen(false)
    }

    const handleTUpdate = () => {
        handleUpdate()
        handleUpdateDialogClose()
    }

    const handleProgress = async () => {
        setProgress((progress) => progress + 1)
    }

    useEffect(() => {
        if (mounted) {

            getMedicines().then(async (data) => { await handleProgress()})
            getCategories().then(async (data) => { await handleProgress()})
            getProblems().then(async (data) => { await handleProgress()})
            getCultures().then(async (data) => { await handleProgress()})
            getTreatments().then(async (data) => { await handleProgress()})
            getPCs().then(async (data) => { await handleProgress()})
        }

        setMounted(false)
    },[mounted])

    const getMedicines = () => {
        return Medicine.getAll().then(res => {
            setMedicines(res.data)

        })
    }

    const getCategories = () => {
        return Category.getAll().then(res => {
            setCategories(res.data)
        })
    }

    const getProblems = () => {
        return Problem.getAll().then(res => {
            setProblems(res.data)
        })
    }

    const getCultures = () => {
        return Culture.getAll().then(res => {
            setCultures(res.data)
        })
    }

    const getTreatments = () => {
        return Treatment.getAll().then(res => {
            setTreatments(res.data)
        })
    }

    const getPCs = () => {
        return PC.getAll().then(res => {
            setPCs(res.data)
        })
    }

    return (
        <div className="view d-flex flex-column">
            <Backdrop style={{zIndex: 3000}} open={progress !== 6}>
                <ThemeProvider theme={theme}>
                    <CircularProgress color="secondary" />
                </ThemeProvider>
            </Backdrop>

            <TreatmentView
                categories={categories}
                medicines={medicines}
                problems={problems}
                cultures={cultures}
                pcs={pcs}
                treatments={treatments}
                onCreateDialogOpen={handleDialogOpen} 
                onUpdate={handleUpdate}
                onUpdateDialogOpen={handleUpdateDialogOpen} />
            <CreateTreatmentDialog
                open={open}
                categories={categories}
                cultures={cultures}
                problems={problems}
                pcs={pcs}
                medicines={medicines}
                onClose={handleDialogClose}
                onSave={handleCreate} />
            <UpdateTreatmentDialog
                open={updateOpen}        
                categories={categories}
                cultures={cultures}
                problems={problems}
                pcs={pcs}
                medicines={medicines}
                treatment_id={treatmentId}
                treatment_category_id={treatmentCategory}
                treatment_problems={treatmentProblems}
                treatment_cultures={treatmentCultures}
                treatment_medicine={treatmentMedicine}
                onClose={() => {setUpdateOpen(false)}}
                onSave={handleTUpdate} />

        </div>
    )
}
