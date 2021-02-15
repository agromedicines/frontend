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

export interface UpdateCultureDialogProps {
    open: boolean,
    id: number,
    name: string,
    problems: IProblem[],
    onClose(): void,
    onUpdate(): void
}

export default function UpdateCultureDialog(props: UpdateCultureDialogProps) {
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

    const handleUpdate = () => {
        if (!name) return alert('Поле "Назва" не може бути пустим')
        if (!(selectedIProblems.length + selectedFProblems.length + selectedGProblems.length))
            return alert('Культура має піддаватися хоча б одній проблемі')

        Culture.update(props.id, name).then(
        resc => {
            
            Promise.all(props.problems.map((problem: IProblem) => PC.delete(props.id, problem.id))).then(respc => {
                
                Promise.all(
                    [...selectedIProblems, ...selectedFProblems, ...selectedGProblems]
                        .map((problem: IProblem) => PC.create(props.id, problem.id)))
                    .then(
                        res => {
                            setName('')
                            setSelectedIProblems([])
                            setSelectedFProblems([])
                            setSelectedGProblems([])
                            props.onUpdate()
                        },
                        err => {
                            alert(`При створенні зв'язків сталася помилка :'(\n${err}`)
                            console.log(err) 
                        })

            }, err => {alert(`При видаленні зв'язків сталася помилка ${err}`); console.log(err)})

            
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

        setName(props.name)
        // console.log(props.problems)
        setSelectedIProblems(props.problems.filter((problem: IProblem) => problem.category_id === 1))
        setSelectedFProblems(props.problems.filter((problem: IProblem) => problem.category_id === 2))
        setSelectedGProblems(props.problems.filter((problem: IProblem) => problem.category_id === 3))

        return () => {setMounted(false)}
    }, [mounted, props.name, props.problems])

    return (
        <Dialog
            title="Редагування культури" 
            buttonText="Редагувати"
            open={props.open} 
            onClose={handleClose}
            onSave={handleUpdate}
        >
            <div className="d-flex flex-column">
                <ThemeProvider theme={theme}>
                    <TextField
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