import { Divider } from '@mui/material';
import React from 'react'
import CustomButton from './CustomButton';
import BackIcon from '@mui/icons-material/KeyboardReturn';
import router from 'next/router';

interface Props {
    onSubmit;
    isEdit?;
}

export default function FormBottomWidget({ onSubmit, isEdit }: Props) {
    return (
        <div>
            <Divider sx={{ mb: 3 }} />
            <div className="flex">
                <CustomButton
                    onClick={() => {
                        router.back();
                    }}
                    startIcon={<BackIcon />}
                    width='20rem'
                    title='Go Back' />
                <CustomButton
                    onClick={onSubmit}
                    mainButton
                    padding={2}
                    title={isEdit ? 'Update' : 'Create'}
                    fullWidth
                />
            </div>
        </div>
    )
}
