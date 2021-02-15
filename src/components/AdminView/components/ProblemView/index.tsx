import React, {useEffect, useState} from 'react'
import {
    ThemeProvider,
    TextField,
    Button,
    IconButton,
    Backdrop,
    CircularProgress
} from '@material-ui/core'
import { red } from '@material-ui/core/colors'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Create'

import {
    DataGrid,
    ColDef,
    RowModel,
    CellParams,
    ColParams,
    RowSelectedParams
} from '@material-ui/data-grid'

import ControlPanel from '../../../ControlPanel'
import Select from '../../../Select'
import NoRowsOverlay from '../../../NoRowsOverlay'

import Problem, {IProblem} from '../../../../service/problem'

import CreateProblemDialog from './components/CreateProblemDialog'
import UpdateProblemDialog from './components/UpdateProblemDialog'

import theme from '../../../theme'
import Category, { ICategory } from '../../../../service/category'

export default function ProblemView() {
    const [mounted, setMounted] = useState(true)
    const [progress, setProgress] = useState(0)
    const [open, setOpen] = useState(false)
    const [updateOpen, setUpdateOpen] = useState(false)

    const handleOpen = () => {
        handleCancel()
        setOpen(true)
    }

    const handleUpdate = () => {
        getProblems()
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleUpdateDialogClose = () => {
        setUpdateId(0)
        setUpdateName('')
        setUpdateCategory(0)
        setUpdateOpen(false)
    }

    const handleCreate = () => {
        handleClose()
        handleUpdate()
    }

    const handlePUpdate = () => {
        handleUpdate()
        handleUpdateDialogClose()
    }

    const [problems, setProblems] = useState([] as IProblem[])
    const [categories, setCategories] = useState([] as ICategory[])

    const [filteredProblems, setFilteredProblems] = useState([] as IProblem[])

    const [searchValue, setSearchValue] = useState('')
    const [categoryValue, setCategoryValue]: [number, any] = useState(0)

    const handleSearchValueChange = (event: React.ChangeEvent<{value: unknown}>) => {
        setSearchValue(event.target.value as string)
    }

    const handleCategoryValueChange = (event: React.ChangeEvent<{value: unknown}>) => {
        setCategoryValue(event.target.value as number)
    }

    const handleSearch = () => {
        setFilteredProblems(problems.filter((problem: IProblem) => problem.name.toLowerCase().includes(searchValue.toLowerCase()) && (!!categoryValue ? problem.category_id === Number(categoryValue) : true)))
    }

    const handleCancel = () => {
        setSearchValue('')
        setCategoryValue('')
        setFilteredProblems(problems)
    }


    const getProblems = () => {
        return Problem.getAll().then(res => {
            setProblems(res.data)
            setFilteredProblems(res.data)
        }) 
    }

    const getCategories = () => {
        return Category.getAll().then(res => {
            setCategories(res.data)
        })
    }
    
    const handleProgress = () => {
        setProgress(progress => progress + 1)
    }

    useEffect(() => {
        if (mounted) {
            getProblems().then(async (data) => {await handleProgress()})
            getCategories().then(async (data) => {await handleProgress()})
        }

        return () => {setMounted(false)}
    }, [mounted])

    const [updateId, setUpdateId] = useState(0)
    const [updateName, setUpdateName] = useState('')
    const [updateCategory, setUpdateCategory] = useState(0)

    const handleUpdateDialogOpen = (id: number) => {
        const problem = problems.find((p: IProblem) => p.id === id)

        if (problem) {
            setUpdateId(id)
            setUpdateName(problem.name)
            setUpdateCategory(problem.category_id)
            setUpdateOpen(true)
        } else {
            alert ('Не вдалося знайти проблему')
            console.error('Problem is missing')
            console.log(problem)
        }
    }

    const handleDelete = (row: RowModel) => {
        const answer = window.confirm(`Ви впевнені, що хочете видалити проблему "${row.name}"?\nЦе може призвести до видалення культур або записів лікування, де ця проблема - єдина`)

        if(answer) {
            Problem.delete(row.id as number).then(
                success => {
                    alert('Проблему видалено')
                    getProblems()
                },
                error => {
                    alert(`Під час видалення проблеми сталася помилка:\n${error}`)
                    console.log(error)
                } 
            )
        }
           
        
    }

    const [selectedRow, setSelectedRow] = useState(0)

    const handleSelectRow = (param: RowSelectedParams) => {
        setSelectedRow(param.data.id as number)
    }

    const columns: Array<ColDef> = [
        {field: 'name', renderHeader: (params: ColParams) => <strong>Назва</strong>, flex: 1},
        {
            field: 'category',
            renderHeader: (params: ColParams) => <strong>Категорія</strong>,
            sortable: true,
            flex: 1,
            renderCell: (params: CellParams) => {
                const category = categories.find((category: ICategory) => category.id === params.row.category_id)
                return <>{category && category.name}</>
            }
        },
        {
            field: '',
            headerName: '',
            disableColumnMenu: true,
            sortable: false,
            flex: 1,
            renderCell: (params: CellParams) => {
                return (
                    <>
                        {selectedRow === params.row.id && (
                            <div className="d-flex" style={{width: '100%'}}>
                                <ThemeProvider theme={theme}>
                                    <IconButton
                                        title="Редагувати"
                                        color="primary"
                                        onClick={() => {handleUpdateDialogOpen(params.row.id as number)}}
                                    ><EditIcon /></IconButton>
                                    <IconButton
                                        title="Видалити"
                                        style={{color: red[700]}}
                                        onClick={() => {handleDelete(params.row)}}
                                    ><DeleteIcon /></IconButton>
                                </ThemeProvider>
                            </div>
                        )}
                    </>
                )
            }}
    ]

    return(
        <>
            <Backdrop style={{zIndex: 3000}} open={progress !== 2}>
                <ThemeProvider theme={theme}>
                    <CircularProgress color="secondary" />
                </ThemeProvider>
            </Backdrop>
            <ControlPanel>
                <div className="d-flex align-items-center">
                    <Select
                        className="m-2"
                        label="Категорія"
                        options={categories}
                        value={categoryValue}
                        onChange={handleCategoryValueChange} />
                    <TextField
                        className="mr-3"
                        variant="outlined"
                        color="primary"
                        label="Назва проблеми" 
                        value={searchValue}
                        onChange={handleSearchValueChange}/>
                    <Button 
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                    >Знайти</Button>
                    <Button
                        className="ml-3"
                        variant="contained"
                        color="primary"
                        onClick={handleCancel}
                    >Скасувати</Button>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
                >Створити</Button>
            </ControlPanel>
            <div style={{width: '100%', height: 'calc(100vh - 2*var(--width))'}}>
                <DataGrid 
                    components={{
                        noRowsOverlay: NoRowsOverlay
                    }}
                    sortModel={[{
                        field: 'name',
                        sort: 'asc'
                    }]}
                    columns={columns} 
                    rows={filteredProblems} 
                    onRowSelected={handleSelectRow}/>
            </div>
            <CreateProblemDialog 
                open={open}
                onClose={handleClose}
                onCreate={handleCreate} />
            <UpdateProblemDialog
                open={updateOpen}
                id={updateId}
                name={updateName}
                category={updateCategory}
                onClose={handleUpdateDialogClose}
                onCreate={handlePUpdate} />
        </>
    )
}