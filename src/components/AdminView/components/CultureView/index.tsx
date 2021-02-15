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
    RowSelectedParams,
    ColParams
} from '@material-ui/data-grid'

import ControlPanel from '../../../ControlPanel'
import NoRowsOverlay from '../../../NoRowsOverlay'

import Problem, {IProblem} from '../../../../service/problem'
import Culture, {ICulture} from '../../../../service/culture'
import PC, {IPC} from '../../../../service/pc'

import CreateCultureDialog from './components/CreateCultureDialog'
import UpdateCultureDialog from './components/UpdateCultureDialog'

import theme from '../../../theme'

export default function CultureView() {
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
        setUpdateProblems([])
        setUpdateOpen(false)
    }


    const handleUpdate = () => {
        getCultures()
        getPC()
    }

    const handleCreate = () => {
        handleUpdate()
        handleClose()
        
    }

    const handleCUpdate = () => {
        handleUpdate()
        handleUpdateDialogClose()
    }

    const [cultures, setCultures] = useState([] as ICulture[])
    const [problems, setProblems] = useState([] as IProblem[])
    const [pcs, setPCs] = useState([] as IPC[])

    const [filteredCultures, setFilteredCultures] = useState([] as ICulture[])

    const [searchValue, setSearchValue]: [string, any] = useState('')

    const handleSearchValueChange = (event: React.ChangeEvent<{value: unknown}>) => {
        setSearchValue(event.target.value)
    }

    const handleSearch = () => {
        setFilteredCultures(cultures.filter((culture: ICulture) => culture.name.toLowerCase().includes(searchValue.toLowerCase())))
    }

    const handleCancel = () => {
        setSearchValue('')
        setFilteredCultures(cultures)
    }

    const getCultures = () => {
        return Culture.getAll().then(res => {
            setCultures(res.data)
            setFilteredCultures(res.data)
        })
    }

    const getProblems = () => {
        return Problem.getAll().then(res => {
            setProblems(res.data)
        }) 
    }

    const getPC = () => {
        return PC.getAll().then(res => {
            setPCs(res.data)
        })
    }
    
    const handleProgress = () => {
        setProgress(progress => progress + 1)
    }

    useEffect(() => {
        if (mounted) {
            getCultures().then(async (data) => {await handleProgress()})
            getProblems().then(async (data) => {await handleProgress()})
            getPC().then(async (data) => {await handleProgress()})
        }

        return () => {setMounted(false)}
    }, [mounted])

    const [updateId, setUpdateId] = useState(0)
    const [updateName, setUpdateName] = useState('')
    const [updateProblems, setUpdateProblems] = useState([] as IProblem[])

    const handleUpdateDialogOpen = (id: number) => {
        const culture = cultures.find((c: ICulture) => c.id === id)

        if (culture) {
            const cproblemsId = pcs.filter((pc: IPC) => pc.culture_id === id).map((pc: IPC) => pc.problem_id)
            const cproblems = problems.filter((p: IProblem) => cproblemsId.includes(p.id))
            
            console.log(cproblems)

            if (cproblems.length) {
                setUpdateId(id)
                setUpdateName(culture.name)
                setUpdateProblems(cproblems)
                setUpdateOpen(true)
            }

        } else {
            alert('Не вдалося знайти потрібну культуру')
            console.error('Culture is missing')
            console.log(culture)
        }
    }

    const handleDelete = (row: RowModel) => {
        console.log(row)
        const answer = window.confirm(
            `Ви впевнені, що хочете видалити дану культуру: "${row.name}"\nЦе може призвести до видалення записів лікування, де ця культура - єдина`
            )
        
        if (answer) {
            Culture.delete(row.id as number)
                .then(res => {
                        alert('Культуру видалено :)')
                        getCultures()
                    })
        }
        
    }

    const [selectedRow, setSelectedRow] = useState(0)

    const handleSelectRow = (param: RowSelectedParams) => {
        setSelectedRow(param.data.id as number)
    }

    const columns: Array<ColDef> = [
        {field: 'name', flex: 0.15, renderHeader: (params: ColParams) => <strong>Назва</strong>},
        {
            field: 'problems',
            headerName: 'Проблеми',
            flex: 0.75,
            sortable: false,
            disableColumnMenu: true,
            renderHeader: (params: ColParams) => <strong>Проблеми</strong>,
            renderCell: (params: CellParams) => {
                const problems_id = pcs
                                        .filter((pc: IPC) => pc.culture_id === params.row.id)
                                        .map((pc: IPC) => pc.problem_id)

                return (
                    <div className="d-flex flex-column">
                        <div>{`Інсектицид: ${problems
                                            .filter((problem: IProblem) => problem.category_id === 1)
                                            .sort((a: IProblem, b: IProblem) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                                            .filter((problem: IProblem) => problems_id.includes(problem.id))
                                            .map((problem: IProblem) => problem.name)
                                            .join(', ')}`}</div>
                        <div>{`Фунгіцид: ${problems
                                            .filter((problem: IProblem) => problem.category_id === 2)
                                            .sort((a: IProblem, b: IProblem) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                                            .filter((problem: IProblem) => problems_id.includes(problem.id))
                                            .map((problem: IProblem) => problem.name)
                                            .join(', ')}`}</div>
                        <div>{`Гербіцид: ${problems
                                        .filter((problem: IProblem) => problem.category_id === 3)
                                        .sort((a: IProblem, b: IProblem) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                                        .filter((problem: IProblem) => problems_id.includes(problem.id))
                                        .map((problem: IProblem) => problem.name)
                                        .join(', ')}`}</div>
                    </div>
                )  
            }},
        {
            field: '',
            headerName: '',
            disableColumnMenu: true,
            sortable: false,
            flex: 0.1,
            renderCell: (params: CellParams) => {
                return (
                    <>
                        {selectedRow === params.row.id && (
                            <div className="d-flex" style={{width: '100%'}}>
                                <ThemeProvider theme={theme}>
                                    <IconButton
                                        color="primary"
                                        onClick={() => {handleUpdateDialogOpen(params.row.id as number)}}
                                    ><EditIcon /></IconButton>
                                    <IconButton
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
            <Backdrop style={{zIndex: 3000}} open={progress !== 3}>
                <ThemeProvider theme={theme}>
                    <CircularProgress color="secondary" />
                </ThemeProvider>
            </Backdrop>
            <ControlPanel>
                <div className="d-flex align-items-center">
                    <TextField
                        className="mr-3"
                        variant="outlined"
                        color="primary"
                        label="Назва культури" 
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
                    sortModel={[
                        {
                            field: 'name',
                            sort: 'asc'
                        }
                    ]}
                    columns={columns} 
                    rows={filteredCultures.sort((a: ICulture, b: ICulture) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))} 
                    onRowSelected={handleSelectRow}/>
            </div>
            <CreateCultureDialog 
                open={open}
                onClose={handleClose}
                onCreate={handleCreate} />

            <UpdateCultureDialog
                open={updateOpen}
                id={updateId}
                name={updateName}
                problems={updateProblems}
                onClose={handleUpdateDialogClose}
                onUpdate={handleCUpdate} />

        </>
    )
}