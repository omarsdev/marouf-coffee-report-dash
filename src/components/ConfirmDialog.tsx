import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { red } from '@mui/material/colors';
import TextInput from './TextInput';


interface Props {
    isOpen;
    confirmCallBack;
    handleClose;
    values;
}

export default function ConfirmDialog({ isOpen, confirmCallBack, handleClose, values }: Props) {

    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Notification"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action is non-reversable, please make sure of your action before proceeding, if entry is incorrect, you can NOT unsend notification!
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button autoFocus onClick={handleClose}>Dismiss</Button>
                    <Button
                        color='error'
                        onClick={() => {
                            confirmCallBack();
                        }}
                    >
                        Broadcast
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}