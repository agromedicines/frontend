import React, {useEffect, useState} from 'react'
import {
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox
} from '@material-ui/core'

export interface MultipleSelectProps {
    label: string,
    selectedValue: Array<string>,
    options: Array<any>,
    onConfirm(checkedValue: Array<number>): void,
}

export default function MultipleSelect(props: MultipleSelectProps) {
    const [open, setOpen]: [boolean, any] = useState(false)

    const [checkedValue, setCheckedValue]: [Array<number>, any] = useState([])

    useEffect(() => {
        const newChecked = props.options.filter((o: any) => props.selectedValue.includes(o.name)).map((o: any) => o.id)
        setCheckedValue(newChecked)
        
    }, [props.options, props.selectedValue])

    const handleOpen = () => {
        setOpen(true)
    }

    const handleToggle = (value: number) => () => {
        const currentIndex = checkedValue.indexOf(value);
        const newChecked = [...checkedValue];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        setCheckedValue(newChecked);
    }

    const handleCancel = () => {
        setCheckedValue(props.options
                            .filter((option: any) => props.selectedValue.includes(option.name))
                            .map((option: any) => option.id))
        setOpen(false)
    }

    const handleCancelAll = () => {
        setCheckedValue([])
    }

    const handleAcceptAll = () => {
        setCheckedValue(props.options.map((option: any) => option.id))
    }

    const handleConfirm = () => {
        setOpen(false)
        props.onConfirm(checkedValue)
    }

    return (
        <>
            <div className="d-flex mt-3 mb-3 ml-2 mr-2">
                <Button
                    className="mr-3"
                    style={{alignSelf: 'stretch'}}
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
                >{props.label}</Button>
                <div className="d-flex align-items-center flex-wrap">
                    {props.selectedValue.length === 0 ? "Нічого не вибрано" : props.selectedValue.sort((a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase())).map((value: string, index: number) => (
                        <div key={index} style={{display: 'flex', flexWrap: 'wrap'}}>
                            <Chip label={value} style={{margin: 2}} />
                        </div>
                    ))}
                </div>
            </div>
            <Dialog disableBackdropClick disableEscapeKeyDown open={open}>
                <DialogTitle>{props.label}</DialogTitle>
                <DialogContent dividers>
                    <List>
                        {!props.options.length ? 'Ніц немає, спробуйте щось інше :\'(' : props.options.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())).map((option: any) => 
                            <ListItem key={option.id} role={undefined} dense button onClick={handleToggle(option.id)}>
                                <ListItemIcon>
                                    <Checkbox 
                                        edge="start"
                                        checked={checkedValue.indexOf(option.id) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText primary={option.name} />
                            </ListItem>)}
                    </List>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Відміна
                </Button>
                <Button onClick={handleAcceptAll} color="primary">
                    Обрати всі
                </Button>
                <Button onClick={handleCancelAll} color="primary">
                    Відмінити всі
                </Button>
                <Button onClick={handleConfirm} color="primary">
                    ОК
                </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}