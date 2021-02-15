import React, {useEffect, useState} from 'react'

import {
    ThemeProvider,
    TextField
} from '@material-ui/core'
import theme from '../../../../../theme'

import Dialog from '../../../../../Dialog'
import Select from '../../../../../Select'

import Category, {ICategory} from '../../../../../../service/category'
import Medicine from '../../../../../../service/medicine'

export interface UpdateMedicineDialogProps {
    open: boolean,
    id: number,
    name: string,
    category: number,
    onClose(): void,
    onUpdate(): void
}

export default function UpdateMedicineDialog(props: UpdateMedicineDialogProps) {
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

        Medicine.update(props.id, name, category).then(
        res => {
            setName('')
            setCategory(0)
            props.onUpdate()
        },
        err => {
            alert(`При оновленні препарату сталася помилка :'(\n${err}`)
            console.log(err)
        })
    }



    useEffect(() => {
        if (mounted) {
            Category.getAll().then(res => {
                setCategories(res.data)
            })
        }

        setName(props.name)
        setCategory(props.category)

        return () => {setMounted(false)}
    }, [mounted, props.name, props.category])

    return (
        <Dialog
            title="Створення нового запису" 
            buttonText="Створити"
            open={props.open} 
            onClose={handleClose}
            onSave={handleCreate}
        >
            <div className="d-flex flex-column">
                <ThemeProvider theme={theme}>
                    <TextField
                        color="primary"
                        label="Назва"
                        variant="outlined"
                        value={name}
                        onChange={handleNameChange} />
                    
                    <Select 
                        className="mt-4"
                        label="Категорія "
                        value={category}
                        onChange={handleCategoryChange}
                        options={categories} />
                </ThemeProvider>
            </div>
        </Dialog>
    )
}