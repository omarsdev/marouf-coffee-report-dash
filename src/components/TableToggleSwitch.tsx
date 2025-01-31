import { Switch } from '@mui/material'
import React from 'react'

interface Props {
    checked?: boolean;
    onStatusChange
}

export default function TableToggleSwitch({ checked, onStatusChange }: Props) {
    return (
        <div>
            <Switch
                onClick={() => {
                    onStatusChange(!checked)
                }}
                checked={checked}
            />
        </div>
    )
}
