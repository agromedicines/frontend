import React from 'react'
import {
    Dialog as MuiDialog,
    AppBar,
    IconButton,
    Typography,
    Button,
    Slide,
    ThemeProvider,
    Toolbar,
    Box
} from '@material-ui/core'
import {TransitionProps} from '@material-ui/core/transitions'
import CloseIcon from '@material-ui/icons/Close'

import theme from '../theme'


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export interface DialogProps {
    title: string,
    buttonText: string,
    open: boolean,
    onClose(): void,
    onSave(): void,
    children: any
}

export default function Dialog(props: DialogProps) {
    return (
        <ThemeProvider theme={theme}>
            <MuiDialog fullScreen open={props.open} onClose={props.onClose} TransitionComponent={Transition}>
            <AppBar color="primary" style={{position: 'relative'}}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={props.onClose} aria-label="close">
                <CloseIcon />
                </IconButton>
                <Typography variant="h6" style={{flex: 1}}>
                {props.title}
                </Typography>
                <Button variant="contained" color="secondary" onClick={props.onSave}>
                {props.buttonText}
                </Button>
            </Toolbar>
            </AppBar>
            <Box className="p-4">
                {props.children}
            </Box>
        </MuiDialog>
      </ThemeProvider>
    )
}