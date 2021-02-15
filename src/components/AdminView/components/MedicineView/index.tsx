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
import EditIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'

import {
    DataGrid,
    ColDef,
    ColParams,
    RowModel,
    CellParams,
    RowSelectedParams
} from '@material-ui/data-grid'

import ControlPanel from '../../../ControlPanel'
import Select from '../../../Select'
import CreateMedicineDialog from './сomponents/CreateMedicineDialog'
import NoRowsOverlay from '../../../NoRowsOverlay'

import Medicine, { IMedicine } from '../../../../service/medicine'
import Category, { ICategory } from '../../../../service/category'

import theme from '../../../theme'
import UpdateMedicineDialog from './сomponents/UpdateMedicineDialog'


export default function MedicineView() {
    const [mounted, setMounted] = useState(true)
    const [progress, setProgress] = useState(0)
    const [open, setOpen] = useState(false)
    const [updateOpen, setUpdateOpen] = useState(false)

    const handleOpen = () => {
        handleCancel()
        setOpen(true)
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
        getMedicines()
    }

    const handleMUpdate = () => {
        getMedicines()
        handleUpdateDialogClose()
    }

    const [medicines, setMedicines] = useState([] as IMedicine[])
    const [categories, setCategories] = useState([] as ICategory[])

    const [filteredMedicines, setFilteredMedicines] = useState([] as IMedicine[])

    const [searchValue, setSearchValue] = useState('')
    const [categoryValue, setCategoryValue]: [number, any] = useState(0)

    const handleSearchValueChange = (event: React.ChangeEvent<{value: unknown}>) => {
        setSearchValue(event.target.value as string)
    }

    const handleCategoryValueChange = (event: React.ChangeEvent<{value: unknown}>) => {
        setCategoryValue(event.target.value as number)
    }

    const handleSearch = () => {
        setFilteredMedicines(medicines.filter((medicine: IMedicine) => 
            (!!categoryValue ? medicine.category_id === Number(categoryValue) : true) &&
            medicine.name.toLowerCase().includes(searchValue.toLowerCase())
        ))
    }

    const handleCancel = () => {
        setSearchValue('')
        setCategoryValue('')
        setFilteredMedicines(medicines)
    }


    const getMedicines = () => {
        return Medicine.getAll().then(res => {
            setMedicines(res.data)
            setFilteredMedicines(res.data)
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
            getMedicines().then(async (data) => {await handleProgress()})
            getCategories().then(async (data) => {await handleProgress()})
        }

        return () => {setMounted(false)}
    }, [mounted])

    const [updateId, setUpdateId] = useState(0)
    const [updateName, setUpdateName] = useState('')
    const [updateCategory, setUpdateCategory] = useState(0)

    const handleUpdateDialogOpen = (id: number) => {
        const medicine = medicines.find((m: IMedicine) => m.id === id)

        if (medicine) {
            setUpdateId(id)
            setUpdateName(medicine.name)
            setUpdateCategory(medicine.category_id)
            setUpdateOpen(true)
        } else {
            alert('Не вдалося знайти препарат')
            console.error('Medicine is missing')
            console.log(medicine)
        }
    }

    const handleDelete = (row: RowModel) => {
        console.log(row)
        const answer = window.confirm(
            `Ви впевнені, що хочете видалити даний препарат: ${row.name}`
            )
        
        if (answer) {
            Medicine.delete(row.id as number)
                .then(res => {
                        alert('Проблему видалено :)')
                        getMedicines()
                    })
        }
        
    }

    const [selectedRow, setSelectedRow] = useState(0)

    const handleSelectRow = (param: RowSelectedParams) => {
        setSelectedRow(param.data.id as number)
    }

    const columns: Array<ColDef> = [
        {
            field: 'category',
            renderHeader: (params: ColParams) => <strong>Категорія</strong>,
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params: CellParams) => {
                const category = categories.find((category: ICategory) => category.id === params.row.category_id)

                return <>{category && category.name}</>
            }
        },
        {field: 'name', renderHeader: (params: ColParams) => <strong>Назва</strong>, flex: 1},
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
                        className="m-2"
                        variant="outlined"
                        color="primary"
                        label="Назва препарату" 
                        value={searchValue}
                        onChange={handleSearchValueChange} />
                    
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
                    sortModel={[
                        {
                            field: 'name',
                            sort: 'asc'
                        }
                    ]}
                    columns={columns} 
                    rows={filteredMedicines.sort((a: IMedicine, b: IMedicine) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))} 
                    onRowSelected={handleSelectRow}/>
            </div>
            <CreateMedicineDialog 
                open={open}
                onClose={handleClose}
                onCreate={handleCreate} />
            <UpdateMedicineDialog
                open={updateOpen}
                id={updateId}
                name={updateName}
                category={updateCategory}
                onClose={handleUpdateDialogClose}
                onUpdate={handleMUpdate} />
        </>
    )
}