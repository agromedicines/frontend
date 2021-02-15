import React, {useEffect, useState} from 'react'

import {
    ThemeProvider,
    TextField
} from '@material-ui/core'
import theme from '../../../../../theme'

import Dialog from '../../../../../Dialog'
import Select from '../../../../../Select'

import Category, {ICategory} from '../../../../../../service/category'
import Problem from '../../../../../../service/problem'

export interface CreateProblemDialogProps {
    open: boolean,
    onClose(): void,
    onCreate(): void
}

export default function CreateProblemDialog(props: CreateProblemDialogProps) {
    const [mounted, setMounted] = useState(true)
    
    const [name, setName] = useState('')

    const handleNameChange = (event: React.ChangeEvent<{value: unknown}>) => {
        setName(event.target.value as string)
    }

    const [categories, setCategories] = useState([] as ICategory[])
    const [category, setCategory] = useState(0)

    const handleCategoryChange = (event: React.ChangeEvent<{value: unknown}>) => {
        setCategory(event.target.value as number)
    }


    const handleClose = () => {
        setName('')
        setCategory(0)
        props.onClose()
    }

    const handleCreate = () => {
        if (!name) return alert('Поле "Назва" не може бути пустим')

        Problem.create(name, category).then(
        res => {
            setName('')
            setCategory(0)
            props.onCreate()
        },
        err => {
            alert(`При створенні проблеми сталася помилка :'(\n${err}`)
            console.log(err)
        })
    }



    useEffect(() => {
        if (mounted) {
            Category.getAll().then(res => {
                setCategories(res.data)
            })
        }

        return () => {setMounted(false)}
    }, [mounted])

    return (
        <Dialog
            title="Створення нової проблеми" 
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
                    
                    <Select 
                        className="mt-4"
                        label="Категорія препарату"
                        value={category}
                        onChange={handleCategoryChange}
                        options={categories}/>
                </ThemeProvider>
            </div>
        </Dialog>
    )
}