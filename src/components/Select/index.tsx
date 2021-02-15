import React from 'react'

import {
    FormControl,
    InputLabel,
    Select as MuiSelect
} from '@material-ui/core'



export interface SelectProps {
    label: string,
    value: any,
    onChange(event: React.ChangeEvent<{value: unknown}>): void,
    options: Array<any>,
    name?: boolean,
    className?: string
}

export default function Select(props: SelectProps) {
    return (
        <FormControl color="primary" variant="outlined" className={(props.className ? props.className : '')}>
            <InputLabel>{props.label}</InputLabel>
            <MuiSelect
                className="ml-2 mr-2"
                native
                label={props.label}
                value={props.value}
                onChange={props.onChange}
            >   
                <option value=""></option>
                {props.options.sort((a: {name: string}, b: {name: string}) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())).map((option: any) => (
                    <option key={option.id} value={!props.name ? option.id : option.name}>{option.name}</option>
                ))}
            </MuiSelect>
        </FormControl>
    )
}