import React, {useEffect, useState} from 'react'

import {
    ThemeProvider,
    TextField
} from '@material-ui/core'
import theme from '../../../../../theme'

import Dialog from '../../../../../Dialog'
import MultipleSelect from '../../../../../MultipleSelect'

import Culture from '../../../../../../service/culture'
import Problem, {IProblem} from '../../../../../../service/problem'
import PC from '../../../../../../service/pc'

export interface CreateCultureDialogProps {
    open: boolean,
    onClose(): void,
    onCreate(): void
}

export default function CreateCultureDialog(props: CreateCultureDialogProps) {
    const [mounted, setMounted] = useState(true)
    
    const [name, setName] = useState('')

    const handleNameChange = (event: React.ChangeEvent<{value: unknown}>) => {
        setName(event.target.value as string)
    }

    const [iProblems, setIProblems] = useState([] as IProblem[])
    const [fProblems, setFProblems] = useState([] as IProblem[])
    const [gProblems,setGProblems] = useState([] as IProblem[])
    const [selectedIProblems, setSelectedIProblems] = useState([] as IProblem[])
    const [selectedFProblems, setSelectedFProblems] = useState([] as IProblem[])
    const [selectedGProblems, setSelectedGProblems] = useState([] as IProblem[])

    const handleIConfirm = (checkedValue: Array<number>) => {
        setSelectedIProblems(iProblems.filter((problem: IProblem) => checkedValue.includes(problem.id)))
    }

    const handleFConfirm = (checkedValue: Array<number>) => {
        setSelectedFProblems(fProblems.filter((problem: IProblem) => checkedValue.includes(problem.id)))
    }

    const handleGConfirm = (checkedValue: Array<number>) => {
        setSelectedGProblems(gProblems.filter((problem: IProblem) => checkedValue.includes(problem.id)))
    }


    const handleClose = () => {
        setName('')
        setSelectedIProblems([])
        setSelectedFProblems([])
        setSelectedGProblems([])
        props.onClose()
    }

    const handleCreate = () => {
        if (!name) return alert('Поле "Назва" не може бути пустим')
        if (!(selectedIProblems.length + selectedFProblems.length + selectedGProblems.length))
            return alert('Культура має піддаватися хоча б одній проблемі')

        Culture.create(name).then(
        res => {
            
            Promise.all(
                [...selectedIProblems, ...selectedFProblems, ...selectedGProblems]
                    .map((problem: IProblem) => PC.create(res.data[0], problem.id)))
                .then(
                    res => {
                        setName('')
                        setSelectedIProblems([])
                        setSelectedFProblems([])
                        setSelectedGProblems([])
                        props.onCreate()
                    },
                    err => {
                        alert(`При створенні зв'язків сталася помилка :'(\n${err}`)
                        console.log(err) 
                    })
        },
        err => {
            alert(`При створенні культури сталася помилка :'(\n${err}`)
            console.log(err)
        })
    }



    useEffect(() => {
        if (mounted) {
            Problem.getByCategoryId(1).then(res => {
                setIProblems(res.data)
            })

            Problem.getByCategoryId(2).then(res => {
                setFProblems(res.data)
            })

            Problem.getByCategoryId(3).then(res => {
                setGProblems(res.data)
            })
        }

        return () => {setMounted(false)}
    }, [mounted])

    return (
        <Dialog
            title="Створення нової культури" 
            buttonText="Створити"
            open={props.open} 
            onClose={handleClose}
            onSave={handleCreate}
        >
            <div className="d-flex flex-column">
                <ThemeProvider theme={theme}>
                    <TextField
                        autoFocus
                        color="primary"
                        label="Назва"
                        variant="outlined"
                        value={name}
                        onChange={handleNameChange} />
                    
                    <MultipleSelect
                        label="Інсектицид"
                        options={iProblems}
                        selectedValue={selectedIProblems.map((problem: IProblem) => problem.name)}
                        onConfirm={handleIConfirm} />
                    
                    <MultipleSelect
                        label="Фунгіцид"
                        options={fProblems}
                        selectedValue={selectedFProblems.map((problem: IProblem) => problem.name)}
                        onConfirm={handleFConfirm} />
                    
                    <MultipleSelect
                        label="Гербіцид"
                        options={gProblems}
                        selectedValue={selectedGProblems.map((problem: IProblem) => problem.name)}
                        onConfirm={handleGConfirm} />
                </ThemeProvider>
            </div>
        </Dialog>
    )
}