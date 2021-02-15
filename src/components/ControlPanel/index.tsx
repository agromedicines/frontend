import React from 'react'

export interface ControlPanelProps {
    children: any
}

export default function ControlPanel(props: ControlPanelProps) {
    return (
        <div className="d-flex justify-content-between align-items-center p-3" style={{width: '100%', height: 'var(--width)', backgroundColor: 'var(--gray)'}}>
            {props.children}
        </div>
    )
}